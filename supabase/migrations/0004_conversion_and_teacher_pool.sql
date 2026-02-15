-- Conversion workflow support: payment requests and human-readable ids

alter table students
  add column if not exists student_code text unique;

create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  requested_by uuid not null references users(id),
  amount numeric(12,2) not null,
  screenshot_url text,
  status text not null default 'pending',
  finance_note text,
  verified_by uuid references users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payment_requests_status on payment_requests(status);
create index if not exists idx_payment_requests_lead on payment_requests(lead_id);
