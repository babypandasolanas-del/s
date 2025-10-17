/*
  # Fix duplicate daily quests issue

  1. Schema Changes
    - Add unique constraint on (user_id, quest_date, category) to prevent duplicate missions
    - This ensures only one quest per category per day for each user

  2. Data Safety
    - Uses IF NOT EXISTS to safely handle existing constraints
    - If duplicates exist, removes older ones keeping most recent

  3. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

-- Step 1: Create the quests table if it doesn't exist
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus')),
  xp_reward integer NOT NULL CHECK (xp_reward > 0),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  quest_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Remove any existing duplicate quests (keep most recent per user/date/category)
DO $$
DECLARE
  table_exists boolean;
BEGIN
  -- Check if table has data
  SELECT EXISTS (SELECT 1 FROM quests LIMIT 1) INTO table_exists;
  
  IF table_exists THEN
    -- Delete older duplicate quests, keeping only the most recent one
    DELETE FROM quests
    WHERE id NOT IN (
      SELECT DISTINCT ON (user_id, quest_date, category) id
      FROM quests
      ORDER BY user_id, quest_date, category, created_at DESC
    );
  END IF;
END $$;

-- Step 3: Add unique constraint to prevent future duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_user_quest_per_category_per_day'
      AND conrelid = 'quests'::regclass
  ) THEN
    ALTER TABLE quests
    ADD CONSTRAINT unique_user_quest_per_category_per_day
    UNIQUE (user_id, quest_date, category);
  END IF;
END $$;

-- Step 4: Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_quests_user_date ON quests(user_id, quest_date);
CREATE INDEX IF NOT EXISTS idx_quests_category ON quests(category);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON quests(completed);

-- Step 5: Add comment for documentation
COMMENT ON CONSTRAINT unique_user_quest_per_category_per_day ON quests IS 
  'Ensures each user can only have one quest per category per day, preventing duplicate daily mission generation';