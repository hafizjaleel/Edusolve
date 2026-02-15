-- EHMS roles seed + baseline RLS for leads module

insert into roles (code, name)
values
  ('super_admin', 'Super Admin'),
  ('counselor_head', 'Counselor Head'),
  ('counselor', 'Counselor'),
  ('teacher_coordinator', 'Teacher Coordinator'),
  ('academic_coordinator', 'Academic Coordinator'),
  ('teacher', 'Teacher'),
  ('finance', 'Finance')
on conflict (code) do nothing;

-- Enable RLS
alter table leads enable row level security;
alter table lead_status_history enable row level security;
alter table demo_requests enable row level security;
alter table audit_logs enable row level security;

-- Leads policies
-- Broad authenticated read with ownership write lock.
drop policy if exists leads_select_authenticated on leads;
create policy leads_select_authenticated
on leads
for select
to authenticated
using (deleted_at is null);

drop policy if exists leads_insert_authenticated on leads;
create policy leads_insert_authenticated
on leads
for insert
to authenticated
with check (auth.uid() is not null);

drop policy if exists leads_update_owner_only on leads;
create policy leads_update_owner_only
on leads
for update
to authenticated
using (counselor_id = auth.uid() and deleted_at is null)
with check (counselor_id = auth.uid());

-- History + demo requests
drop policy if exists lead_history_select_authenticated on lead_status_history;
create policy lead_history_select_authenticated
on lead_status_history
for select
to authenticated
using (true);

drop policy if exists demo_requests_select_authenticated on demo_requests;
create policy demo_requests_select_authenticated
on demo_requests
for select
to authenticated
using (true);

drop policy if exists demo_requests_insert_authenticated on demo_requests;
create policy demo_requests_insert_authenticated
on demo_requests
for insert
to authenticated
with check (auth.uid() is not null);

-- Audit logs are read-only to authenticated users.
drop policy if exists audit_logs_select_authenticated on audit_logs;
create policy audit_logs_select_authenticated
on audit_logs
for select
to authenticated
using (true);
