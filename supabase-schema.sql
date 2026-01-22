-- Supabase SQL Schema for Chat Messages
-- Run this in your Supabase SQL Editor to create the required table

-- Create the chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  pet_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_pet ON chat_messages(user_id, pet_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In production, you should use proper authentication and more restrictive policies
CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Add a policy for authenticated users only (uncomment if using Supabase Auth)
-- CREATE POLICY "Users can only access their own messages" ON chat_messages
--   FOR ALL
--   USING (auth.uid()::text = user_id)
--   WITH CHECK (auth.uid()::text = user_id);
