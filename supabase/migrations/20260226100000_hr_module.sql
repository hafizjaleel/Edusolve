-- HR Module: role, employees, attendance, salary, payroll, payment requests
-- Run this migration manually against the database.

-- ═══════ INSERT HR ROLE ═══════
INSERT INTO roles (code, name)
VALUES ('hr', 'HR')
ON CONFLICT (code) DO NOTHING;

-- ═══════ ENUMS ═══════
DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present','absent','half_day','leave');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE hr_payroll_status AS ENUM ('draft','submitted','approved','rejected','paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE hr_payment_request_status AS ENUM ('pending','approved','rejected','paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE employee_type AS ENUM ('staff','student');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ═══════ EMPLOYEES ═══════
-- HR-managed people for attendance & salary. 
-- user_id references a system user (for staff who have logins).
-- For students added purely for attendance/salary, user_id is NULL.
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  designation TEXT,
  department TEXT,
  employee_type employee_type NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  joined_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_type ON employees(employee_type);

-- ═══════ ATTENDANCE RECORDS ═══════
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  attendance_date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  check_in TIME,
  check_out TIME,
  notes TEXT,
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_records(employee_id);

-- ═══════ SALARY STRUCTURES ═══════
CREATE TABLE IF NOT EXISTS salary_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) UNIQUE,
  base_salary NUMERIC(14,2) NOT NULL DEFAULT 0,
  hra NUMERIC(14,2) NOT NULL DEFAULT 0,
  transport_allowance NUMERIC(14,2) NOT NULL DEFAULT 0,
  other_allowance NUMERIC(14,2) NOT NULL DEFAULT 0,
  pf_deduction NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_deduction NUMERIC(14,2) NOT NULL DEFAULT 0,
  other_deduction NUMERIC(14,2) NOT NULL DEFAULT 0,
  effective_from DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════ HR PAYROLL CYCLES ═══════
CREATE TABLE IF NOT EXISTS hr_payroll_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status hr_payroll_status NOT NULL DEFAULT 'draft',
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id),
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, month)
);

-- ═══════ HR PAYROLL ITEMS ═══════
CREATE TABLE IF NOT EXISTS hr_payroll_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES hr_payroll_cycles(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  working_days INT NOT NULL DEFAULT 0,
  present_days INT NOT NULL DEFAULT 0,
  half_days INT NOT NULL DEFAULT 0,
  leave_days INT NOT NULL DEFAULT 0,
  absent_days INT NOT NULL DEFAULT 0,
  base_salary NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_allowances NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(14,2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(14,2) NOT NULL DEFAULT 0,
  adjustment NUMERIC(14,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cycle_id, employee_id)
);

-- ═══════ HR PAYMENT REQUESTS ═══════
-- Sent from HR to Finance for payroll disbursement
CREATE TABLE IF NOT EXISTS hr_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES hr_payroll_cycles(id),
  total_amount NUMERIC(14,2) NOT NULL,
  status hr_payment_request_status NOT NULL DEFAULT 'pending',
  requested_by UUID REFERENCES users(id),
  finance_note TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
