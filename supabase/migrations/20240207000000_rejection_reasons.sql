-- Add rejection_reason column to teacher_leads
ALTER TABLE teacher_leads ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create rejection_reasons table
CREATE TABLE IF NOT EXISTS rejection_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reason TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial rejection reasons
INSERT INTO rejection_reasons (reason) VALUES
  ('Expected higher salary'),
  ('Not qualified / Lacks experience'),
  ('Failed first interview'),
  ('Failed second interview'),
  ('Location mismatch'),
  ('Language proficiency issue'),
  ('No response after contact'),
  ('Joined another organization')
ON CONFLICT (reason) DO NOTHING;
