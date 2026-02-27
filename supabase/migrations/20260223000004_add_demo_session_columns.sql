-- Create demo_sessions table if it doesn't exist (was defined in 0002 but may not have been applied)
create table if not exists demo_sessions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  teacher_id uuid references users(id),
  scheduled_at timestamptz,
  completed_at timestamptz,
  outcome text,
  ends_at timestamptz,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);
