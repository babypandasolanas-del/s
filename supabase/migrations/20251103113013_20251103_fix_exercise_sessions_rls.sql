/*
  # Fix Exercise Sessions RLS Policies
  
  1. Enable RLS on exercise_sessions table
  2. Add policies for users to manage their own training sessions
*/

ALTER TABLE exercise_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exercise sessions"
  ON exercise_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise sessions"
  ON exercise_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise sessions"
  ON exercise_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);