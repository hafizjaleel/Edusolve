-- Add meeting_link column to teacher_profiles
ALTER TABLE teacher_profiles
  ADD COLUMN IF NOT EXISTS meeting_link TEXT;
