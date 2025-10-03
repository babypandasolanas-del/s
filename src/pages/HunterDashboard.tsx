import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';
import { supabase, createDailyQuests } from '../lib/supabase';
import { generateDailyQuests } from '../data/questSystem';
import RankBadge from '../components/RankBadge';
import ProgressBar from '../components/ProgressBar';
import GlowingCard from '../components/GlowingCard';
import { 
  Target, 
  Trophy, 
  Calendar,
  Flame,
  Star,
  Zap
} from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  difficulty: string;
  completed: boolean;
  quest_date: string;
}

export default function HunterDashboard() {
  const { user } = useAuth();
  const { progressData, loading } = useUserProgress();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loadingQuests, setLoadingQuests] = useState(true);

  useEffect(() => {
    if (user) {
      initializeDailyQuests();
    }
  }, [user]);

  const initializeDailyQuests = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user?.id)
        .eq('quest_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If no quests exist for today, generate them
      if (!data || data.length === 0) {
        const currentRank = progressData?.currentRank || 'E';
        const generatedQuests = generateDailyQuests(currentRank);
        
        // Save to database
        await createDailyQuests(user?.id!, generatedQuests);
        
        // Fetch the newly created quests
        const { data: newQuests, error: newError } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', user?.id)
          .eq('quest_date', today)
          .order('created_at', { ascending: false });
          
        if (newError) throw newError;
        setQuests(newQuests || []);
      } else {
        setQuests(data);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
      // Fallback to generated quests if database fails
      const currentRank = progressData?.currentRank || 'E';
      const fallbackQuests = generateDailyQuests(currentRank).map(quest => ({
        ...quest,
        quest_date: new Date().toISOString().split('T')[0]
      }));
      setQuests(fallbackQuests);
    } finally {
      setLoadingQuests(false);
    }
  };

  const completeQuest = async (questId: string) => {
    try {
      const { error } = await supabase
        .from('quests')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', questId);

      if (error) throw error;
      
      // Refresh quests
      setQuests(prevQuests => 
        prevQuests.map(quest => 
          quest.id === questId 
            ? { ...quest, completed: true }
            : quest
        )
      );
    } catch (error) {
      console.error('Error completing quest:', error);
      // Update local state even if database update fails
      setQuests(prevQuests => 
        prevQuests.map(quest => 
          quest.id === questId 
            ? { ...quest, completed: true }
            : quest
        )
      );
    }
  };

  if (loading || loadingQuests) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-orbitron" style={{ textShadow: '0 0 10px #00f0ff' }}>
            Loading Hunter System...
          </p>
        </motion.div>
      </div>
    );
  }

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            Hunter Dashboard
          </h1>
          <p className="text-electric-blue font-orbitron text-lg text-glow">
            Welcome back, Hunter {user?.email?.split('@')[0] || 'Unknown'}
          </p>
          
          {/* Glowing separator */}
          <motion.div
            className="w-32 h-1 mx-auto mt-6 rounded-full bg-gradient-to-r from-transparent via-electric-blue to-transparent"
            style={{
              boxShadow: '0 0 20px #00f0ff, 0 0 40px #00f0ff'
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Stats Overview - Top Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Current Rank */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm
                     hover:border-electric-blue/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-electric-blue" />
              <div className="text-right">
                <p className="text-electric-blue/60 text-sm font-orbitron">Current Rank</p>
              </div>
            </div>
            <div className="flex justify-center">
              <RankBadge rank={progressData?.currentRank || 'E'} size="lg" />
            </div>
          </motion.div>

          {/* Total XP */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm
                     hover:border-electric-blue/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-electric-blue" />
              <div className="text-right">
                <p className="text-electric-blue/60 text-sm font-orbitron">Total XP</p>
              </div>
            </div>
            <p className="text-2xl font-orbitron font-bold text-white text-glow text-center">
              {progressData?.totalXp?.toLocaleString() || 0}
            </p>
          </motion.div>

          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm
                     hover:border-electric-blue/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 text-electric-blue" />
              <div className="text-right">
                <p className="text-electric-blue/60 text-sm font-orbitron">Streak</p>
              </div>
            </div>
            <p className="text-2xl font-orbitron font-bold text-white text-center"
               style={{ textShadow: '0 0 10px #00f0ff' }}>
              {progressData?.streakDays || 0} days
            </p>
          </motion.div>

          {/* Today's Progress */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm
                     hover:border-electric-blue/60 transition-all duration-300"
            style={{
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-electric-blue" />
              <div className="text-right">
                <p className="text-electric-blue/60 text-sm font-orbitron">Today's Progress</p>
              </div>
            </div>
            <p className="text-2xl font-orbitron font-bold text-white text-center"
               style={{ textShadow: '0 0 10px #00f0ff' }}>
              {completedQuests}/{totalQuests}
            </p>
          </motion.div>
        </motion.div>

        {/* Glowing separator */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent mb-12"
          style={{
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
          }}
        />

        {/* Daily Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm"
               style={{
                 boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
               }}>
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-[#00f0ff] mr-3" />
              <h2 className="text-xl font-orbitron font-bold text-white"
                  style={{ textShadow: '0 0 10px #00f0ff' }}>
                Daily Quests
              </h2>
              <div className="ml-auto text-[#00f0ff] font-orbitron text-sm">
                {completedQuests} / {totalQuests} Complete
              </div>
            </div>
            
            <div className="space-y-4">
                {quests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      quest.completed
                        ? 'bg-green-500/10 border-green-400/50' 
                        : 'bg-[#0d0d1a]/50 border-[#00f0ff]/30 hover:border-[#00f0ff]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`font-orbitron font-bold mb-1 ${
                          quest.completed ? 'text-green-400' : 'text-white'
                        }`} style={{ textShadow: quest.completed ? '0 0 10px #4ade80' : '0 0 10px #00f0ff' }}>
                          {quest.title}
                        </h4>
                        <p className="text-white/80 font-orbitron text-sm mb-2">
                          {quest.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-[#00f0ff] font-orbitron uppercase tracking-wider font-semibold">
                            {quest.category}
                          </span>
                          <span className="text-xs text-[#00f0ff] font-orbitron font-bold">
                            +{quest.xp_reward} XP
                          </span>
                        </div>
                      </div>
                      
                        <motion.button
                          whileHover={{ scale: quest.completed ? 1 : 1.05 }}
                          whileTap={{ scale: quest.completed ? 1 : 0.95 }}
                          onClick={() => completeQuest(quest.id)}
                          disabled={quest.completed}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 font-orbitron ${
                            quest.completed
                              ? 'bg-green-500 text-white cursor-default'
                              : 'bg-gradient-to-r from-[#00f0ff] to-cyan-400 text-white hover:shadow-lg hover:shadow-[#00f0ff]/25'
                          }`}
                        >
                          {quest.completed ? 'Complete' : 'Mark Done'}
                        </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>

            {completedQuests === totalQuests && totalQuests > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-gradient-to-r from-[#00f0ff]/10 to-green-500/10 
                         border border-[#00f0ff]/40 rounded-lg text-center"
              >
                <Zap className="w-8 h-8 text-[#00f0ff] mx-auto mb-2" />
                <h4 className="text-xl font-orbitron font-bold text-white mb-2"
                    style={{ textShadow: '0 0 10px #00f0ff' }}>
                  Perfect Day Achievement!
                </h4>
                <p className="text-white/80 font-orbitron">
                  You've completed all daily quests. Bonus XP will be awarded!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}