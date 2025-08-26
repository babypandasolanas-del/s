/*
  # Complete Hunter System Database Schema

  1. New Tables
    - `users` - Main user profiles with rank, XP, and streak data
    - `user_stats` - Individual stat tracking (mind, body, discipline, etc.)
    - `profiles` - Basic auth profile data
    - `guilds` - Guild system for community features
    - `quests` - Daily quest system
    - `boss_missions` - Special challenge missions
    - `user_boss_missions` - User progress on boss missions
    - `subscriptions` - Premium subscription tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public data where appropriate

  3. Functions and Triggers
    - Auto-update timestamps
    - User rank calculation based on XP
    - Guild statistics updates
    - Subscription status synchronization
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read and update own profile"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read other users' public profile data"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create guilds table
CREATE TABLE IF NOT EXISTS guilds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus')),
  member_count integer DEFAULT 0 CHECK (member_count >= 0),
  total_xp bigint DEFAULT 0 CHECK (total_xp >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read guilds"
  ON guilds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON guilds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create users table (main user profiles)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  rank text DEFAULT 'E' CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS')),
  total_xp integer DEFAULT 0 CHECK (total_xp >= 0),
  streak_days integer DEFAULT 0 CHECK (streak_days >= 0),
  guild_id uuid REFERENCES guilds(id) ON DELETE SET NULL,
  subscription_active boolean DEFAULT false,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read and update own data"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read public data of other users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_total_xp ON users (total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_users_rank ON users (rank);
CREATE INDEX IF NOT EXISTS idx_users_guild_id ON users (guild_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_active ON users (subscription_active);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users (last_active);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  mind integer DEFAULT 0 CHECK (mind >= 0 AND mind <= 100),
  body integer DEFAULT 0 CHECK (body >= 0 AND body <= 100),
  discipline integer DEFAULT 0 CHECK (discipline >= 0 AND discipline <= 100),
  lifestyle integer DEFAULT 0 CHECK (lifestyle >= 0 AND lifestyle <= 100),
  willpower integer DEFAULT 0 CHECK (willpower >= 0 AND willpower <= 100),
  focus integer DEFAULT 0 CHECK (focus >= 0 AND focus <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own stats"
  ON user_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read other users' stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus')),
  xp_reward integer NOT NULL CHECK (xp_reward > 0),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  quest_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own quests"
  ON quests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for quests table
CREATE INDEX IF NOT EXISTS idx_quests_user_date ON quests (user_id, quest_date);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON quests (completed);
CREATE INDEX IF NOT EXISTS idx_quests_category ON quests (category);

CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create boss_missions table
CREATE TABLE IF NOT EXISTS boss_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  required_rank text NOT NULL CHECK (required_rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS')),
  required_streak integer NOT NULL CHECK (required_streak >= 0),
  xp_reward integer NOT NULL CHECK (xp_reward > 0),
  category text NOT NULL CHECK (category IN ('mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE boss_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read boss missions"
  ON boss_missions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create user_boss_missions table
CREATE TABLE IF NOT EXISTS user_boss_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  boss_mission_id uuid REFERENCES boss_missions(id) ON DELETE CASCADE NOT NULL,
  unlocked boolean DEFAULT false,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, boss_mission_id)
);

ALTER TABLE user_boss_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own boss mission progress"
  ON user_boss_missions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id text UNIQUE NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscription"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update user rank based on XP
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_xp >= 10000 THEN
    NEW.rank = 'SS';
  ELSIF NEW.total_xp >= 5000 THEN
    NEW.rank = 'S';
  ELSIF NEW.total_xp >= 2500 THEN
    NEW.rank = 'A';
  ELSIF NEW.total_xp >= 1000 THEN
    NEW.rank = 'B';
  ELSIF NEW.total_xp >= 500 THEN
    NEW.rank = 'C';
  ELSIF NEW.total_xp >= 100 THEN
    NEW.rank = 'D';
  ELSE
    NEW.rank = 'E';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_rank_trigger
  BEFORE UPDATE OF total_xp ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rank();

-- Create function to update guild stats
CREATE OR REPLACE FUNCTION update_guild_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update member count and total XP for affected guilds
  IF TG_OP = 'INSERT' THEN
    IF NEW.guild_id IS NOT NULL THEN
      UPDATE guilds 
      SET member_count = member_count + 1,
          total_xp = total_xp + NEW.total_xp
      WHERE id = NEW.guild_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle guild changes
    IF OLD.guild_id IS DISTINCT FROM NEW.guild_id THEN
      -- Remove from old guild
      IF OLD.guild_id IS NOT NULL THEN
        UPDATE guilds 
        SET member_count = member_count - 1,
            total_xp = total_xp - OLD.total_xp
        WHERE id = OLD.guild_id;
      END IF;
      -- Add to new guild
      IF NEW.guild_id IS NOT NULL THEN
        UPDATE guilds 
        SET member_count = member_count + 1,
            total_xp = total_xp + NEW.total_xp
        WHERE id = NEW.guild_id;
      END IF;
    ELSIF NEW.guild_id IS NOT NULL AND OLD.total_xp != NEW.total_xp THEN
      -- Update XP in same guild
      UPDATE guilds 
      SET total_xp = total_xp - OLD.total_xp + NEW.total_xp
      WHERE id = NEW.guild_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.guild_id IS NOT NULL THEN
      UPDATE guilds 
      SET member_count = member_count - 1,
          total_xp = total_xp - OLD.total_xp
      WHERE id = OLD.guild_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guild_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_stats();

-- Create function to update user subscription status
CREATE OR REPLACE FUNCTION update_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET subscription_active = (NEW.status = 'active')
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_subscription_status_trigger
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_subscription_status();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert some sample guilds
INSERT INTO guilds (name, description, category) VALUES
  ('Mind Masters', 'Dedicated to mental growth and cognitive enhancement', 'mind'),
  ('Iron Bodies', 'Physical fitness and strength training community', 'body'),
  ('Discipline Warriors', 'Building unbreakable self-discipline', 'discipline'),
  ('Lifestyle Legends', 'Creating balanced and fulfilling lifestyles', 'lifestyle'),
  ('Willpower Titans', 'Strengthening mental fortitude and determination', 'willpower'),
  ('Focus Guardians', 'Mastering concentration and attention', 'focus')
ON CONFLICT (name) DO NOTHING;

-- Insert some sample boss missions
INSERT INTO boss_missions (name, description, required_rank, required_streak, xp_reward, category) VALUES
  ('The Mental Marathon', 'Complete 30 days of continuous learning and mental challenges', 'C', 7, 500, 'mind'),
  ('Iron Will Challenge', 'Maintain perfect discipline for 14 consecutive days', 'B', 14, 750, 'discipline'),
  ('Physical Mastery', 'Complete an intensive 21-day fitness transformation', 'B', 10, 600, 'body'),
  ('Lifestyle Revolution', 'Transform your daily routines for 30 days straight', 'A', 21, 1000, 'lifestyle'),
  ('Focus Fortress', 'Achieve deep focus states for 100 hours total', 'A', 15, 800, 'focus'),
  ('Ultimate Willpower', 'The supreme test of mental strength and determination', 'S', 30, 1500, 'willpower')
ON CONFLICT DO NOTHING;