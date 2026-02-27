-- Add interview schedule fields to teacher_leads
alter table teacher_leads
  add column if not exists interview_date text, -- Storing as ISO string or YYYY-MM-DD
  add column if not exists interview_time text; -- Storing as HH:mm (24h) or similar
