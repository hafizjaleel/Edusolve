-- Subjects & Boards management tables
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- Seed subjects
insert into subjects (name) values
  ('English'), ('Malayalam'), ('Hindi'),
  ('Physics'), ('Chemistry'), ('Biology'), ('Social Science'), ('Maths'),
  ('EVS'), ('MS'), ('Arabic'), ('IT'),
  ('Accountancy'), ('Economics'), ('Business Studies'), ('Computer Application')
on conflict (name) do nothing;

-- Seed boards
insert into boards (name) values
  ('State'), ('CBSE'), ('ICSE'), ('IB'), ('IGCSE'), ('ISCE')
on conflict (name) do nothing;

-- Add boards column to teacher_leads
alter table teacher_leads
  add column if not exists boards jsonb default '[]'::jsonb;
