/*
  # Add admin email bypass to RLS policies
  
  This migration adds admin bypass functionality for selflevelings@gmail.com
  to all relevant Row Level Security policies, granting full access without
  subscription requirements.
  
  ## Changes
  1. Update profiles table policies to allow admin access
  2. Update other relevant table policies for admin bypass
  3. Maintain existing subscription validation for all other users
*/

-- Update profiles table policies to include admin bypass
DROP POLICY IF EXISTS "Users can read and update own profile" ON public.profiles;
CREATE POLICY "Users can read and update own profile" 
  ON public.profiles 
  FOR ALL 
  TO authenticated 
  USING (
    auth.uid() = id 
    OR auth.email() = 'selflevelings@gmail.com'
  )
  WITH CHECK (
    auth.uid() = id 
    OR auth.email() = 'selflevelings@gmail.com'
  );

DROP POLICY IF EXISTS "Users can read other users' public profile data" ON public.profiles;
CREATE POLICY "Users can read other users' public profile data" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (
    true 
    OR auth.email() = 'selflevelings@gmail.com'
  );

-- Update users table policies (if they exist) to include admin bypass
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND schemaname = 'public'
  ) THEN
    DROP POLICY IF EXISTS "Users can read and update own data" ON public.users;
    CREATE POLICY "Users can read and update own data" 
      ON public.users 
      FOR ALL 
      TO authenticated 
      USING (
        auth.uid() = id 
        OR auth.email() = 'selflevelings@gmail.com'
      )
      WITH CHECK (
        auth.uid() = id 
        OR auth.email() = 'selflevelings@gmail.com'
      );

    DROP POLICY IF EXISTS "Users can read other users' stats" ON public.users;
    CREATE POLICY "Users can read other users' stats" 
      ON public.users 
      FOR SELECT 
      TO authenticated 
      USING (
        true 
        OR auth.email() = 'selflevelings@gmail.com'
      );
  END IF;
END $$;

-- Update quests table policies to include admin bypass
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quests' AND schemaname = 'public'
  ) THEN
    DROP POLICY IF EXISTS "Users can manage own quests" ON public.quests;
    CREATE POLICY "Users can manage own quests" 
      ON public.quests 
      FOR ALL 
      TO authenticated 
      USING (
        auth.uid() = user_id 
        OR auth.email() = 'selflevelings@gmail.com'
      )
      WITH CHECK (
        auth.uid() = user_id 
        OR auth.email() = 'selflevelings@gmail.com'
      );
  END IF;
END $$;

-- Update user_stats table policies to include admin bypass
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_stats' AND schemaname = 'public'
  ) THEN
    DROP POLICY IF EXISTS "Users can manage own stats" ON public.user_stats;
    CREATE POLICY "Users can manage own stats" 
      ON public.user_stats 
      FOR ALL 
      TO authenticated 
      USING (
        auth.uid() = user_id 
        OR auth.email() = 'selflevelings@gmail.com'
      )
      WITH CHECK (
        auth.uid() = user_id 
        OR auth.email() = 'selflevelings@gmail.com'
      );

    DROP POLICY IF EXISTS "Users can read other users' stats" ON public.user_stats;
    CREATE POLICY "Users can read other users' stats" 
      ON public.user_stats 
      FOR SELECT 
      TO authenticated 
      USING (
        true 
        OR auth.email() = 'selflevelings@gmail.com'
      );
  END IF;
END $$;