-- Add missing fields from leads table to students table
alter table students add column if not exists country_code text;
alter table students add column if not exists subject text;
alter table students add column if not exists counselor_id uuid references users(id);
alter table students add column if not exists source text;
