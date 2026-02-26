-- Add fields to store demo schedule details explicitly on the lead
ALTER TABLE leads ADD COLUMN IF NOT EXISTS demo_scheduled_at TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS demo_ends_at TIMESTAMPTZ;

-- Optional: Index for querying upcoming demos
CREATE INDEX IF NOT EXISTS idx_leads_demo_scheduled_at ON leads(demo_scheduled_at);
