-- Add total_amount and hours columns to payment_requests
alter table payment_requests add column if not exists total_amount numeric(12,2);
alter table payment_requests add column if not exists hours numeric(6,1);
