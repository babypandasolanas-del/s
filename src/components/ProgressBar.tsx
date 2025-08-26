import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  showNumbers?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  label, 
  color = 'cyan',
  showNumbers = true 
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm font-orbitron font-medium text-glow">{label}</span>
          {showNumbers && (
            <span className="text-electric-blue text-sm font-orbitron">{current}/{max}</span>
          )}
        </div>
      )}
      <div className="w-full bg-navy-dark/80 rounded-full h-3 border border-electric-blue/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r from-electric-blue to-electric-blue-dark rounded-full relative`}
          style={{
            boxShadow: '0 0 10px rgba(0, 207, 255, 0.5)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;