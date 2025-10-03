export interface User {
  id: string;
  email: string;
  name?: string;
  rank: Rank;
  totalXp: number;
  streakDays: number;
  guildId?: string;
  subscriptionActive: boolean;
  lastActive: string;
  stats: UserStats;
  createdAt: string;
}

export interface UserStats {
  mind: number;
  body: number;
  discipline: number;
  lifestyle: number;
  willpower: number;
  focus: number;
}

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';

export interface AwakeningAnswer {
  questionId: number;
  answer: number; // 1-5 scale
  category: Category;
}

export type Category = 'mind' | 'body' | 'discipline' | 'lifestyle' | 'willpower' | 'focus';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: Category;
  xp_reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalXp: number;
  category: Category;
}

export interface BossMission {
  id: string;
  name: string;
  description: string;
  requiredRank: Rank;
  requiredStreak: number;
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
}