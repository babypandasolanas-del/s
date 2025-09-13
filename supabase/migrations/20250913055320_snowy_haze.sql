/*
  # Fix Auth Trigger with Qualified Function Reference

  ## Problem
  The `on_auth_user_created` trigger on `auth.users` table is calling `handle_new_user()` 
  without schema qualification, causing user signup failures with "Database error saving new user".

  ## Solution
  1. Safely drop the existing broken trigger
  2. Recreate the trigger with fully qualified function reference `public.handle_new_user()`
  3. Ensure idempotency with proper conditional logic

  ## Changes
  - Drop existing `on_auth_user_created` trigger if it exists
  - Recreate trigger with qualified function name `public.handle_new_user()`
*/

-- Step 1: Safely drop the existing trigger if it exists
-- This prevents errors if the trigger doesn't exist or has already been fixed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Recreate the trigger with the fully qualified function reference
-- Using the qualified function name ensures PostgreSQL can locate the function
-- in the correct schema (public) rather than searching the current schema path
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verification comment: The trigger now correctly references public.handle_new_user()
-- This ensures user signup will work properly by creating the associated user profile