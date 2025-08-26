/*
  # Create User Stats Table

  1. New Tables
    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null, foreign key to users.id)
      - `mind` (integer, not null, default 0)
      - `body` (integer, not null, default 0)
      - `discipline` (integer, not null, default 0)
      - `lifestyle` (integer, not null, default 0)
      - `willpower` (integer, not null, default 0)
      - `focus` (integer, not null, default 0)
      - `created_at` (timestamptz, not null, default now())
      - `updated_at` (timestamptz, not null, default now())

  2. Security
    - Enable RLS on `user_stats` table
    - Add policy for users to manage their own stats
    - Add policy for reading other users' stats (for leaderboards)

  3. Constraints
    - Each user can only have one stats record
    - All stat values must be between 0 and 100
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mind integer NOT NULL DEFAULT 0 CHECK (mind >= 0 AND mind <= 100),
  body integer NOT NULL DEFAULT 0 CHECK (body >= 0 AND body <= 100),
  discipline integer NOT NULL DEFAULT 0 CHECK (discipline >= 0 AND discipline <= 100),
  lifestyle integer NOT NULL DEFAULT 0 CHECK (lifestyle >= 0 AND lifestyle <= 100),
  willpower integer NOT NULL DEFAULT 0 CHECK (willpower >= 0 AND willpower <= 100),
  focus integer NOT NULL DEFAULT 0 CHECK (focus >= 0 AND focus <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own stats"
  ON user_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read other users' stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();