-- Create lead_types table
CREATE TABLE IF NOT EXISTS lead_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Populate lead_types with existing values from leads table
INSERT INTO lead_types (name)
SELECT DISTINCT lead_type 
FROM leads 
WHERE lead_type IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
