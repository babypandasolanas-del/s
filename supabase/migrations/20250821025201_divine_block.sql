/*
  # Create Quests Table

  1. New Tables
    - `quests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null, foreign key to users.id)
      - `title` (text, not null)
      - `description` (text, not null)
      - `category` (text, not null) - Which stat category this quest affects
      - `xp_reward` (integer, not null) - XP gained upon completion
      - `difficulty` (text, not null) - easy, medium, hard
      - `completed` (boolean, not null, default false)
      - `completed_at` (timestamptz, nullable)
      - `quest_date` (date, not null, default current_date) - Which day this quest is for
      - `created_at` (timestamptz, not null, default now())
      - `updated_at` (timestamptz, not null, default now())

  2. Security
    - Enable RLS on `quests` table
    - Add policy for users to manage their own quests only

  3. Constraints
    - Ensure quest_date is not in the future
    - Ensure xp_reward is positive
*/

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Enable Row Level Security
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own quests"
  ON quests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_quests_updated_at
  BEFORE UPDATE ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_quests_user_date ON quests(user_id, quest_date);
CREATE INDEX IF NOT EXISTS idx_quests_category ON quests(category);
CREATE INDEX IF NOT EXISTS idx_quests_completed ON quests(completed);