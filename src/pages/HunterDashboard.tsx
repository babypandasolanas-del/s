import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';
import { supabase } from '../lib/supabase';
import { RankBadge } from '../components/RankBadge';
import { ProgressBar } from '../components/ProgressBar';
import { StatsCarousel } from '../components/StatsCarousel';
import { GlowingCard } from '../components/GlowingCard';
import { 
  Sword, 
  Shield, 
  Target, 
  Trophy, 
  Users, 
  Calendar,
  Flame,
  Star
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
  const { userStats, userProfile, loading } = useUserProgress();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Hunter Dashboard...</div>
      </div>
    );
  }

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hunter Dashboard
          </h1>
          <p className="text-purple-200">
            Welcome back, {userProfile?.name || 'Hunter'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlowingCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Current Rank</p>
                <div className="mt-2">
                  <RankBadge rank={userProfile?.rank || 'E'} size="lg" />
                </div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </GlowingCard>

          <GlowingCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Total XP</p>
                <p className="text-2xl font-bold text-white">
                  {userProfile?.total_xp?.toLocaleString() || 0}
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-400" />
            </div>
          </GlowingCard>

          <GlowingCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Streak</p>
                <p className="text-2xl font-bold text-white">
                  {userProfile?.streak_days || 0} days
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </GlowingCard>

          <GlowingCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Today's Progress</p>
                <p className="text-2xl font-bold text-white">
                  {completedQuests}/{totalQuests}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </GlowingCard>
        </div>

        {/* Stats Carousel */}
        <div className="mb-8">
          <StatsCarousel stats={userStats} />
        </div>

        {/* Today's Quests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlowingCard className="p-6">
            <div className="flex items-center mb-4">
              <Sword className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Today's Quests</h2>
            </div>
            
            {quests.length === 0 ? (
              <p className="text-purple-200">No quests for today. Create some to start your journey!</p>
            ) : (
              <div className="space-y-3">
                {quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-lg border transition-all ${
                      quest.completed
                        ? 'bg-green-900/20 border-green-500/30'
                        : 'bg-slate-800/50 border-slate-600/30 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          quest.completed ? 'text-green-300 line-through' : 'text-white'
                        }`}>
                          {quest.title}
                        </h3>
                        <p className="text-sm text-purple-200 mt-1">
                          {quest.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            quest.category === 'mind' ? 'bg-blue-900/50 text-blue-300' :
                            quest.category === 'body' ? 'bg-red-900/50 text-red-300' :
                            quest.category === 'discipline' ? 'bg-purple-900/50 text-purple-300' :
                            quest.category === 'lifestyle' ? 'bg-green-900/50 text-green-300' :
                            quest.category === 'willpower' ? 'bg-orange-900/50 text-orange-300' :
                            'bg-yellow-900/50 text-yellow-300'
                          }`}>
                            {quest.category}
                          </span>
                          <span className="text-xs text-purple-200">
                            {quest.xp_reward} XP
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            quest.difficulty === 'easy' ? 'bg-green-900/50 text-green-300' :
                            quest.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                          }`}>
                            {quest.difficulty}
                          </span>
                        </div>
                      </div>
                      {!quest.completed && (
                        <button
                          onClick={() => completeQuest(quest.id)}
                          className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlowingCard>

          {/* Quick Actions */}
          <GlowingCard className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-purple-400 mr-2" />
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all transform hover:scale-105">
                Create New Quest
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg transition-all transform hover:scale-105">
                View Progress
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all transform hover:scale-105">
                Boss Missions
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Join Guild
              </button>
            </div>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}