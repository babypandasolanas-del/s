/*
  # Add Profile Progress Columns

  1. New Columns
    - `total_xp` (integer, default 0) - User's total experience points
    - `current_rank` (text, default 'E') - User's current rank
    - `rank_assigned_at` (timestamp) - When the current rank was assigned
    - `streak_days` (integer, default 0) - Current streak of consecutive days
    - `quests_done` (integer, default 0) - Total quests completed

  2. Updates
    - Add columns to profiles table if they don't exist
    - Set appropriate defaults and constraints
*/

-- Add total_xp column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_xp'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_xp integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add current_rank column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_rank'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_rank text DEFAULT 'E' NOT NULL;
  END IF;
END $$;

-- Add rank_assigned_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'rank_assigned_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN rank_assigned_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add streak_days column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'streak_days'
  ) THEN
    ALTER TABLE profiles ADD COLUMN streak_days integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add quests_done column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'quests_done'
  ) THEN
    ALTER TABLE profiles ADD COLUMN quests_done integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add constraints
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_total_xp_check CHECK (total_xp >= 0);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_streak_days_check CHECK (streak_days >= 0);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_quests_done_check CHECK (quests_done >= 0);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS profiles_current_rank_check CHECK (current_rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles (total_xp);
CREATE INDEX IF NOT EXISTS idx_profiles_current_rank ON profiles (current_rank);
CREATE INDEX IF NOT EXISTS idx_profiles_streak_days ON profiles (streak_days);