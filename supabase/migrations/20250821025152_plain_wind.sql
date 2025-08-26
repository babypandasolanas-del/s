/*
  # Create Guilds Table

  1. New Tables
    - `guilds`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `description` (text, not null)
      - `category` (text, not null) - Focus area of the guild
      - `member_count` (integer, not null, default 0)
      - `total_xp` (bigint, not null, default 0)
      - `created_at` (timestamptz, not null, default now())
      - `updated_at` (timestamptz, not null, default now())

  2. Security
    - Enable RLS on `guilds` table
    - Add policy for all authenticated users to read guild data
    - Add policy for guild admins to update guild data (future feature)

  3. Initial Data
    - Insert the 6 core guilds based on the 6 stat categories
*/

-- Create guilds table
CREATE TABLE IF NOT EXISTS guilds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('mind', 'body', 'discipline', 'lifestyle', 'willpower', 'focus')),
  member_count integer NOT NULL DEFAULT 0 CHECK (member_count >= 0),
  total_xp bigint NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All authenticated users can read guilds"
  ON guilds
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON guilds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial guild data
INSERT INTO guilds (name, description, category) VALUES
  ('Study Hunters', 'Masters of knowledge and academic excellence. Focus on deep work, learning, and intellectual growth.', 'mind'),
  ('Fitness Hunters', 'Warriors of physical strength and endurance. Dedicated to health, exercise, and bodily improvement.', 'body'),
  ('Discipline Hunters', 'Champions of routine and consistency. Masters of habits, schedules, and unwavering commitment.', 'discipline'),
  ('Lifestyle Hunters', 'Guardians of balance and wellness. Experts in nutrition, sleep, and healthy living practices.', 'lifestyle'),
  ('Willpower Hunters', 'Conquerors of temptation and weakness. Specialists in mental fortitude and self-control.', 'willpower'),
  ('Focus Hunters', 'Eliminators of distraction and chaos. Masters of attention, concentration, and digital discipline.', 'focus')
ON CONFLICT (name) DO NOTHING;