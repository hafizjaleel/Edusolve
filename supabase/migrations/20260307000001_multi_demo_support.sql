-- Add subject and demo_number columns to demo_sessions
ALTER TABLE demo_sessions ADD COLUMN IF NOT EXISTS subject text;
ALTER TABLE demo_sessions ADD COLUMN IF NOT EXISTS demo_number integer DEFAULT 1;

-- Backfill existing demo_sessions with subject from leads
UPDATE demo_sessions ds
SET subject = l.subject
FROM leads l
WHERE ds.lead_id = l.id
AND ds.subject IS NULL;

-- Backfill demo_number for any existing rows (set all to 1)
UPDATE demo_sessions
SET demo_number = 1
WHERE demo_number IS NULL;
