/*
  # Create Boss Missions Table

  1. New Tables
    - `boss_missions`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `required_rank` (text, not null) - Minimum rank to attempt
      - `required_streak` (integer, not null) - Minimum streak days required
      - `xp_reward` (integer, not null) - XP gained upon completion
      - `category` (text, not null) - Which stat category this mission focuses on
      - `is_active` (boolean, not null, default true)
      - `created_at` (timestamptz, not null, default now())

    - `user_boss_missions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null, foreign key to users.id)
      - `boss_mission_id` (uuid, not null, foreign key to boss_missions.id)
      - `unlocked` (boolean, not null, default false)
      - `completed` (boolean, not null, default false)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, not null, default now())

  2. Security
    - Enable RLS on both tables
    - Users can read all boss missions
    - Users can only manage their own boss mission progress

  3. Initial Data
    - Insert sample boss missions for different paths and ranks
*/

-- Create boss_missions table
CREATE TABLE IF NOT EXISTS boss_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  required_rank text NOT NULL CHECK (required_rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS')),
  required_streak integer NOT NULL CHECK (required_streak >= 0),
  xp_reward integer NOT NULL CHECK (xp_reward > 0),
  category text NOT NULL CHECK (category IN ('mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create user_boss_missions table
CREATE TABLE IF NOT EXISTS user_boss_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boss_mission_id uuid NOT NULL REFERENCES boss_missions(id) ON DELETE CASCADE,
  unlocked boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, boss_mission_id)
);

-- Enable Row Level Security
ALTER TABLE boss_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_boss_missions ENABLE ROW LEVEL SECURITY;

-- Create policies for boss_missions
CREATE POLICY "All authenticated users can read boss missions"
  ON boss_missions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create policies for user_boss_missions
CREATE POLICY "Users can manage own boss mission progress"
  ON user_boss_missions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample boss missions
INSERT INTO boss_missions (name, description, required_rank, required_streak, xp_reward, category) VALUES
  ('Exam Ogre', 'Complete 7 consecutive days of 4+ hour study sessions to defeat this academic beast.', 'D', 7, 100, 'mind'),
  ('Deadline Demon', 'Maintain 7 days of deep work without procrastination to banish this productivity monster.', 'C', 7, 150, 'mind'),
  ('Training Golem', 'Complete 14 consecutive days of exercise to shatter this fitness guardian.', 'D', 14, 120, 'body'),
  ('Iron Will Titan', 'Resist all major temptations for 21 days to overcome this willpower colossus.', 'B', 21, 200, 'willpower'),
  ('Digital Hydra', 'Stay off social media and entertainment for 30 days to slay this attention destroyer.', 'A', 30, 300, 'focus'),
  ('Chaos Dragon', 'Maintain perfect daily routine for 30 days to defeat the ultimate discipline challenge.', 'S', 30, 500, 'discipline'),
  ('Lifestyle Lich', 'Perfect sleep, nutrition, and health habits for 60 days to banish this wellness nemesis.', 'A', 60, 400, 'lifestyle')
ON CONFLICT DO NOTHING;