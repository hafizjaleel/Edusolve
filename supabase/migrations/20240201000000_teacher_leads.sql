-- Teacher Leads (recruitment pipeline for teacher coordinator)
create table if not exists teacher_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  subject text,
  experience_level text default 'fresher',
  qualification text,
  status text not null default 'new',
  -- statuses: new → contacted → first_interview → first_interview_done → second_interview → second_interview_done → approved → rejected
  notes text,
  coordinator_id uuid references auth.users(id),
  converted_teacher_id uuid references teacher_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audit log for teacher lead status changes
create table if not exists teacher_lead_history (
  id uuid primary key default gen_random_uuid(),
  teacher_lead_id uuid references teacher_leads(id) on delete cascade,
  old_status text,
  new_status text,
  changed_by uuid references auth.users(id),
  note text,
  created_at timestamptz default now()
);
