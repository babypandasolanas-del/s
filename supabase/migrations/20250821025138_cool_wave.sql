/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Links to auth.users
      - `email` (text, unique, not null)
      - `name` (text, nullable)
      - `rank` (text, not null, default 'E')
      - `total_xp` (integer, not null, default 0)
      - `streak_days` (integer, not null, default 0)
      - `guild_id` (uuid, nullable, foreign key)
      - `subscription_active` (boolean, not null, default false)
      - `last_active` (timestamptz, not null, default now())
      - `created_at` (timestamptz, not null, default now())
      - `updated_at` (timestamptz, not null, default now())

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read and update their own data
    - Add policy for authenticated users to read other users' public data (for leaderboards)

  3. Functions
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  rank text NOT NULL DEFAULT 'E' CHECK (rank IN ('E', 'D', 'C', 'B', 'A', 'S', 'SS')),
  total_xp integer NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  streak_days integer NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  guild_id uuid,
  subscription_active boolean NOT NULL DEFAULT false,
  last_active timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read and update own data"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read public data of other users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();