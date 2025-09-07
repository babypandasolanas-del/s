import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';

const DiscordButton: React.FC = () => {
  const handleDiscordClick = () => {
    window.open('https://discord.gg/Sv6cJHEGg8', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDiscordClick}
      className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
               text-white font-orbitron font-bold text-lg rounded-xl
               shadow-lg hover:shadow-indigo-500/25 
               border border-indigo-500/50 transition-all duration-300
               relative overflow-hidden group"
      style={{
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
      }}
    >
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative flex items-center justify-center gap-3">
        <MessageCircle className="w-6 h-6" />
        Join Our Discord ⚡
        <Users className="w-5 h-5" />
      </div>
    </motion.button>
  );
};

export default DiscordButton;