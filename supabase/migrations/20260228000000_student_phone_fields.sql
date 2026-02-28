-- Add phone-related fields to students table
alter table students add column if not exists alternative_number text;
alter table students add column if not exists parent_phone text;
alter table students add column if not exists messaging_number text default 'contact';
