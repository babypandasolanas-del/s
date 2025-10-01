import React from 'react';
import { motion } from 'framer-motion';

interface DynamicProgressBarProps {
  current: number;
  max: number;
  percentage: number;
  label: string;
  showNumbers?: boolean;
  color?: string;
  className?: string;
}

const DynamicProgressBar: React.FC<DynamicProgressBarProps> = ({ 
  current, 
  max, 
  percentage,
  label, 
  showNumbers = true,
  color = 'electric-blue',
  className = ''
}) => {
  // Ensure percentage is always between 0 and 100
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-white text-sm font-orbitron font-medium text-glow">{label}</span>
          {showNumbers && (
            <span className="text-electric-blue text-sm font-orbitron">
              {max > 0 ? `${current}/${max}` : current}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-navy-dark/80 rounded-full h-3 border border-electric-blue/30 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r from-electric-blue to-electric-blue-dark relative`}
          style={{
            boxShadow: '0 0 10px rgba(0, 207, 255, 0.5)',
          }}
        >
          {/* Animated shimmer effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
      {showNumbers && (
        <div className="text-center mt-1">
          <span className="text-electric-blue/60 font-orbitron text-xs">
            {safePercentage.toFixed(1)}% Complete
          </span>
        </div>
      )}
    </div>
  );
};

export default DynamicProgressBar;