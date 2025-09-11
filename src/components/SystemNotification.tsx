import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface SystemNotificationProps {
  show: boolean;
  message: string;
  type?: 'warning' | 'error' | 'info';
  onClose: () => void;
  showButtons?: boolean;
  onYes?: () => void;
  onNo?: () => void;
}

const SystemNotification: React.FC<SystemNotificationProps> = ({
  show,
  message,
  type = 'warning',
  onClose,
  showButtons = true,
  onYes,
  onNo
}) => {
  // Format message in Solo Leveling style (first letter capitalized, rest lowercase)
  const formatMessage = (text: string) => {
    return text.replace(/\b\w/g, (match, offset) => 
      offset === 0 ? match.toUpperCase() : match.toLowerCase()
    );
  };

  // Highlight time patterns in red
  const highlightTimeInMessage = (text: string) => {
    const timePattern = /(\d+(?:\.\d+)?\s*(?:second|minute|hour|day|week|month|year)s?)/gi;
    const parts = text.split(timePattern);
    
    return parts.map((part, index) => {
      if (timePattern.test(part)) {
        return (
          <span key={index} className="text-red-500 font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const formattedMessage = formatMessage(message);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={!showButtons ? onClose : undefined}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#0A0F1C]/90 border border-cyan-400/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.3), inset 0 0 30px rgba(56, 189, 248, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-cyan-400 mr-3" />
              <h2 
                className="text-xl font-lato font-normal text-cyan-400 tracking-wider"
                style={{
                  textShadow: '0 0 10px rgba(56, 189, 248, 0.8)'
                }}
              >
                NOTIFICATION
              </h2>
            </div>

            {/* Message */}
            <div className="mb-6 text-center">
              <p className="text-white font-lato text-base leading-relaxed">
                {highlightTimeInMessage(formattedMessage)}
              </p>
            </div>

            {/* Buttons */}
            {showButtons && (
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onYes || onClose}
                  className="px-6 py-2 bg-gray-800/50 border border-cyan-400/50 rounded-lg text-cyan-400 font-lato hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-200"
                  style={{
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
                  }}
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNo || onClose}
                  className="px-6 py-2 bg-gray-800/50 border border-cyan-400/50 rounded-lg text-cyan-400 font-lato hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-200"
                  style={{
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)'
                  }}
                >
                  No
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotification;