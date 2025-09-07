import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react';
import GlowingCard from '../components/GlowingCard';
import PayPalSubscription from '../components/PayPalSubscription';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface LockedRankRevealProps {
  totalScore: number;
  onUpgradeSuccess: () => void;
}

const LockedRankReveal: React.FC<LockedRankRevealProps> = ({ 
  totalScore, 
  onUpgradeSuccess 
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, userName } = useAuth();

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    
    try {
      // Refresh user profile to get updated subscription status
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for webhook processing
      
      // Check if subscription is now active
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user?.id)
        .single();

      if (profile?.subscription_status === 'active') {
        onUpgradeSuccess();
      } else {
        // Retry after a short delay
        setTimeout(async () => {
          const { data: retryProfile } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user?.id)
            .single();
          
          if (retryProfile?.subscription_status === 'active') {
            onUpgradeSuccess();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing payment success:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-slate-900 to-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        {!showPayment ? (
          // Locked Rank Screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 1, type: "spring" }}
              className="mb-8"
            >
              <div className="inline-block p-12 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full border-4 border-electric-blue shadow-glow-strong relative">
                <Crown className="w-24 h-24 text-electric-blue" />
                {/* Lock overlay */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="absolute inset-0 flex items-center justify-center bg-navy-dark/80 rounded-full backdrop-blur-sm"
                >
                  <Lock className="w-16 h-16 text-electric-blue" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-6xl font-orbitron font-black text-white mb-6 text-glow-strong"
            >
              ASSESSMENT COMPLETE
            </motion.h1>
            
            {/* Blurred Rank Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mb-8 relative"
            >
              <div className="inline-block transform scale-150 filter blur-sm">
                <div className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 border border-gray-400 rounded-lg font-orbitron font-extrabold text-white text-2xl">
                  ???
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-8 h-8 text-electric-blue" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-orbitron font-bold text-electric-blue mb-4 text-glow">
                Hunter {userName}, your rank is ready to be revealed! ⚔️
              </h2>
              <div className="text-xl font-orbitron text-white/90 text-glow mb-6">
                Assessment Score: <span className="text-electric-blue font-bold">{totalScore}/150</span>
              </div>
              <p className="text-2xl font-orbitron font-bold text-white text-glow">
                Upgrade to unlock your Hunter Rank ⚔️ and full training system.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <GlowingCard className="max-w-2xl mx-auto mb-8">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                    Unlock Your Hunter Potential
                  </h3>
                  <p className="text-white/80 font-orbitron leading-relaxed mb-6">
                    Your assessment is complete, but your true journey begins with the full Hunter System. 
                    Unlock your rank, daily quests, guild access, and join thousands of hunters on their path to greatness.
                  </p>
                  <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-4">
                    <p className="text-electric-blue font-orbitron font-semibold text-glow">
                      "Every hunter must prove their commitment to the path of growth."
                    </p>
                  </div>
                </div>
              </GlowingCard>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPayment(true)}
                className="px-8 py-4 bg-gradient-to-r from-electric-blue to-electric-blue-dark 
                         text-white font-orbitron font-bold text-xl rounded-xl
                         shadow-glow-strong hover:shadow-electric-blue/25 
                         border border-electric-blue/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Upgrade Now
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          // Payment Screen
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-5xl font-orbitron font-bold text-white mb-8 text-glow-strong"
            >
              ⚔️ UNLOCK HUNTER SYSTEM
            </motion.h1>

            <GlowingCard className="max-w-2xl mx-auto">
              {isProcessing ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
                    <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2 text-glow">
                    Activating Hunter System...
                  </h3>
                  <p className="text-white/80 font-orbitron">
                    Please wait while we unlock your rank and prepare your dashboard.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-lg border border-electric-blue/40 mb-4">
                      <Crown className="w-5 h-5 text-electric-blue" />
                      <span className="text-electric-blue font-orbitron font-bold text-glow">HUNTER PREMIUM</span>
                    </div>
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                      Complete Your Hunter Registration
                    </h2>
                  </div>

                  <PayPalSubscription 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="text-white/60 font-orbitron text-sm hover:text-white transition-colors"
                    >
                      ← Back to rank reveal
                    </button>
                  </div>
                </>
              )}
            </GlowingCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LockedRankReveal;