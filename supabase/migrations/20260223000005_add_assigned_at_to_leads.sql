-- Add assigned_at column to track when a lead was assigned to a counselor
alter table leads add column if not exists assigned_at timestamptz;

-- Backfill: set assigned_at from lead_status_history assignment entries, or fallback to created_at
update leads
set assigned_at = coalesce(
  (select max(lsh.created_at) from lead_status_history lsh where lsh.lead_id = leads.id and lsh.reason ilike '%assigned to counselor%'),
  leads.created_at
)
where leads.counselor_id is not null and leads.assigned_at is null;
