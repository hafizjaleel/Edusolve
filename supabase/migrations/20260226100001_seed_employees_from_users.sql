-- Migrate existing system users into the employees table
-- Excludes: super_admin, teacher roles
-- Run this AFTER 20260226100000_hr_module.sql

INSERT INTO employees (user_id, full_name, email, designation, department, employee_type, is_active, joined_date)
SELECT
  u.id,
  u.full_name,
  u.email,
  r.name AS designation,       -- use role name as default designation
  CASE r.code
    WHEN 'counselor_head' THEN 'Sales'
    WHEN 'counselor' THEN 'Sales'
    WHEN 'academic_coordinator' THEN 'Academics'
    WHEN 'teacher_coordinator' THEN 'Academics'
    WHEN 'finance' THEN 'Finance'
    WHEN 'hr' THEN 'HR'
    ELSE 'General'
  END AS department,
  'staff',
  u.is_active,
  u.created_at::date
FROM users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r ON r.id = ur.role_id
WHERE r.code NOT IN ('super_admin', 'teacher')
  AND NOT EXISTS (
    SELECT 1 FROM employees e WHERE e.user_id = u.id
  );
