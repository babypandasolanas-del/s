import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Zap } from 'lucide-react';
import { Rank } from '../data/questSystem';

interface HunterSummaryProps {
  currentRank: Rank;
  totalXP: number;
  streakDays: number;
  questsCompleted: number;
  totalQuests: number;
}

const motivationalQuotes = [
  "The dungeon never sleeps. Neither should your discipline.",
  "Every quest completed brings you closer to S-Rank.",
  "True hunters rise before dawn and train after dusk.",
  "Weakness is a choice. Strength is earned daily.",
  "Your future self is watching. Make them proud."
];

const HunterSummary: React.FC<HunterSummaryProps> = ({
  currentRank,
  totalXP,
  streakDays,
  questsCompleted,
  totalQuests
}) => {
  const dailyQuote = useMemo(() => {
    const today = new Date().getDate();
    return motivationalQuotes[today % motivationalQuotes.length];
  }, []);

  const completionPercentage = totalQuests > 0 ? (questsCompleted / totalQuests) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full mb-8"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 via-purple-500/10 to-electric-blue/10 rounded-2xl blur-xl" />

      <div className="relative bg-[#0d0d1a]/60 backdrop-blur-lg border border-electric-blue/30 rounded-2xl p-6 overflow-hidden">
        {/* Top glowing line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-electric-blue to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Rank */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-electric-blue/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <Trophy className="w-10 h-10 text-electric-blue relative z-10" />
            </div>
            <div>
              <div className="text-xs font-orbitron text-white/50 uppercase tracking-wider">
                Current Rank
              </div>
              <div className="text-2xl font-orbitron font-bold text-electric-blue" style={{ textShadow: '0 0 10px #00f0ff' }}>
                {currentRank}
              </div>
            </div>
          </motion.div>

          {/* Vertical divider */}
          <div className="hidden md:block absolute left-1/4 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-electric-blue/50 to-transparent" />

          {/* XP */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-purple-500/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5
                }}
              />
              <Zap className="w-10 h-10 text-purple-400 relative z-10" fill="#c084fc" />
            </div>
            <div>
              <div className="text-xs font-orbitron text-white/50 uppercase tracking-wider">
                Total XP
              </div>
              <div className="text-2xl font-orbitron font-bold text-purple-400" style={{ textShadow: '0 0 10px #c084fc' }}>
                {totalXP.toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Vertical divider */}
          <div className="hidden md:block absolute left-2/4 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-electric-blue/50 to-transparent" />

          {/* Streak */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-orange-500/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1
                }}
              />
              <Flame className="w-10 h-10 text-orange-400 relative z-10" fill="#fb923c" />
            </div>
            <div>
              <div className="text-xs font-orbitron text-white/50 uppercase tracking-wider">
                Streak
              </div>
              <div className="text-2xl font-orbitron font-bold text-orange-400" style={{ textShadow: '0 0 10px #fb923c' }}>
                {streakDays} Days
              </div>
            </div>
          </motion.div>

          {/* Vertical divider */}
          <div className="hidden md:block absolute left-3/4 top-1/2 transform -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-electric-blue/50 to-transparent" />

          {/* Quests */}
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-green-500/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.5
                }}
              />
              <Target className="w-10 h-10 text-green-400 relative z-10" />
            </div>
            <div>
              <div className="text-xs font-orbitron text-white/50 uppercase tracking-wider">
                Today's Quests
              </div>
              <div className="text-2xl font-orbitron font-bold text-green-400" style={{ textShadow: '0 0 10px #4ade80' }}>
                {questsCompleted}/{totalQuests}
              </div>
              <div className="text-xs font-orbitron text-white/40">
                {completionPercentage.toFixed(0)}% Complete
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom motivational quote */}
        <motion.div
          className="mt-6 pt-6 border-t border-electric-blue/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 rounded-full bg-electric-blue"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <p className="text-sm font-orbitron text-electric-blue italic">
              "{dailyQuote}"
            </p>
          </div>
        </motion.div>

        {/* Bottom glowing line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-electric-blue to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </div>
    </motion.div>
  );
};

export default HunterSummary;
