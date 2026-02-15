-- Top-up verification workflow for academic coordinator -> finance

alter table student_topups
  add column if not exists screenshot_url text,
  add column if not exists status text not null default 'pending_finance',
  add column if not exists finance_note text;

create index if not exists idx_student_topups_status on student_topups(status);
create index if not exists idx_student_topups_student_id on student_topups(student_id);
