import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, Award, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'warning' | 'achievement';
  show: boolean;
  onClose: () => void;
  showButtons?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}

const SystemNotification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  show, 
  onClose,
  showButtons = false,
  onAccept,
  onDecline 
}) => {
  useEffect(() => {
    if (show && !showButtons) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, showButtons]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Zap className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
    }
  };

  // Format message like Solo Leveling UI
  const formatMessage = (text: string) => {
    // Replace time patterns with red highlighting
    const timePattern = /(\d+\.?\d*\s*(seconds?|minutes?|hours?|days?))/gi;
    const parts = text.split(timePattern);
    
    return parts.map((part, index) => {
      if (timePattern.test(part)) {
        return (
          <span key={index} className="text-red-500 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleAccept = () => {
    if (onAccept) onAccept();
    onClose();
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={!showButtons ? onClose : undefined}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-navy-dark/90 backdrop-blur-sm border border-cyan-400/50 rounded-xl p-6 max-w-md w-full mx-4"
              style={{
                backgroundColor: 'rgba(10, 15, 28, 0.9)',
                boxShadow: '0 0 30px rgba(56, 189, 248, 0.3), inset 0 0 30px rgba(56, 189, 248, 0.1)'
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-cyan-400">
                  {getIcon()}
                </div>
                <h3 
                  className="text-xl font-lato font-normal text-cyan-400 tracking-wider"
                  style={{
                    textShadow: '0 0 10px rgba(56, 189, 248, 0.8)'
                  }}
                >
                  NOTIFICATION
                </h3>
              </div>

              {/* Message */}
              <div className="mb-6">
                <p className="text-white font-lato text-base leading-relaxed">
                  {formatMessage(message)}
                </p>
              </div>

              {/* Buttons */}
              {showButtons && (
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAccept}
                    className="px-6 py-2 bg-navy-dark border border-cyan-400/50 text-white font-lato rounded-lg
                             hover:border-cyan-400 transition-all duration-300"
                    style={{
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    Yes
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDecline}
                    className="px-6 py-2 bg-navy-dark border border-cyan-400/50 text-white font-lato rounded-lg
                             hover:border-cyan-400 transition-all duration-300"
                    style={{
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    No
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SystemNotification;
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