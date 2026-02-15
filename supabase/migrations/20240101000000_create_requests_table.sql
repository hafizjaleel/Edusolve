
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  counselor_id uuid references auth.users(id) not null,
  subject text not null,
  description text not null,
  status text default 'open' check (status in ('open', 'closed')),
  resolution_note text,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- Enable RLS (optional, for security)
alter table public.requests enable row level security;

-- Policies
create policy "Counselors can view own requests" 
on public.requests for select 
using (auth.uid() = counselor_id);

create policy "Counselors can create requests" 
on public.requests for insert 
with check (auth.uid() = counselor_id);
