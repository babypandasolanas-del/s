import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { awakeningQuestions } from '../data/awakeningQuestions';
import { AwakeningAnswer, UserStats, Rank } from '../types';
import { calculateRankFromXp } from '../data/questSystem';
import ProgressBar from '../components/ProgressBar';
import GlowingCard from '../components/GlowingCard';

interface AwakeningTestProps {
  onComplete: (rank: Rank, stats: UserStats, totalXp: number) => void;
}

const AwakeningTest: React.FC<AwakeningTestProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AwakeningAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (score: number) => {
    const answer: AwakeningAnswer = {
      questionId: awakeningQuestions[currentQuestion].id,
      answer: score,
      category: awakeningQuestions[currentQuestion].category,
    };

    setAnswers([...answers, answer]);
    setSelectedAnswer(null);

    if (currentQuestion < awakeningQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults([...answers, answer]);
    }
  };

  const calculateResults = (allAnswers: AwakeningAnswer[]) => {
    const stats: UserStats = {
      mind: 0,
      body: 0,
      discipline: 0,
      lifestyle: 0,
      willpower: 0,
      focus: 0,
    };

    // Calculate average score for each category
    const categories = ['mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus'] as const;
    
    categories.forEach((category) => {
      const categoryAnswers = allAnswers.filter(a => a.category === category);
      const average = categoryAnswers.reduce((sum, a) => sum + a.answer, 0) / categoryAnswers.length;
      stats[category] = Math.round(average * 20); // Scale to 0-100
    });

    // Calculate total XP based on stats
    const totalXp = Object.values(stats).reduce((sum, stat) => sum + stat, 0);
    const rank = calculateRankFromXp(totalXp);

    onComplete(rank, stats, totalXp);
  };

  const progress = ((currentQuestion + 1) / awakeningQuestions.length) * 100;
  const question = awakeningQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4 text-glow">
            Hunter Awakening Test
          </h1>
          <p className="text-electric-blue font-orbitron text-lg">
            Question {currentQuestion + 1} of {awakeningQuestions.length}
          </p>
        </motion.div>

        <ProgressBar 
          current={currentQuestion + 1} 
          max={awakeningQuestions.length}
          showNumbers={false}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <GlowingCard className="mb-8">
              <div className="text-center mb-8">
                <div className="text-sm text-electric-blue font-orbitron mb-2 uppercase tracking-wider font-semibold">
                  {question.category}
                </div>
                <h2 className="text-2xl font-orbitron font-bold text-white leading-relaxed text-glow">
                  {question.text}
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { score: 5, label: 'Always / Excellent', color: 'from-green-600 to-green-700' },
                  { score: 4, label: 'Often / Good', color: 'from-blue-600 to-blue-700' },
                  { score: 3, label: 'Sometimes / Average', color: 'from-yellow-600 to-yellow-700' },
                  { score: 2, label: 'Rarely / Poor', color: 'from-orange-600 to-orange-700' },
                  { score: 1, label: 'Never / Very Poor', color: 'from-red-600 to-red-700' },
                ].map(({ score, label, color }) => (
                  <motion.button
                    key={score}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnswer(score)}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all duration-300
                      ${selectedAnswer === score
                        ? `bg-gradient-to-r ${color} border-electric-blue shadow-lg`
                        : 'bg-navy-dark/50 border-electric-blue/30 hover:border-electric-blue/60'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-orbitron font-medium">{label}</span>
                      <span className="text-electric-blue font-orbitron font-bold">{score}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {selectedAnswer && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(selectedAnswer)}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                           text-white font-orbitron font-bold rounded-lg shadow-lg
                           hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  {currentQuestion < awakeningQuestions.length - 1 ? 'Next Question' : 'Complete Test'}
                </motion.button>
              )}
            </GlowingCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AwakeningTest;