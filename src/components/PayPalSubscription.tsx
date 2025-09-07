import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface PayPalSubscriptionProps {
  onSuccess: () => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ onSuccess, onError }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe',
            height: 50
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              'plan_id': import.meta.env.VITE_PAYPAL_PLAN_ID, // Your PayPal plan ID
              'custom_id': user?.id, // Pass user ID for webhook processing
              'application_context': {
                'brand_name': 'SelfLeveling Hunter System',
                'locale': 'en-US',
                'shipping_preference': 'NO_SHIPPING',
                'user_action': 'SUBSCRIBE_NOW',
                'payment_method': {
                  'payer_selected': 'PAYPAL',
                  'payee_preferred': 'IMMEDIATE_PAYMENT_REQUIRED'
                },
                'return_url': `${window.location.origin}/dashboard`,
                'cancel_url': `${window.location.origin}/upgrade`
              }
            });
          },
          onApprove: function(data: any, actions: any) {
            console.log('PayPal subscription approved:', data);
            
            // Call your backend to handle the subscription
            fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-webhook`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
              },
              body: JSON.stringify({
                event_type: 'BILLING.SUBSCRIPTION.ACTIVATED',
                resource: {
                  id: data.subscriptionID,
                  custom_id: user?.id
                }
              })
            }).then(() => {
              onSuccess();
            }).catch(onError);
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            onError(err);
          },
          onCancel: function(data: any) {
            console.log('PayPal subscription cancelled:', data);
          }
        }).render(paypalRef.current);
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [user?.id, onSuccess, onError]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="bg-gradient-to-r from-electric-blue/10 to-electric-blue-dark/10 border border-electric-blue/30 rounded-lg p-6">
          <h3 className="text-electric-blue font-orbitron font-bold text-lg mb-4 text-glow flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Hunter Premium Features
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-white font-orbitron">Unlock Your Hunter Rank</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-white font-orbitron">Daily Quest System</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-white font-orbitron">Progress Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-white font-orbitron">Guild Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-white font-orbitron">Boss Missions</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-white font-orbitron">Discord Community</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-orbitron font-bold text-white mb-2 text-glow">
          $9.99<span className="text-lg text-electric-blue">/month</span>
        </div>
        <p className="text-white/80 font-orbitron text-sm">
          Cancel anytime • Secure PayPal payment
        </p>
      </div>

      <div ref={paypalRef} className="w-full" />

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white/60 font-orbitron text-xs">
          <CreditCard className="w-4 h-4" />
          <span>Secured by PayPal • 30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default PayPalSubscription;