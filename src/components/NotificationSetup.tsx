import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Zap } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import GlowingCard from './GlowingCard';

const NotificationSetup: React.FC = () => {
  const { permission, requestPermission, subscribeToPush } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    
    try {
      const granted = await requestPermission();
      if (granted) {
        await subscribeToPush();
        // Show success notification
        new Notification('⚡ Hunter System Activated!', {
          body: 'You will now receive quest reminders and streak warnings.',
          icon: '/icons/icon-192x192.png'
        });
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (permission === 'granted') {
    return (
      <GlowingCard className="mb-6">
        <div className="flex items-center gap-3 text-electric-blue">
          <Bell className="w-5 h-5" />
          <span className="font-orbitron font-medium text-glow">Notifications Enabled</span>
        </div>
        <p className="text-white/80 font-orbitron text-sm mt-2">
          You'll receive quest reminders and streak warnings.
        </p>
      </GlowingCard>
    );
  }

  if (permission === 'denied') {
    return (
      <GlowingCard className="mb-6">
        <div className="flex items-center gap-3 text-red-500">
          <BellOff className="w-5 h-5" />
          <span className="font-orbitron font-medium">Notifications Blocked</span>
        </div>
        <p className="text-white/80 font-orbitron text-sm mt-2">
          Enable notifications in your browser settings to receive quest reminders.
        </p>
      </GlowingCard>
    );
  }

  return (
    <GlowingCard className="mb-6">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full">
            <Zap className="w-6 h-6 text-electric-blue" />
          </div>
        </div>
        
        <h3 className="text-lg font-orbitron font-bold text-white mb-2 text-glow">
          Enable Hunter Notifications
        </h3>
        <p className="text-white/80 font-orbitron text-sm mb-4">
          Get notified about daily quests, streak warnings, and rank achievements.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnableNotifications}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                   text-white font-orbitron font-bold rounded-lg shadow-lg
                   hover:shadow-electric-blue/25 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {isLoading ? 'Setting up...' : 'Enable Notifications'}
          </div>
        </motion.button>
      </div>
    </GlowingCard>
  );
};

export default NotificationSetup;