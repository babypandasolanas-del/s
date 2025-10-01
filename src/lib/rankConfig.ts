export type RankId = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';

export interface RankConfig {
  id: RankId;
  displayName: string;
  minXP: number;
  xpToNext: number;
  daysToNext: number;
  color: string;
  description: string;
}

export const RANK_CONFIG: Record<RankId, RankConfig> = {
  E: {
    id: 'E',
    displayName: 'E-Rank Hunter',
    minXP: 0,
    xpToNext: 250,
    daysToNext: 7,
    color: 'from-gray-600 to-gray-700',
    description: 'Novice Hunter - Your journey begins here'
  },
  D: {
    id: 'D',
    displayName: 'D-Rank Hunter',
    minXP: 250,
    xpToNext: 750,
    daysToNext: 30,
    color: 'from-green-500 to-green-600',
    description: 'Apprentice Hunter - Building your foundation'
  },
  C: {
    id: 'C',
    displayName: 'C-Rank Hunter',
    minXP: 1000,
    xpToNext: 2000,
    daysToNext: 45,
    color: 'from-blue-500 to-blue-600',
    description: 'Skilled Hunter - Proven dedication'
  },
  B: {
    id: 'B',
    displayName: 'B-Rank Hunter',
    minXP: 3000,
    xpToNext: 5000,
    daysToNext: 60,
    color: 'from-purple-500 to-purple-600',
    description: 'Advanced Hunter - Elite capabilities'
  },
  A: {
    id: 'A',
    displayName: 'A-Rank Hunter',
    minXP: 8000,
    xpToNext: 12000,
    daysToNext: 90,
    color: 'from-orange-500 to-orange-600',
    description: 'Master Hunter - Exceptional prowess'
  },
  S: {
    id: 'S',
    displayName: 'S-Rank Hunter',
    minXP: 20000,
    xpToNext: 50000,
    daysToNext: 120,
    color: 'from-red-500 to-red-600',
    description: 'Legendary Hunter - Among the strongest'
  },
  SS: {
    id: 'SS',
    displayName: 'SS-Rank Hunter',
    minXP: 70000,
    xpToNext: 0, // Max rank
    daysToNext: 0, // Max rank
    color: 'from-electric-blue to-yellow-400',
    description: 'Transcendent Hunter - Beyond human limits'
  }
};

export const RANK_ORDER: RankId[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS'];

export function getRankConfig(rankId: RankId): RankConfig {
  return RANK_CONFIG[rankId];
}

export function getNextRankId(currentRank: RankId): RankId | null {
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  if (currentIndex === -1 || currentIndex === RANK_ORDER.length - 1) {
    return null; // Invalid rank or already at max
  }
  return RANK_ORDER[currentIndex + 1];
}

export function calculateRankFromXP(totalXP: number): RankId {
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    const rank = RANK_ORDER[i];
    const config = RANK_CONFIG[rank];
    if (totalXP >= config.minXP) {
      return rank;
    }
  }
  return 'E'; // Default to E rank
}

export function calculateXPProgress(currentXP: number, currentRank: RankId): {
  current: number;
  max: number;
  percentage: number;
  xpInCurrentRank: number;
  xpNeededForNext: number;
} {
  const rankConfig = getRankConfig(currentRank);
  const nextRankId = getNextRankId(currentRank);
  
  if (!nextRankId) {
    // Max rank reached
    return {
      current: currentXP,
      max: currentXP,
      percentage: 100,
      xpInCurrentRank: currentXP - rankConfig.minXP,
      xpNeededForNext: 0
    };
  }
  
  const nextRankConfig = getRankConfig(nextRankId);
  const xpInCurrentRank = Math.max(0, currentXP - rankConfig.minXP);
  const xpNeededForNext = nextRankConfig.minXP - rankConfig.minXP;
  const percentage = Math.min(100, Math.max(0, (xpInCurrentRank / xpNeededForNext) * 100));
  
  return {
    current: rankConfig.minXP + xpInCurrentRank,
    max: nextRankConfig.minXP,
    percentage,
    xpInCurrentRank,
    xpNeededForNext
  };
}

export function calculateDaysProgress(
  rankAssignedAt: string | null, 
  streakDays: number, 
  currentRank: RankId
): {
  daysCompleted: number;
  daysRequired: number;
  percentage: number;
  daysRemaining: number;
} {
  const rankConfig = getRankConfig(currentRank);
  const daysRequired = rankConfig.daysToNext;
  
  if (daysRequired === 0) {
    // Max rank
    return {
      daysCompleted: streakDays,
      daysRequired: 0,
      percentage: 100,
      daysRemaining: 0
    };
  }
  
  // Calculate days since rank was assigned
  let daysCompleted = 0;
  if (rankAssignedAt) {
    const assignedDate = new Date(rankAssignedAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24));
    daysCompleted = Math.min(daysRequired, Math.max(0, daysDiff));
  }
  
  // Use streak days as fallback or if it's higher
  daysCompleted = Math.max(daysCompleted, Math.min(daysRequired, streakDays));
  
  const percentage = Math.min(100, Math.max(0, (daysCompleted / daysRequired) * 100));
  const daysRemaining = Math.max(0, daysRequired - daysCompleted);
  
  return {
    daysCompleted,
    daysRequired,
    percentage,
    daysRemaining
  };
}