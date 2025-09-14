/*
  # Fix handle_new_user trigger function

  This migration fixes the "Database error saving new user" issue by:
  1. Safely dropping existing trigger and function
  2. Creating a robust handle_new_user function with proper defaults
  3. Recreating the trigger with correct configuration

  The function handles all NOT NULL constraints by providing safe defaults
  and uses proper error handling for production reliability.
*/

-- Step 1: Safely drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create robust handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert new user profile with safe defaults for all potential NOT NULL columns
  INSERT INTO public.profiles (
    id,
    email,
    created_at,
    last_login,
    subscription_status
  ) VALUES (
    NEW.id,                           -- Required: user ID from auth.users
    NEW.email,                        -- Required: email from auth.users
    COALESCE(NEW.created_at, now()),  -- Safe default: current timestamp
    NULL,                             -- Optional: last_login can be null
    'free'                            -- Safe default: free subscription status
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    created_at = COALESCE(profiles.created_at, EXCLUDED.created_at);

  -- Return NEW record as required for AFTER INSERT triggers
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details for debugging
    RAISE LOG 'Error in handle_new_user function: %', SQLERRM;
    -- Re-raise the exception to prevent silent failures
    RAISE;
END;
$$;

-- Step 3: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Step 4: Create trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Verify trigger was created successfully
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created' 
    AND event_object_table = 'users'
    AND event_object_schema = 'auth'
  ) THEN
    RAISE NOTICE 'Trigger on_auth_user_created created successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create trigger on_auth_user_created';
  END IF;
END $$;