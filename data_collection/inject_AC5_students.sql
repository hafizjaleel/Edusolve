-- Direct Student and AC Injection for AC5 (Pure Direct, No Finance/Leads)
-- Already Paid - Setting initial hours directly

DO $$
DECLARE
    ac_role_id UUID;
BEGIN
    SELECT id INTO ac_role_id FROM public.roles WHERE code = 'academic_coordinator';
    
    IF ac_role_id IS NULL THEN
        RAISE EXCEPTION 'Required Academic Coordinator role not found';
    END IF;

    -- Create AC User: AC5
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'edusolve5ac@gmail.com') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, recovery_token, email_change_token_new, email_change
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', 'e5555555-5555-4555-a555-555555555555', 'authenticated', 'authenticated', 'edusolve5ac@gmail.com', 
            extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf')), now(), 
            '{"provider":"email","providers":["email"]}', '{"role":"academic_coordinator","full_name":"AC5"}', 
            now(), now(), '', '', '', ''
        );

        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
        ) VALUES (
            'e5555555-5555-4555-a555-555555555555', 'e5555555-5555-4555-a555-555555555555', format('{"sub":"%s","email":"%s"}', 'e5555555-5555-4555-a555-555555555555', 'edusolve5ac@gmail.com')::jsonb, 'email', 'e5555555-5555-4555-a555-555555555555', now(), now(), now()
        );

        INSERT INTO public.users (id, full_name, email)
        VALUES ('e5555555-5555-4555-a555-555555555555', 'AC5', 'edusolve5ac@gmail.com');

        INSERT INTO public.user_roles (user_id, role_id)
        VALUES ('e5555555-5555-4555-a555-555555555555', ac_role_id);
    END IF;

    -- Student: ADITHYA SINU
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000000-0000-4000-8000-000000000000', 'e5555555-5555-4555-a555-555555555555', 'ADITHYA SINU', 'AU02501083', 
        '918547605438', '971563978285', NULL, 'contact',
        '5', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-02-23', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AMELIYA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000001-0000-4000-8000-000000000001', 'e5555555-5555-4555-a555-555555555555', 'AMELIYA', 'AU02501094', 
        '971527211339', '971527211339', NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        10, 10, 'active', 
        '2026-02-12', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AIDHIHIYA DANIL
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000002-0000-4000-8000-000000000002', 'e5555555-5555-4555-a555-555555555555', 'AIDHIHIYA DANIL', 'AU02501099', 
        '971527345615', '971527345615', NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        16, 16, 'active', 
        '2026-02-12', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: JUGAL JEEVAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000003-0000-4000-8000-000000000003', 'e5555555-5555-4555-a555-555555555555', 'JUGAL JEEVAN', 'AU02501101', 
        '971557183174', '971557183174', NULL, 'contact',
        '5', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        10, 10, 'active', 
        '2026-05-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: JAHAZIEL DELIJO
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000004-0000-4000-8000-000000000004', 'e5555555-5555-4555-a555-555555555555', 'JAHAZIEL DELIJO', 'AU02501104', 
        '971555812603', '971555812603', NULL, 'contact',
        '2', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-08-27', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student:  JACQUIS JOBY
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000005-0000-4000-8000-000000000005', 'e5555555-5555-4555-a555-555555555555', ' JACQUIS JOBY', 'DC02501277', 
        '971557424167', '971557424167', '971505406990', 'contact',
        '10', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: SHANE KURIAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000006-0000-4000-8000-000000000006', 'e5555555-5555-4555-a555-555555555555', 'SHANE KURIAN', 'DC02501294', 
        '917907646028', '971503737944', NULL, 'contact',
        '12', 'STATE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: FATHIMATHUL SHIZA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000007-0000-4000-8000-000000000007', 'e5555555-5555-4555-a555-555555555555', 'FATHIMATHUL SHIZA', 'DC02501304', 
        '96597268457', '96550199111', NULL, 'contact',
        '10', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        8, 8, 'active', 
        '2026-01-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ATIN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000008-0000-4000-8000-000000000008', 'e5555555-5555-4555-a555-555555555555', 'ATIN', 'DC02501310', 
        '971567920747', '971567920747', NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        8, 8, 'active', 
        '2026-02-25', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: SHREYA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000009-0000-4000-8000-000000000009', 'e5555555-5555-4555-a555-555555555555', 'SHREYA', 'DC02501311', 
        '918139046820', '8139046820', NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        12, 12, 'active', 
        '2026-11-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: WAFA MARIYAM
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000010-0000-4000-8000-00000000000a', 'e5555555-5555-4555-a555-555555555555', 'WAFA MARIYAM', 'DC02501314', 
        '971564685759', '971564685759', NULL, 'contact',
        '4', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-05-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ILAN BIN ZAHIR
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000011-0000-4000-8000-00000000000b', 'e5555555-5555-4555-a555-555555555555', 'ILAN BIN ZAHIR', 'DC02501312', 
        '971503694659', '971503694659', NULL, 'contact',
        '10', 'CBSE', 'ENGLISH', 'MONTHLY', 
        60, 60, 'active', 
        '2026-12-01', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: EASHAN AHMAD
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000012-0000-4000-8000-00000000000c', 'e5555555-5555-4555-a555-555555555555', 'EASHAN AHMAD', 'DC02501317', 
        '96892587607', '96892587607', NULL, 'contact',
        '10', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: DIYA KURUVILA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000013-0000-4000-8000-00000000000d', 'e5555555-5555-4555-a555-555555555555', 'DIYA KURUVILA', 'DC02501322', 
        '919744689993', '971552088154', NULL, 'contact',
        '11', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-02-25', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: SREYAS
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000014-0000-4000-8000-00000000000e', 'e5555555-5555-4555-a555-555555555555', 'SREYAS', 'AU02501122', 
        '971542181828', '971542181828', NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-27', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: FATHIMA SHEZA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000015-0000-4000-8000-00000000000f', 'e5555555-5555-4555-a555-555555555555', 'FATHIMA SHEZA', 'DC02501315', 
        '918714510015', '971562086415', NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        15, 15, 'active', 
        '2026-02-14', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ACHYUT
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000016-0000-4000-8000-000000000010', 'e5555555-5555-4555-a555-555555555555', 'ACHYUT', 'DC02501324', 
        '919048291270', '971552513995', NULL, 'contact',
        '3', 'STATE', 'monthly', 'MONTHLY', 
        20, 20, 'active', 
        '2026-02-28', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ISHANI MENON
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000017-0000-4000-8000-000000000011', 'e5555555-5555-4555-a555-555555555555', 'ISHANI MENON', 'DC02501325', 
        '971557207476', '971557207476', NULL, 'contact',
        '4', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-02-17', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AMY
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000018-0000-4000-8000-000000000012', 'e5555555-5555-4555-a555-555555555555', 'AMY', 'FB026011386', 
        '919745539931', '97433081263', NULL, 'contact',
        '10', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-04-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MOHAMMED SHEZIN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000019-0000-4000-8000-000000000013', 'e5555555-5555-4555-a555-555555555555', 'MOHAMMED SHEZIN', 'FB02601394', 
        '918893043272', '918893043272', NULL, 'contact',
        '1', 'STATE', 'English ', 'MONTHLY', 
        20, 20, 'active', 
        '2026-10-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: SANDRA ANN MINNU
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000020-0000-4000-8000-000000000014', 'e5555555-5555-4555-a555-555555555555', 'SANDRA ANN MINNU', 'FB02601397', 
        '96565549520', '96569600622', NULL, 'contact',
        '10', 'CBSE', 'ENGLISH', 'MONTHLY', 
        40, 40, 'active', 
        '2026-09-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: FATHIMA DAISHA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000021-0000-4000-8000-000000000015', 'e5555555-5555-4555-a555-555555555555', 'FATHIMA DAISHA', 'FB02601398', 
        '919895267100', '919895267100', NULL, 'contact',
        '4', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-07-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: NAIMA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000022-0000-4000-8000-000000000016', 'e5555555-5555-4555-a555-555555555555', 'NAIMA', 'FB02601400', 
        '966539679480', '966539679480', NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        12, 12, 'active', 
        '2026-04-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ABDULLA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000023-0000-4000-8000-000000000017', 'e5555555-5555-4555-a555-555555555555', 'ABDULLA', 'FB02601404', 
        '917558814077', '9562176466', NULL, 'contact',
        '10', 'STATE', 'English ', 'MONTHLY', 
        20, 20, 'active', 
        '2026-02-18', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: VAIGA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000024-0000-4000-8000-000000000018', 'e5555555-5555-4555-a555-555555555555', 'VAIGA', 'FB02601409', 
        '97430084276', '97430084276', NULL, 'contact',
        '9', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        12, 12, 'active', 
        '2026-02-24', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: JEFF
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000025-0000-4000-8000-000000000019', 'e5555555-5555-4555-a555-555555555555', 'JEFF', 'FB02601413', 
        '971504662477', '971504662477', NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        15, 15, 'active', 
        '2026-02-26', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ADHVI
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000026-0000-4000-8000-00000000001a', 'e5555555-5555-4555-a555-555555555555', 'ADHVI', 'FB02601415', 
        '971563978285', '971563978285', '971589819955', 'contact',
        'KG2', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-02-20', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MUHAMMED RISHAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000027-0000-4000-8000-00000000001b', 'e5555555-5555-4555-a555-555555555555', 'MUHAMMED RISHAN', 'FB2601417', 
        '917907928510', '917907928510', NULL, 'contact',
        '10', 'STATE', 'ENGLISH', 'CUSTOMISED', 
        8, 8, 'active', 
        '2026-02-27', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: NYLA MARIYAM
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000028-0000-4000-8000-00000000001c', 'e5555555-5555-4555-a555-555555555555', 'NYLA MARIYAM', 'JN02601333', 
        '971567167032', '971567212395', NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-05-01', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: PARVANA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000029-0000-4000-8000-00000000001d', 'e5555555-5555-4555-a555-555555555555', 'PARVANA', 'JN02601340', 
        '971551346566', '971551346566', NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-09-01', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AFAN MUHAMMED
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000030-0000-4000-8000-00000000001e', 'e5555555-5555-4555-a555-555555555555', 'AFAN MUHAMMED', 'JN02601349', 
        '918547526555', '971506598249', NULL, 'contact',
        '6', 'STATE', 'english', 'MONTHLY', 
        20, 20, 'active', 
        '2026-12-01', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: HITESH
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000031-0000-4000-8000-00000000001f', 'e5555555-5555-4555-a555-555555555555', 'HITESH', 'JN02601350', 
        '917305567809', '917305567809', NULL, 'contact',
        '1', 'ICSE', 'ENGLISH', 'CUTOMISED', 
        12, 12, 'active', 
        '2026-01-15', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: IZZA ZAFREEN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000032-0000-4000-8000-000000000020', 'e5555555-5555-4555-a555-555555555555', 'IZZA ZAFREEN', 'JN02601357', 
        '97433679877', '97433679877', NULL, 'contact',
        '12', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-01', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: HIDHA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000033-0000-4000-8000-000000000021', 'e5555555-5555-4555-a555-555555555555', 'HIDHA', 'JN02601358', 
        '919074672530', '919074672530', NULL, 'contact',
        '10', 'STATE', 'English ', 'CUSTOMISED', 
        12, 12, 'active', 
        '2026-01-18', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ANUGRAHA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000034-0000-4000-8000-000000000022', 'e5555555-5555-4555-a555-555555555555', 'ANUGRAHA', 'JN02601359', 
        '917356140056', '917356140056', NULL, 'contact',
        '3', 'STATE', 'English ', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-17', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ADAM HINAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000035-0000-4000-8000-000000000023', 'e5555555-5555-4555-a555-555555555555', 'ADAM HINAN', 'JN02601361', 
        '971509307879', '971509307879', NULL, 'contact',
        '2', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        now(), 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: NIVEDATH
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000036-0000-4000-8000-000000000024', 'e5555555-5555-4555-a555-555555555555', 'NIVEDATH', 'JN02601370', 
        '919567819371', '919567819371', NULL, 'contact',
        '6', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        8, 8, 'active', 
        '2026-01-24', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ANSHIKA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000037-0000-4000-8000-000000000025', 'e5555555-5555-4555-a555-555555555555', 'ANSHIKA', 'JN02601378', 
        '919847528782', '919847528782', NULL, 'contact',
        '9', 'STATE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-29', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ANKIT V ROSHAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000038-0000-4000-8000-000000000026', 'e5555555-5555-4555-a555-555555555555', 'ANKIT V ROSHAN', 'JN02601382', 
        '97431424656', '97455839122', NULL, 'contact',
        '6', 'BRITISH', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-01-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ANIKA V ROSHAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000039-0000-4000-8000-000000000027', 'e5555555-5555-4555-a555-555555555555', 'ANIKA V ROSHAN', 'JN02601383', 
        '97431424656', '97455839122', NULL, 'contact',
        '2', 'BRITISH', 'ENGLISH', 'MONTHLY', 
        20, 20, 'inactive', 
        '2026-01-02', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: NASHWA MARIYAM
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000040-0000-4000-8000-000000000028', 'e5555555-5555-4555-a555-555555555555', 'NASHWA MARIYAM', 'MR02601419', 
        '971552801139', '971552801139', NULL, 'contact',
        'LKG', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-04-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: JON V SIJU
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000041-0000-4000-8000-000000000029', 'e5555555-5555-4555-a555-555555555555', 'JON V SIJU', 'MR02601424', 
        '97566193508', '97566193508', NULL, 'contact',
        '4', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-08-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MAHIR MUNAWAR
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000042-0000-4000-8000-00000000002a', 'e5555555-5555-4555-a555-555555555555', 'MAHIR MUNAWAR', 'MR02601429', 
        '971509352117', '971509352117', NULL, 'contact',
        '12', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        16, 16, 'active', 
        '2026-10-03', 'WHATSAAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AMAAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000043-0000-4000-8000-00000000002b', 'e5555555-5555-4555-a555-555555555555', 'AMAAN', 'MR026011431', 
        '97433975979', NULL, NULL, 'contact',
        '2', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2026-12-03', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: RUTH SHALYCHERIYAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000044-0000-4000-8000-00000000002c', 'e5555555-5555-4555-a555-555555555555', 'RUTH SHALYCHERIYAN', 'NV02501240', 
        '971505204993', '971555611954', NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        16, 16, 'active', 
        '2026-05-11', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MUHAMMED AL FAIZE
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000045-0000-4000-8000-00000000002d', 'e5555555-5555-4555-a555-555555555555', 'MUHAMMED AL FAIZE', 'NV02501241', 
        '916282650814', '966538864065', NULL, 'contact',
        '9', 'STATE', 'MALAYALAM', 'MONTHLY', 
        60, 60, 'active', 
        '2026-05-11', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: NEIL
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000046-0000-4000-8000-00000000002e', 'e5555555-5555-4555-a555-555555555555', 'NEIL', 'NV02501241', 
        '971506002271', NULL, NULL, 'contact',
        '2', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-11-14', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: WASIM MUSTHAFA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000047-0000-4000-8000-00000000002f', 'e5555555-5555-4555-a555-555555555555', 'WASIM MUSTHAFA', 'NV02501254', 
        '971509667901', '971558233881', NULL, 'contact',
        '12', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        16, 16, 'active', 
        '2025-11-14', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MUHAMMED SHAZIL
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000048-0000-4000-8000-000000000030', 'e5555555-5555-4555-a555-555555555555', 'MUHAMMED SHAZIL', 'NV02501256', 
        '971553955281', NULL, NULL, 'contact',
        '8', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-11-17', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: IZAAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000049-0000-4000-8000-000000000031', 'e5555555-5555-4555-a555-555555555555', 'IZAAN', 'NV02501266', 
        '919995228333', NULL, NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        16, 16, 'active', 
        '2026-11-25', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: RITHIK VARGHEES
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000050-0000-4000-8000-000000000032', 'e5555555-5555-4555-a555-555555555555', 'RITHIK VARGHEES', 'NV02501276', 
        '96896622739', NULL, NULL, 'contact',
        '6', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-01-12', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AYISHA AZMIN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000051-0000-4000-8000-000000000033', 'e5555555-5555-4555-a555-555555555555', 'AYISHA AZMIN', 'OT02501216', 
        '97470074616', NULL, NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        12, 12, 'active', 
        '2025-10-13', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MUHAMMED ZIYAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000052-0000-4000-8000-000000000034', 'e5555555-5555-4555-a555-555555555555', 'MUHAMMED ZIYAN', 'OT02501220', 
        '971544098958', '97155484236', NULL, 'contact',
        '8', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        8, 8, 'active', 
        '2025-12-10', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MINHA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000053-0000-4000-8000-000000000035', 'e5555555-5555-4555-a555-555555555555', 'MINHA', 'OT02501222', 
        '971582749014', NULL, NULL, 'contact',
        '11', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        16, 16, 'active', 
        '2025-10-19', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: SREEVEDH
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000054-0000-4000-8000-000000000036', 'e5555555-5555-4555-a555-555555555555', 'SREEVEDH', 'OT02501228', 
        '97477550767', NULL, NULL, 'contact',
        '2', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        15, 15, 'active', 
        '2025-10-21', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: MUHAMMED REHAAN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000055-0000-4000-8000-000000000037', 'e5555555-5555-4555-a555-555555555555', 'MUHAMMED REHAAN', 'OT02501229', 
        '971562656892', NULL, NULL, 'contact',
        '6', 'CBSE', 'ENGLSIH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-01-11', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ERIN ELIZABATH
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000056-0000-4000-8000-000000000038', 'e5555555-5555-4555-a555-555555555555', 'ERIN ELIZABATH', 'SP02501130', 
        '971561150724', NULL, NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        8, 8, 'active', 
        '2025-08-09', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AYASH
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000057-0000-4000-8000-000000000039', 'e5555555-5555-4555-a555-555555555555', 'AYASH', 'SP02501133', 
        '971568423570', '971558914474', NULL, 'contact',
        '4', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        12, 12, 'active', 
        '2025-08-09', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ESHITA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000058-0000-4000-8000-00000000003a', 'e5555555-5555-4555-a555-555555555555', 'ESHITA', 'SP02501176', 
        '96871745653', NULL, NULL, 'contact',
        '6', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-05-10', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: AYISHA MEHRIN
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000059-0000-4000-8000-00000000003b', 'e5555555-5555-4555-a555-555555555555', 'AYISHA MEHRIN', 'AU02501090', 
        '97466087025', NULL, NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        4, 4, 'active', 
        '2025-08-16', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: JOHAN JOHN ELDHO
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000060-0000-4000-8000-00000000003c', 'e5555555-5555-4555-a555-555555555555', 'JOHAN JOHN ELDHO', 'DC02501306', 
        '974337002260', '97450218723', NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        12, 12, 'active', 
        '2025-12-20', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: ARADHITHA
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000061-0000-4000-8000-00000000003d', 'e5555555-5555-4555-a555-555555555555', 'ARADHITHA', 'DC025011300', 
        '96896942754', NULL, NULL, 'contact',
        '4', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-12-14', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: OLIVIA ANN RIJO
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000062-0000-4000-8000-00000000003e', 'e5555555-5555-4555-a555-555555555555', 'OLIVIA ANN RIJO', 'DC02501302', 
        '971504512894', NULL, NULL, 'contact',
        '3', 'CBSE', 'ENGLISH', 'MONTHLY', 
        20, 20, 'active', 
        '2025-12-16', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();

    -- Student: EVA MARIYAM
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '55000063-0000-4000-8000-00000000003f', 'e5555555-5555-4555-a555-555555555555', 'EVA MARIYAM', 'DC02501306', 
        '919400635715', NULL, NULL, 'contact',
        '7', 'CBSE', 'ENGLISH', 'CUSTOMISED', 
        14, 14, 'active', 
        '2025-12-18', 'WHATSAPP', now(), now()
    )
    ON CONFLICT (student_code) DO UPDATE SET
        academic_coordinator_id = EXCLUDED.academic_coordinator_id,
        student_name = EXCLUDED.student_name,
        contact_number = EXCLUDED.contact_number,
        parent_phone = EXCLUDED.parent_phone,
        alternative_number = EXCLUDED.alternative_number,
        class_level = EXCLUDED.class_level,
        board = EXCLUDED.board,
        medium = EXCLUDED.medium,
        package_name = EXCLUDED.package_name,
        total_hours = EXCLUDED.total_hours,
        remaining_hours = EXCLUDED.remaining_hours,
        status = EXCLUDED.status,
        updated_at = now();


END $$;
