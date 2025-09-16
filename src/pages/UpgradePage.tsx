import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Shield, Users, Target, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import GlowingCard from '../components/GlowingCard';

declare global {
  interface Window {
    paypal: any;
  }
}

const UpgradePage: React.FC = () => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load PayPal SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=ASIfYvxxalJueZfwJdpxjQS1HhOrqBpjrvTz2mfbrCo7DHje-r_l17NnJ-XhWmdarUwqsWQL0nIksvSu&vault=true&intent=subscription';
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.async = true;
    
    script.onload = () => {
      setIsLoading(false);
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: 'P-3ST53432TK471363YNDEZCIA'
            });
          },
          onApprove: async function(data: any, actions: any) {
            setIsProcessing(true);
            
            try {
              // Update user subscription status in Supabase
              if (user) {
                const { error } = await supabase
                  .from('profiles')
                  .upsert({
                    id: user.id,
                    email: user.email!,
                    subscription_status: 'active',
                    last_login: new Date().toISOString()
                  });

                if (error) {
                  console.error('Error updating subscription:', error);
                  alert('❌ Error activating subscription. Please contact support.');
                  return;
                }
              }

              alert("Thanks for subscribing! Your Subscription ID: " + data.subscriptionID);
              
              // Redirect to dashboard after successful payment
              setTimeout(() => {
                navigate('/dashboard');
              }, 2000);
              
            } catch (error) {
              console.error('Subscription processing error:', error);
              alert('❌ Error processing subscription. Please contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            alert('❌ Payment failed. Please try again.');
            setIsProcessing(false);
          },
          onCancel: function(data: any) {
            console.log('Payment cancelled:', data);
            setIsProcessing(false);
          }
        }).render('#paypal-button-container-P-3ST53432TK471363YNDEZCIA');
      }
    };

    script.onerror = () => {
      setIsLoading(false);
      console.error('Failed to load PayPal SDK');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [user, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0F1C' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-orbitron font-bold text-white mb-2 text-glow">
            Activating Hunter System...
          </h2>
          <p className="text-white/80 font-orbitron">
            Please wait while we unlock your rank and prepare your dashboard.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#0A0F1C' }}>
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, type: "spring" }}
            className="mb-6"
          >
            <div className="inline-block p-8 bg-gradient-to-r from-electric-blue/20 to-electric-blue-dark/20 rounded-full border-4 border-electric-blue shadow-glow-strong">
              <Crown className="w-16 h-16 text-electric-blue" />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 text-glow-strong">
            Upgrade to Unlock Your Hunter Rank ⚔️
          </h1>
          
          <p className="text-xl text-white/90 font-orbitron mb-8 text-glow">
            Join thousands of hunters on their journey to greatness
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <GlowingCard className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-orbitron font-bold text-white mb-4 text-glow">
                Hunter Premium Features
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-electric-blue" />
                  <span className="text-white font-orbitron">Unlock Your Hunter Rank</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-electric-blue" />
                  <span className="text-white font-orbitron">Daily Quest System</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-electric-blue" />
                  <span className="text-white font-orbitron">Progress Tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-electric-blue" />
                  <span className="text-white font-orbitron">Guild Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-electric-blue" />
                  <span className="text-white font-orbitron">Boss Missions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-electric-blue" />
                  <span className="text-white font-orbitron">Discord Community</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-orbitron font-bold text-white mb-2 text-glow">
                $9.99<span className="text-lg text-electric-blue">/month</span>
              </div>
              <p className="text-white/80 font-orbitron text-sm">
                Cancel anytime • Secure PayPal payment
              </p>
            </div>

            <div className="flex justify-center">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin mr-3"></div>
                  <span className="text-white font-orbitron">Loading payment options...</span>
                </div>
              ) : (
                <div 
                  id="paypal-button-container-P-3ST53432TK471363YNDEZCIA" 
                  ref={paypalRef}
                  className="w-full max-w-sm"
                />
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/60 font-orbitron text-xs">
                🔒 Secured by PayPal • 30-day money-back guarantee
              </p>
            </div>
          </GlowingCard>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="text-white/60 font-orbitron text-sm hover:text-white transition-colors"
            >
              ← Back to Assessment
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpgradePage;