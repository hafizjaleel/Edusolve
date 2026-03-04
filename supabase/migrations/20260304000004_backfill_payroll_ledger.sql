-- Backfill Script: Recreate missing ledger_entries and expenses from existing hr_payment_requests
-- Run this AFTER the 20260304000003 migration has been applied.
-- This is safe to run multiple times (uses NOT EXISTS checks).

-- ═══ 1. Create 'payable' ledger entries for ALL payment requests (pending + paid) ═══
INSERT INTO ledger_entries (entry_date, entry_type, amount, description, teacher_id, employee_id, posted_by)
SELECT
  COALESCE(pr.created_at::date, CURRENT_DATE),
  'payable',
  pr.total_amount,
  CASE
    WHEN pr.target_type = 'teacher' THEN 'Salary Payable (Teacher) — ' || pr.year || '/' || LPAD(pr.month::text, 2, '0')
    ELSE 'Salary Payable (Employee) — ' || pr.year || '/' || LPAD(pr.month::text, 2, '0')
  END,
  CASE WHEN pr.target_type = 'teacher' THEN pr.teacher_id ELSE NULL END,
  CASE WHEN pr.target_type = 'employee' THEN pr.employee_id ELSE NULL END,
  pr.requested_by
FROM hr_payment_requests pr
WHERE pr.total_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM ledger_entries le
    WHERE le.entry_type = 'payable'
      AND le.description LIKE '%' || pr.year || '/' || LPAD(pr.month::text, 2, '0') || '%'
      AND (
        (pr.target_type = 'teacher' AND le.teacher_id = pr.teacher_id)
        OR (pr.target_type = 'employee' AND le.employee_id = pr.employee_id)
      )
  );

-- ═══ 2. Create expense records for PAID payment requests ═══
INSERT INTO expenses (expense_date, category, amount, description, teacher_id, employee_id, created_by)
SELECT
  COALESCE(pr.updated_at::date, CURRENT_DATE),
  'salary',
  pr.total_amount,
  'Salary Payment — ' || pr.year || '/' || LPAD(pr.month::text, 2, '0'),
  CASE WHEN pr.target_type = 'teacher' THEN pr.teacher_id ELSE NULL END,
  CASE WHEN pr.target_type = 'employee' THEN pr.employee_id ELSE NULL END,
  pr.requested_by
FROM hr_payment_requests pr
WHERE pr.status = 'paid'
  AND pr.total_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM expenses e
    WHERE e.category = 'salary'
      AND e.description LIKE '%' || pr.year || '/' || LPAD(pr.month::text, 2, '0') || '%'
      AND (
        (pr.target_type = 'teacher' AND e.teacher_id = pr.teacher_id)
        OR (pr.target_type = 'employee' AND e.employee_id = pr.employee_id)
      )
  );

-- ═══ 3. Create 'expense' ledger entries for PAID payment requests ═══
INSERT INTO ledger_entries (entry_date, entry_type, amount, description, teacher_id, employee_id, posted_by)
SELECT
  COALESCE(pr.updated_at::date, CURRENT_DATE),
  'expense',
  pr.total_amount,
  'Salary Paid: ' || pr.year || '/' || LPAD(pr.month::text, 2, '0'),
  CASE WHEN pr.target_type = 'teacher' THEN pr.teacher_id ELSE NULL END,
  CASE WHEN pr.target_type = 'employee' THEN pr.employee_id ELSE NULL END,
  pr.requested_by
FROM hr_payment_requests pr
WHERE pr.status = 'paid'
  AND pr.total_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM ledger_entries le
    WHERE le.entry_type = 'expense'
      AND le.description LIKE '%' || pr.year || '/' || LPAD(pr.month::text, 2, '0') || '%'
      AND (
        (pr.target_type = 'teacher' AND le.teacher_id = pr.teacher_id)
        OR (pr.target_type = 'employee' AND le.employee_id = pr.employee_id)
      )
  );
