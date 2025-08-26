import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// User profile functions
export const createUserProfile = async (userData: {
  id: string;
  email: string;
  rank: string;
  total_xp: number;
  streak_days: number;
}) => {
  const { data, error } = await supabase
    .from('users')
    .upsert([userData])
    .select()
    .single();
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_stats(*),
      guilds(*)
    `)
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// User stats functions
export const createUserStats = async (userId: string, stats: any) => {
  const { data, error } = await supabase
    .from('user_stats')
    .insert([{ user_id: userId, ...stats }])
    .select()
    .single();
  return { data, error };
};

export const updateUserStats = async (userId: string, stats: any) => {
  const { data, error } = await supabase
    .from('user_stats')
    .update(stats)
    .eq('user_id', userId)
    .select()
    .single();
  return { data, error };
};

// Quest functions
export const createDailyQuests = async (userId: string, quests: any[]) => {
  const questsWithUserId = quests.map(quest => ({ ...quest, user_id: userId }));
  const { data, error } = await supabase
    .from('quests')
    .insert(questsWithUserId)
    .select();
  return { data, error };
};

export const getUserQuests = async (userId: string, date?: string) => {
  let query = supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId);
  
  if (date) {
    query = query.eq('quest_date', date);
  }
  
  const { data, error } = await query.order('created_at', { ascending: true });
  return { data, error };
};

export const completeQuest = async (questId: string) => {
  const { data, error } = await supabase
    .from('quests')
    .update({ 
      completed: true, 
      completed_at: new Date().toISOString() 
    })
    .eq('id', questId)
    .select()
    .single();
  return { data, error };
};

// Guild functions
export const getAllGuilds = async () => {
  const { data, error } = await supabase
    .from('guilds')
    .select('*')
    .order('total_xp', { ascending: false });
  return { data, error };
};

export const joinGuild = async (userId: string, guildId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ guild_id: guildId })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Boss mission functions
export const getBossMissions = async () => {
  const { data, error } = await supabase
    .from('boss_missions')
    .select('*')
    .eq('is_active', true)
    .order('required_rank', { ascending: true });
  return { data, error };
};

export const getUserBossMissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_boss_missions')
    .select(`
      *,
      boss_missions(*)
    `)
    .eq('user_id', userId);
  return { data, error };
};

// Subscription functions
export const createSubscription = async (subscriptionData: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([subscriptionData])
    .select()
    .single();
  return { data, error };
};

export const updateSubscription = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  return { data, error };
};