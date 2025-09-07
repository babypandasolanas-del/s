/*
  # Add subscription status to profiles table

  1. Schema Changes
    - Add `subscription_status` column to `profiles` table with default 'free'
    - Add check constraint for valid subscription statuses

  2. Security
    - No RLS changes needed as existing policies cover the new column
*/

-- Add subscription_status column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free';
  END IF;
END $$;

-- Add check constraint for valid subscription statuses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'profiles_subscription_status_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check 
    CHECK (subscription_status IN ('free', 'active', 'canceled', 'expired'));
  END IF;
END $$;

-- Create index for subscription status queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status 
ON profiles (subscription_status);