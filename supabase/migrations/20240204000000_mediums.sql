-- Mediums management table
create table if not exists mediums (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- Seed mediums
insert into mediums (name) values
  ('English'), ('Malayalam')
on conflict (name) do nothing;

-- Add mediums column to teacher_leads
alter table teacher_leads
  add column if not exists mediums jsonb default '[]'::jsonb;
