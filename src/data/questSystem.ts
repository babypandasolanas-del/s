import { Quest, Category } from '../types';

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';

export const calculateRankFromScore = (totalScore: number): Rank => {
  if (totalScore <= 60) return 'E';
  if (totalScore <= 90) return 'D';
  if (totalScore <= 110) return 'C';
  // Higher ranks earned via quests, not initial assessment
  return 'C';
};

export const getRankDescription = (rank: Rank): string => {
  const descriptions = {
    E: 'E Rank Adventurer - Your journey begins here. Every legend started as a novice.',
    D: 'D Rank Adventurer - You show potential. Keep training to unlock your true power.',
    C: 'C Rank Adventurer - Solid foundation established. Ready for greater challenges.',
    B: 'B Rank Hunter - Advanced skills developed. You stand above most adventurers.',
    A: 'A Rank Hunter - Elite status achieved. Your dedication inspires others.',
    S: 'S Rank Hunter - Master level reached. Few can match your discipline.',
    SS: 'SS Rank Hunter - Transcendent being. You have surpassed human limitations.'
  };
  return descriptions[rank];
};

export const generateDailyQuests = (rank: Rank): Quest[] => {
  const questTemplates = {
    E: {
      mind: { title: 'Focus Training', description: '1 hour of focused work/study (no phone)', xp: 10 },
      body: { title: 'Basic Physical Training', description: '50 pushups, 50 squats, 1 km run', xp: 10 },
      discipline: { title: 'Discipline Challenge', description: 'No junk food for the entire day', xp: 8 }
    },
    D: {
      mind: { title: 'Extended Focus', description: '2 hours of focused work/study', xp: 15 },
      body: { title: 'Trainee Workout', description: '100 pushups, 100 squats, 2 km run', xp: 15 },
      discipline: { title: 'Digital Discipline', description: 'No junk food + limit social media to <2 hours', xp: 12 }
    },
    C: {
      mind: { title: 'Deep Work Session', description: '3 hours of focused work/study', xp: 20 },
      body: { title: 'Intermediate Training', description: '150 pushups, 150 squats, 3 km run', xp: 20 },
      discipline: { title: 'Evening Reflection', description: 'Journal at night + no social media scrolling', xp: 18 }
    },
    B: {
      mind: { title: 'Advanced Focus', description: '4 hours of focused work/study', xp: 25 },
      body: { title: 'Advanced Workout', description: '200 pushups, 200 squats, 4 km run', xp: 25 },
      discipline: { title: 'Complete Discipline', description: 'No adult content + no junk food + daily reflection', xp: 22 }
    },
    A: {
      mind: { title: 'Elite Focus', description: '5 hours of focused work/study', xp: 30 },
      body: { title: 'Elite Training', description: '300 pushups, 300 squats, 5 km run', xp: 30 },
      discipline: { title: 'Cold Discipline', description: 'Cold shower + strict no distractions', xp: 28 }
    },
    S: {
      mind: { title: 'Master Focus', description: '6 hours of focused work/study', xp: 35 },
      body: { title: 'Master Training', description: '400 pushups, 400 squats, 6 km run', xp: 35 },
      discipline: { title: 'Master Discipline', description: 'Mentor/teach someone + no indulgence in bad habits', xp: 32 }
    },
    SS: {
      mind: { title: 'Transcendent Focus', description: '8 hours of focused work/study', xp: 40 },
      body: { title: 'Transcendent Training', description: '500 pushups, 500 squats, 8 km run', xp: 40 },
      discipline: { title: 'Absolute Detox', description: 'Complete detox: no social media, adult content, junk food', xp: 38 }
    }
  };

  const templates = questTemplates[rank];
  
  return [
    {
      id: `${rank}-mind-${Date.now()}`,
      title: templates.mind.title,
      description: templates.mind.description,
      category: 'mind' as Category,
      xpReward: templates.mind.xp,
      difficulty: 'medium' as const,
      completed: false
    },
    {
      id: `${rank}-body-${Date.now() + 1}`,
      title: templates.body.title,
      description: templates.body.description,
      category: 'body' as Category,
      xpReward: templates.body.xp,
      difficulty: 'medium' as const,
      completed: false
    },
    {
      id: `${rank}-discipline-${Date.now() + 2}`,
      title: templates.discipline.title,
      description: templates.discipline.description,
      category: 'discipline' as Category,
      xpReward: templates.discipline.xp,
      difficulty: 'medium' as const,
      completed: false
    }
  ];
};

export const getXpRequiredForNextRank = (rank: Rank): number => {
  const requirements = {
    E: 100,
    D: 250,
    C: 500,
    B: 1000,
    A: 2000,
    S: 4000,
    SS: 8000
  };
  return requirements[rank];
};

export const calculateRankFromXp = (totalXp: number): Rank => {
  if (totalXp >= 8000) return 'SS';
  if (totalXp >= 4000) return 'S';
  if (totalXp >= 2000) return 'A';
  if (totalXp >= 1000) return 'B';
  if (totalXp >= 500) return 'C';
  if (totalXp >= 250) return 'D';
  return 'E';
};