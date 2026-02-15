-- Add filter fields to teacher_profiles for AC teacher pool filtering
alter table teacher_profiles add column if not exists languages text[];       -- e.g. {'English','Hindi','Tamil'}
alter table teacher_profiles add column if not exists subjects_taught text[]; -- e.g. {'Mathematics','Physics'}
alter table teacher_profiles add column if not exists syllabus text[];        -- e.g. {'CBSE','ICSE','State Board'}
alter table teacher_profiles add column if not exists preferred_time text;    -- e.g. 'morning','afternoon','evening','flexible'
alter table teacher_profiles add column if not exists qualification text;     -- e.g. 'B.Ed', 'M.Sc'
