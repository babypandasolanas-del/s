import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown, ArrowRight } from 'lucide-react';
import { Rank, UserStats } from '../types';
import RankBadge from '../components/RankBadge';
import ProgressBar from '../components/ProgressBar';
import GlowingCard from '../components/GlowingCard';

interface TestResultsProps {
  rank: Rank;
  stats: UserStats;
  totalXp: number;
  onUpgrade: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ rank, stats, totalXp, onUpgrade }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const getRankDescription = (rank: Rank) => {
    const descriptions = {
      E: 'E-Rank Hunter - You have potential, but need to awaken your true power.',
      D: 'D-Rank Hunter - Your journey has begun, but there\'s much more to unlock.',
      C: 'C-Rank Hunter - You show promise and dedication to growth.',
      B: 'B-Rank Hunter - A capable hunter with balanced abilities.',
      A: 'A-Rank Hunter - Elite level performance across multiple areas.',
      S: 'S-Rank Hunter - Exceptional abilities that inspire others.',
      SS: 'SS-Rank Hunter - Legendary status achieved. You are among the strongest.',
    };
    return descriptions[rank];
  };

  const categoryLabels = {
    mind: 'Mind',
    body: 'Body', 
    discipline: 'Discipline',
    lifestyle: 'Lifestyle',
    willpower: 'Willpower',
    focus: 'Focus'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-block p-8 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full">
              <Crown className="w-16 h-16 text-electric-blue" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-orbitron font-bold text-white mb-4 text-glow-strong"
          >
            Awakening Complete!
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <RankBadge rank={rank} size="lg" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl font-orbitron text-white/90 mb-8 text-glow"
          >
            {getRankDescription(rank)}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="grid gap-6 mb-8"
        >
          <GlowingCard>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-6 text-center text-glow">Hunter Stats</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(stats).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + Object.keys(stats).indexOf(key) * 0.1 }}
                >
                  <ProgressBar
                    current={value}
                    max={100}
                    label={categoryLabels[key as keyof UserStats]}
                    showNumbers={true}
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-electric-blue font-orbitron text-lg">
                Total XP: <span className="font-bold text-white text-glow">{totalXp}</span>
              </div>
            </div>
          </GlowingCard>

          <GlowingCard>
            <div className="text-center">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-white/80 font-orbitron mb-6 leading-relaxed">
                Your hunter abilities have been assessed. To unlock daily quests, 
                guild membership, boss missions, and track your progress, upgrade to the full system.
              </p>
              
              <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-6 mb-6">
                <h4 className="text-electric-blue font-orbitron font-bold text-lg mb-3 text-glow">Premium Features:</h4>
                <div className="grid md:grid-cols-2 gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span className="text-white font-orbitron">Daily Quest System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span className="text-white font-orbitron">Guild Membership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span className="text-white font-orbitron">Boss Missions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span className="text-white font-orbitron">Progress Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span className="text-white font-orbitron">Rank Advancement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span className="text-white font-orbitron">System Notifications</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onUpgrade}
                className="px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                         text-white font-orbitron font-bold text-xl rounded-xl
                         shadow-2xl hover:shadow-electric-blue/25 
                         border border-electric-blue/50 transition-all duration-300"
                style={{
                  boxShadow: '0 0 30px rgba(0, 207, 255, 0.4)'
                }}
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6" />
                  Upgrade to Premium - $29/month
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
            </div>
          </GlowingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default TestResults;