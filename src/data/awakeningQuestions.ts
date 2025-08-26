import { Category } from '../types';

export interface Question {
  id: number;
  category: Category;
  text: string;
}

export const awakeningQuestions: Question[] = [
  // Mind/Study-Work (1-10)
  { id: 1, category: 'mind', text: 'How many hours/day do you study or work with full focus?' },
  { id: 2, category: 'mind', text: 'Do you often procrastinate tasks until the deadline?' },
  { id: 3, category: 'mind', text: 'Do you revise or review your work regularly?' },
  { id: 4, category: 'mind', text: 'Do you set daily or weekly goals?' },
  { id: 5, category: 'mind', text: 'How often do you get distracted while studying/working?' },
  { id: 6, category: 'mind', text: 'Do you use techniques like Pomodoro or deep work?' },
  { id: 7, category: 'mind', text: 'Do you study/work at the same time daily?' },
  { id: 8, category: 'mind', text: 'Do you finish tasks before deadlines?' },
  { id: 9, category: 'mind', text: 'How often do you feel proud of your work/study sessions?' },
  { id: 10, category: 'mind', text: 'Do you track your progress (grades, career, or milestones)?' },

  // Body/Fitness (11-20)
  { id: 11, category: 'body', text: 'Do you exercise at least 3 times a week?' },
  { id: 12, category: 'body', text: 'Do you take at least 8,000 steps daily?' },
  { id: 13, category: 'body', text: 'Do you stretch or warm up your body?' },
  { id: 14, category: 'body', text: 'How often do you eat processed junk food?' },
  { id: 15, category: 'body', text: 'Do you maintain a stable sleep schedule?' },
  { id: 16, category: 'body', text: 'Do you drink enough water daily?' },
  { id: 17, category: 'body', text: 'Do you feel energetic most mornings?' },
  { id: 18, category: 'body', text: 'How often do you feel lazy/tired during the day?' },
  { id: 19, category: 'body', text: 'Do you maintain a healthy weight range?' },
  { id: 20, category: 'body', text: 'Do you avoid skipping meals?' },

  // Discipline (21-30)
  { id: 21, category: 'discipline', text: 'Do you wake up at a consistent time daily?' },
  { id: 22, category: 'discipline', text: 'Do you keep a morning routine?' },
  { id: 23, category: 'discipline', text: 'Do you use a planner or to-do list?' },
  { id: 24, category: 'discipline', text: 'Do you complete tasks even when you don\'t feel like it?' },
  { id: 25, category: 'discipline', text: 'Do you delay instant gratification for long-term goals?' },
  { id: 26, category: 'discipline', text: 'Do you track habits regularly?' },
  { id: 27, category: 'discipline', text: 'Do you avoid snoozing your alarm?' },
  { id: 28, category: 'discipline', text: 'Do you limit late-night screen use?' },
  { id: 29, category: 'discipline', text: 'Do you prepare for the next day in advance?' },
  { id: 30, category: 'discipline', text: 'Do you avoid excuses when skipping work?' },

  // Lifestyle (31-40)
  { id: 31, category: 'lifestyle', text: 'Do you sleep 7–8 hours daily?' },
  { id: 32, category: 'lifestyle', text: 'Do you avoid energy drinks and excessive caffeine?' },
  { id: 33, category: 'lifestyle', text: 'Do you eat fruits and vegetables daily?' },
  { id: 34, category: 'lifestyle', text: 'Do you eat at regular times?' },
  { id: 35, category: 'lifestyle', text: 'Do you avoid late-night junk food?' },
  { id: 36, category: 'lifestyle', text: 'Do you cook meals instead of eating out daily?' },
  { id: 37, category: 'lifestyle', text: 'Do you wake up refreshed most mornings?' },
  { id: 38, category: 'lifestyle', text: 'Do you avoid binge eating?' },
  { id: 39, category: 'lifestyle', text: 'Do you drink alcohol rarely or never?' },
  { id: 40, category: 'lifestyle', text: 'Do you avoid smoking/vaping?' },

  // Willpower (41-50)
  { id: 41, category: 'willpower', text: 'Do you push yourself when you want to quit?' },
  { id: 42, category: 'willpower', text: 'Do you finish what you start?' },
  { id: 43, category: 'willpower', text: 'Do you avoid giving in to temptations easily?' },
  { id: 44, category: 'willpower', text: 'Do you stick to difficult tasks for long periods?' },
  { id: 45, category: 'willpower', text: 'Do you avoid quitting when things get boring?' },
  { id: 46, category: 'willpower', text: 'Do you say no to bad habits when offered by friends?' },
  { id: 47, category: 'willpower', text: 'Do you stay consistent during failures?' },
  { id: 48, category: 'willpower', text: 'Do you challenge yourself often?' },
  { id: 49, category: 'willpower', text: 'Do you attempt things outside your comfort zone?' },
  { id: 50, category: 'willpower', text: 'Do you keep promises to yourself?' },

  // Focus (51-60)
  { id: 51, category: 'focus', text: 'Do you avoid scrolling social media during work/study?' },
  { id: 52, category: 'focus', text: 'Do you use website/app blockers?' },
  { id: 53, category: 'focus', text: 'Do you spend less than 2 hours/day on entertainment apps?' },
  { id: 54, category: 'focus', text: 'Do you take focus breaks instead of scrolling?' },
  { id: 55, category: 'focus', text: 'Do you avoid checking your phone first thing in the morning?' },
  { id: 56, category: 'focus', text: 'Do you avoid using your phone in bed?' },
  { id: 57, category: 'focus', text: 'Do you stay off your phone while eating?' },
  { id: 58, category: 'focus', text: 'Do you complete work before opening entertainment apps?' },
  { id: 59, category: 'focus', text: 'Do you avoid binge-watching shows?' },
  { id: 60, category: 'focus', text: 'Do you avoid pornography/explicit content?' },
];