/*
  # Complete Database Setup with Owner Account

  1. Create Core Tables
    - users table for user data
    - profiles table for auth integration
    - subscriptions table for premium features

  2. Owner Account Setup
    - Create owner account infrastructure
    - Add is_owner flag to profiles
    - Set up bypass functions for owner

  3. Security
    - Enable RLS on all tables
    - Create policies for proper access control
    - Grant owner full access to all features
*/

-- Step 1: Create helper function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 2: Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  rank text NOT NULL DEFAULT 'E' CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS')),
  total_xp integer NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  streak_days integer NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  guild_id uuid,
  subscription_active boolean NOT NULL DEFAULT false,
  last_active timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 3: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text,
  is_owner boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Step 4: Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  subscription_id text,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  plan_type text,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 5: Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for users table
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

-- Step 7: Create RLS policies for profiles table
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 8: Create RLS policies for subscriptions table
CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 9: Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Create owner helper functions
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  RETURN user_email = 'selflevelings@gmail.com';
END;
$$;

CREATE OR REPLACE FUNCTION public.has_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
  has_subscription boolean;
BEGIN
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Owner always has access
  IF user_email = 'selflevelings@gmail.com' THEN
    RETURN true;
  END IF;
  
  -- Check if user has active subscription
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
    AND status = 'active'
    AND (end_date IS NULL OR end_date > now())
  ) INTO has_subscription;
  
  RETURN has_subscription;
END;
$$;

-- Step 11: Create function to initialize owner account
CREATE OR REPLACE FUNCTION public.initialize_owner_if_needed()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  owner_id uuid;
BEGIN
  SELECT id INTO owner_id
  FROM auth.users
  WHERE email = 'selflevelings@gmail.com';
  
  IF owner_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, is_owner, created_at)
    VALUES (owner_id, 'selflevelings@gmail.com', true, now())
    ON CONFLICT (id) DO UPDATE
    SET is_owner = true;
    
    INSERT INTO public.users (id, email, name, rank, total_xp, streak_days, subscription_active, last_active, created_at, updated_at)
    VALUES (owner_id, 'selflevelings@gmail.com', 'Owner', 'SS', 999999, 999, true, now(), now(), now())
    ON CONFLICT (id) DO UPDATE
    SET subscription_active = true,
        rank = 'SS',
        total_xp = 999999,
        streak_days = 999;
  END IF;
END;
$$;

-- Step 12: Create trigger function for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_username text;
  is_owner_account boolean;
BEGIN
  user_username := NEW.raw_user_meta_data->>'username';
  
  IF user_username IS NOT NULL AND user_username !~ '^[A-Za-z]+$' THEN
    user_username := NULL;
  END IF;
  
  is_owner_account := NEW.email = 'selflevelings@gmail.com';

  INSERT INTO public.profiles (id, email, username, is_owner, created_at)
  VALUES (NEW.id, NEW.email, user_username, is_owner_account, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  IF is_owner_account THEN
    INSERT INTO public.users (id, email, name, rank, total_xp, streak_days, subscription_active, last_active, created_at, updated_at)
    VALUES (NEW.id, NEW.email, 'Owner', 'SS', 999999, 999, true, NOW(), NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 13: Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 14: Grant permissions
GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_access() TO authenticated;
GRANT EXECUTE ON FUNCTION public.initialize_owner_if_needed() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 15: Initialize owner if they already exist
SELECT public.initialize_owner_if_needed();

-- Step 16: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Step 17: Add comments
COMMENT ON TABLE users IS 'Core user data and game progress';
COMMENT ON TABLE profiles IS 'User profile information linked to auth.users';
COMMENT ON TABLE subscriptions IS 'User subscription and payment data';
COMMENT ON FUNCTION public.is_owner() IS 'Returns true if current user is the owner account';
COMMENT ON FUNCTION public.has_access() IS 'Returns true if user has active subscription or is owner';
COMMENT ON COLUMN profiles.is_owner IS 'Special flag for owner account with full access';