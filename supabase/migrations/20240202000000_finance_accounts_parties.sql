-- Finance: Accounts & Parties
create table if not exists finance_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'bank', -- bank, cash, upi, wallet, other
  is_main boolean not null default false,
  balance numeric(14,2) not null default 0,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists finance_parties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'vendor', -- vendor, client, employee, other
  phone text,
  email text,
  address text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add account_id to expenses and ledger_entries
alter table expenses add column if not exists account_id uuid references finance_accounts(id);
alter table expenses add column if not exists party_id uuid references finance_parties(id);
alter table ledger_entries add column if not exists account_id uuid references finance_accounts(id);
alter table ledger_entries add column if not exists party_id uuid references finance_parties(id);
