import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_login?: string;
}

// Sign up new user with name and OTP verification
export const signUp = async (username: string, email: string, password: string) => {
  try {
    // Simple signup - let Supabase handle user creation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        },
        emailRedirectTo: `${window.location.origin}`
      }
    });

    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('Signup error details:', error);
    return { user: null, error: error.message };
  }
};

// Verify OTP code
export const verifyOTP = async (email: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });

    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Resend OTP verification email
export const resendOTP = async (email: string) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Sign in existing user
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Update last login timestamp
    if (data.user) {
      await supabase.rpc('update_last_login', { user_id: data.user.id });
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get user profile with name
export const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<AuthUser>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
};

export const getPasswordValidation = (password: string) => {
  return {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&#]/.test(password),
    hasMinLength: password.length >= 8,
    isValid: validatePassword(password)
  };
};

// Username validation - only letters allowed
export const validateUsername = (username: string): boolean => {
  const regex = /^[A-Za-z]+$/;
  return regex.test(username) && username.length >= 2;
};

// Auth state change listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

// Check if email is owner
export const isOwnerEmail = (email: string | undefined): boolean => {
  return email === 'selflevelings@gmail.com';
};

// Auto-create owner account if login fails
export const ensureOwnerAccount = async (email: string, password: string) => {
  if (!isOwnerEmail(email)) {
    return { success: false, error: 'Not owner email' };
  }

  try {
    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!signInError && signInData.user) {
      return { success: true, user: signInData.user, error: null };
    }

    // If sign in fails with invalid credentials, try to create account
    if (signInError?.message?.toLowerCase().includes('invalid')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: 'Owner'
          },
          emailRedirectTo: `${window.location.origin}`
        }
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }

      // After successful signup, try signing in again
      const { data: finalSignIn, error: finalError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (finalError) {
        return { success: false, error: finalError.message };
      }

      return { success: true, user: finalSignIn.user, error: null };
    }

    return { success: false, error: signInError?.message || 'Login failed' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};