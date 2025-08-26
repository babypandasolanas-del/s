import React from 'react';
import { Rank } from '../types';

interface RankBadgeProps {
  rank: Rank;
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
}

const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'md', glowing = true }) => {
  const getRankColor = (rank: Rank) => {
    switch (rank) {
      case 'E': return 'from-gray-600 to-gray-700 border-gray-400';
      case 'D': return 'from-green-500 to-green-600 border-green-400';
      case 'C': return 'from-electric-blue to-blue-600 border-electric-blue';
      case 'B': return 'from-purple-500 to-purple-600 border-purple-400';
      case 'A': return 'from-orange-500 to-orange-600 border-orange-400';
      case 'S': return 'from-red-500 to-red-600 border-red-400';
      case 'SS': return 'from-electric-blue to-yellow-400 border-electric-blue';
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'md': return 'px-3 py-1.5 text-sm';
      case 'lg': return 'px-4 py-2 text-lg';
    }
  };

  return (
    <div className={`
      inline-flex items-center justify-center
      bg-gradient-to-r ${getRankColor(rank)} font-orbitron
      border rounded-lg font-extrabold text-white
      ${getSizeClasses(size)}
      ${glowing ? 'shadow-lg' : ''}
    `}
      style={glowing ? {
        filter: 'drop-shadow(0 0 10px rgba(0, 207, 255, 0.4))',
        textShadow: '0 0 10px rgba(0, 207, 255, 0.8)'
      } : {}}
    >
      {rank}
    </div>
  );
};

export default RankBadge;