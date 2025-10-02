import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';
import { supabase } from '../lib/supabase';
import RankBadge from '../components/RankBadge';
import ProgressBar from '../components/ProgressBar';
import StatsCarousel from '../components/StatsCarousel';
import GlowingCard from '../components/GlowingCard';
import { 
  Sword, 
  Shield, 
  Target, 
  Trophy, 
  Users, 
  Calendar,
  Flame,
  Star,
  Zap,
  Crown,
  Plus,
  TrendingUp,
  Award
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
      fetchTodaysQuests();
    }
  }, [user]);

  const fetchTodaysQuests = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user?.id)
        .eq('quest_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuests(data || []);
    } catch (error) {
      console.error('Error fetching quests:', error);
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
      fetchTodaysQuests();
    } catch (error) {
      console.error('Error completing quest:', error);
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
          <p className="text-white font-orbitron text-glow">Loading Hunter System...</p>
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
            <p className="text-2xl font-orbitron font-bold text-white text-glow text-center">
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
              <Target className="w-8 h-8 text-electric-blue" />
              <div className="text-right">
                <p className="text-electric-blue/60 text-sm font-orbitron">Today's Progress</p>
              </div>
            </div>
            <p className="text-2xl font-orbitron font-bold text-white text-glow text-center">
              {completedQuests}/{totalQuests}
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center text-glow">
            Hunter Stats
          </h2>
          <StatsCarousel />
        </motion.div>

        {/* Glowing separator */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent mb-12"
          style={{
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
          }}
        />

        {/* Main Content - Quests and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Today's Quests */}
          <div className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm"
               style={{
                 boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
               }}>
            <div className="flex items-center mb-6">
              <Sword className="w-6 h-6 text-electric-blue mr-3" />
              <h2 className="text-xl font-orbitron font-bold text-white text-glow">Today's Quests</h2>
            </div>
            
            {quests.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-electric-blue/50 mx-auto mb-4" />
                <p className="text-electric-blue/60 font-orbitron">No quests for today</p>
                <p className="text-white/60 font-orbitron text-sm mt-2">Create some to start your journey!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {quests.map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      quest.completed
                        ? 'bg-electric-blue/10 border-electric-blue/50'
                        : 'bg-[#0d0d1a]/50 border-electric-blue/20 hover:border-electric-blue/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-orbitron font-semibold mb-2 ${
                          quest.completed ? 'text-electric-blue line-through' : 'text-white text-glow'
                        }`}>
                          {quest.title}
                        </h3>
                        <p className="text-white/70 font-orbitron text-sm mb-3">
                          {quest.description}
                        </p>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 rounded-full text-xs font-orbitron bg-electric-blue/20 text-electric-blue border border-electric-blue/30">
                            {quest.category}
                          </span>
                          <span className="text-xs text-electric-blue font-orbitron font-semibold">
                            +{quest.xp_reward} XP
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-orbitron ${
                            quest.difficulty === 'easy' ? 'bg-electric-blue/20 text-electric-blue' :
                            quest.difficulty === 'medium' ? 'bg-electric-blue/30 text-electric-blue' :
                            'bg-electric-blue/40 text-white'
                          }`}>
                            {quest.difficulty}
                          </span>
                        </div>
                      </div>
                      {!quest.completed && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => completeQuest(quest.id)}
                          className="ml-4 px-4 py-2 bg-gradient-to-r from-electric-blue to-cyan-400 
                                   text-white font-orbitron font-medium rounded-lg transition-all duration-300
                                   hover:shadow-lg hover:shadow-electric-blue/25"
                        >
                          Complete
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0d0d1a]/90 border border-electric-blue/30 rounded-xl p-6 backdrop-blur-sm"
               style={{
                 boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)'
               }}>
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-electric-blue mr-3" />
              <h2 className="text-xl font-orbitron font-bold text-white text-glow">Quick Actions</h2>
            </div>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-electric-blue to-cyan-400 
                         text-white font-orbitron font-medium rounded-lg transition-all duration-300
                         hover:shadow-lg hover:shadow-electric-blue/25 flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Create New Quest
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-electric-blue to-cyan-400 
                         text-white font-orbitron font-medium rounded-lg transition-all duration-300
                         hover:shadow-lg hover:shadow-electric-blue/25 flex items-center justify-center gap-3"
              >
                <TrendingUp className="w-5 h-5" />
                View Progress
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-electric-blue to-cyan-400 
                         text-white font-orbitron font-medium rounded-lg transition-all duration-300
                         hover:shadow-lg hover:shadow-electric-blue/25 flex items-center justify-center gap-3"
              >
                <Crown className="w-5 h-5" />
                Boss Missions
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-electric-blue to-cyan-400 
                         text-white font-orbitron font-medium rounded-lg transition-all duration-300
                         hover:shadow-lg hover:shadow-electric-blue/25 flex items-center justify-center gap-3"
              >
                <Users className="w-5 h-5" />
                Join Guild
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-gradient-to-r from-electric-blue to-cyan-400 
                         text-white font-orbitron font-medium rounded-lg transition-all duration-300
                         hover:shadow-lg hover:shadow-electric-blue/25 flex items-center justify-center gap-3"
              >
                <Award className="w-5 h-5" />
                Achievements
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}