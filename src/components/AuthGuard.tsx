import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import GlowingCard from './GlowingCard';

interface AuthGuardProps {
  onShowAuth: () => void;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ onShowAuth }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full"
      >
        <GlowingCard>
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
                <Shield className="w-8 h-8 text-electric-blue" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-2 text-glow-strong">
                Access Restricted
              </h3>
              <p className="text-white/80 font-orbitron leading-relaxed">
                You must log in or sign up to take the Hunter Assessment and access the system.
              </p>
            </div>

            <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 justify-center text-electric-blue">
                <Lock className="w-5 h-5" />
                <span className="font-orbitron font-semibold text-glow">Hunter System Protected</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowAuth}
              className="w-full py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                       text-white font-orbitron font-bold text-lg rounded-lg
                       shadow-glow-strong hover:shadow-electric-blue/25 
                       border border-electric-blue/50 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-5 h-5" />
                Sign In / Sign Up
              </div>
            </motion.button>
          </div>
        </GlowingCard>
      </motion.div>
    </motion.div>
  );
};

export default AuthGuard;