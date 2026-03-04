-- Migration: Fix ledger_entries entry_type enum + add party ID columns
-- The ledger_type enum is missing 'payable' and 'receivable' values that the code uses.
-- We change entry_type to TEXT to avoid future enum mismatches.

-- ═══ Fix entry_type column: change from enum to TEXT ═══
ALTER TABLE ledger_entries ALTER COLUMN entry_type TYPE TEXT USING entry_type::TEXT;

-- Also make posted_by / created_by nullable (some system-generated entries may not have a user)
ALTER TABLE ledger_entries ALTER COLUMN posted_by DROP NOT NULL;
ALTER TABLE expenses ALTER COLUMN created_by DROP NOT NULL;

-- ═══ Add party ID columns to ledger_entries ═══
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id);
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS teacher_id UUID;
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

-- Drop FK constraints on teacher_id that reference users (HR stores teacher_profiles.id, not users.id)
ALTER TABLE ledger_entries DROP CONSTRAINT IF EXISTS ledger_entries_teacher_id_fkey;
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_teacher_id_fkey;

-- ═══ Add party ID columns to expenses ═══
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES students(id);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS teacher_id UUID;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS employee_id UUID REFERENCES employees(id);

-- ═══ Indexes for faster ledger lookups ═══
CREATE INDEX IF NOT EXISTS idx_ledger_student ON ledger_entries(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ledger_teacher ON ledger_entries(teacher_id) WHERE teacher_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ledger_employee ON ledger_entries(employee_id) WHERE employee_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_expenses_student ON expenses(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_teacher ON expenses(teacher_id) WHERE teacher_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_expenses_employee ON expenses(employee_id) WHERE employee_id IS NOT NULL;

-- NOTE: teacher_id is intentionally NOT a FK because HR payroll stores teacher_profiles.id
-- while other flows may store users.id. Both are valid UUIDs pointing to different tables.
