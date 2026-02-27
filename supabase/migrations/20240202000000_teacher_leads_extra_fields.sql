-- Extra fields for teacher leads: subjects, experience details, location, account details, communication level
alter table teacher_leads
  add column if not exists subjects jsonb default '[]'::jsonb,
  add column if not exists experience_type text,
  add column if not exists experience_duration text,
  add column if not exists place text,
  add column if not exists city text,
  add column if not exists account_holder_name text,
  add column if not exists account_number text,
  add column if not exists ifsc_code text,
  add column if not exists gpay_holder_name text,
  add column if not exists gpay_number text,
  add column if not exists upi_id text,
  add column if not exists communication_level text;
