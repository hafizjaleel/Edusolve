-- Add second interview schedule fields to teacher_leads
alter table teacher_leads
  add column if not exists second_interview_date text,
  add column if not exists second_interview_time text;
