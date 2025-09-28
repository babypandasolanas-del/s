import { Quest, Category } from '../types';

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';

export const calculateRankFromScore = (totalScore: number): Rank => {
  // Initial rank assignment based on assessment score
  if (totalScore >= 150) return 'D'; // Maximum score gets D rank
  return 'E'; // Below maximum gets E rank
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
      discipline: { title: 'Discipline Challenge', description: 'No junk food for the entire day', xp: 8 },
      social: { title: 'Social Connection', description: 'Have a meaningful conversation with someone', xp: 8 },
      spirit: { title: 'Mindfulness Practice', description: '10 minutes of meditation or reflection', xp: 8 },
      skill: { title: 'Skill Development', description: 'Practice a skill for 30 minutes', xp: 8 }
    },
    D: {
      mind: { title: 'Extended Focus', description: '2 hours of focused work/study', xp: 15 },
      body: { title: 'Trainee Workout', description: '100 pushups, 100 squats, 2 km run', xp: 15 },
      discipline: { title: 'Digital Discipline', description: 'No junk food + limit social media to <2 hours', xp: 12 },
      social: { title: 'Network Building', description: 'Reach out to 3 people in your network', xp: 12 },
      spirit: { title: 'Gratitude Practice', description: '15 minutes meditation + write 3 gratitudes', xp: 12 },
      skill: { title: 'Skill Advancement', description: 'Practice a skill for 45 minutes', xp: 12 }
    },
    C: {
      mind: { title: 'Deep Work Session', description: '3 hours of focused work/study', xp: 20 },
      body: { title: 'Intermediate Training', description: '150 pushups, 150 squats, 3 km run', xp: 20 },
      discipline: { title: 'Evening Reflection', description: 'Journal at night + no social media scrolling', xp: 18 },
      social: { title: 'Leadership Practice', description: 'Help or mentor someone today', xp: 18 },
      spirit: { title: 'Inner Work', description: '20 minutes meditation + journal reflection', xp: 18 },
      skill: { title: 'Skill Mastery', description: 'Practice a skill for 1 hour with focus', xp: 18 }
    },
    B: {
      mind: { title: 'Advanced Focus', description: '4 hours of focused work/study', xp: 25 },
      body: { title: 'Advanced Workout', description: '200 pushups, 200 squats, 4 km run', xp: 25 },
      discipline: { title: 'Complete Discipline', description: 'No adult content + no junk food + daily reflection', xp: 22 },
      social: { title: 'Community Impact', description: 'Contribute to your community or help 3+ people', xp: 22 },
      spirit: { title: 'Spiritual Discipline', description: '30 minutes meditation + spiritual reading', xp: 22 },
      skill: { title: 'Expert Practice', description: 'Practice a skill for 1.5 hours with intensity', xp: 22 }
    },
    A: {
      mind: { title: 'Elite Focus', description: '5 hours of focused work/study', xp: 30 },
      body: { title: 'Elite Training', description: '300 pushups, 300 squats, 5 km run', xp: 30 },
      discipline: { title: 'Cold Discipline', description: 'Cold shower + strict no distractions', xp: 28 },
      social: { title: 'Social Leadership', description: 'Lead a group activity or inspire 5+ people', xp: 28 },
      spirit: { title: 'Advanced Spirituality', description: '45 minutes meditation + teach someone', xp: 28 },
      skill: { title: 'Mastery Training', description: 'Practice a skill for 2 hours with perfect focus', xp: 28 }
    },
    S: {
      mind: { title: 'Master Focus', description: '6 hours of focused work/study', xp: 35 },
      body: { title: 'Master Training', description: '400 pushups, 400 squats, 6 km run', xp: 35 },
      discipline: { title: 'Master Discipline', description: 'Mentor/teach someone + no indulgence in bad habits', xp: 32 },
      social: { title: 'Master Influence', description: 'Create positive impact for 10+ people', xp: 32 },
      spirit: { title: 'Master Spirituality', description: '1 hour meditation + guide others spiritually', xp: 32 },
      skill: { title: 'Master Craft', description: 'Practice a skill for 3 hours + teach someone', xp: 32 }
    },
    SS: {
      mind: { title: 'Transcendent Focus', description: '8 hours of focused work/study', xp: 40 },
      body: { title: 'Transcendent Training', description: '500 pushups, 500 squats, 8 km run', xp: 40 },
      discipline: { title: 'Absolute Detox', description: 'Complete detox: no social media, adult content, junk food', xp: 38 },
      social: { title: 'Transcendent Leadership', description: 'Create massive positive impact for 20+ people', xp: 38 },
      spirit: { title: 'Transcendent Being', description: '2 hours meditation + spiritual mastery practice', xp: 38 },
      skill: { title: 'Transcendent Mastery', description: 'Practice a skill for 4+ hours + innovate/create', xp: 38 }
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
    },
    {
      id: `${rank}-social-${Date.now() + 3}`,
      title: templates.social.title,
      description: templates.social.description,
      category: 'lifestyle' as Category, // Map to existing category
      xpReward: templates.social.xp,
      difficulty: 'medium' as const,
      completed: false
    },
    {
      id: `${rank}-spirit-${Date.now() + 4}`,
      title: templates.spirit.title,
      description: templates.spirit.description,
      category: 'willpower' as Category, // Map to existing category
      xpReward: templates.spirit.xp,
      difficulty: 'medium' as const,
      completed: false
    },
    {
      id: `${rank}-skill-${Date.now() + 5}`,
      title: templates.skill.title,
      description: templates.skill.description,
      category: 'focus' as Category, // Map to existing category
      xpReward: templates.skill.xp,
      difficulty: 'medium' as const,
      completed: false
    }
  ];
};

export const getXpRequiredForNextRank = (rank: Rank): number => {
  const requirements = {
    E: 300,    // E → D requires 300 XP
    D: 750,    // D → C requires 750 XP total
    C: 1500,   // C → B requires 1500 XP total
    B: 3000,   // B → A requires 3000 XP total
    A: 6000,   // A → S requires 6000 XP total
    S: 12000,  // S → SS requires 12000 XP total
    SS: 25000  // SS → Max (no further progression)
  };
  return requirements[rank];
};

export const calculateRankFromXp = (totalXp: number): Rank => {
  // XP-based rank progression thresholds
  if (totalXp >= 12000) return 'SS';
  if (totalXp >= 6000) return 'S';
  if (totalXp >= 3000) return 'A';
  if (totalXp >= 1500) return 'B';
  if (totalXp >= 750) return 'C';
  if (totalXp >= 300) return 'D';
  return 'E';
};

export const getXpRequiredForCurrentRank = (rank: Rank): number => {
  const requirements = {
    E: 0,      // E rank starts at 0 XP
    D: 300,    // D rank starts at 300 XP
    C: 750,    // C rank starts at 750 XP
    B: 1500,   // B rank starts at 1500 XP
    A: 3000,   // A rank starts at 3000 XP
    S: 6000,   // S rank starts at 6000 XP
    SS: 12000  // SS rank starts at 12000 XP
  };
  return requirements[rank];
};

export const getNextRank = (currentRank: Rank): Rank | null => {
  const rankOrder: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS'];
  const currentIndex = rankOrder.indexOf(currentRank);
  
  if (currentIndex === -1 || currentIndex === rankOrder.length - 1) {
    return null; // Invalid rank or already at max
  }
  
  return rankOrder[currentIndex + 1];
};