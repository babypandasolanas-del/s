import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import GlowingCard from './GlowingCard';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Show prompt after user has been on the site for 30 seconds and hasn't seen it before
    const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-shown');
    
    if (isInstallable && !isInstalled && !hasSeenPrompt && !hasBeenShown) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
        setHasBeenShown(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, hasBeenShown]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
      localStorage.setItem('pwa-install-prompt-shown', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-md w-full"
        >
          <GlowingCard className="relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-electric-blue" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-white mb-2 text-glow">
                  Install MindLevel
                </h3>
                <p className="text-white/80 font-orbitron leading-relaxed">
                  Get instant access to your Hunter System with notifications, 
                  offline support, and home screen access.
                </p>
              </div>

              <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-4 mb-6">
                <h4 className="text-electric-blue font-orbitron font-semibold mb-3 text-glow">PWA Features:</h4>
                <div className="space-y-2 text-sm text-white/80 font-orbitron">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-electric-blue" />
                    <span>Home screen installation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-electric-blue" />
                    <span>Push notifications for quests & streaks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-electric-blue" />
                    <span>Offline access to dashboard</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInstall}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                           text-white font-orbitron font-bold rounded-lg shadow-lg
                           hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Install App
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="px-6 py-3 bg-navy-dark/80 hover:bg-navy-dark 
                           text-white font-orbitron font-medium rounded-lg transition-colors border border-electric-blue/30"
                >
                  Later
                </motion.button>
              </div>
            </div>
          </GlowingCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;