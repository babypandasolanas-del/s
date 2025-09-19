import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  // Admin bypass - hardcoded for security
  const isAdminEmail = user?.email === 'selflevelings@gmail.com';

  useEffect(() => {
    if (user) {
      if (isAdminEmail) {
        // Grant immediate admin access
        setSubscriptionStatus('active');
        setLoading(false);
      } else {
        fetchSubscriptionStatus();
      }
    } else {
      setSubscriptionStatus('free');
      setLoading(false);
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    if (!user) return;

    // Admin bypass - skip database query
    if (isAdminEmail) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription status:', error);
        setSubscriptionStatus('free');
      } else {
        setSubscriptionStatus(data?.subscription_status || 'free');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscriptionStatus('free');
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscriptionStatus = () => {
    if (user) {
      fetchSubscriptionStatus();
    }
  };

  const isActive = subscriptionStatus === 'active' || isAdminEmail;
  const isFree = subscriptionStatus === 'free';
  const isCanceled = subscriptionStatus === 'canceled';
  const isExpired = subscriptionStatus === 'expired';

  return {
    subscriptionStatus,
    loading,
    isActive,
    isFree,
    isCanceled,
    isExpired,
    refreshSubscriptionStatus
  };
};