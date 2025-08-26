/*
  # Add Foreign Key Constraints and Indexes

  1. Foreign Key Constraints
    - Add guild_id foreign key constraint to users table
    - Ensure referential integrity across all tables

  2. Indexes
    - Add performance indexes for common queries
    - Optimize for leaderboards, quest lookups, and user data

  3. Functions
    - Add helper functions for rank calculations and XP management
*/

-- Add foreign key constraint for guild_id in users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_guild_id_fkey'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_guild_id_fkey 
    FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_users_rank ON users(rank);
CREATE INDEX IF NOT EXISTS idx_users_total_xp ON users(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_users_guild_id ON users(guild_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_active ON users(subscription_active);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);

-- Function to calculate rank from XP
CREATE OR REPLACE FUNCTION calculate_rank_from_xp(xp integer)
RETURNS text AS $$
BEGIN
  IF xp >= 10000 THEN RETURN 'SS';
  ELSIF xp >= 5000 THEN RETURN 'S';
  ELSIF xp >= 2500 THEN RETURN 'A';
  ELSIF xp >= 1200 THEN RETURN 'B';
  ELSIF xp >= 500 THEN RETURN 'C';
  ELSIF xp >= 150 THEN RETURN 'D';
  ELSE RETURN 'E';
  END IF;
END;
$$ language 'plpgsql';

-- Function to update user rank when XP changes
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
BEGIN
  NEW.rank = calculate_rank_from_xp(NEW.total_xp);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update rank when XP changes
CREATE TRIGGER update_user_rank_trigger
  BEFORE UPDATE OF total_xp ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rank();

-- Function to update guild member count and total XP
CREATE OR REPLACE FUNCTION update_guild_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update member count and total XP for affected guilds
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.guild_id IS NOT NULL THEN
      UPDATE guilds SET 
        member_count = (SELECT COUNT(*) FROM users WHERE guild_id = NEW.guild_id),
        total_xp = (SELECT COALESCE(SUM(total_xp), 0) FROM users WHERE guild_id = NEW.guild_id)
      WHERE id = NEW.guild_id;
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.guild_id IS DISTINCT FROM NEW.guild_id) THEN
    IF OLD.guild_id IS NOT NULL THEN
      UPDATE guilds SET 
        member_count = (SELECT COUNT(*) FROM users WHERE guild_id = OLD.guild_id),
        total_xp = (SELECT COALESCE(SUM(total_xp), 0) FROM users WHERE guild_id = OLD.guild_id)
      WHERE id = OLD.guild_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger to update guild stats when users join/leave or gain XP
CREATE TRIGGER update_guild_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_guild_stats();