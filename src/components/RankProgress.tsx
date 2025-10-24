import React from 'react';
import { motion } from 'framer-motion';
import { Rank } from '../data/questSystem';

interface RankProgressProps {
  currentRank: Rank;
  currentXP: number;
  nextRankXP: number;
  previousRankXP: number;
  nextRank: Rank | null;
}

const getRankColor = (rank: Rank): string => {
  const colors = {
    E: '#808080',
    D: '#4169E1',
    C: '#FFD700',
    B: '#FF6B35',
    A: '#9333EA',
    S: '#EC4899',
    SS: '#F59E0B'
  };
  return colors[rank];
};

const RankProgress: React.FC<RankProgressProps> = ({
  currentRank,
  currentXP,
  nextRankXP,
  previousRankXP,
  nextRank
}) => {
  const xpInCurrentRank = currentXP - previousRankXP;
  const xpRequiredForNext = nextRankXP - previousRankXP;
  const progress = Math.min((xpInCurrentRank / xpRequiredForNext) * 100, 100);
  const xpRemaining = nextRankXP - currentXP;

  const rankColor = getRankColor(currentRank);

  return (
    <div className="w-full">
      {/* Progress info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-orbitron text-white/70">Current Progress</span>
        </div>
        {nextRank && (
          <div className="text-right">
            <span className="text-sm font-orbitron text-electric-blue">
              Next Rank: <span className="font-bold">{nextRank}</span>
            </span>
            <div className="text-xs font-orbitron text-white/60">
              {xpRemaining > 0 ? `${xpRemaining.toLocaleString()} XP remaining` : 'Max Level!'}
            </div>
          </div>
        )}
      </div>

      {/* Progress bar container */}
      <div className="relative w-full h-8 bg-[#0d0d1a]/60 rounded-full overflow-hidden border border-electric-blue/20">
        {/* Animated glow background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(90deg, transparent, ${rankColor}, transparent)`
          }}
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${rankColor}dd, ${rankColor})`,
            boxShadow: `0 0 20px ${rankColor}, inset 0 0 10px ${rankColor}`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
            width: '30%'
          }}
          animate={{
            x: ['-30%', '130%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1
          }}
        />

        {/* Progress text */}
        <div className="relative h-full flex items-center justify-center">
          <span
            className="text-sm font-orbitron font-bold z-10 mix-blend-difference"
            style={{ color: '#ffffff' }}
          >
            {xpInCurrentRank.toLocaleString()} / {xpRequiredForNext.toLocaleString()} XP
          </span>
        </div>

        {/* Glow pulse on edges */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `inset 0 0 15px ${rankColor}80`
          }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Percentage indicator */}
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs font-orbitron text-white/50">
          {progress.toFixed(1)}% Complete
        </span>
        {nextRank && (
          <motion.div
            className="flex items-center gap-1"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: getRankColor(nextRank),
                boxShadow: `0 0 10px ${getRankColor(nextRank)}`
              }}
            />
            <span
              className="text-xs font-orbitron font-bold"
              style={{
                color: getRankColor(nextRank),
                textShadow: `0 0 10px ${getRankColor(nextRank)}`
              }}
            >
              {nextRank} Rank
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RankProgress;
