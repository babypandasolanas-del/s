import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, onAuthStateChange, isOwnerEmail } from '../lib/auth';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username, is_owner, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user);
      setIsOwner(isOwnerEmail(user?.email));
      if (user) {
        fetchUserProfile(user.id).then((profile) => {
          setProfile(profile);
          setIsOwner(profile?.is_owner || isOwnerEmail(user.email));
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      setUser(user);
      setIsOwner(isOwnerEmail(user?.email));
      if (user) {
        const userProfile = await fetchUserProfile(user.id);
        setProfile(userProfile);
        setIsOwner(userProfile?.is_owner || isOwnerEmail(user.email));
      } else {
        setProfile(null);
        setIsOwner(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isOwner,
    userName: profile?.username || profile?.email?.split('@')[0] || 'Hunter'
  };
};