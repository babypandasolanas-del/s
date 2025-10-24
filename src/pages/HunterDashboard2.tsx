import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';
import { supabase, createDailyQuests } from '../lib/supabase';
import { generateDailyQuests, getXpRequiredForNextRank, getXpRequiredForCurrentRank, getNextRank, calculateRankFromXp } from '../data/questSystem';
import RankBadge from '../components/RankBadge';
import HunterSummary from '../components/HunterSummary';
import RankProgress from '../components/RankProgress';
import HunterStreak from '../components/HunterStreak';
import RadarChart from '../components/RadarChart';
import {
  Target,
  CheckCircle,
  Sparkles,
  LogOut,
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../lib/auth';

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

export default function HunterDashboard2() {
  const { user, isOwner } = useAuth();
  const { progressData, loading } = useUserProgress();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loadingQuests, setLoadingQuests] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [completingQuest, setCompletingQuest] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const navigate = useNavigate();

  // Calculate stats for radar chart based on completed quests
  const hunterStats = {
    mind: Math.min((quests.filter(q => q.category === 'mind' && q.completed).length / 30) * 100, 100),
    body: Math.min((quests.filter(q => q.category === 'body' && q.completed).length / 30) * 100, 100),
    discipline: Math.min((quests.filter(q => q.category === 'discipline' && q.completed).length / 30) * 100, 100),
    lifestyle: Math.min((quests.filter(q => q.category === 'lifestyle' && q.completed).length / 30) * 100, 100),
    willpower: Math.min((quests.filter(q => q.category === 'willpower' && q.completed).length / 30) * 100, 100),
    focus: Math.min((quests.filter(q => q.category === 'focus' && q.completed).length / 30) * 100, 100)
  };

  useEffect(() => {
    if (user && !isInitializing) {
      initializeDailyQuests();
    }
  }, [user]);

  const initializeDailyQuests = async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    try {
      if (user) {
        const { error: userError } = await supabase
          .from('users')
          .upsert([{
            id: user.id,
            email: user.email!,
            name: user.email?.split('@')[0] || 'Hunter',
            rank: 'E',
            total_xp: 0,
            streak_days: 0,
            subscription_active: false,
            last_active: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }], { onConflict: 'id' })
          .select()
          .single();

        if (userError && userError.code !== '23505') {
          console.error('Error ensuring user exists:', userError);
        }
      }

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', user?.id)
        .eq('quest_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setQuests(data);
        return;
      }

      const currentRank = progressData?.currentRank || 'E';
      const generatedQuests = generateDailyQuests(currentRank);
      const { data: createdQuests, error: createError } = await createDailyQuests(user?.id!, generatedQuests);

      if (createError) {
        console.error('Error creating quests:', createError);
        const { data: refetchData, error: refetchError } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', user?.id)
          .eq('quest_date', today)
          .order('created_at', { ascending: false });

        if (!refetchError && refetchData && refetchData.length > 0) {
          setQuests(refetchData);
          return;
        }

        const fallbackQuests = generatedQuests.map(quest => ({
          ...quest,
          quest_date: today
        }));
        setQuests(fallbackQuests);
      } else {
        setQuests(createdQuests || []);
      }
    } catch (error) {
      console.error('Error fetching quests:', error);
      const currentRank = progressData?.currentRank || 'E';
      const fallbackQuests = generateDailyQuests(currentRank).map(quest => ({
        ...quest,
        quest_date: new Date().toISOString().split('T')[0]
      }));
      setQuests(fallbackQuests);
    } finally {
      setLoadingQuests(false);
      setIsInitializing(false);
    }
  };

  const completeQuest = async (questId: string) => {
    setCompletingQuest(questId);

    try {
      const { error } = await supabase
        .from('quests')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', questId);

      if (error) throw error;

      setQuests(prevQuests =>
        prevQuests.map(quest =>
          quest.id === questId
            ? { ...quest, completed: true }
            : quest
        )
      );

      const updatedQuests = quests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );
      const allComplete = updatedQuests.every(q => q.completed);

      if (allComplete) {
        setTimeout(() => setShowCompletion(true), 500);
        setTimeout(() => setShowCompletion(false), 4000);
      }

      setTimeout(() => setCompletingQuest(null), 800);
    } catch (error) {
      console.error('Error completing quest:', error);
      setQuests(prevQuests =>
        prevQuests.map(quest =>
          quest.id === questId
            ? { ...quest, completed: true }
            : quest
        )
      );
      setTimeout(() => setCompletingQuest(null), 800);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || loadingQuests) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-orbitron text-lg" style={{ textShadow: '0 0 10px #00f0ff' }}>
            Loading Hunter System...
          </p>
        </motion.div>
      </div>
    );
  }

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const currentRank = progressData?.currentRank || 'E';
  const totalXP = progressData?.totalXp || 0;
  const nextRankXP = getXpRequiredForNextRank(currentRank);
  const currentRankXP = getXpRequiredForCurrentRank(currentRank);
  const nextRank = getNextRank(currentRank);

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d1a] to-[#1a0a2e] -z-10" />
      <motion.div
        className="fixed inset-0 opacity-30 -z-10"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-2" style={{ textShadow: '0 0 20px #00f0ff' }}>
              Dashboard 2.0
            </h1>
            <p className="text-electric-blue font-orbitron text-sm md:text-base">
              Welcome back, Hunter {user?.email?.split('@')[0] || 'Unknown'}
              {isOwner && <span className="ml-2 text-yellow-400">[OWNER]</span>}
            </p>
          </motion.div>

          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            <span className="font-orbitron text-sm">Logout</span>
          </motion.button>
        </div>

        {/* Hunter Summary Panel */}
        <HunterSummary
          currentRank={currentRank}
          totalXP={totalXP}
          streakDays={progressData?.streakDays || 0}
          questsCompleted={completedQuests}
          totalQuests={totalQuests}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Rank Progress & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rank Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d0d1a]/60 backdrop-blur-lg border border-electric-blue/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-electric-blue" />
                <h2 className="text-xl font-orbitron font-bold text-white" style={{ textShadow: '0 0 10px #00f0ff' }}>
                  Rank Progress
                </h2>
              </div>

              <div className="flex items-center justify-center mb-6">
                <RankBadge rank={currentRank} size="xl" />
              </div>

              <RankProgress
                currentRank={currentRank}
                currentXP={totalXP}
                nextRankXP={nextRankXP}
                previousRankXP={currentRankXP}
                nextRank={nextRank}
              />
            </motion.div>

            {/* Hunter Stats Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0d0d1a]/60 backdrop-blur-lg border border-electric-blue/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-electric-blue" />
                <h2 className="text-xl font-orbitron font-bold text-white" style={{ textShadow: '0 0 10px #00f0ff' }}>
                  Hunter Stats
                </h2>
              </div>
              <div className="flex items-center justify-center">
                <RadarChart stats={hunterStats} />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Streak */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d0d1a]/60 backdrop-blur-lg border border-electric-blue/30 rounded-2xl p-6"
            >
              <HunterStreak streakDays={progressData?.streakDays || 0} />
            </motion.div>
          </div>
        </div>

        {/* Daily Quests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0d0d1a]/60 backdrop-blur-lg border border-electric-blue/30 rounded-2xl p-6"
        >
          {/* Quest Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-electric-blue" />
              <h2 className="text-xl font-orbitron font-bold text-white" style={{ textShadow: '0 0 10px #00f0ff' }}>
                Daily Quests
              </h2>
            </div>
            <div className="text-electric-blue font-orbitron text-sm">
              {completedQuests} / {totalQuests} Complete
            </div>
          </div>

          {/* Daily Quest Progress Bar */}
          <div className="mb-6">
            <div className="relative w-full h-3 bg-[#0d0d1a]/60 rounded-full overflow-hidden border border-electric-blue/20">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-electric-blue to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedQuests / totalQuests) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="text-xs text-white/50 font-orbitron mt-1 text-right">
              {((completedQuests / totalQuests) * 100).toFixed(0)}% Complete
            </div>
          </div>

          {/* Quests List */}
          <div className="space-y-3">
            {quests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  quest.completed
                    ? 'bg-green-500/10 border-green-400/50'
                    : 'bg-[#0d0d1a]/50 border-electric-blue/30 hover:border-electric-blue/60'
                }`}
              >
                {completingQuest === quest.id && (
                  <motion.div
                    className="absolute inset-0 bg-electric-blue/20 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8 }}
                  />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {quest.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      <h4
                        className={`font-orbitron font-bold ${
                          quest.completed ? 'text-green-400' : 'text-white'
                        }`}
                        style={{
                          textShadow: quest.completed ? '0 0 10px #4ade80' : '0 0 10px #00f0ff'
                        }}
                      >
                        {quest.title}
                      </h4>
                    </div>
                    <p className="text-white/70 font-orbitron text-sm mb-3">
                      {quest.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-electric-blue font-orbitron uppercase tracking-wider font-semibold">
                        {quest.category}
                      </span>
                      <span className="text-xs text-purple-400 font-orbitron font-bold">
                        +{quest.xp_reward} XP
                      </span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => !quest.completed && completeQuest(quest.id)}
                    disabled={quest.completed}
                    className={`px-6 py-2 rounded-lg font-orbitron font-medium transition-all duration-300 ${
                      quest.completed
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-gradient-to-r from-electric-blue to-purple-500 text-white hover:shadow-lg hover:shadow-electric-blue/50'
                    }`}
                    whileHover={!quest.completed ? { scale: 1.05 } : {}}
                    whileTap={!quest.completed ? { scale: 0.95 } : {}}
                  >
                    {quest.completed ? 'Done' : 'Mark Done'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* All Quests Complete Banner */}
          <AnimatePresence>
            {showCompletion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="mt-6 p-6 bg-gradient-to-r from-electric-blue/20 to-purple-500/20 border border-electric-blue/50 rounded-xl text-center relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-purple-500/10"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
                <Sparkles className="w-12 h-12 text-electric-blue mx-auto mb-3" />
                <h3 className="text-2xl font-orbitron font-bold text-white mb-2" style={{ textShadow: '0 0 20px #00f0ff' }}>
                  Daily Quests Complete!
                </h3>
                <p className="text-white/80 font-orbitron">
                  Outstanding work, Hunter! Your discipline is legendary.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Owner Admin Section */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-yellow-500/10 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-orbitron font-bold text-yellow-400">
                Owner Admin Panel
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/30 transition-all"
              >
                <Users className="w-5 h-5" />
                <span className="font-orbitron">View All Hunters</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/30 transition-all"
              >
                <Target className="w-5 h-5" />
                <span className="font-orbitron">Manage Quests</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/30 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-orbitron">Leaderboard</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
