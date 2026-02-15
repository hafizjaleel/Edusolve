-- =============================================
-- 0006: Student Teacher Assignments & Messages
-- =============================================

-- Student-teacher assignment (a student can have multiple teachers for different subjects)
create table if not exists student_teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  teacher_id uuid not null references users(id),
  subject text not null,
  schedule_note text,
  is_active boolean not null default true,
  assigned_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, teacher_id, subject)
);

-- Add subject column to academic_sessions
alter table academic_sessions add column if not exists subject text;

-- Student messages log (WhatsApp communication history)
create table if not exists student_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  sent_by uuid references users(id),
  direction text not null default 'outgoing' check (direction in ('outgoing', 'incoming')),
  channel text not null default 'whatsapp',
  message_type text not null default 'reminder' check (message_type in ('reminder', 'notification', 'follow_up', 'general')),
  content text not null,
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'sent', 'delivered', 'failed')),
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_sta_student on student_teacher_assignments(student_id);
create index if not exists idx_sta_teacher on student_teacher_assignments(teacher_id);
create index if not exists idx_sta_active on student_teacher_assignments(is_active);
create index if not exists idx_sm_student on student_messages(student_id);
create index if not exists idx_sm_created on student_messages(created_at);
