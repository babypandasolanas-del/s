import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../utils/offlineStorage';

const OfflineIndicator: React.FC = () => {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 z-50"
        >
          <div className="bg-gradient-to-r from-electric-blue/10 to-red-500/20 
                         border border-electric-blue/40 backdrop-blur-sm p-3 rounded-lg
                         shadow-2xl">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-electric-blue" />
              <span className="text-white text-sm font-orbitron font-medium">
                Offline Mode
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;