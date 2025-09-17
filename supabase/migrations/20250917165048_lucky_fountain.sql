/*
  # Add username support to profiles table

  1. Schema Changes
    - Add `username` column to profiles table (text, nullable)
    - Username allows only letters (a-z, A-Z), no numbers or special characters
    - Multiple users can have same username, but email remains unique

  2. Function Updates
    - Update handle_new_user() to extract username from raw_user_meta_data
    - Insert username into profiles table if provided
    - Leave username NULL if not provided (no default to "Hunter")

  3. Security
    - Maintain existing RLS policies
    - Ensure proper error handling
*/

-- Step 1: Add username column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username text;
  END IF;
END $$;

-- Step 2: Drop existing trigger and function safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Create updated handle_new_user function with username support
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_username text;
BEGIN
  -- Extract username from raw_user_meta_data if provided
  user_username := NEW.raw_user_meta_data->>'username';
  
  -- Validate username contains only letters if provided
  IF user_username IS NOT NULL AND user_username !~ '^[A-Za-z]+$' THEN
    user_username := NULL;
  END IF;

  -- Insert new user profile with extracted data
  INSERT INTO public.profiles (
    id,
    email,
    username,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_username,
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 4: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 5: Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile record when new user signs up, extracting username from metadata';