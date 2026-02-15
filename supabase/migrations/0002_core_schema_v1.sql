-- EHMS core schema v1
-- Timezone standard: Asia/Kolkata at application/reporting layer.
-- Store timestamps in UTC.

create extension if not exists pgcrypto;

-- ===== Enums =====
create type lead_status as enum ('new','demo_scheduled','demo_done','payment_pending','joined','dropped');
create type interview_status as enum ('applied','interviewed','selected','rejected');
create type session_status as enum ('completed','missed','rescheduled');
create type verification_status as enum ('pending','approved','rejected');
create type student_status as enum ('active','vacation','dropped','completed');
create type payroll_status as enum ('draft','approved','paid','reopened');
create type owner_stage as enum ('counselor','finance','academic');
create type ledger_type as enum ('income','expense','payout','adjustment','reversal');

-- ===== Users and Roles =====
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_roles (
  user_id uuid not null references users(id),
  role_id uuid not null references roles(id),
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- ===== Leads and Demo =====
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  counselor_id uuid references users(id),
  student_name text not null,
  parent_name text,
  country_code text,
  contact_number text,
  class_level text,
  subject text,
  package_name text,
  source text,
  status lead_status not null default 'new',
  owner_stage owner_stage not null default 'counselor',
  joined_student_id uuid,
  deleted_at timestamptz,
  deleted_by uuid references users(id),
  delete_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  from_status lead_status,
  to_status lead_status not null,
  changed_by uuid not null references users(id),
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists demo_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  broadcasted_by uuid not null references users(id),
  scheduled_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists demo_teacher_responses (
  id uuid primary key default gen_random_uuid(),
  demo_request_id uuid not null references demo_requests(id),
  teacher_id uuid not null references users(id),
  response text not null,
  responded_at timestamptz not null default now()
);

create table if not exists demo_sessions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  teacher_id uuid references users(id),
  scheduled_at timestamptz,
  completed_at timestamptz,
  outcome text,
  created_at timestamptz not null default now()
);

-- ===== Teacher Pipeline =====
create table if not exists teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id),
  teacher_code text unique,
  experience_level text,
  per_hour_rate numeric(12,2),
  is_in_pool boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teacher_interviews (
  id uuid primary key default gen_random_uuid(),
  teacher_profile_id uuid not null references teacher_profiles(id),
  status interview_status not null,
  interviewer_id uuid references users(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists teacher_availability (
  id uuid primary key default gen_random_uuid(),
  teacher_profile_id uuid not null references teacher_profiles(id),
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now()
);

-- ===== Students and Sessions =====
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references leads(id),
  academic_coordinator_id uuid references users(id),
  student_name text not null,
  parent_name text,
  contact_number text,
  class_level text,
  package_name text,
  total_hours numeric(10,2) not null default 0,
  remaining_hours numeric(10,2) not null default 0,
  status student_status not null default 'active',
  joined_at timestamptz,
  ended_at timestamptz,
  deleted_at timestamptz,
  deleted_by uuid references users(id),
  delete_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table leads
  add constraint leads_joined_student_fk
  foreign key (joined_student_id) references students(id);

create table if not exists student_topups (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  hours_added numeric(10,2) not null,
  amount numeric(12,2) not null,
  payment_verified boolean not null default false,
  requested_by uuid not null references users(id),
  verified_by uuid references users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists academic_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  teacher_id uuid not null references users(id),
  session_date date not null,
  started_at timestamptz,
  ended_at timestamptz,
  duration_hours numeric(8,2) not null,
  status session_status not null,
  homework text,
  marks text,
  created_at timestamptz not null default now()
);

create table if not exists session_verifications (
  id uuid primary key default gen_random_uuid(),
  session_id uuid unique not null references academic_sessions(id),
  verifier_id uuid not null references users(id),
  status verification_status not null default 'pending',
  reason text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists hour_ledger (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  teacher_id uuid references users(id),
  session_id uuid references academic_sessions(id),
  hours_delta numeric(10,2) not null,
  entry_type text not null,
  created_at timestamptz not null default now()
);

-- ===== Finance and Payroll =====
create table if not exists ledger_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  entry_type ledger_type not null,
  amount numeric(14,2) not null,
  currency text not null default 'INR',
  reference_type text,
  reference_id uuid,
  description text,
  posted_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  category text not null,
  amount numeric(14,2) not null,
  description text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  invoice_number text unique,
  amount numeric(14,2) not null,
  due_date date,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists payroll_monthly_cycles (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null check (month between 1 and 12),
  start_date date not null,
  end_date date not null,
  status payroll_status not null default 'draft',
  approved_by uuid references users(id),
  approved_at timestamptz,
  paid_at timestamptz,
  unique (year, month)
);

create table if not exists payroll_items (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references payroll_monthly_cycles(id),
  teacher_id uuid not null references users(id),
  verified_hours numeric(10,2) not null,
  rate_per_hour numeric(12,2) not null,
  amount numeric(14,2) not null,
  adjustment_amount numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  unique (cycle_id, teacher_id)
);

-- ===== Ownership + Audit + Integration =====
create table if not exists ownership_transfers (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  from_stage owner_stage,
  to_stage owner_stage not null,
  transferred_by uuid not null references users(id),
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  reason text,
  request_id text,
  created_at timestamptz not null default now()
);

create table if not exists integration_logs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  external_id text,
  payload jsonb,
  status text not null,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  scope text not null,
  response_hash text,
  created_at timestamptz not null default now()
);

-- ===== Helpful indexes =====
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_students_status on students(status);
create index if not exists idx_sessions_student on academic_sessions(student_id);
create index if not exists idx_sessions_teacher on academic_sessions(teacher_id);
create index if not exists idx_ledger_entry_date on ledger_entries(entry_date);
create index if not exists idx_audit_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_created_at on audit_logs(created_at);
