import React from 'react';
import { motion } from 'framer-motion';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glowColor?: string;
}

const GlowingCard: React.FC<GlowingCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  glowColor = 'cyan'
}) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`
        bg-navy-dark/90 border border-electric-blue/30 rounded-xl p-6
        backdrop-blur-sm relative overflow-hidden
        ${hover ? 'hover:border-electric-blue/60 transition-all duration-300' : ''}
        ${className}
      `}
      style={{
        boxShadow: `0 0 20px rgba(0, 207, 255, 0.15), inset 0 0 20px rgba(0, 207, 255, 0.05)`
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-blue/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
    </motion.div>
  );
};

export default GlowingCard;