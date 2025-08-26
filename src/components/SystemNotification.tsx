import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, Award } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'warning' | 'achievement';
  show: boolean;
  onClose: () => void;
}

const SystemNotification: React.FC<NotificationProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Zap className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-blue-500/20 border-green-400/30';
      case 'warning':
        return 'from-orange-500/20 to-red-500/20 border-orange-400/30';
      case 'achievement':
        return 'from-purple-500/20 to-blue-500/20 border-purple-400/30';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="solo-notification p-6 rounded-lg max-w-sm">
            <div className="solo-notification-title">
              [! NOTIFICATION]
            </div>
            <div className="flex items-start gap-3">
              <div className="text-electric-blue animate-pulse mt-1">
                {getIcon()}
              </div>
              <div className="flex-1">
                <p className="solo-notification-body font-orbitron text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotification;