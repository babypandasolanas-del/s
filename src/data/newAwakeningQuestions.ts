export interface AssessmentQuestion {
  id: number;
  category: 'mind' | 'work' | 'body' | 'discipline' | 'willpower' | 'habits';
  text: string;
  answers: {
    text: string;
    score: number;
  }[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Mind (Q1-Q5)
  {
    id: 1,
    category: 'mind',
    text: 'How often do you read or learn new things?',
    answers: [
      { text: 'Almost never, I get bored quickly.', score: 1 },
      { text: 'Sometimes, if it\'s easy or short.', score: 2 },
      { text: 'Regularly, when I need it.', score: 3 },
      { text: 'I seek out new knowledge weekly.', score: 4 },
      { text: 'I hunger for learning every day.', score: 5 }
    ]
  },
  {
    id: 2,
    category: 'mind',
    text: 'When faced with stress, you…',
    answers: [
      { text: 'Panic or avoid it.', score: 1 },
      { text: 'Complain and feel overwhelmed.', score: 2 },
      { text: 'Try to manage but lose focus.', score: 3 },
      { text: 'Face it calmly and solve it.', score: 4 },
      { text: 'Turn it into growth energy.', score: 5 }
    ]
  },
  {
    id: 3,
    category: 'mind',
    text: 'Do you journal or reflect on your life?',
    answers: [
      { text: 'Never.', score: 1 },
      { text: 'Only during crises.', score: 2 },
      { text: 'Occasionally.', score: 3 },
      { text: 'Weekly habit.', score: 4 },
      { text: 'Daily ritual.', score: 5 }
    ]
  },
  {
    id: 4,
    category: 'mind',
    text: 'When you fail at something, you…',
    answers: [
      { text: 'Quit immediately.', score: 1 },
      { text: 'Feel defeated for a long time.', score: 2 },
      { text: 'Move on without deep reflection.', score: 3 },
      { text: 'Learn and retry.', score: 4 },
      { text: 'See failure as training XP.', score: 5 }
    ]
  },
  {
    id: 5,
    category: 'mind',
    text: 'How do you handle criticism?',
    answers: [
      { text: 'Hate it, avoid it.', score: 1 },
      { text: 'Take it personally.', score: 2 },
      { text: 'Listen but ignore.', score: 3 },
      { text: 'Learn from it.', score: 4 },
      { text: 'Seek it out to improve.', score: 5 }
    ]
  },

  // Work/Study (Q6-Q10)
  {
    id: 6,
    category: 'work',
    text: 'How do you approach your daily work/study?',
    answers: [
      { text: 'Avoid until forced.', score: 1 },
      { text: 'Start late, rush to finish.', score: 2 },
      { text: 'Do it as required.', score: 3 },
      { text: 'Plan and execute.', score: 4 },
      { text: 'Treat it like a mission.', score: 5 }
    ]
  },
  {
    id: 7,
    category: 'work',
    text: 'How many hours do you dedicate daily?',
    answers: [
      { text: 'Almost none.', score: 1 },
      { text: 'Less than 1 hour.', score: 2 },
      { text: '1–2 hours.', score: 3 },
      { text: '3–4 hours.', score: 4 },
      { text: '5+ hours with focus.', score: 5 }
    ]
  },
  {
    id: 8,
    category: 'work',
    text: 'Do you procrastinate?',
    answers: [
      { text: 'Always.', score: 1 },
      { text: 'Frequently.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Rarely.', score: 4 },
      { text: 'Never, I strike instantly.', score: 5 }
    ]
  },
  {
    id: 9,
    category: 'work',
    text: 'How do you treat deadlines?',
    answers: [
      { text: 'I ignore them.', score: 1 },
      { text: 'Often miss them.', score: 2 },
      { text: 'Barely meet them.', score: 3 },
      { text: 'Usually on time.', score: 4 },
      { text: 'Always ahead of time.', score: 5 }
    ]
  },
  {
    id: 10,
    category: 'work',
    text: 'How do you balance work and rest?',
    answers: [
      { text: 'No balance, mostly idle.', score: 1 },
      { text: 'Work too little.', score: 2 },
      { text: 'Work and rest equally.', score: 3 },
      { text: 'Work more than rest.', score: 4 },
      { text: 'Work with discipline, rest strategically.', score: 5 }
    ]
  },

  // Body (Q11-Q15)
  {
    id: 11,
    category: 'body',
    text: 'How often do you exercise?',
    answers: [
      { text: 'Never.', score: 1 },
      { text: 'Rarely.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Weekly routine.', score: 4 },
      { text: 'Daily commitment.', score: 5 }
    ]
  },
  {
    id: 12,
    category: 'body',
    text: 'Can you run 1 km without stopping?',
    answers: [
      { text: 'Not possible.', score: 1 },
      { text: 'Barely.', score: 2 },
      { text: 'With effort.', score: 3 },
      { text: 'Comfortably.', score: 4 },
      { text: 'Easily, with energy left.', score: 5 }
    ]
  },
  {
    id: 13,
    category: 'body',
    text: 'Pushup ability:',
    answers: [
      { text: '0–5 max.', score: 1 },
      { text: '6–10 max.', score: 2 },
      { text: '11–20 max.', score: 3 },
      { text: '21–40 max.', score: 4 },
      { text: '40+ with ease.', score: 5 }
    ]
  },
  {
    id: 14,
    category: 'body',
    text: 'Eating habits:',
    answers: [
      { text: 'Mostly junk.', score: 1 },
      { text: 'Frequent junk.', score: 2 },
      { text: 'Balanced but inconsistent.', score: 3 },
      { text: 'Mostly healthy.', score: 4 },
      { text: 'Disciplined clean diet.', score: 5 }
    ]
  },
  {
    id: 15,
    category: 'body',
    text: 'Sleep routine:',
    answers: [
      { text: 'Chaotic, random.', score: 1 },
      { text: 'Late nights, little rest.', score: 2 },
      { text: 'Inconsistent.', score: 3 },
      { text: 'Mostly regular.', score: 4 },
      { text: 'Strict, 7–8 hours daily.', score: 5 }
    ]
  },

  // Discipline (Q16-Q20)
  {
    id: 16,
    category: 'discipline',
    text: 'Morning routine:',
    answers: [
      { text: 'No structure.', score: 1 },
      { text: 'Random wake-ups.', score: 2 },
      { text: 'Loose schedule.', score: 3 },
      { text: 'Some structure.', score: 4 },
      { text: 'Strict, daily ritual.', score: 5 }
    ]
  },
  {
    id: 17,
    category: 'discipline',
    text: 'Phone use in bed:',
    answers: [
      { text: 'Always scroll till late.', score: 1 },
      { text: 'Often scroll before sleep.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Rarely.', score: 4 },
      { text: 'Never.', score: 5 }
    ]
  },
  {
    id: 18,
    category: 'discipline',
    text: 'Keeping promises to yourself:',
    answers: [
      { text: 'Always break them.', score: 1 },
      { text: 'Often fail.', score: 2 },
      { text: 'Sometimes succeed.', score: 3 },
      { text: 'Usually succeed.', score: 4 },
      { text: 'Always honor them.', score: 5 }
    ]
  },
  {
    id: 19,
    category: 'discipline',
    text: 'Following schedules:',
    answers: [
      { text: 'Never.', score: 1 },
      { text: 'Rarely.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Often.', score: 4 },
      { text: 'Always.', score: 5 }
    ]
  },
  {
    id: 20,
    category: 'discipline',
    text: 'Do you track progress (journals, apps)?',
    answers: [
      { text: 'Never.', score: 1 },
      { text: 'Rarely.', score: 2 },
      { text: 'Occasionally.', score: 3 },
      { text: 'Often.', score: 4 },
      { text: 'Daily discipline.', score: 5 }
    ]
  },

  // Willpower & Focus (Q21-Q25)
  {
    id: 21,
    category: 'willpower',
    text: 'How long can you focus without distraction?',
    answers: [
      { text: '<10 min.', score: 1 },
      { text: '10–20 min.', score: 2 },
      { text: '30 min.', score: 3 },
      { text: '1 hour.', score: 4 },
      { text: '2+ hours.', score: 5 }
    ]
  },
  {
    id: 22,
    category: 'willpower',
    text: 'Handling urges (food, social media):',
    answers: [
      { text: 'Always give in.', score: 1 },
      { text: 'Mostly give in.', score: 2 },
      { text: 'Sometimes resist.', score: 3 },
      { text: 'Usually resist.', score: 4 },
      { text: 'Strong self-control.', score: 5 }
    ]
  },
  {
    id: 23,
    category: 'willpower',
    text: 'Meditation/breathing practice:',
    answers: [
      { text: 'Never.', score: 1 },
      { text: 'Tried once.', score: 2 },
      { text: 'Occasionally.', score: 3 },
      { text: 'Weekly.', score: 4 },
      { text: 'Daily ritual.', score: 5 }
    ]
  },
  {
    id: 24,
    category: 'willpower',
    text: 'Long-term goals:',
    answers: [
      { text: 'Don\'t have any.', score: 1 },
      { text: 'Vague ideas only.', score: 2 },
      { text: 'Some goals, not tracked.', score: 3 },
      { text: 'Clear goals, partly tracked.', score: 4 },
      { text: 'Clear goals, strict tracking.', score: 5 }
    ]
  },
  {
    id: 25,
    category: 'willpower',
    text: 'Can you work in silence, no phone?',
    answers: [
      { text: 'Impossible.', score: 1 },
      { text: 'Rarely.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Often.', score: 4 },
      { text: 'Easily for hours.', score: 5 }
    ]
  },

  // Habits/Detox (Q26-Q30)
  {
    id: 26,
    category: 'habits',
    text: 'Social media time daily:',
    answers: [
      { text: '6+ hours.', score: 1 },
      { text: '4–6 hours.', score: 2 },
      { text: '2–4 hours.', score: 3 },
      { text: '1–2 hours.', score: 4 },
      { text: '<1 hour.', score: 5 }
    ]
  },
  {
    id: 27,
    category: 'habits',
    text: 'Do you watch adult content?',
    answers: [
      { text: 'Daily.', score: 1 },
      { text: 'Few times a week.', score: 2 },
      { text: 'Occasionally.', score: 3 },
      { text: 'Rarely.', score: 4 },
      { text: 'Never.', score: 5 }
    ]
  },
  {
    id: 28,
    category: 'habits',
    text: 'Junk food frequency:',
    answers: [
      { text: 'Every day.', score: 1 },
      { text: '4–6 days/week.', score: 2 },
      { text: '2–3 days/week.', score: 3 },
      { text: 'Once/week.', score: 4 },
      { text: 'Almost never.', score: 5 }
    ]
  },
  {
    id: 29,
    category: 'habits',
    text: 'Alcohol/smoking:',
    answers: [
      { text: 'Daily.', score: 1 },
      { text: 'Several times/week.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Rarely.', score: 4 },
      { text: 'Never.', score: 5 }
    ]
  },
  {
    id: 30,
    category: 'habits',
    text: 'Do you waste time endlessly scrolling?',
    answers: [
      { text: 'All the time.', score: 1 },
      { text: 'Often.', score: 2 },
      { text: 'Sometimes.', score: 3 },
      { text: 'Rarely.', score: 4 },
      { text: 'Almost never.', score: 5 }
    ]
  }
];