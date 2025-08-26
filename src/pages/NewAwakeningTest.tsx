import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, ArrowRight } from 'lucide-react';
import { assessmentQuestions } from '../data/newAwakeningQuestions';
import { calculateRankFromScore, getRankDescription } from '../data/questSystem';
import ProgressBar from '../components/ProgressBar';
import GlowingCard from '../components/GlowingCard';

interface NewAwakeningTestProps {
  onComplete: (totalScore: number, answers: number[], rank: string) => void;
}

const NewAwakeningTest: React.FC<NewAwakeningTestProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final results
      const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
      const rank = calculateRankFromScore(totalScore);
      onComplete(totalScore, newAnswers, rank);
    }
  };

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const question = assessmentQuestions[currentQuestion];

  const getCategoryIcon = (category: string) => {
    return <Sword className="w-5 h-5 text-electric-blue" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      mind: 'from-purple-500/20 to-blue-500/20 border-purple-400/30',
      work: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
      body: 'from-red-500/20 to-orange-500/20 border-red-400/30',
      discipline: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
      willpower: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/30',
      habits: 'from-pink-500/20 to-rose-500/20 border-pink-400/30'
    };
    return colors[category as keyof typeof colors] || 'from-electric-blue/20 to-electric-blue-dark/20 border-electric-blue/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            ⚔️ Hunter Assessment
          </h1>
          <p className="text-electric-blue font-orbitron text-lg text-glow">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </p>
        </motion.div>

        <div className="mb-6">
          <ProgressBar 
            current={currentQuestion + 1} 
            max={assessmentQuestions.length}
            showNumbers={false}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GlowingCard className="mb-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 bg-gradient-to-r ${getCategoryColor(question.category)}`}>
                  {getCategoryIcon(question.category)}
                  <span className="text-electric-blue font-orbitron font-semibold uppercase tracking-wider text-sm text-glow">
                    {question.category}
                  </span>
                </div>
                <h2 className="text-2xl font-orbitron font-bold text-white leading-relaxed text-glow">
                  {question.text}
                </h2>
              </div>

              <div className="space-y-3">
                {question.answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnswer(answer.score)}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all duration-300 text-left
                      ${selectedAnswer === answer.score
                        ? 'bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 border-electric-blue shadow-glow'
                        : 'bg-navy-dark/50 border-electric-blue/30 hover:border-electric-blue/60'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-orbitron font-medium text-glow">
                        {answer.text}
                      </span>
                      <span className="text-electric-blue font-orbitron font-bold text-glow">
                        {answer.score}
                      </span>
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
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                           text-white font-orbitron font-bold text-lg rounded-lg shadow-glow-strong
                           hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-3">
                    {currentQuestion < assessmentQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Reveal My Rank
                        <Sword className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </motion.button>
              )}
            </GlowingCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewAwakeningTest;