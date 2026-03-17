-- Selective Data Reset for Edusolve (Fixed - V2)
-- Preserves: roles, subjects, boards, mediums, staff logins
-- Removes: teacher accounts, teacher data, and all operational records

DO $$ 
DECLARE 
    teacher_role_id UUID;
    target_tables TEXT[] := ARRAY[
        'leads',
        'lead_status_history',
        'demo_requests',
        'demo_teacher_responses',
        'demo_sessions',
        'students',
        'student_topups',
        'academic_sessions',
        'session_verifications',
        'hour_ledger',
        'ledger_entries',
        'expenses',
        'invoices',
        'payroll_monthly_cycles',
        'payroll_items',
        'hr_payroll_cycles',
        'hr_payroll_items',
        'hr_payment_requests',
        'attendance_records',
        'salary_structures',
        'ownership_transfers',
        'audit_logs',
        'integration_logs',
        'teacher_interviews',
        'teacher_availability',
        'teacher_profiles',
        'teacher_leads',
        'teacher_lead_history',
        'employees',
        'tickets',
        'ticket_messages',
        'ticket_attachments',
        'whatsapp_messages',
        'whatsapp_sessions',
        'whatsapp_contacts',
        'finance_accounts',
        'finance_parties',
        'finance_categories',
        'payment_requests',
        'installment_payments',
        'installments',
        'requests',
        'student_teacher_assignments',
        'student_messages',
        'accounts',
        'parties'
    ];
    tbl TEXT;
BEGIN
    -- 1. Get Teacher Role ID
    SELECT id INTO teacher_role_id FROM public.roles WHERE code = 'teacher';

    -- 2. Truncate operational tables safely
    FOREACH tbl IN ARRAY target_tables
    LOOP
        -- Check if table exists before attempting truncate
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = tbl
        ) THEN
            EXECUTE format('TRUNCATE TABLE public.%I CASCADE', tbl);
        END IF;
    END LOOP;

    -- 3. Remove Teacher Users
    -- We must delete from user_roles FIRST to avoid FK constraint issues
    IF teacher_role_id IS NOT NULL THEN
        -- a. Delete teacher role assignments
        -- We only delete for users who have the teacher role
        DELETE FROM public.user_roles 
        WHERE user_id IN (
            SELECT user_id FROM public.user_roles WHERE role_id = teacher_role_id
        );

        -- b. Delete the teacher users themselves
        DELETE FROM public.users 
        WHERE id NOT IN (
            SELECT user_id FROM public.user_roles -- Keep anyone who still has a role (Admins, Counselors, etc.)
        );
        
        -- Logic: After deleting teacher roles, teachers have no roles left. 
        -- Staff (Admins/Counselors) still have their roles, so they are kept.
    END IF;
    
    RAISE NOTICE 'Selective reset complete. Staff accounts and core positions preserved.';
END $$;
