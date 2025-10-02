import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { 
  RankId, 
  calculateRankFromXP, 
  calculateXPProgress, 
  calculateDaysProgress,
  getRankConfig,
  getNextRankId
} from '../lib/rankConfig';

export interface UserProgressData {
  totalXp: number;
  currentRank: RankId;
  rankAssignedAt: string | null;
  streakDays: number;
  questsDone: number;
  xpProgress: {
    current: number;
    max: number;
    percentage: number;
    xpInCurrentRank: number;
    xpNeededForNext: number;
  };
  daysProgress: {
    daysCompleted: number;
    daysRequired: number;
    percentage: number;
    daysRemaining: number;
  };
  nextRank: RankId | null;
  isMaxRank: boolean;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, created_at, last_login, subscription_status, username')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create it with defaults
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email!,
              created_at: new Date().toISOString(),
              subscription_status: 'free',
              username: user.email?.split('@')[0] || 'Hunter'
            }]);

          if (insertError) throw insertError;

          // Fetch the newly created profile
          const { data: newProfileData, error: newProfileError } = await supabase
            .from('profiles')
            .select('id, email, created_at, last_login, subscription_status, username')
            .eq('id', user.id)
            .single();

          if (newProfileError) throw newProfileError;
          
          const progressData = calculateProgressData(newProfileData);
          setProgressData(progressData);
        } else {
          throw profileError;
        }
      } else {
        const progressData = calculateProgressData(profileData);
        setProgressData(progressData);
      }
    } catch (err: any) {
      console.error('Error fetching user progress:', err);
      setError(err.message || 'Failed to fetch user progress');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressData = (data: any): UserProgressData => {
    // Since profiles table doesn't have XP/rank data, we'll use defaults
    // In a real app, this data should come from the users table
    const totalXp = 0;
    const currentRank = 'E' as RankId;
    const rankAssignedAt = data.created_at;
    const streakDays = 0;
    const questsDone = 0;

    // Calculate XP progress
    const xpProgress = calculateXPProgress(totalXp, currentRank);
    
    // Calculate days progress
    const daysProgress = calculateDaysProgress(rankAssignedAt, streakDays, currentRank);
    
    // Get next rank info
    const nextRank = getNextRankId(currentRank);
    const isMaxRank = nextRank === null;

    return {
      totalXp,
      currentRank,
      rankAssignedAt,
      streakDays,
      questsDone,
      xpProgress,
      daysProgress,
      nextRank,
      isMaxRank
    };
  };

  const updateProgress = async (updates: {
    xpGained?: number;
    questCompleted?: boolean;
    streakIncrement?: number;
  }) => {
    if (!user || !progressData) return;

    try {
      const newTotalXp = progressData.totalXp + (updates.xpGained || 0);
      const newQuestsDone = progressData.questsDone + (updates.questCompleted ? 1 : 0);
      const newStreakDays = progressData.streakDays + (updates.streakIncrement || 0);
      
      // Calculate new rank based on XP
      const newRank = calculateRankFromXP(newTotalXp);
      const rankChanged = newRank !== progressData.currentRank;
      
      const updateData: any = {
        last_login: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh progress data
      await fetchUserProgress();

      return { rankChanged, newRank };
    } catch (err: any) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserProgress();
  }, [user]);

  return {
    progressData,
    loading,
    error,
    refetch: fetchUserProgress,
    updateProgress
  };
};