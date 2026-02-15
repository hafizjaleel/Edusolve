-- Create finance_categories table
create table if not exists finance_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text check (type in ('income', 'expense')) not null,
  created_at timestamptz default now()
);

-- Add unique constraint on name + type
alter table finance_categories add constraint finance_categories_name_type_key unique (name, type);

-- Seed default expense categories
insert into finance_categories (name, type) values
  ('salary', 'expense'),
  ('rent', 'expense'),
  ('marketing', 'expense'),
  ('software', 'expense'),
  ('travel', 'expense'),
  ('office supplies', 'expense'),
  ('utilities', 'expense'),
  ('maintenance', 'expense'),
  ('other', 'expense')
on conflict (name, type) do nothing;
