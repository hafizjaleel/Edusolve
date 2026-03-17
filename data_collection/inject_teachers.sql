-- Teacher Injection SQL (Fixed - V4 - No Duplicates)
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    teacher_role_id UUID;
BEGIN
    SELECT id INTO teacher_role_id FROM public.roles WHERE code = 'teacher';
    IF teacher_role_id IS NULL THEN
        RAISE EXCEPTION 'Teacher role not found';
    END IF;

    -- Teacher: AASHI MARY SEBASTIAN (T25SP686)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c18bc4aa-1b9d-4b27-b71b-edfa049affcd', 'authenticated', 'authenticated', 't25sp686@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AASHI MARY SEBASTIAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c18bc4aa-1b9d-4b27-b71b-edfa049affcd', 'c18bc4aa-1b9d-4b27-b71b-edfa049affcd', format('{"sub":"%s","email":"%s"}', 'c18bc4aa-1b9d-4b27-b71b-edfa049affcd', 't25sp686@gmail.com')::jsonb, 'email', 'c18bc4aa-1b9d-4b27-b71b-edfa049affcd', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c18bc4aa-1b9d-4b27-b71b-edfa049affcd', 'AASHI MARY SEBASTIAN', 't25sp686@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c18bc4aa-1b9d-4b27-b71b-edfa049affcd', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c18bc4aa-1b9d-4b27-b71b-edfa049affcd', 'T25SP686', now(), now());

    -- Teacher: AASIYA SANA (T24JU269)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '57dab638-c054-40b3-ab72-75ba0288b137', 'authenticated', 'authenticated', 't24ju269@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AASIYA SANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '57dab638-c054-40b3-ab72-75ba0288b137', '57dab638-c054-40b3-ab72-75ba0288b137', format('{"sub":"%s","email":"%s"}', '57dab638-c054-40b3-ab72-75ba0288b137', 't24ju269@gmail.com')::jsonb, 'email', '57dab638-c054-40b3-ab72-75ba0288b137', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('57dab638-c054-40b3-ab72-75ba0288b137', 'AASIYA SANA', 't24ju269@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('57dab638-c054-40b3-ab72-75ba0288b137', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('57dab638-c054-40b3-ab72-75ba0288b137', 'T24JU269', now(), now());

    -- Teacher: AAVANI (T24MA225)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '87502aa0-0605-432b-a2f2-a5277842cba4', 'authenticated', 'authenticated', 't24ma225@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AAVANI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '87502aa0-0605-432b-a2f2-a5277842cba4', '87502aa0-0605-432b-a2f2-a5277842cba4', format('{"sub":"%s","email":"%s"}', '87502aa0-0605-432b-a2f2-a5277842cba4', 't24ma225@gmail.com')::jsonb, 'email', '87502aa0-0605-432b-a2f2-a5277842cba4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('87502aa0-0605-432b-a2f2-a5277842cba4', 'AAVANI', 't24ma225@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('87502aa0-0605-432b-a2f2-a5277842cba4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('87502aa0-0605-432b-a2f2-a5277842cba4', 'T24MA225', now(), now());

    -- Teacher: ABHIRAMI M (T25FB466)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ba775e76-58ef-49e6-8c45-7243f2e028fb', 'authenticated', 'authenticated', 't25fb466@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ABHIRAMI M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ba775e76-58ef-49e6-8c45-7243f2e028fb', 'ba775e76-58ef-49e6-8c45-7243f2e028fb', format('{"sub":"%s","email":"%s"}', 'ba775e76-58ef-49e6-8c45-7243f2e028fb', 't25fb466@gmail.com')::jsonb, 'email', 'ba775e76-58ef-49e6-8c45-7243f2e028fb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ba775e76-58ef-49e6-8c45-7243f2e028fb', 'ABHIRAMI M', 't25fb466@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ba775e76-58ef-49e6-8c45-7243f2e028fb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ba775e76-58ef-49e6-8c45-7243f2e028fb', 'T25FB466', now(), now());

    -- Teacher: ABHIRAMI V (T25JN442)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', 'authenticated', 'authenticated', 't25jn442@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ABHIRAMI V"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', 'cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', format('{"sub":"%s","email":"%s"}', 'cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', 't25jn442@gmail.com')::jsonb, 'email', 'cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', 'ABHIRAMI V', 't25jn442@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cf625542-84e7-4cc6-b7a5-9ef3cc73f07b', 'T25JN442', now(), now());

    -- Teacher: ABHIRAMI.R.NAIR (T25AP530)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', 'authenticated', 'authenticated', 't25ap530@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ABHIRAMI.R.NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', 'f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', format('{"sub":"%s","email":"%s"}', 'f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', 't25ap530@gmail.com')::jsonb, 'email', 'f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', 'ABHIRAMI.R.NAIR', 't25ap530@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f3ca3253-c33e-4d84-a4bc-13ed7c427ad9', 'T25AP530', now(), now());

    -- Teacher: ABHISHEK (T25OC720)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '11e37b6e-afc4-4e92-a432-a64d4d4c71de', 'authenticated', 'authenticated', 't25oc720@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ABHISHEK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '11e37b6e-afc4-4e92-a432-a64d4d4c71de', '11e37b6e-afc4-4e92-a432-a64d4d4c71de', format('{"sub":"%s","email":"%s"}', '11e37b6e-afc4-4e92-a432-a64d4d4c71de', 't25oc720@gmail.com')::jsonb, 'email', '11e37b6e-afc4-4e92-a432-a64d4d4c71de', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('11e37b6e-afc4-4e92-a432-a64d4d4c71de', 'ABHISHEK', 't25oc720@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('11e37b6e-afc4-4e92-a432-a64d4d4c71de', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('11e37b6e-afc4-4e92-a432-a64d4d4c71de', 'T25OC720', now(), now());

    -- Teacher: ADILA (T23DC135)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', 'authenticated', 'authenticated', 't23dc135@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ADILA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', '0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', format('{"sub":"%s","email":"%s"}', '0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', 't23dc135@gmail.com')::jsonb, 'email', '0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', 'ADILA', 't23dc135@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0f39fdbb-bd6f-4b2a-b4a9-cb271d8fc64f', 'T23DC135', now(), now());

    -- Teacher: AFEEFA PK (T24JL306)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bf9de3f8-8d2c-4f4f-add7-03daa14722e9', 'authenticated', 'authenticated', 't24jl306@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AFEEFA PK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bf9de3f8-8d2c-4f4f-add7-03daa14722e9', 'bf9de3f8-8d2c-4f4f-add7-03daa14722e9', format('{"sub":"%s","email":"%s"}', 'bf9de3f8-8d2c-4f4f-add7-03daa14722e9', 't24jl306@gmail.com')::jsonb, 'email', 'bf9de3f8-8d2c-4f4f-add7-03daa14722e9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bf9de3f8-8d2c-4f4f-add7-03daa14722e9', 'AFEEFA PK', 't24jl306@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bf9de3f8-8d2c-4f4f-add7-03daa14722e9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bf9de3f8-8d2c-4f4f-add7-03daa14722e9', 'T24JL306', now(), now());

    -- Teacher: AFNANA SALAM (T26JN799)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a01ab681-ccba-430d-9fca-5fdb67e58291', 'authenticated', 'authenticated', 't26jn799@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AFNANA SALAM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a01ab681-ccba-430d-9fca-5fdb67e58291', 'a01ab681-ccba-430d-9fca-5fdb67e58291', format('{"sub":"%s","email":"%s"}', 'a01ab681-ccba-430d-9fca-5fdb67e58291', 't26jn799@gmail.com')::jsonb, 'email', 'a01ab681-ccba-430d-9fca-5fdb67e58291', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a01ab681-ccba-430d-9fca-5fdb67e58291', 'AFNANA SALAM', 't26jn799@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a01ab681-ccba-430d-9fca-5fdb67e58291', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a01ab681-ccba-430d-9fca-5fdb67e58291', 'T26JN799', now(), now());

    -- Teacher: AFNIDA K (T25OC706)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '308921aa-2197-4330-89f7-6a2ae75219d0', 'authenticated', 'authenticated', 't25oc706@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AFNIDA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '308921aa-2197-4330-89f7-6a2ae75219d0', '308921aa-2197-4330-89f7-6a2ae75219d0', format('{"sub":"%s","email":"%s"}', '308921aa-2197-4330-89f7-6a2ae75219d0', 't25oc706@gmail.com')::jsonb, 'email', '308921aa-2197-4330-89f7-6a2ae75219d0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('308921aa-2197-4330-89f7-6a2ae75219d0', 'AFNIDA K', 't25oc706@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('308921aa-2197-4330-89f7-6a2ae75219d0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('308921aa-2197-4330-89f7-6a2ae75219d0', 'T25OC706', now(), now());

    -- Teacher: AFRIN SUDHEER (T25FB478)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', 'authenticated', 'authenticated', 't25fb478@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AFRIN SUDHEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', 'b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', format('{"sub":"%s","email":"%s"}', 'b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', 't25fb478@gmail.com')::jsonb, 'email', 'b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', 'AFRIN SUDHEER', 't25fb478@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b6293eb3-c6c6-4d65-88d0-a2dd3d1639c2', 'T25FB478', now(), now());

    -- Teacher: AFSANA  GAFFOOR (T25FB474)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7efd0281-4b0c-4dcf-a1fa-b23841d1093a', 'authenticated', 'authenticated', 't25fb474@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AFSANA  GAFFOOR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7efd0281-4b0c-4dcf-a1fa-b23841d1093a', '7efd0281-4b0c-4dcf-a1fa-b23841d1093a', format('{"sub":"%s","email":"%s"}', '7efd0281-4b0c-4dcf-a1fa-b23841d1093a', 't25fb474@gmail.com')::jsonb, 'email', '7efd0281-4b0c-4dcf-a1fa-b23841d1093a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7efd0281-4b0c-4dcf-a1fa-b23841d1093a', 'AFSANA  GAFFOOR', 't25fb474@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7efd0281-4b0c-4dcf-a1fa-b23841d1093a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7efd0281-4b0c-4dcf-a1fa-b23841d1093a', 'T25FB474', now(), now());

    -- Teacher: AISWARYA (T25OC733)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '348c3575-2a7f-469d-9649-c7e31f76470f', 'authenticated', 'authenticated', 't25oc733@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AISWARYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '348c3575-2a7f-469d-9649-c7e31f76470f', '348c3575-2a7f-469d-9649-c7e31f76470f', format('{"sub":"%s","email":"%s"}', '348c3575-2a7f-469d-9649-c7e31f76470f', 't25oc733@gmail.com')::jsonb, 'email', '348c3575-2a7f-469d-9649-c7e31f76470f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('348c3575-2a7f-469d-9649-c7e31f76470f', 'AISWARYA', 't25oc733@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('348c3575-2a7f-469d-9649-c7e31f76470f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('348c3575-2a7f-469d-9649-c7e31f76470f', 'T25OC733', now(), now());

    -- Teacher: AISWARYA CT (T24SP373)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '73600bfc-7c4b-488a-a8e0-ed6436c297ee', 'authenticated', 'authenticated', 't24sp373@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AISWARYA CT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '73600bfc-7c4b-488a-a8e0-ed6436c297ee', '73600bfc-7c4b-488a-a8e0-ed6436c297ee', format('{"sub":"%s","email":"%s"}', '73600bfc-7c4b-488a-a8e0-ed6436c297ee', 't24sp373@gmail.com')::jsonb, 'email', '73600bfc-7c4b-488a-a8e0-ed6436c297ee', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('73600bfc-7c4b-488a-a8e0-ed6436c297ee', 'AISWARYA CT', 't24sp373@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('73600bfc-7c4b-488a-a8e0-ed6436c297ee', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('73600bfc-7c4b-488a-a8e0-ed6436c297ee', 'T24SP373', now(), now());

    -- Teacher: AISWARYA K.S (T25MR489)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b4c0ca39-e300-4e21-aab0-1f50ac32d523', 'authenticated', 'authenticated', 't25mr489@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AISWARYA K.S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b4c0ca39-e300-4e21-aab0-1f50ac32d523', 'b4c0ca39-e300-4e21-aab0-1f50ac32d523', format('{"sub":"%s","email":"%s"}', 'b4c0ca39-e300-4e21-aab0-1f50ac32d523', 't25mr489@gmail.com')::jsonb, 'email', 'b4c0ca39-e300-4e21-aab0-1f50ac32d523', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b4c0ca39-e300-4e21-aab0-1f50ac32d523', 'AISWARYA K.S', 't25mr489@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b4c0ca39-e300-4e21-aab0-1f50ac32d523', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b4c0ca39-e300-4e21-aab0-1f50ac32d523', 'T25MR489', now(), now());

    -- Teacher: AISWARYA ROY (T24JL298)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '54b130c4-3a65-4123-ab21-28004d1b61c3', 'authenticated', 'authenticated', 't24jl298@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AISWARYA ROY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '54b130c4-3a65-4123-ab21-28004d1b61c3', '54b130c4-3a65-4123-ab21-28004d1b61c3', format('{"sub":"%s","email":"%s"}', '54b130c4-3a65-4123-ab21-28004d1b61c3', 't24jl298@gmail.com')::jsonb, 'email', '54b130c4-3a65-4123-ab21-28004d1b61c3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('54b130c4-3a65-4123-ab21-28004d1b61c3', 'AISWARYA ROY', 't24jl298@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('54b130c4-3a65-4123-ab21-28004d1b61c3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('54b130c4-3a65-4123-ab21-28004d1b61c3', 'T24JL298', now(), now());

    -- Teacher: AISWARYA SUBRAMANYAN (T25OC702)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1f2fa862-4f4c-42cd-8248-c47bb65801f7', 'authenticated', 'authenticated', 't25oc702@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AISWARYA SUBRAMANYAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1f2fa862-4f4c-42cd-8248-c47bb65801f7', '1f2fa862-4f4c-42cd-8248-c47bb65801f7', format('{"sub":"%s","email":"%s"}', '1f2fa862-4f4c-42cd-8248-c47bb65801f7', 't25oc702@gmail.com')::jsonb, 'email', '1f2fa862-4f4c-42cd-8248-c47bb65801f7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1f2fa862-4f4c-42cd-8248-c47bb65801f7', 'AISWARYA SUBRAMANYAN', 't25oc702@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1f2fa862-4f4c-42cd-8248-c47bb65801f7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1f2fa862-4f4c-42cd-8248-c47bb65801f7', 'T25OC702', now(), now());

    -- Teacher: AIYSHA KAYYALA (T25AP547)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', 'authenticated', 'authenticated', 't25ap547@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AIYSHA KAYYALA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', '06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', format('{"sub":"%s","email":"%s"}', '06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', 't25ap547@gmail.com')::jsonb, 'email', '06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', 'AIYSHA KAYYALA', 't25ap547@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('06c0b0ad-bc82-4c2c-b2b8-8b2c5fbcc12c', 'T25AP547', now(), now());

    -- Teacher: AKHILA M THAMPY (T25NV759)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'eb671942-a9f4-43c0-9522-633f07da2d2b', 'authenticated', 'authenticated', 't25nv759@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AKHILA M THAMPY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'eb671942-a9f4-43c0-9522-633f07da2d2b', 'eb671942-a9f4-43c0-9522-633f07da2d2b', format('{"sub":"%s","email":"%s"}', 'eb671942-a9f4-43c0-9522-633f07da2d2b', 't25nv759@gmail.com')::jsonb, 'email', 'eb671942-a9f4-43c0-9522-633f07da2d2b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('eb671942-a9f4-43c0-9522-633f07da2d2b', 'AKHILA M THAMPY', 't25nv759@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('eb671942-a9f4-43c0-9522-633f07da2d2b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('eb671942-a9f4-43c0-9522-633f07da2d2b', 'T25NV759', now(), now());

    -- Teacher: AKHILA NELSON (T24MA241)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '240c37e3-ec69-44bc-972f-b54cd2e2d0c6', 'authenticated', 'authenticated', 't24ma241@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AKHILA NELSON"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '240c37e3-ec69-44bc-972f-b54cd2e2d0c6', '240c37e3-ec69-44bc-972f-b54cd2e2d0c6', format('{"sub":"%s","email":"%s"}', '240c37e3-ec69-44bc-972f-b54cd2e2d0c6', 't24ma241@gmail.com')::jsonb, 'email', '240c37e3-ec69-44bc-972f-b54cd2e2d0c6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('240c37e3-ec69-44bc-972f-b54cd2e2d0c6', 'AKHILA NELSON', 't24ma241@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('240c37e3-ec69-44bc-972f-b54cd2e2d0c6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('240c37e3-ec69-44bc-972f-b54cd2e2d0c6', 'T24MA241', now(), now());

    -- Teacher: AKSA (T25JU586)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '38ada239-9f59-4005-b4ce-5e1bb3e3ace3', 'authenticated', 'authenticated', 't25ju586@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AKSA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '38ada239-9f59-4005-b4ce-5e1bb3e3ace3', '38ada239-9f59-4005-b4ce-5e1bb3e3ace3', format('{"sub":"%s","email":"%s"}', '38ada239-9f59-4005-b4ce-5e1bb3e3ace3', 't25ju586@gmail.com')::jsonb, 'email', '38ada239-9f59-4005-b4ce-5e1bb3e3ace3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('38ada239-9f59-4005-b4ce-5e1bb3e3ace3', 'AKSA', 't25ju586@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('38ada239-9f59-4005-b4ce-5e1bb3e3ace3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('38ada239-9f59-4005-b4ce-5e1bb3e3ace3', 'T25JU586', now(), now());

    -- Teacher: AKSHAYA SUNILJOY BINDHU (T25FB473)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '55db87b7-dfd0-4612-b160-ec3ed68da279', 'authenticated', 'authenticated', 't25fb473@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AKSHAYA SUNILJOY BINDHU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '55db87b7-dfd0-4612-b160-ec3ed68da279', '55db87b7-dfd0-4612-b160-ec3ed68da279', format('{"sub":"%s","email":"%s"}', '55db87b7-dfd0-4612-b160-ec3ed68da279', 't25fb473@gmail.com')::jsonb, 'email', '55db87b7-dfd0-4612-b160-ec3ed68da279', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('55db87b7-dfd0-4612-b160-ec3ed68da279', 'AKSHAYA SUNILJOY BINDHU', 't25fb473@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('55db87b7-dfd0-4612-b160-ec3ed68da279', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('55db87b7-dfd0-4612-b160-ec3ed68da279', 'T25FB473', now(), now());

    -- Teacher: AKSHAYA VIJAYAN (T25SP679)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6ad7f841-e834-4819-972b-8faa47ee6f64', 'authenticated', 'authenticated', 't25sp679@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AKSHAYA VIJAYAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6ad7f841-e834-4819-972b-8faa47ee6f64', '6ad7f841-e834-4819-972b-8faa47ee6f64', format('{"sub":"%s","email":"%s"}', '6ad7f841-e834-4819-972b-8faa47ee6f64', 't25sp679@gmail.com')::jsonb, 'email', '6ad7f841-e834-4819-972b-8faa47ee6f64', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6ad7f841-e834-4819-972b-8faa47ee6f64', 'AKSHAYA VIJAYAN', 't25sp679@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6ad7f841-e834-4819-972b-8faa47ee6f64', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6ad7f841-e834-4819-972b-8faa47ee6f64', 'T25SP679', now(), now());

    -- Teacher: ALEENA BENNY (T25AP536)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c6e1984e-a067-4646-88d5-9f97413c63e1', 'authenticated', 'authenticated', 't25ap536@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALEENA BENNY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c6e1984e-a067-4646-88d5-9f97413c63e1', 'c6e1984e-a067-4646-88d5-9f97413c63e1', format('{"sub":"%s","email":"%s"}', 'c6e1984e-a067-4646-88d5-9f97413c63e1', 't25ap536@gmail.com')::jsonb, 'email', 'c6e1984e-a067-4646-88d5-9f97413c63e1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c6e1984e-a067-4646-88d5-9f97413c63e1', 'ALEENA BENNY', 't25ap536@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c6e1984e-a067-4646-88d5-9f97413c63e1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c6e1984e-a067-4646-88d5-9f97413c63e1', 'T25AP536', now(), now());

    -- Teacher: ALEENA K JOSEPH (T25MA570)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '34ae095f-0257-4219-8782-9d68eefc87fe', 'authenticated', 'authenticated', 't25ma570@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALEENA K JOSEPH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '34ae095f-0257-4219-8782-9d68eefc87fe', '34ae095f-0257-4219-8782-9d68eefc87fe', format('{"sub":"%s","email":"%s"}', '34ae095f-0257-4219-8782-9d68eefc87fe', 't25ma570@gmail.com')::jsonb, 'email', '34ae095f-0257-4219-8782-9d68eefc87fe', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('34ae095f-0257-4219-8782-9d68eefc87fe', 'ALEENA K JOSEPH', 't25ma570@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('34ae095f-0257-4219-8782-9d68eefc87fe', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('34ae095f-0257-4219-8782-9d68eefc87fe', 'T25MA570', now(), now());

    -- Teacher: ALEENA MEGHANATHEN (T26JN823)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ae3ad9e4-7920-45f0-ab53-3db7d85731fa', 'authenticated', 'authenticated', 't26jn823@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALEENA MEGHANATHEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ae3ad9e4-7920-45f0-ab53-3db7d85731fa', 'ae3ad9e4-7920-45f0-ab53-3db7d85731fa', format('{"sub":"%s","email":"%s"}', 'ae3ad9e4-7920-45f0-ab53-3db7d85731fa', 't26jn823@gmail.com')::jsonb, 'email', 'ae3ad9e4-7920-45f0-ab53-3db7d85731fa', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ae3ad9e4-7920-45f0-ab53-3db7d85731fa', 'ALEENA MEGHANATHEN', 't26jn823@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ae3ad9e4-7920-45f0-ab53-3db7d85731fa', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ae3ad9e4-7920-45f0-ab53-3db7d85731fa', 'T26JN823', now(), now());

    -- Teacher: ALEKHA K B (T26JN803)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd671f492-e176-4d46-987b-e2a58b87604d', 'authenticated', 'authenticated', 't26jn803@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALEKHA K B"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd671f492-e176-4d46-987b-e2a58b87604d', 'd671f492-e176-4d46-987b-e2a58b87604d', format('{"sub":"%s","email":"%s"}', 'd671f492-e176-4d46-987b-e2a58b87604d', 't26jn803@gmail.com')::jsonb, 'email', 'd671f492-e176-4d46-987b-e2a58b87604d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d671f492-e176-4d46-987b-e2a58b87604d', 'ALEKHA K B', 't26jn803@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d671f492-e176-4d46-987b-e2a58b87604d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d671f492-e176-4d46-987b-e2a58b87604d', 'T26JN803', now(), now());

    -- Teacher: ALISH SINGH (T25AP556)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '550e3eaa-6785-40d5-b5fa-6fb99aef3db6', 'authenticated', 'authenticated', 't25ap556@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALISH SINGH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '550e3eaa-6785-40d5-b5fa-6fb99aef3db6', '550e3eaa-6785-40d5-b5fa-6fb99aef3db6', format('{"sub":"%s","email":"%s"}', '550e3eaa-6785-40d5-b5fa-6fb99aef3db6', 't25ap556@gmail.com')::jsonb, 'email', '550e3eaa-6785-40d5-b5fa-6fb99aef3db6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('550e3eaa-6785-40d5-b5fa-6fb99aef3db6', 'ALISH SINGH', 't25ap556@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('550e3eaa-6785-40d5-b5fa-6fb99aef3db6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('550e3eaa-6785-40d5-b5fa-6fb99aef3db6', 'T25AP556', now(), now());

    -- Teacher: ALISHA (T25JU578)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '96f0f49d-a044-49a3-9b51-a283f7fb1d44', 'authenticated', 'authenticated', 't25ju578@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALISHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '96f0f49d-a044-49a3-9b51-a283f7fb1d44', '96f0f49d-a044-49a3-9b51-a283f7fb1d44', format('{"sub":"%s","email":"%s"}', '96f0f49d-a044-49a3-9b51-a283f7fb1d44', 't25ju578@gmail.com')::jsonb, 'email', '96f0f49d-a044-49a3-9b51-a283f7fb1d44', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('96f0f49d-a044-49a3-9b51-a283f7fb1d44', 'ALISHA', 't25ju578@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('96f0f49d-a044-49a3-9b51-a283f7fb1d44', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('96f0f49d-a044-49a3-9b51-a283f7fb1d44', 'T25JU578', now(), now());

    -- Teacher: ALKA (T25JU575)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '291eab6c-8c87-43e5-816f-3020f59cfab7', 'authenticated', 'authenticated', 't25ju575@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALKA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '291eab6c-8c87-43e5-816f-3020f59cfab7', '291eab6c-8c87-43e5-816f-3020f59cfab7', format('{"sub":"%s","email":"%s"}', '291eab6c-8c87-43e5-816f-3020f59cfab7', 't25ju575@gmail.com')::jsonb, 'email', '291eab6c-8c87-43e5-816f-3020f59cfab7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('291eab6c-8c87-43e5-816f-3020f59cfab7', 'ALKA', 't25ju575@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('291eab6c-8c87-43e5-816f-3020f59cfab7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('291eab6c-8c87-43e5-816f-3020f59cfab7', 'T25JU575', now(), now());

    -- Teacher: ALSWAFI MOOSA (T25SP688)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '49842188-6895-4602-9771-1155a04b8c23', 'authenticated', 'authenticated', 't25sp688@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALSWAFI MOOSA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '49842188-6895-4602-9771-1155a04b8c23', '49842188-6895-4602-9771-1155a04b8c23', format('{"sub":"%s","email":"%s"}', '49842188-6895-4602-9771-1155a04b8c23', 't25sp688@gmail.com')::jsonb, 'email', '49842188-6895-4602-9771-1155a04b8c23', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('49842188-6895-4602-9771-1155a04b8c23', 'ALSWAFI MOOSA', 't25sp688@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('49842188-6895-4602-9771-1155a04b8c23', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('49842188-6895-4602-9771-1155a04b8c23', 'T25SP688', now(), now());

    -- Teacher: ALTTA MARIYA (T25AP502)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1d8886bf-756d-49c9-9862-5968b6022505', 'authenticated', 'authenticated', 't25ap502@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALTTA MARIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1d8886bf-756d-49c9-9862-5968b6022505', '1d8886bf-756d-49c9-9862-5968b6022505', format('{"sub":"%s","email":"%s"}', '1d8886bf-756d-49c9-9862-5968b6022505', 't25ap502@gmail.com')::jsonb, 'email', '1d8886bf-756d-49c9-9862-5968b6022505', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1d8886bf-756d-49c9-9862-5968b6022505', 'ALTTA MARIYA', 't25ap502@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1d8886bf-756d-49c9-9862-5968b6022505', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1d8886bf-756d-49c9-9862-5968b6022505', 'T25AP502', now(), now());

    -- Teacher: ALVIN (T26FB832)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5020e406-e712-4858-8a70-b7e60b28ccaf', 'authenticated', 'authenticated', 't26fb832@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ALVIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5020e406-e712-4858-8a70-b7e60b28ccaf', '5020e406-e712-4858-8a70-b7e60b28ccaf', format('{"sub":"%s","email":"%s"}', '5020e406-e712-4858-8a70-b7e60b28ccaf', 't26fb832@gmail.com')::jsonb, 'email', '5020e406-e712-4858-8a70-b7e60b28ccaf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5020e406-e712-4858-8a70-b7e60b28ccaf', 'ALVIN', 't26fb832@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5020e406-e712-4858-8a70-b7e60b28ccaf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5020e406-e712-4858-8a70-b7e60b28ccaf', 'T26FB832', now(), now());

    -- Teacher: AMINA RIYA (T26JN826)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fe674e4b-2ccf-4341-935c-704be0a60570', 'authenticated', 'authenticated', 't26jn826@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AMINA RIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fe674e4b-2ccf-4341-935c-704be0a60570', 'fe674e4b-2ccf-4341-935c-704be0a60570', format('{"sub":"%s","email":"%s"}', 'fe674e4b-2ccf-4341-935c-704be0a60570', 't26jn826@gmail.com')::jsonb, 'email', 'fe674e4b-2ccf-4341-935c-704be0a60570', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fe674e4b-2ccf-4341-935c-704be0a60570', 'AMINA RIYA', 't26jn826@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fe674e4b-2ccf-4341-935c-704be0a60570', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fe674e4b-2ccf-4341-935c-704be0a60570', 'T26JN826', now(), now());

    -- Teacher: AMINA SAKKEER (T25NV738)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '00db92f5-6df1-4246-a273-42ab7a44aa57', 'authenticated', 'authenticated', 't25nv738@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AMINA SAKKEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '00db92f5-6df1-4246-a273-42ab7a44aa57', '00db92f5-6df1-4246-a273-42ab7a44aa57', format('{"sub":"%s","email":"%s"}', '00db92f5-6df1-4246-a273-42ab7a44aa57', 't25nv738@gmail.com')::jsonb, 'email', '00db92f5-6df1-4246-a273-42ab7a44aa57', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('00db92f5-6df1-4246-a273-42ab7a44aa57', 'AMINA SAKKEER', 't25nv738@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('00db92f5-6df1-4246-a273-42ab7a44aa57', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('00db92f5-6df1-4246-a273-42ab7a44aa57', 'T25NV738', now(), now());

    -- Teacher: AMITHA (T25AG639)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '84299055-1ba6-4992-a6ab-70d9e5cee96d', 'authenticated', 'authenticated', 't25ag639@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AMITHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '84299055-1ba6-4992-a6ab-70d9e5cee96d', '84299055-1ba6-4992-a6ab-70d9e5cee96d', format('{"sub":"%s","email":"%s"}', '84299055-1ba6-4992-a6ab-70d9e5cee96d', 't25ag639@gmail.com')::jsonb, 'email', '84299055-1ba6-4992-a6ab-70d9e5cee96d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('84299055-1ba6-4992-a6ab-70d9e5cee96d', 'AMITHA', 't25ag639@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('84299055-1ba6-4992-a6ab-70d9e5cee96d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('84299055-1ba6-4992-a6ab-70d9e5cee96d', 'T25AG639', now(), now());

    -- Teacher: AMJITHA S (T26FB849)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b22a705d-79cb-4c79-ad2e-fe27a8e41709', 'authenticated', 'authenticated', 't26fb849@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AMJITHA S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b22a705d-79cb-4c79-ad2e-fe27a8e41709', 'b22a705d-79cb-4c79-ad2e-fe27a8e41709', format('{"sub":"%s","email":"%s"}', 'b22a705d-79cb-4c79-ad2e-fe27a8e41709', 't26fb849@gmail.com')::jsonb, 'email', 'b22a705d-79cb-4c79-ad2e-fe27a8e41709', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b22a705d-79cb-4c79-ad2e-fe27a8e41709', 'AMJITHA S', 't26fb849@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b22a705d-79cb-4c79-ad2e-fe27a8e41709', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b22a705d-79cb-4c79-ad2e-fe27a8e41709', 'T26FB849', now(), now());

    -- Teacher: AMRITA MURALI (T24OC403)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '55c64525-838e-443b-a8a3-be08d9f4317e', 'authenticated', 'authenticated', 't24oc403@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AMRITA MURALI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '55c64525-838e-443b-a8a3-be08d9f4317e', '55c64525-838e-443b-a8a3-be08d9f4317e', format('{"sub":"%s","email":"%s"}', '55c64525-838e-443b-a8a3-be08d9f4317e', 't24oc403@gmail.com')::jsonb, 'email', '55c64525-838e-443b-a8a3-be08d9f4317e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('55c64525-838e-443b-a8a3-be08d9f4317e', 'AMRITA MURALI', 't24oc403@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('55c64525-838e-443b-a8a3-be08d9f4317e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('55c64525-838e-443b-a8a3-be08d9f4317e', 'T24OC403', now(), now());

    -- Teacher: ANAGHA K (T25JL607)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', 'authenticated', 'authenticated', 't25jl607@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANAGHA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', 'dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', format('{"sub":"%s","email":"%s"}', 'dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', 't25jl607@gmail.com')::jsonb, 'email', 'dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', 'ANAGHA K', 't25jl607@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dde9c86d-4f47-4cce-b97e-3d8bcf6253d3', 'T25JL607', now(), now());

    -- Teacher: ANAGHA ROSE THERESA (T25FB472)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '74f91c44-2791-48dc-86ad-46d2d622fd19', 'authenticated', 'authenticated', 't25fb472@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANAGHA ROSE THERESA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '74f91c44-2791-48dc-86ad-46d2d622fd19', '74f91c44-2791-48dc-86ad-46d2d622fd19', format('{"sub":"%s","email":"%s"}', '74f91c44-2791-48dc-86ad-46d2d622fd19', 't25fb472@gmail.com')::jsonb, 'email', '74f91c44-2791-48dc-86ad-46d2d622fd19', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('74f91c44-2791-48dc-86ad-46d2d622fd19', 'ANAGHA ROSE THERESA', 't25fb472@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('74f91c44-2791-48dc-86ad-46d2d622fd19', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('74f91c44-2791-48dc-86ad-46d2d622fd19', 'T25FB472', now(), now());

    -- Teacher: ANAN P ABBAS (T25SP660)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'da53c897-61b6-490c-ba95-c8e45c8f94c4', 'authenticated', 'authenticated', 't25sp660@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANAN P ABBAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'da53c897-61b6-490c-ba95-c8e45c8f94c4', 'da53c897-61b6-490c-ba95-c8e45c8f94c4', format('{"sub":"%s","email":"%s"}', 'da53c897-61b6-490c-ba95-c8e45c8f94c4', 't25sp660@gmail.com')::jsonb, 'email', 'da53c897-61b6-490c-ba95-c8e45c8f94c4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('da53c897-61b6-490c-ba95-c8e45c8f94c4', 'ANAN P ABBAS', 't25sp660@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('da53c897-61b6-490c-ba95-c8e45c8f94c4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('da53c897-61b6-490c-ba95-c8e45c8f94c4', 'T25SP660', now(), now());

    -- Teacher: ANEESHA (T24JL307)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7e26f1d7-5697-4c8e-9b11-79746cb70d2a', 'authenticated', 'authenticated', 't24jl307@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANEESHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7e26f1d7-5697-4c8e-9b11-79746cb70d2a', '7e26f1d7-5697-4c8e-9b11-79746cb70d2a', format('{"sub":"%s","email":"%s"}', '7e26f1d7-5697-4c8e-9b11-79746cb70d2a', 't24jl307@gmail.com')::jsonb, 'email', '7e26f1d7-5697-4c8e-9b11-79746cb70d2a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7e26f1d7-5697-4c8e-9b11-79746cb70d2a', 'ANEESHA', 't24jl307@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7e26f1d7-5697-4c8e-9b11-79746cb70d2a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7e26f1d7-5697-4c8e-9b11-79746cb70d2a', 'T24JL307', now(), now());

    -- Teacher: ANFAS (T25SP677)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a0ff08f3-6c04-423c-b8ec-c29cb94f1820', 'authenticated', 'authenticated', 't25sp677@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANFAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a0ff08f3-6c04-423c-b8ec-c29cb94f1820', 'a0ff08f3-6c04-423c-b8ec-c29cb94f1820', format('{"sub":"%s","email":"%s"}', 'a0ff08f3-6c04-423c-b8ec-c29cb94f1820', 't25sp677@gmail.com')::jsonb, 'email', 'a0ff08f3-6c04-423c-b8ec-c29cb94f1820', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a0ff08f3-6c04-423c-b8ec-c29cb94f1820', 'ANFAS', 't25sp677@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a0ff08f3-6c04-423c-b8ec-c29cb94f1820', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a0ff08f3-6c04-423c-b8ec-c29cb94f1820', 'T25SP677', now(), now());

    -- Teacher: ANGEL TREESA JOHN (T26FB854)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', 'authenticated', 'authenticated', 't26fb854@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANGEL TREESA JOHN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', 'b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', format('{"sub":"%s","email":"%s"}', 'b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', 't26fb854@gmail.com')::jsonb, 'email', 'b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', 'ANGEL TREESA JOHN', 't26fb854@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b6b3638a-1bb8-4a1f-aaa3-1cf128b03598', 'T26FB854', now(), now());

    -- Teacher: ANITA JOY (T25FB470)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1d84275f-9ddc-4d58-8272-74c12ed44385', 'authenticated', 'authenticated', 't25fb470@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANITA JOY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1d84275f-9ddc-4d58-8272-74c12ed44385', '1d84275f-9ddc-4d58-8272-74c12ed44385', format('{"sub":"%s","email":"%s"}', '1d84275f-9ddc-4d58-8272-74c12ed44385', 't25fb470@gmail.com')::jsonb, 'email', '1d84275f-9ddc-4d58-8272-74c12ed44385', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1d84275f-9ddc-4d58-8272-74c12ed44385', 'ANITA JOY', 't25fb470@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1d84275f-9ddc-4d58-8272-74c12ed44385', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1d84275f-9ddc-4d58-8272-74c12ed44385', 'T25FB470', now(), now());

    -- Teacher: ANJALA NIHAL (T25JL615)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0300ca81-1f03-4474-8611-9bd70ae27a33', 'authenticated', 'authenticated', 't25jl615@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJALA NIHAL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0300ca81-1f03-4474-8611-9bd70ae27a33', '0300ca81-1f03-4474-8611-9bd70ae27a33', format('{"sub":"%s","email":"%s"}', '0300ca81-1f03-4474-8611-9bd70ae27a33', 't25jl615@gmail.com')::jsonb, 'email', '0300ca81-1f03-4474-8611-9bd70ae27a33', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0300ca81-1f03-4474-8611-9bd70ae27a33', 'ANJALA NIHAL', 't25jl615@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0300ca81-1f03-4474-8611-9bd70ae27a33', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0300ca81-1f03-4474-8611-9bd70ae27a33', 'T25JL615', now(), now());

    -- Teacher: ANJALI (T24MA245)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '56917aca-00c9-4c19-86ad-494af674f991', 'authenticated', 'authenticated', 't24ma245@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJALI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '56917aca-00c9-4c19-86ad-494af674f991', '56917aca-00c9-4c19-86ad-494af674f991', format('{"sub":"%s","email":"%s"}', '56917aca-00c9-4c19-86ad-494af674f991', 't24ma245@gmail.com')::jsonb, 'email', '56917aca-00c9-4c19-86ad-494af674f991', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('56917aca-00c9-4c19-86ad-494af674f991', 'ANJALI', 't24ma245@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('56917aca-00c9-4c19-86ad-494af674f991', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('56917aca-00c9-4c19-86ad-494af674f991', 'T24MA245', now(), now());

    -- Teacher: ANJALI CS (T26FB833)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '341170ae-084a-4b81-a514-6a1de8107928', 'authenticated', 'authenticated', 't26fb833@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJALI CS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '341170ae-084a-4b81-a514-6a1de8107928', '341170ae-084a-4b81-a514-6a1de8107928', format('{"sub":"%s","email":"%s"}', '341170ae-084a-4b81-a514-6a1de8107928', 't26fb833@gmail.com')::jsonb, 'email', '341170ae-084a-4b81-a514-6a1de8107928', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('341170ae-084a-4b81-a514-6a1de8107928', 'ANJALI CS', 't26fb833@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('341170ae-084a-4b81-a514-6a1de8107928', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('341170ae-084a-4b81-a514-6a1de8107928', 'T26FB833', now(), now());

    -- Teacher: ANJALI P (T25JU584)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '01d2091c-2b40-4cc4-ade5-a2646c4aa50d', 'authenticated', 'authenticated', 't25ju584@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJALI P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '01d2091c-2b40-4cc4-ade5-a2646c4aa50d', '01d2091c-2b40-4cc4-ade5-a2646c4aa50d', format('{"sub":"%s","email":"%s"}', '01d2091c-2b40-4cc4-ade5-a2646c4aa50d', 't25ju584@gmail.com')::jsonb, 'email', '01d2091c-2b40-4cc4-ade5-a2646c4aa50d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('01d2091c-2b40-4cc4-ade5-a2646c4aa50d', 'ANJALI P', 't25ju584@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('01d2091c-2b40-4cc4-ade5-a2646c4aa50d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('01d2091c-2b40-4cc4-ade5-a2646c4aa50d', 'T25JU584', now(), now());

    -- Teacher: ANJANA CG (T25AP514)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '725d7e80-da07-4162-bc1b-bf721bd5406d', 'authenticated', 'authenticated', 't25ap514@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJANA CG"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '725d7e80-da07-4162-bc1b-bf721bd5406d', '725d7e80-da07-4162-bc1b-bf721bd5406d', format('{"sub":"%s","email":"%s"}', '725d7e80-da07-4162-bc1b-bf721bd5406d', 't25ap514@gmail.com')::jsonb, 'email', '725d7e80-da07-4162-bc1b-bf721bd5406d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('725d7e80-da07-4162-bc1b-bf721bd5406d', 'ANJANA CG', 't25ap514@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('725d7e80-da07-4162-bc1b-bf721bd5406d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('725d7e80-da07-4162-bc1b-bf721bd5406d', 'T25AP514', now(), now());

    -- Teacher: ANJANA PRANAV (T25AP523)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6295497b-df05-4f0a-8a66-a8f98c231c0b', 'authenticated', 'authenticated', 't25ap523@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJANA PRANAV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6295497b-df05-4f0a-8a66-a8f98c231c0b', '6295497b-df05-4f0a-8a66-a8f98c231c0b', format('{"sub":"%s","email":"%s"}', '6295497b-df05-4f0a-8a66-a8f98c231c0b', 't25ap523@gmail.com')::jsonb, 'email', '6295497b-df05-4f0a-8a66-a8f98c231c0b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6295497b-df05-4f0a-8a66-a8f98c231c0b', 'ANJANA PRANAV', 't25ap523@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6295497b-df05-4f0a-8a66-a8f98c231c0b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6295497b-df05-4f0a-8a66-a8f98c231c0b', 'T25AP523', now(), now());

    -- Teacher: ANJUMOL VARGHESE (T25MR494)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9530f873-04e3-499a-943e-e98dddfaf9f1', 'authenticated', 'authenticated', 't25mr494@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJUMOL VARGHESE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9530f873-04e3-499a-943e-e98dddfaf9f1', '9530f873-04e3-499a-943e-e98dddfaf9f1', format('{"sub":"%s","email":"%s"}', '9530f873-04e3-499a-943e-e98dddfaf9f1', 't25mr494@gmail.com')::jsonb, 'email', '9530f873-04e3-499a-943e-e98dddfaf9f1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9530f873-04e3-499a-943e-e98dddfaf9f1', 'ANJUMOL VARGHESE', 't25mr494@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9530f873-04e3-499a-943e-e98dddfaf9f1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9530f873-04e3-499a-943e-e98dddfaf9f1', 'T25MR494', now(), now());

    -- Teacher: ANJUSHA B (T24SP365)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c52c64b9-6e0f-4574-8380-d4856966ed66', 'authenticated', 'authenticated', 't24sp365@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANJUSHA B"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c52c64b9-6e0f-4574-8380-d4856966ed66', 'c52c64b9-6e0f-4574-8380-d4856966ed66', format('{"sub":"%s","email":"%s"}', 'c52c64b9-6e0f-4574-8380-d4856966ed66', 't24sp365@gmail.com')::jsonb, 'email', 'c52c64b9-6e0f-4574-8380-d4856966ed66', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c52c64b9-6e0f-4574-8380-d4856966ed66', 'ANJUSHA B', 't24sp365@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c52c64b9-6e0f-4574-8380-d4856966ed66', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c52c64b9-6e0f-4574-8380-d4856966ed66', 'T24SP365', now(), now());

    -- Teacher: ANN MARIA (T25JL613)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c7deff4c-7639-4916-91fa-b8b0d5b5e602', 'authenticated', 'authenticated', 't25jl613@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANN MARIA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c7deff4c-7639-4916-91fa-b8b0d5b5e602', 'c7deff4c-7639-4916-91fa-b8b0d5b5e602', format('{"sub":"%s","email":"%s"}', 'c7deff4c-7639-4916-91fa-b8b0d5b5e602', 't25jl613@gmail.com')::jsonb, 'email', 'c7deff4c-7639-4916-91fa-b8b0d5b5e602', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c7deff4c-7639-4916-91fa-b8b0d5b5e602', 'ANN MARIA', 't25jl613@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c7deff4c-7639-4916-91fa-b8b0d5b5e602', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c7deff4c-7639-4916-91fa-b8b0d5b5e602', 'T25JL613', now(), now());

    -- Teacher: ANNA MARIYA PETER (T25AG625)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dc6fc97d-fdd5-4523-9cf0-57298df5b58b', 'authenticated', 'authenticated', 't25ag625@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANNA MARIYA PETER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dc6fc97d-fdd5-4523-9cf0-57298df5b58b', 'dc6fc97d-fdd5-4523-9cf0-57298df5b58b', format('{"sub":"%s","email":"%s"}', 'dc6fc97d-fdd5-4523-9cf0-57298df5b58b', 't25ag625@gmail.com')::jsonb, 'email', 'dc6fc97d-fdd5-4523-9cf0-57298df5b58b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dc6fc97d-fdd5-4523-9cf0-57298df5b58b', 'ANNA MARIYA PETER', 't25ag625@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dc6fc97d-fdd5-4523-9cf0-57298df5b58b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dc6fc97d-fdd5-4523-9cf0-57298df5b58b', 'T25AG625', now(), now());

    -- Teacher: ANSHIDA (T23OC63)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '36ff5c88-5b01-4112-83ea-b16ee258ec53', 'authenticated', 'authenticated', 't23oc63@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANSHIDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '36ff5c88-5b01-4112-83ea-b16ee258ec53', '36ff5c88-5b01-4112-83ea-b16ee258ec53', format('{"sub":"%s","email":"%s"}', '36ff5c88-5b01-4112-83ea-b16ee258ec53', 't23oc63@gmail.com')::jsonb, 'email', '36ff5c88-5b01-4112-83ea-b16ee258ec53', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('36ff5c88-5b01-4112-83ea-b16ee258ec53', 'ANSHIDA', 't23oc63@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('36ff5c88-5b01-4112-83ea-b16ee258ec53', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('36ff5c88-5b01-4112-83ea-b16ee258ec53', 'T23OC63', now(), now());

    -- Teacher: ANSHIDA P (T25SP673)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '26ca539c-05cf-44fc-85a8-79571e9badea', 'authenticated', 'authenticated', 't25sp673@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANSHIDA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '26ca539c-05cf-44fc-85a8-79571e9badea', '26ca539c-05cf-44fc-85a8-79571e9badea', format('{"sub":"%s","email":"%s"}', '26ca539c-05cf-44fc-85a8-79571e9badea', 't25sp673@gmail.com')::jsonb, 'email', '26ca539c-05cf-44fc-85a8-79571e9badea', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('26ca539c-05cf-44fc-85a8-79571e9badea', 'ANSHIDA P', 't25sp673@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('26ca539c-05cf-44fc-85a8-79571e9badea', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('26ca539c-05cf-44fc-85a8-79571e9badea', 'T25SP673', now(), now());

    -- Teacher: ANSHIDA SAFWAN (T25DC783)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '702ca0f2-732a-411b-b43f-8ef885e0558a', 'authenticated', 'authenticated', 't25dc783@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANSHIDA SAFWAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '702ca0f2-732a-411b-b43f-8ef885e0558a', '702ca0f2-732a-411b-b43f-8ef885e0558a', format('{"sub":"%s","email":"%s"}', '702ca0f2-732a-411b-b43f-8ef885e0558a', 't25dc783@gmail.com')::jsonb, 'email', '702ca0f2-732a-411b-b43f-8ef885e0558a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('702ca0f2-732a-411b-b43f-8ef885e0558a', 'ANSHIDA SAFWAN', 't25dc783@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('702ca0f2-732a-411b-b43f-8ef885e0558a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('702ca0f2-732a-411b-b43f-8ef885e0558a', 'T25DC783', now(), now());

    -- Teacher: ANSILA ASLAM (T26FB841)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e43000ec-e00a-4c96-bb07-9c655bd357a6', 'authenticated', 'authenticated', 't26fb841@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANSILA ASLAM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e43000ec-e00a-4c96-bb07-9c655bd357a6', 'e43000ec-e00a-4c96-bb07-9c655bd357a6', format('{"sub":"%s","email":"%s"}', 'e43000ec-e00a-4c96-bb07-9c655bd357a6', 't26fb841@gmail.com')::jsonb, 'email', 'e43000ec-e00a-4c96-bb07-9c655bd357a6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e43000ec-e00a-4c96-bb07-9c655bd357a6', 'ANSILA ASLAM', 't26fb841@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e43000ec-e00a-4c96-bb07-9c655bd357a6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e43000ec-e00a-4c96-bb07-9c655bd357a6', 'T26FB841', now(), now());

    -- Teacher: ANSIYA E (T25JN448)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dd42c767-425f-4c01-9105-c2246f7cbf4f', 'authenticated', 'authenticated', 't25jn448@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANSIYA E"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dd42c767-425f-4c01-9105-c2246f7cbf4f', 'dd42c767-425f-4c01-9105-c2246f7cbf4f', format('{"sub":"%s","email":"%s"}', 'dd42c767-425f-4c01-9105-c2246f7cbf4f', 't25jn448@gmail.com')::jsonb, 'email', 'dd42c767-425f-4c01-9105-c2246f7cbf4f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dd42c767-425f-4c01-9105-c2246f7cbf4f', 'ANSIYA E', 't25jn448@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dd42c767-425f-4c01-9105-c2246f7cbf4f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dd42c767-425f-4c01-9105-c2246f7cbf4f', 'T25JN448', now(), now());

    -- Teacher: ANU KURIAN (T26FB842)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a9414ec3-a5c2-4adf-af1c-446b22568fac', 'authenticated', 'authenticated', 't26fb842@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANU KURIAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a9414ec3-a5c2-4adf-af1c-446b22568fac', 'a9414ec3-a5c2-4adf-af1c-446b22568fac', format('{"sub":"%s","email":"%s"}', 'a9414ec3-a5c2-4adf-af1c-446b22568fac', 't26fb842@gmail.com')::jsonb, 'email', 'a9414ec3-a5c2-4adf-af1c-446b22568fac', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a9414ec3-a5c2-4adf-af1c-446b22568fac', 'ANU KURIAN', 't26fb842@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a9414ec3-a5c2-4adf-af1c-446b22568fac', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a9414ec3-a5c2-4adf-af1c-446b22568fac', 'T26FB842', now(), now());

    -- Teacher: ANU MARIA (T24SP356)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f5f17db1-2f43-4803-a976-3f7d03a30155', 'authenticated', 'authenticated', 't24sp356@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANU MARIA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f5f17db1-2f43-4803-a976-3f7d03a30155', 'f5f17db1-2f43-4803-a976-3f7d03a30155', format('{"sub":"%s","email":"%s"}', 'f5f17db1-2f43-4803-a976-3f7d03a30155', 't24sp356@gmail.com')::jsonb, 'email', 'f5f17db1-2f43-4803-a976-3f7d03a30155', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f5f17db1-2f43-4803-a976-3f7d03a30155', 'ANU MARIA', 't24sp356@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f5f17db1-2f43-4803-a976-3f7d03a30155', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f5f17db1-2f43-4803-a976-3f7d03a30155', 'T24SP356', now(), now());

    -- Teacher: ANUGRAHA JOSHY P (T25AP548)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '717027ac-6971-4963-a466-3573995838c4', 'authenticated', 'authenticated', 't25ap548@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUGRAHA JOSHY P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '717027ac-6971-4963-a466-3573995838c4', '717027ac-6971-4963-a466-3573995838c4', format('{"sub":"%s","email":"%s"}', '717027ac-6971-4963-a466-3573995838c4', 't25ap548@gmail.com')::jsonb, 'email', '717027ac-6971-4963-a466-3573995838c4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('717027ac-6971-4963-a466-3573995838c4', 'ANUGRAHA JOSHY P', 't25ap548@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('717027ac-6971-4963-a466-3573995838c4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('717027ac-6971-4963-a466-3573995838c4', 'T25AP548', now(), now());

    -- Teacher: ANUJA (T25OC724)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a73f8180-df26-43ef-8fb5-b6c562c6ee05', 'authenticated', 'authenticated', 't25oc724@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUJA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a73f8180-df26-43ef-8fb5-b6c562c6ee05', 'a73f8180-df26-43ef-8fb5-b6c562c6ee05', format('{"sub":"%s","email":"%s"}', 'a73f8180-df26-43ef-8fb5-b6c562c6ee05', 't25oc724@gmail.com')::jsonb, 'email', 'a73f8180-df26-43ef-8fb5-b6c562c6ee05', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a73f8180-df26-43ef-8fb5-b6c562c6ee05', 'ANUJA', 't25oc724@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a73f8180-df26-43ef-8fb5-b6c562c6ee05', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a73f8180-df26-43ef-8fb5-b6c562c6ee05', 'T25OC724', now(), now());

    -- Teacher: ANUPRIYA (T25JL597)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '79dfc5e9-a714-4cec-b90c-502dbd47395e', 'authenticated', 'authenticated', 't25jl597@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUPRIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '79dfc5e9-a714-4cec-b90c-502dbd47395e', '79dfc5e9-a714-4cec-b90c-502dbd47395e', format('{"sub":"%s","email":"%s"}', '79dfc5e9-a714-4cec-b90c-502dbd47395e', 't25jl597@gmail.com')::jsonb, 'email', '79dfc5e9-a714-4cec-b90c-502dbd47395e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('79dfc5e9-a714-4cec-b90c-502dbd47395e', 'ANUPRIYA', 't25jl597@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('79dfc5e9-a714-4cec-b90c-502dbd47395e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('79dfc5e9-a714-4cec-b90c-502dbd47395e', 'T25JL597', now(), now());

    -- Teacher: ANUSREE (T25AG633)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'afd24466-56d1-488d-a0c5-06ec2f53966c', 'authenticated', 'authenticated', 't25ag633@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUSREE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'afd24466-56d1-488d-a0c5-06ec2f53966c', 'afd24466-56d1-488d-a0c5-06ec2f53966c', format('{"sub":"%s","email":"%s"}', 'afd24466-56d1-488d-a0c5-06ec2f53966c', 't25ag633@gmail.com')::jsonb, 'email', 'afd24466-56d1-488d-a0c5-06ec2f53966c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('afd24466-56d1-488d-a0c5-06ec2f53966c', 'ANUSREE', 't25ag633@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('afd24466-56d1-488d-a0c5-06ec2f53966c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('afd24466-56d1-488d-a0c5-06ec2f53966c', 'T25AG633', now(), now());

    -- Teacher: ANUSREE AJAYKUMAR (T25AP525)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '91a0a638-abde-4896-8c02-247008f94ae8', 'authenticated', 'authenticated', 't25ap525@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUSREE AJAYKUMAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '91a0a638-abde-4896-8c02-247008f94ae8', '91a0a638-abde-4896-8c02-247008f94ae8', format('{"sub":"%s","email":"%s"}', '91a0a638-abde-4896-8c02-247008f94ae8', 't25ap525@gmail.com')::jsonb, 'email', '91a0a638-abde-4896-8c02-247008f94ae8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('91a0a638-abde-4896-8c02-247008f94ae8', 'ANUSREE AJAYKUMAR', 't25ap525@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('91a0a638-abde-4896-8c02-247008f94ae8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('91a0a638-abde-4896-8c02-247008f94ae8', 'T25AP525', now(), now());

    -- Teacher: ANUSREE MV (T26JN807)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', 'authenticated', 'authenticated', 't26jn807@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUSREE MV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', '6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', format('{"sub":"%s","email":"%s"}', '6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', 't26jn807@gmail.com')::jsonb, 'email', '6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', 'ANUSREE MV', 't26jn807@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6bf41e8a-c299-4d9c-bb48-d9a07c5071fc', 'T26JN807', now(), now());

    -- Teacher: ANUSREE P (T24AG343)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2bc124b1-0938-4e9c-8980-003dd5400d80', 'authenticated', 'authenticated', 't24ag343@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ANUSREE P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2bc124b1-0938-4e9c-8980-003dd5400d80', '2bc124b1-0938-4e9c-8980-003dd5400d80', format('{"sub":"%s","email":"%s"}', '2bc124b1-0938-4e9c-8980-003dd5400d80', 't24ag343@gmail.com')::jsonb, 'email', '2bc124b1-0938-4e9c-8980-003dd5400d80', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2bc124b1-0938-4e9c-8980-003dd5400d80', 'ANUSREE P', 't24ag343@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2bc124b1-0938-4e9c-8980-003dd5400d80', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2bc124b1-0938-4e9c-8980-003dd5400d80', 'T24AG343', now(), now());

    -- Teacher: APARNA (T23NV97)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6787b7de-d3bf-4078-a6a1-291539d12039', 'authenticated', 'authenticated', 't23nv97@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"APARNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6787b7de-d3bf-4078-a6a1-291539d12039', '6787b7de-d3bf-4078-a6a1-291539d12039', format('{"sub":"%s","email":"%s"}', '6787b7de-d3bf-4078-a6a1-291539d12039', 't23nv97@gmail.com')::jsonb, 'email', '6787b7de-d3bf-4078-a6a1-291539d12039', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6787b7de-d3bf-4078-a6a1-291539d12039', 'APARNA', 't23nv97@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6787b7de-d3bf-4078-a6a1-291539d12039', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6787b7de-d3bf-4078-a6a1-291539d12039', 'T23NV97', now(), now());

    -- Teacher: APARNA A (T24AG329)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b1e28ac0-7115-40f3-8360-e72c8d4a189b', 'authenticated', 'authenticated', 't24ag329@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"APARNA A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b1e28ac0-7115-40f3-8360-e72c8d4a189b', 'b1e28ac0-7115-40f3-8360-e72c8d4a189b', format('{"sub":"%s","email":"%s"}', 'b1e28ac0-7115-40f3-8360-e72c8d4a189b', 't24ag329@gmail.com')::jsonb, 'email', 'b1e28ac0-7115-40f3-8360-e72c8d4a189b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b1e28ac0-7115-40f3-8360-e72c8d4a189b', 'APARNA A', 't24ag329@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b1e28ac0-7115-40f3-8360-e72c8d4a189b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b1e28ac0-7115-40f3-8360-e72c8d4a189b', 'T24AG329', now(), now());

    -- Teacher: APARNA ROSE (T24AG345)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8adef540-f844-4779-bb07-b20982202309', 'authenticated', 'authenticated', 't24ag345@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"APARNA ROSE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8adef540-f844-4779-bb07-b20982202309', '8adef540-f844-4779-bb07-b20982202309', format('{"sub":"%s","email":"%s"}', '8adef540-f844-4779-bb07-b20982202309', 't24ag345@gmail.com')::jsonb, 'email', '8adef540-f844-4779-bb07-b20982202309', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8adef540-f844-4779-bb07-b20982202309', 'APARNA ROSE', 't24ag345@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8adef540-f844-4779-bb07-b20982202309', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8adef540-f844-4779-bb07-b20982202309', 'T24AG345', now(), now());

    -- Teacher: ARATHY VB (T26FB831)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '77fa4732-17f6-4d26-8195-3c96ad2501ed', 'authenticated', 'authenticated', 't26fb831@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARATHY VB"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '77fa4732-17f6-4d26-8195-3c96ad2501ed', '77fa4732-17f6-4d26-8195-3c96ad2501ed', format('{"sub":"%s","email":"%s"}', '77fa4732-17f6-4d26-8195-3c96ad2501ed', 't26fb831@gmail.com')::jsonb, 'email', '77fa4732-17f6-4d26-8195-3c96ad2501ed', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('77fa4732-17f6-4d26-8195-3c96ad2501ed', 'ARATHY VB', 't26fb831@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('77fa4732-17f6-4d26-8195-3c96ad2501ed', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('77fa4732-17f6-4d26-8195-3c96ad2501ed', 'T26FB831', now(), now());

    -- Teacher: ARCHANA MANOJ (T25AP526)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9be84a92-5d0c-438a-a752-22bc498b1d79', 'authenticated', 'authenticated', 't25ap526@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARCHANA MANOJ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9be84a92-5d0c-438a-a752-22bc498b1d79', '9be84a92-5d0c-438a-a752-22bc498b1d79', format('{"sub":"%s","email":"%s"}', '9be84a92-5d0c-438a-a752-22bc498b1d79', 't25ap526@gmail.com')::jsonb, 'email', '9be84a92-5d0c-438a-a752-22bc498b1d79', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9be84a92-5d0c-438a-a752-22bc498b1d79', 'ARCHANA MANOJ', 't25ap526@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9be84a92-5d0c-438a-a752-22bc498b1d79', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9be84a92-5d0c-438a-a752-22bc498b1d79', 'T25AP526', now(), now());

    -- Teacher: ARJUN MELATH (T24AG341)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '99ef5956-0563-40e0-bdee-cb997566be31', 'authenticated', 'authenticated', 't24ag341@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARJUN MELATH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '99ef5956-0563-40e0-bdee-cb997566be31', '99ef5956-0563-40e0-bdee-cb997566be31', format('{"sub":"%s","email":"%s"}', '99ef5956-0563-40e0-bdee-cb997566be31', 't24ag341@gmail.com')::jsonb, 'email', '99ef5956-0563-40e0-bdee-cb997566be31', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('99ef5956-0563-40e0-bdee-cb997566be31', 'ARJUN MELATH', 't24ag341@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('99ef5956-0563-40e0-bdee-cb997566be31', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('99ef5956-0563-40e0-bdee-cb997566be31', 'T24AG341', now(), now());

    -- Teacher: ARSEENA (T25JL600)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '37efdd22-da29-4666-a896-0ed564e212c0', 'authenticated', 'authenticated', 't25jl600@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARSEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '37efdd22-da29-4666-a896-0ed564e212c0', '37efdd22-da29-4666-a896-0ed564e212c0', format('{"sub":"%s","email":"%s"}', '37efdd22-da29-4666-a896-0ed564e212c0', 't25jl600@gmail.com')::jsonb, 'email', '37efdd22-da29-4666-a896-0ed564e212c0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('37efdd22-da29-4666-a896-0ed564e212c0', 'ARSEENA', 't25jl600@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('37efdd22-da29-4666-a896-0ed564e212c0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('37efdd22-da29-4666-a896-0ed564e212c0', 'T25JL600', now(), now());

    -- Teacher: ARSHINA (T24AP198)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cda03776-70d2-440d-a1a8-e7388bf63a90', 'authenticated', 'authenticated', 't24ap198@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARSHINA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cda03776-70d2-440d-a1a8-e7388bf63a90', 'cda03776-70d2-440d-a1a8-e7388bf63a90', format('{"sub":"%s","email":"%s"}', 'cda03776-70d2-440d-a1a8-e7388bf63a90', 't24ap198@gmail.com')::jsonb, 'email', 'cda03776-70d2-440d-a1a8-e7388bf63a90', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cda03776-70d2-440d-a1a8-e7388bf63a90', 'ARSHINA', 't24ap198@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cda03776-70d2-440d-a1a8-e7388bf63a90', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cda03776-70d2-440d-a1a8-e7388bf63a90', 'T24AP198', now(), now());

    -- Teacher: ARUNIMA RAJESH (T25JN439)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', 'authenticated', 'authenticated', 't25jn439@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARUNIMA RAJESH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', '7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', format('{"sub":"%s","email":"%s"}', '7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', 't25jn439@gmail.com')::jsonb, 'email', '7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', 'ARUNIMA RAJESH', 't25jn439@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7e5df249-4c81-44ab-bac1-00ed3fd7fb8c', 'T25JN439', now(), now());

    -- Teacher: ARWA JASMIN MANSOOR (T26JN818)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '050ee32f-7fb8-4f24-90aa-2a23401c5d6b', 'authenticated', 'authenticated', 't26jn818@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARWA JASMIN MANSOOR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '050ee32f-7fb8-4f24-90aa-2a23401c5d6b', '050ee32f-7fb8-4f24-90aa-2a23401c5d6b', format('{"sub":"%s","email":"%s"}', '050ee32f-7fb8-4f24-90aa-2a23401c5d6b', 't26jn818@gmail.com')::jsonb, 'email', '050ee32f-7fb8-4f24-90aa-2a23401c5d6b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('050ee32f-7fb8-4f24-90aa-2a23401c5d6b', 'ARWA JASMIN MANSOOR', 't26jn818@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('050ee32f-7fb8-4f24-90aa-2a23401c5d6b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('050ee32f-7fb8-4f24-90aa-2a23401c5d6b', 'T26JN818', now(), now());

    -- Teacher: ARYA B G (T25AP500)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', 'authenticated', 'authenticated', 't25ap500@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARYA B G"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', '4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', format('{"sub":"%s","email":"%s"}', '4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', 't25ap500@gmail.com')::jsonb, 'email', '4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', 'ARYA B G', 't25ap500@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4f0c002a-cedd-4abf-b1d0-968f7dcdcc37', 'T25AP500', now(), now());

    -- Teacher: ASFA FATHIMA (T26JN819)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', 'authenticated', 'authenticated', 't26jn819@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASFA FATHIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', 'f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', format('{"sub":"%s","email":"%s"}', 'f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', 't26jn819@gmail.com')::jsonb, 'email', 'f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', 'ASFA FATHIMA', 't26jn819@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f68cbe35-bdb3-4a9e-85ad-0212ce5b8879', 'T26JN819', now(), now());

    -- Teacher: ASHIKHA.P (T25AP505)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '78a30ae1-75d0-4a1d-a438-f6f4ea406992', 'authenticated', 'authenticated', 't25ap505@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASHIKHA.P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '78a30ae1-75d0-4a1d-a438-f6f4ea406992', '78a30ae1-75d0-4a1d-a438-f6f4ea406992', format('{"sub":"%s","email":"%s"}', '78a30ae1-75d0-4a1d-a438-f6f4ea406992', 't25ap505@gmail.com')::jsonb, 'email', '78a30ae1-75d0-4a1d-a438-f6f4ea406992', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('78a30ae1-75d0-4a1d-a438-f6f4ea406992', 'ASHIKHA.P', 't25ap505@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('78a30ae1-75d0-4a1d-a438-f6f4ea406992', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('78a30ae1-75d0-4a1d-a438-f6f4ea406992', 'T25AP505', now(), now());

    -- Teacher: ASHMEELA SHEMEEN (T25OC713)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '13c34832-a96a-4f05-a567-08c8cf81e76b', 'authenticated', 'authenticated', 't25oc713@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASHMEELA SHEMEEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '13c34832-a96a-4f05-a567-08c8cf81e76b', '13c34832-a96a-4f05-a567-08c8cf81e76b', format('{"sub":"%s","email":"%s"}', '13c34832-a96a-4f05-a567-08c8cf81e76b', 't25oc713@gmail.com')::jsonb, 'email', '13c34832-a96a-4f05-a567-08c8cf81e76b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('13c34832-a96a-4f05-a567-08c8cf81e76b', 'ASHMEELA SHEMEEN', 't25oc713@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('13c34832-a96a-4f05-a567-08c8cf81e76b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('13c34832-a96a-4f05-a567-08c8cf81e76b', 'T25OC713', now(), now());

    -- Teacher: ASIYA SHERIN (T25SP678)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b9223060-1fe5-4e70-bb3e-40300b8ebd1c', 'authenticated', 'authenticated', 't25sp678@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASIYA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b9223060-1fe5-4e70-bb3e-40300b8ebd1c', 'b9223060-1fe5-4e70-bb3e-40300b8ebd1c', format('{"sub":"%s","email":"%s"}', 'b9223060-1fe5-4e70-bb3e-40300b8ebd1c', 't25sp678@gmail.com')::jsonb, 'email', 'b9223060-1fe5-4e70-bb3e-40300b8ebd1c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b9223060-1fe5-4e70-bb3e-40300b8ebd1c', 'ASIYA SHERIN', 't25sp678@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b9223060-1fe5-4e70-bb3e-40300b8ebd1c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b9223060-1fe5-4e70-bb3e-40300b8ebd1c', 'T25SP678', now(), now());

    -- Teacher: ASIYASHIFA N (T26FB847)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5ca9a277-b69c-452a-a2da-545527614a37', 'authenticated', 'authenticated', 't26fb847@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASIYASHIFA N"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5ca9a277-b69c-452a-a2da-545527614a37', '5ca9a277-b69c-452a-a2da-545527614a37', format('{"sub":"%s","email":"%s"}', '5ca9a277-b69c-452a-a2da-545527614a37', 't26fb847@gmail.com')::jsonb, 'email', '5ca9a277-b69c-452a-a2da-545527614a37', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5ca9a277-b69c-452a-a2da-545527614a37', 'ASIYASHIFA N', 't26fb847@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5ca9a277-b69c-452a-a2da-545527614a37', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5ca9a277-b69c-452a-a2da-545527614a37', 'T26FB847', now(), now());

    -- Teacher: ASLA (T25SP680)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '02e247fb-bac0-45e6-b857-c96e3ce8766e', 'authenticated', 'authenticated', 't25sp680@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '02e247fb-bac0-45e6-b857-c96e3ce8766e', '02e247fb-bac0-45e6-b857-c96e3ce8766e', format('{"sub":"%s","email":"%s"}', '02e247fb-bac0-45e6-b857-c96e3ce8766e', 't25sp680@gmail.com')::jsonb, 'email', '02e247fb-bac0-45e6-b857-c96e3ce8766e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('02e247fb-bac0-45e6-b857-c96e3ce8766e', 'ASLA', 't25sp680@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('02e247fb-bac0-45e6-b857-c96e3ce8766e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('02e247fb-bac0-45e6-b857-c96e3ce8766e', 'T25SP680', now(), now());

    -- Teacher: ASLAHA SHERIN (T25OC722)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '832053e0-8cd4-4bd6-9618-8790f22dce4e', 'authenticated', 'authenticated', 't25oc722@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASLAHA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '832053e0-8cd4-4bd6-9618-8790f22dce4e', '832053e0-8cd4-4bd6-9618-8790f22dce4e', format('{"sub":"%s","email":"%s"}', '832053e0-8cd4-4bd6-9618-8790f22dce4e', 't25oc722@gmail.com')::jsonb, 'email', '832053e0-8cd4-4bd6-9618-8790f22dce4e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('832053e0-8cd4-4bd6-9618-8790f22dce4e', 'ASLAHA SHERIN', 't25oc722@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('832053e0-8cd4-4bd6-9618-8790f22dce4e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('832053e0-8cd4-4bd6-9618-8790f22dce4e', 'T25OC722', now(), now());

    -- Teacher: ASNA (T25JU574)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '53ec23a8-1a09-4293-8932-d41c9751d587', 'authenticated', 'authenticated', 't25ju574@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '53ec23a8-1a09-4293-8932-d41c9751d587', '53ec23a8-1a09-4293-8932-d41c9751d587', format('{"sub":"%s","email":"%s"}', '53ec23a8-1a09-4293-8932-d41c9751d587', 't25ju574@gmail.com')::jsonb, 'email', '53ec23a8-1a09-4293-8932-d41c9751d587', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('53ec23a8-1a09-4293-8932-d41c9751d587', 'ASNA', 't25ju574@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('53ec23a8-1a09-4293-8932-d41c9751d587', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('53ec23a8-1a09-4293-8932-d41c9751d587', 'T25JU574', now(), now());

    -- Teacher: ASNA P SHAJI (T25NV743)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', 'authenticated', 'authenticated', 't25nv743@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASNA P SHAJI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', 'e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', format('{"sub":"%s","email":"%s"}', 'e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', 't25nv743@gmail.com')::jsonb, 'email', 'e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', 'ASNA P SHAJI', 't25nv743@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e7e0a22c-79c8-48ea-be15-5f9a3a61b37b', 'T25NV743', now(), now());

    -- Teacher: ASWATHI K A (T25FB484)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '725c8c3f-116e-4ebb-8d51-0e841d303776', 'authenticated', 'authenticated', 't25fb484@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASWATHI K A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '725c8c3f-116e-4ebb-8d51-0e841d303776', '725c8c3f-116e-4ebb-8d51-0e841d303776', format('{"sub":"%s","email":"%s"}', '725c8c3f-116e-4ebb-8d51-0e841d303776', 't25fb484@gmail.com')::jsonb, 'email', '725c8c3f-116e-4ebb-8d51-0e841d303776', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('725c8c3f-116e-4ebb-8d51-0e841d303776', 'ASWATHI K A', 't25fb484@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('725c8c3f-116e-4ebb-8d51-0e841d303776', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('725c8c3f-116e-4ebb-8d51-0e841d303776', 'T25FB484', now(), now());

    -- Teacher: ASWATHI VAYATT (T25FB483)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'eb10a191-310a-439b-ada6-e068c5b7df9d', 'authenticated', 'authenticated', 't25fb483@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASWATHI VAYATT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'eb10a191-310a-439b-ada6-e068c5b7df9d', 'eb10a191-310a-439b-ada6-e068c5b7df9d', format('{"sub":"%s","email":"%s"}', 'eb10a191-310a-439b-ada6-e068c5b7df9d', 't25fb483@gmail.com')::jsonb, 'email', 'eb10a191-310a-439b-ada6-e068c5b7df9d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('eb10a191-310a-439b-ada6-e068c5b7df9d', 'ASWATHI VAYATT', 't25fb483@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('eb10a191-310a-439b-ada6-e068c5b7df9d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('eb10a191-310a-439b-ada6-e068c5b7df9d', 'T25FB483', now(), now());

    -- Teacher: ASWATHY K TENSO (T25JU606)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2c088364-c394-4722-b112-e25346f4aa04', 'authenticated', 'authenticated', 't25ju606@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASWATHY K TENSO"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2c088364-c394-4722-b112-e25346f4aa04', '2c088364-c394-4722-b112-e25346f4aa04', format('{"sub":"%s","email":"%s"}', '2c088364-c394-4722-b112-e25346f4aa04', 't25ju606@gmail.com')::jsonb, 'email', '2c088364-c394-4722-b112-e25346f4aa04', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2c088364-c394-4722-b112-e25346f4aa04', 'ASWATHY K TENSO', 't25ju606@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2c088364-c394-4722-b112-e25346f4aa04', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2c088364-c394-4722-b112-e25346f4aa04', 'T25JU606', now(), now());

    -- Teacher: ASWATHY M S (T26JN798)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c5daedd5-fba5-43b5-bd71-48542af5a1a6', 'authenticated', 'authenticated', 't26jn798@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASWATHY M S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c5daedd5-fba5-43b5-bd71-48542af5a1a6', 'c5daedd5-fba5-43b5-bd71-48542af5a1a6', format('{"sub":"%s","email":"%s"}', 'c5daedd5-fba5-43b5-bd71-48542af5a1a6', 't26jn798@gmail.com')::jsonb, 'email', 'c5daedd5-fba5-43b5-bd71-48542af5a1a6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c5daedd5-fba5-43b5-bd71-48542af5a1a6', 'ASWATHY M S', 't26jn798@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c5daedd5-fba5-43b5-bd71-48542af5a1a6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c5daedd5-fba5-43b5-bd71-48542af5a1a6', 'T26JN798', now(), now());

    -- Teacher: ASWATHY M VINOD (T25AG640)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e720c40d-404a-437f-a736-7d7da8867988', 'authenticated', 'authenticated', 't25ag640@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASWATHY M VINOD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e720c40d-404a-437f-a736-7d7da8867988', 'e720c40d-404a-437f-a736-7d7da8867988', format('{"sub":"%s","email":"%s"}', 'e720c40d-404a-437f-a736-7d7da8867988', 't25ag640@gmail.com')::jsonb, 'email', 'e720c40d-404a-437f-a736-7d7da8867988', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e720c40d-404a-437f-a736-7d7da8867988', 'ASWATHY M VINOD', 't25ag640@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e720c40d-404a-437f-a736-7d7da8867988', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e720c40d-404a-437f-a736-7d7da8867988', 'T25AG640', now(), now());

    -- Teacher: ASWATHY SUMESH (T24AG337)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', 'authenticated', 'authenticated', 't24ag337@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ASWATHY SUMESH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', 'fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', format('{"sub":"%s","email":"%s"}', 'fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', 't24ag337@gmail.com')::jsonb, 'email', 'fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', 'ASWATHY SUMESH', 't24ag337@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fcb1afe9-a95d-4405-9fed-df1b3b83dc3c', 'T24AG337', now(), now());

    -- Teacher: ATHIRA J (T25NV770)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', 'authenticated', 'authenticated', 't25nv770@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ATHIRA J"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', '8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', format('{"sub":"%s","email":"%s"}', '8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', 't25nv770@gmail.com')::jsonb, 'email', '8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', 'ATHIRA J', 't25nv770@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8e5b04cc-3a78-4378-9b2e-8b8ac8ca7d2f', 'T25NV770', now(), now());

    -- Teacher: ATHISHA (T26JN816)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4dbce430-8379-4732-bd4e-b0090a229447', 'authenticated', 'authenticated', 't26jn816@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ATHISHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4dbce430-8379-4732-bd4e-b0090a229447', '4dbce430-8379-4732-bd4e-b0090a229447', format('{"sub":"%s","email":"%s"}', '4dbce430-8379-4732-bd4e-b0090a229447', 't26jn816@gmail.com')::jsonb, 'email', '4dbce430-8379-4732-bd4e-b0090a229447', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4dbce430-8379-4732-bd4e-b0090a229447', 'ATHISHA', 't26jn816@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4dbce430-8379-4732-bd4e-b0090a229447', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4dbce430-8379-4732-bd4e-b0090a229447', 'T26JN816', now(), now());

    -- Teacher: ATHULYA K (T25AP543)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '03a47924-515d-4465-81a4-bf7dd4f58775', 'authenticated', 'authenticated', 't25ap543@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ATHULYA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '03a47924-515d-4465-81a4-bf7dd4f58775', '03a47924-515d-4465-81a4-bf7dd4f58775', format('{"sub":"%s","email":"%s"}', '03a47924-515d-4465-81a4-bf7dd4f58775', 't25ap543@gmail.com')::jsonb, 'email', '03a47924-515d-4465-81a4-bf7dd4f58775', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('03a47924-515d-4465-81a4-bf7dd4f58775', 'ATHULYA K', 't25ap543@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('03a47924-515d-4465-81a4-bf7dd4f58775', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('03a47924-515d-4465-81a4-bf7dd4f58775', 'T25AP543', now(), now());

    -- Teacher: AVANTHIKA S ANAND (T25MR492)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4a2d6990-9d9b-45cf-a16f-834fa3421ed2', 'authenticated', 'authenticated', 't25mr492@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AVANTHIKA S ANAND"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4a2d6990-9d9b-45cf-a16f-834fa3421ed2', '4a2d6990-9d9b-45cf-a16f-834fa3421ed2', format('{"sub":"%s","email":"%s"}', '4a2d6990-9d9b-45cf-a16f-834fa3421ed2', 't25mr492@gmail.com')::jsonb, 'email', '4a2d6990-9d9b-45cf-a16f-834fa3421ed2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4a2d6990-9d9b-45cf-a16f-834fa3421ed2', 'AVANTHIKA S ANAND', 't25mr492@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4a2d6990-9d9b-45cf-a16f-834fa3421ed2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4a2d6990-9d9b-45cf-a16f-834fa3421ed2', 'T25MR492', now(), now());

    -- Teacher: AYANA T R (T25OC715)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b5531250-94b1-4279-b273-084f37f110b2', 'authenticated', 'authenticated', 't25oc715@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYANA T R"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b5531250-94b1-4279-b273-084f37f110b2', 'b5531250-94b1-4279-b273-084f37f110b2', format('{"sub":"%s","email":"%s"}', 'b5531250-94b1-4279-b273-084f37f110b2', 't25oc715@gmail.com')::jsonb, 'email', 'b5531250-94b1-4279-b273-084f37f110b2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b5531250-94b1-4279-b273-084f37f110b2', 'AYANA T R', 't25oc715@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b5531250-94b1-4279-b273-084f37f110b2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b5531250-94b1-4279-b273-084f37f110b2', 'T25OC715', now(), now());

    -- Teacher: AYISHA HIBA N.P (T25AP529)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '41a32dc4-d0ea-43af-a210-0c8c79581b7b', 'authenticated', 'authenticated', 't25ap529@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHA HIBA N.P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '41a32dc4-d0ea-43af-a210-0c8c79581b7b', '41a32dc4-d0ea-43af-a210-0c8c79581b7b', format('{"sub":"%s","email":"%s"}', '41a32dc4-d0ea-43af-a210-0c8c79581b7b', 't25ap529@gmail.com')::jsonb, 'email', '41a32dc4-d0ea-43af-a210-0c8c79581b7b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('41a32dc4-d0ea-43af-a210-0c8c79581b7b', 'AYISHA HIBA N.P', 't25ap529@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('41a32dc4-d0ea-43af-a210-0c8c79581b7b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('41a32dc4-d0ea-43af-a210-0c8c79581b7b', 'T25AP529', now(), now());

    -- Teacher: AYISHA NUSRIN (T24JU268)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e15ba9e0-8573-4c83-9f94-68b9d403eb78', 'authenticated', 'authenticated', 't24ju268@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHA NUSRIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e15ba9e0-8573-4c83-9f94-68b9d403eb78', 'e15ba9e0-8573-4c83-9f94-68b9d403eb78', format('{"sub":"%s","email":"%s"}', 'e15ba9e0-8573-4c83-9f94-68b9d403eb78', 't24ju268@gmail.com')::jsonb, 'email', 'e15ba9e0-8573-4c83-9f94-68b9d403eb78', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e15ba9e0-8573-4c83-9f94-68b9d403eb78', 'AYISHA NUSRIN', 't24ju268@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e15ba9e0-8573-4c83-9f94-68b9d403eb78', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e15ba9e0-8573-4c83-9f94-68b9d403eb78', 'T24JU268', now(), now());

    -- Teacher: AYISHA RAZWIN P.N (T25AP508)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '565d7c24-182c-49d6-b3a1-ef3d71aaf473', 'authenticated', 'authenticated', 't25ap508@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHA RAZWIN P.N"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '565d7c24-182c-49d6-b3a1-ef3d71aaf473', '565d7c24-182c-49d6-b3a1-ef3d71aaf473', format('{"sub":"%s","email":"%s"}', '565d7c24-182c-49d6-b3a1-ef3d71aaf473', 't25ap508@gmail.com')::jsonb, 'email', '565d7c24-182c-49d6-b3a1-ef3d71aaf473', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('565d7c24-182c-49d6-b3a1-ef3d71aaf473', 'AYISHA RAZWIN P.N', 't25ap508@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('565d7c24-182c-49d6-b3a1-ef3d71aaf473', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('565d7c24-182c-49d6-b3a1-ef3d71aaf473', 'T25AP508', now(), now());

    -- Teacher: AYISHA SHIBILA (T25SP671)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e286020e-e586-487f-be9f-2f6e8fe94b49', 'authenticated', 'authenticated', 't25sp671@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHA SHIBILA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e286020e-e586-487f-be9f-2f6e8fe94b49', 'e286020e-e586-487f-be9f-2f6e8fe94b49', format('{"sub":"%s","email":"%s"}', 'e286020e-e586-487f-be9f-2f6e8fe94b49', 't25sp671@gmail.com')::jsonb, 'email', 'e286020e-e586-487f-be9f-2f6e8fe94b49', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e286020e-e586-487f-be9f-2f6e8fe94b49', 'AYISHA SHIBILA', 't25sp671@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e286020e-e586-487f-be9f-2f6e8fe94b49', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e286020e-e586-487f-be9f-2f6e8fe94b49', 'T25SP671', now(), now());

    -- Teacher: AYISHA T (T25AP509)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '30969bec-afd9-48d5-8272-af891df90071', 'authenticated', 'authenticated', 't25ap509@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHA T"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '30969bec-afd9-48d5-8272-af891df90071', '30969bec-afd9-48d5-8272-af891df90071', format('{"sub":"%s","email":"%s"}', '30969bec-afd9-48d5-8272-af891df90071', 't25ap509@gmail.com')::jsonb, 'email', '30969bec-afd9-48d5-8272-af891df90071', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('30969bec-afd9-48d5-8272-af891df90071', 'AYISHA T', 't25ap509@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('30969bec-afd9-48d5-8272-af891df90071', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('30969bec-afd9-48d5-8272-af891df90071', 'T25AP509', now(), now());

    -- Teacher: AYISHA YASMIN (T25AG623)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f2529995-7603-48c2-a7fc-415ac875410d', 'authenticated', 'authenticated', 't25ag623@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHA YASMIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f2529995-7603-48c2-a7fc-415ac875410d', 'f2529995-7603-48c2-a7fc-415ac875410d', format('{"sub":"%s","email":"%s"}', 'f2529995-7603-48c2-a7fc-415ac875410d', 't25ag623@gmail.com')::jsonb, 'email', 'f2529995-7603-48c2-a7fc-415ac875410d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f2529995-7603-48c2-a7fc-415ac875410d', 'AYISHA YASMIN', 't25ag623@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f2529995-7603-48c2-a7fc-415ac875410d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f2529995-7603-48c2-a7fc-415ac875410d', 'T25AG623', now(), now());

    -- Teacher: AYISHABI (T25AG618)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ea92d873-e80b-4e6a-a213-d9067db98762', 'authenticated', 'authenticated', 't25ag618@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYISHABI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ea92d873-e80b-4e6a-a213-d9067db98762', 'ea92d873-e80b-4e6a-a213-d9067db98762', format('{"sub":"%s","email":"%s"}', 'ea92d873-e80b-4e6a-a213-d9067db98762', 't25ag618@gmail.com')::jsonb, 'email', 'ea92d873-e80b-4e6a-a213-d9067db98762', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ea92d873-e80b-4e6a-a213-d9067db98762', 'AYISHABI', 't25ag618@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ea92d873-e80b-4e6a-a213-d9067db98762', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ea92d873-e80b-4e6a-a213-d9067db98762', 'T25AG618', now(), now());

    -- Teacher: AYSHA FIDA (T26JN815)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd83b22b9-0739-49aa-93e7-829d56a4e8de', 'authenticated', 'authenticated', 't26jn815@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYSHA FIDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd83b22b9-0739-49aa-93e7-829d56a4e8de', 'd83b22b9-0739-49aa-93e7-829d56a4e8de', format('{"sub":"%s","email":"%s"}', 'd83b22b9-0739-49aa-93e7-829d56a4e8de', 't26jn815@gmail.com')::jsonb, 'email', 'd83b22b9-0739-49aa-93e7-829d56a4e8de', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d83b22b9-0739-49aa-93e7-829d56a4e8de', 'AYSHA FIDA', 't26jn815@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d83b22b9-0739-49aa-93e7-829d56a4e8de', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d83b22b9-0739-49aa-93e7-829d56a4e8de', 'T26JN815', now(), now());

    -- Teacher: AYSHA K C (T25DC782)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '86766db7-a896-41ab-a9f5-6e216855f9a6', 'authenticated', 'authenticated', 't25dc782@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYSHA K C"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '86766db7-a896-41ab-a9f5-6e216855f9a6', '86766db7-a896-41ab-a9f5-6e216855f9a6', format('{"sub":"%s","email":"%s"}', '86766db7-a896-41ab-a9f5-6e216855f9a6', 't25dc782@gmail.com')::jsonb, 'email', '86766db7-a896-41ab-a9f5-6e216855f9a6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('86766db7-a896-41ab-a9f5-6e216855f9a6', 'AYSHA K C', 't25dc782@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('86766db7-a896-41ab-a9f5-6e216855f9a6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('86766db7-a896-41ab-a9f5-6e216855f9a6', 'T25DC782', now(), now());

    -- Teacher: AYSHA NIDHA (T25DC784)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e0be5f88-0cba-4887-9a4c-c54be108a216', 'authenticated', 'authenticated', 't25dc784@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"AYSHA NIDHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e0be5f88-0cba-4887-9a4c-c54be108a216', 'e0be5f88-0cba-4887-9a4c-c54be108a216', format('{"sub":"%s","email":"%s"}', 'e0be5f88-0cba-4887-9a4c-c54be108a216', 't25dc784@gmail.com')::jsonb, 'email', 'e0be5f88-0cba-4887-9a4c-c54be108a216', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e0be5f88-0cba-4887-9a4c-c54be108a216', 'AYSHA NIDHA', 't25dc784@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e0be5f88-0cba-4887-9a4c-c54be108a216', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e0be5f88-0cba-4887-9a4c-c54be108a216', 'T25DC784', now(), now());

    -- Teacher: BASILA SHABEEB (T24JU273)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8f74d840-3311-4c4d-97e8-a35eab07f59f', 'authenticated', 'authenticated', 't24ju273@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BASILA SHABEEB"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8f74d840-3311-4c4d-97e8-a35eab07f59f', '8f74d840-3311-4c4d-97e8-a35eab07f59f', format('{"sub":"%s","email":"%s"}', '8f74d840-3311-4c4d-97e8-a35eab07f59f', 't24ju273@gmail.com')::jsonb, 'email', '8f74d840-3311-4c4d-97e8-a35eab07f59f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8f74d840-3311-4c4d-97e8-a35eab07f59f', 'BASILA SHABEEB', 't24ju273@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8f74d840-3311-4c4d-97e8-a35eab07f59f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8f74d840-3311-4c4d-97e8-a35eab07f59f', 'T24JU273', now(), now());

    -- Teacher: BASMALA (T25SP670)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', 'authenticated', 'authenticated', 't25sp670@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BASMALA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', 'ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', format('{"sub":"%s","email":"%s"}', 'ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', 't25sp670@gmail.com')::jsonb, 'email', 'ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', 'BASMALA', 't25sp670@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ad115d4a-1ba4-45b1-89c7-3c5ae340ac3d', 'T25SP670', now(), now());

    -- Teacher: BIJI SAJIRAWTHER (T26JN805)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', 'authenticated', 'authenticated', 't26jn805@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BIJI SAJIRAWTHER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', 'aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', format('{"sub":"%s","email":"%s"}', 'aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', 't26jn805@gmail.com')::jsonb, 'email', 'aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', 'BIJI SAJIRAWTHER', 't26jn805@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('aab8b277-8a1b-4cb1-b343-cbc6e0f24e42', 'T26JN805', now(), now());

    -- Teacher: BIJO (T25SP681)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', 'authenticated', 'authenticated', 't25sp681@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BIJO"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', '31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', format('{"sub":"%s","email":"%s"}', '31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', 't25sp681@gmail.com')::jsonb, 'email', '31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', 'BIJO', 't25sp681@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('31f148a2-cfe5-43a7-b5f0-674bffd2f9ac', 'T25SP681', now(), now());

    -- Teacher: BINCY ELIZABETH (T25JL616)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '02c1f3de-0732-4c13-9b0d-03cf430bd251', 'authenticated', 'authenticated', 't25jl616@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BINCY ELIZABETH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '02c1f3de-0732-4c13-9b0d-03cf430bd251', '02c1f3de-0732-4c13-9b0d-03cf430bd251', format('{"sub":"%s","email":"%s"}', '02c1f3de-0732-4c13-9b0d-03cf430bd251', 't25jl616@gmail.com')::jsonb, 'email', '02c1f3de-0732-4c13-9b0d-03cf430bd251', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('02c1f3de-0732-4c13-9b0d-03cf430bd251', 'BINCY ELIZABETH', 't25jl616@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('02c1f3de-0732-4c13-9b0d-03cf430bd251', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('02c1f3de-0732-4c13-9b0d-03cf430bd251', 'T25JL616', now(), now());

    -- Teacher: BINDHU (T25JU579)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8fac84fc-79f1-4b5c-af21-2b1a17916efd', 'authenticated', 'authenticated', 't25ju579@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BINDHU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8fac84fc-79f1-4b5c-af21-2b1a17916efd', '8fac84fc-79f1-4b5c-af21-2b1a17916efd', format('{"sub":"%s","email":"%s"}', '8fac84fc-79f1-4b5c-af21-2b1a17916efd', 't25ju579@gmail.com')::jsonb, 'email', '8fac84fc-79f1-4b5c-af21-2b1a17916efd', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8fac84fc-79f1-4b5c-af21-2b1a17916efd', 'BINDHU', 't25ju579@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8fac84fc-79f1-4b5c-af21-2b1a17916efd', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8fac84fc-79f1-4b5c-af21-2b1a17916efd', 'T25JU579', now(), now());

    -- Teacher: BINNA ROJAN (T26JN838)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd6ab98ec-fd68-4fab-a841-da86b915e9fc', 'authenticated', 'authenticated', 't26jn838@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"BINNA ROJAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd6ab98ec-fd68-4fab-a841-da86b915e9fc', 'd6ab98ec-fd68-4fab-a841-da86b915e9fc', format('{"sub":"%s","email":"%s"}', 'd6ab98ec-fd68-4fab-a841-da86b915e9fc', 't26jn838@gmail.com')::jsonb, 'email', 'd6ab98ec-fd68-4fab-a841-da86b915e9fc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d6ab98ec-fd68-4fab-a841-da86b915e9fc', 'BINNA ROJAN', 't26jn838@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d6ab98ec-fd68-4fab-a841-da86b915e9fc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d6ab98ec-fd68-4fab-a841-da86b915e9fc', 'T26JN838', now(), now());

    -- Teacher: CHITRA S PILLAI (T25DC793)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a2f02282-194d-4eaf-8cd7-5eddc1a3893f', 'authenticated', 'authenticated', 't25dc793@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"CHITRA S PILLAI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a2f02282-194d-4eaf-8cd7-5eddc1a3893f', 'a2f02282-194d-4eaf-8cd7-5eddc1a3893f', format('{"sub":"%s","email":"%s"}', 'a2f02282-194d-4eaf-8cd7-5eddc1a3893f', 't25dc793@gmail.com')::jsonb, 'email', 'a2f02282-194d-4eaf-8cd7-5eddc1a3893f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a2f02282-194d-4eaf-8cd7-5eddc1a3893f', 'CHITRA S PILLAI', 't25dc793@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a2f02282-194d-4eaf-8cd7-5eddc1a3893f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a2f02282-194d-4eaf-8cd7-5eddc1a3893f', 'T25DC793', now(), now());

    -- Teacher: CHRISTY P (T25AP506)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8ad6f963-c1ee-4473-8aed-bb2923036013', 'authenticated', 'authenticated', 't25ap506@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"CHRISTY P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8ad6f963-c1ee-4473-8aed-bb2923036013', '8ad6f963-c1ee-4473-8aed-bb2923036013', format('{"sub":"%s","email":"%s"}', '8ad6f963-c1ee-4473-8aed-bb2923036013', 't25ap506@gmail.com')::jsonb, 'email', '8ad6f963-c1ee-4473-8aed-bb2923036013', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8ad6f963-c1ee-4473-8aed-bb2923036013', 'CHRISTY P', 't25ap506@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8ad6f963-c1ee-4473-8aed-bb2923036013', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8ad6f963-c1ee-4473-8aed-bb2923036013', 'T25AP506', now(), now());

    -- Teacher: DEEKSHITHA (T26FB853)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1bc55320-ca8d-48e0-9de8-1868294080bb', 'authenticated', 'authenticated', 't26fb853@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DEEKSHITHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1bc55320-ca8d-48e0-9de8-1868294080bb', '1bc55320-ca8d-48e0-9de8-1868294080bb', format('{"sub":"%s","email":"%s"}', '1bc55320-ca8d-48e0-9de8-1868294080bb', 't26fb853@gmail.com')::jsonb, 'email', '1bc55320-ca8d-48e0-9de8-1868294080bb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1bc55320-ca8d-48e0-9de8-1868294080bb', 'DEEKSHITHA', 't26fb853@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1bc55320-ca8d-48e0-9de8-1868294080bb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1bc55320-ca8d-48e0-9de8-1868294080bb', 'T26FB853', now(), now());

    -- Teacher: DEEPA K (T24NV428)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', 'authenticated', 'authenticated', 't24nv428@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DEEPA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', 'c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', format('{"sub":"%s","email":"%s"}', 'c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', 't24nv428@gmail.com')::jsonb, 'email', 'c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', 'DEEPA K', 't24nv428@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c08eea3c-8d5c-44d6-ab6c-8bd4704a4e67', 'T24NV428', now(), now());

    -- Teacher: DEEPA K NAIR (T24MA206)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '17f5fdf3-5181-4202-809d-675c1a62ef10', 'authenticated', 'authenticated', 't24ma206@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DEEPA K NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '17f5fdf3-5181-4202-809d-675c1a62ef10', '17f5fdf3-5181-4202-809d-675c1a62ef10', format('{"sub":"%s","email":"%s"}', '17f5fdf3-5181-4202-809d-675c1a62ef10', 't24ma206@gmail.com')::jsonb, 'email', '17f5fdf3-5181-4202-809d-675c1a62ef10', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('17f5fdf3-5181-4202-809d-675c1a62ef10', 'DEEPA K NAIR', 't24ma206@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('17f5fdf3-5181-4202-809d-675c1a62ef10', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('17f5fdf3-5181-4202-809d-675c1a62ef10', 'T24MA206', now(), now());

    -- Teacher: DHANYA  BALAKRISHNAN (T25AP519)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '08ca68a0-7fca-45ed-837f-6e76a333f366', 'authenticated', 'authenticated', 't25ap519@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DHANYA  BALAKRISHNAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '08ca68a0-7fca-45ed-837f-6e76a333f366', '08ca68a0-7fca-45ed-837f-6e76a333f366', format('{"sub":"%s","email":"%s"}', '08ca68a0-7fca-45ed-837f-6e76a333f366', 't25ap519@gmail.com')::jsonb, 'email', '08ca68a0-7fca-45ed-837f-6e76a333f366', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('08ca68a0-7fca-45ed-837f-6e76a333f366', 'DHANYA  BALAKRISHNAN', 't25ap519@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('08ca68a0-7fca-45ed-837f-6e76a333f366', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('08ca68a0-7fca-45ed-837f-6e76a333f366', 'T25AP519', now(), now());

    -- Teacher: DIVYANANDA (T25JU590)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '17ea9789-6ab8-4c5f-8d6d-db7da0560001', 'authenticated', 'authenticated', 't25ju590@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIVYANANDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '17ea9789-6ab8-4c5f-8d6d-db7da0560001', '17ea9789-6ab8-4c5f-8d6d-db7da0560001', format('{"sub":"%s","email":"%s"}', '17ea9789-6ab8-4c5f-8d6d-db7da0560001', 't25ju590@gmail.com')::jsonb, 'email', '17ea9789-6ab8-4c5f-8d6d-db7da0560001', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('17ea9789-6ab8-4c5f-8d6d-db7da0560001', 'DIVYANANDA', 't25ju590@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('17ea9789-6ab8-4c5f-8d6d-db7da0560001', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('17ea9789-6ab8-4c5f-8d6d-db7da0560001', 'T25JU590', now(), now());

    -- Teacher: DIYA ANEES (T25OC802)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', 'authenticated', 'authenticated', 't25oc802@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIYA ANEES"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', 'a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', format('{"sub":"%s","email":"%s"}', 'a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', 't25oc802@gmail.com')::jsonb, 'email', 'a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', 'DIYA ANEES', 't25oc802@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a5a09d62-0d4e-4bd8-b8d9-fbe5d5a91ac9', 'T25OC802', now(), now());

    -- Teacher: DIYA CYRIL (T25JL611)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f5182713-0c27-41bc-9e25-60c1c6a4cc75', 'authenticated', 'authenticated', 't25jl611@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIYA CYRIL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f5182713-0c27-41bc-9e25-60c1c6a4cc75', 'f5182713-0c27-41bc-9e25-60c1c6a4cc75', format('{"sub":"%s","email":"%s"}', 'f5182713-0c27-41bc-9e25-60c1c6a4cc75', 't25jl611@gmail.com')::jsonb, 'email', 'f5182713-0c27-41bc-9e25-60c1c6a4cc75', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f5182713-0c27-41bc-9e25-60c1c6a4cc75', 'DIYA CYRIL', 't25jl611@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f5182713-0c27-41bc-9e25-60c1c6a4cc75', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f5182713-0c27-41bc-9e25-60c1c6a4cc75', 'T25JL611', now(), now());

    -- Teacher: DIYA PRASAD (T25JL598)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '796d9459-673a-4f74-98a8-6c280ecb3889', 'authenticated', 'authenticated', 't25jl598@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIYA PRASAD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '796d9459-673a-4f74-98a8-6c280ecb3889', '796d9459-673a-4f74-98a8-6c280ecb3889', format('{"sub":"%s","email":"%s"}', '796d9459-673a-4f74-98a8-6c280ecb3889', 't25jl598@gmail.com')::jsonb, 'email', '796d9459-673a-4f74-98a8-6c280ecb3889', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('796d9459-673a-4f74-98a8-6c280ecb3889', 'DIYA PRASAD', 't25jl598@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('796d9459-673a-4f74-98a8-6c280ecb3889', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('796d9459-673a-4f74-98a8-6c280ecb3889', 'T25JL598', now(), now());

    -- Teacher: DIYA VINOD KUMAR (T26FB840)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b883bc41-6253-4cd4-93e1-2cf7c61b9041', 'authenticated', 'authenticated', 't26fb840@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIYA VINOD KUMAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b883bc41-6253-4cd4-93e1-2cf7c61b9041', 'b883bc41-6253-4cd4-93e1-2cf7c61b9041', format('{"sub":"%s","email":"%s"}', 'b883bc41-6253-4cd4-93e1-2cf7c61b9041', 't26fb840@gmail.com')::jsonb, 'email', 'b883bc41-6253-4cd4-93e1-2cf7c61b9041', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b883bc41-6253-4cd4-93e1-2cf7c61b9041', 'DIYA VINOD KUMAR', 't26fb840@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b883bc41-6253-4cd4-93e1-2cf7c61b9041', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b883bc41-6253-4cd4-93e1-2cf7c61b9041', 'T26FB840', now(), now());

    -- Teacher: DIYAMOL JOSEPH (T25FB481)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '463b4419-78fa-405b-9efb-4876aba4ae71', 'authenticated', 'authenticated', 't25fb481@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIYAMOL JOSEPH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '463b4419-78fa-405b-9efb-4876aba4ae71', '463b4419-78fa-405b-9efb-4876aba4ae71', format('{"sub":"%s","email":"%s"}', '463b4419-78fa-405b-9efb-4876aba4ae71', 't25fb481@gmail.com')::jsonb, 'email', '463b4419-78fa-405b-9efb-4876aba4ae71', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('463b4419-78fa-405b-9efb-4876aba4ae71', 'DIYAMOL JOSEPH', 't25fb481@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('463b4419-78fa-405b-9efb-4876aba4ae71', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('463b4419-78fa-405b-9efb-4876aba4ae71', 'T25FB481', now(), now());

    -- Teacher: DR MANJUSHA (T24JU287)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b8585248-6dc1-4edd-ad7e-d1de1462d91e', 'authenticated', 'authenticated', 't24ju287@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DR MANJUSHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b8585248-6dc1-4edd-ad7e-d1de1462d91e', 'b8585248-6dc1-4edd-ad7e-d1de1462d91e', format('{"sub":"%s","email":"%s"}', 'b8585248-6dc1-4edd-ad7e-d1de1462d91e', 't24ju287@gmail.com')::jsonb, 'email', 'b8585248-6dc1-4edd-ad7e-d1de1462d91e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b8585248-6dc1-4edd-ad7e-d1de1462d91e', 'DR MANJUSHA', 't24ju287@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b8585248-6dc1-4edd-ad7e-d1de1462d91e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b8585248-6dc1-4edd-ad7e-d1de1462d91e', 'T24JU287', now(), now());

    -- Teacher: DRAVYA (T25JL608)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', 'authenticated', 'authenticated', 't25jl608@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DRAVYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', 'ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', format('{"sub":"%s","email":"%s"}', 'ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', 't25jl608@gmail.com')::jsonb, 'email', 'ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', 'DRAVYA', 't25jl608@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ddbf49d4-4c54-4bb0-9309-9ab6549c0b09', 'T25JL608', now(), now());

    -- Teacher: DRISYA (T25AG636)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ba21e319-3db2-431a-9876-df8ecea4d9a4', 'authenticated', 'authenticated', 't25ag636@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DRISYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ba21e319-3db2-431a-9876-df8ecea4d9a4', 'ba21e319-3db2-431a-9876-df8ecea4d9a4', format('{"sub":"%s","email":"%s"}', 'ba21e319-3db2-431a-9876-df8ecea4d9a4', 't25ag636@gmail.com')::jsonb, 'email', 'ba21e319-3db2-431a-9876-df8ecea4d9a4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ba21e319-3db2-431a-9876-df8ecea4d9a4', 'DRISYA', 't25ag636@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ba21e319-3db2-431a-9876-df8ecea4d9a4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ba21e319-3db2-431a-9876-df8ecea4d9a4', 'T25AG636', now(), now());

    -- Teacher: ELIZABETH SABU (T24JL293)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cb6efbf1-a145-4b06-9f85-1ddd98a60d68', 'authenticated', 'authenticated', 't24jl293@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ELIZABETH SABU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cb6efbf1-a145-4b06-9f85-1ddd98a60d68', 'cb6efbf1-a145-4b06-9f85-1ddd98a60d68', format('{"sub":"%s","email":"%s"}', 'cb6efbf1-a145-4b06-9f85-1ddd98a60d68', 't24jl293@gmail.com')::jsonb, 'email', 'cb6efbf1-a145-4b06-9f85-1ddd98a60d68', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cb6efbf1-a145-4b06-9f85-1ddd98a60d68', 'ELIZABETH SABU', 't24jl293@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cb6efbf1-a145-4b06-9f85-1ddd98a60d68', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cb6efbf1-a145-4b06-9f85-1ddd98a60d68', 'T24JL293', now(), now());

    -- Teacher: ELIZEBETH ANNET FREDY (T25AG628)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b39fe103-8623-4257-ac4e-4662b8fb51ba', 'authenticated', 'authenticated', 't25ag628@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ELIZEBETH ANNET FREDY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b39fe103-8623-4257-ac4e-4662b8fb51ba', 'b39fe103-8623-4257-ac4e-4662b8fb51ba', format('{"sub":"%s","email":"%s"}', 'b39fe103-8623-4257-ac4e-4662b8fb51ba', 't25ag628@gmail.com')::jsonb, 'email', 'b39fe103-8623-4257-ac4e-4662b8fb51ba', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b39fe103-8623-4257-ac4e-4662b8fb51ba', 'ELIZEBETH ANNET FREDY', 't25ag628@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b39fe103-8623-4257-ac4e-4662b8fb51ba', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b39fe103-8623-4257-ac4e-4662b8fb51ba', 'T25AG628', now(), now());

    -- Teacher: ESTHER P JOSEPH (T24JL299)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'be5d665b-89f3-48a7-96a9-55ac2946152e', 'authenticated', 'authenticated', 't24jl299@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ESTHER P JOSEPH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'be5d665b-89f3-48a7-96a9-55ac2946152e', 'be5d665b-89f3-48a7-96a9-55ac2946152e', format('{"sub":"%s","email":"%s"}', 'be5d665b-89f3-48a7-96a9-55ac2946152e', 't24jl299@gmail.com')::jsonb, 'email', 'be5d665b-89f3-48a7-96a9-55ac2946152e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('be5d665b-89f3-48a7-96a9-55ac2946152e', 'ESTHER P JOSEPH', 't24jl299@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('be5d665b-89f3-48a7-96a9-55ac2946152e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('be5d665b-89f3-48a7-96a9-55ac2946152e', 'T24JL299', now(), now());

    -- Teacher: FABINA SINSI (T24JU283)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '549a42f9-5cc2-4f60-b977-6a2c1931c4c7', 'authenticated', 'authenticated', 't24ju283@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FABINA SINSI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '549a42f9-5cc2-4f60-b977-6a2c1931c4c7', '549a42f9-5cc2-4f60-b977-6a2c1931c4c7', format('{"sub":"%s","email":"%s"}', '549a42f9-5cc2-4f60-b977-6a2c1931c4c7', 't24ju283@gmail.com')::jsonb, 'email', '549a42f9-5cc2-4f60-b977-6a2c1931c4c7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('549a42f9-5cc2-4f60-b977-6a2c1931c4c7', 'FABINA SINSI', 't24ju283@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('549a42f9-5cc2-4f60-b977-6a2c1931c4c7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('549a42f9-5cc2-4f60-b977-6a2c1931c4c7', 'T24JU283', now(), now());

    -- Teacher: FAHIMA (T24MA240)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', 'authenticated', 'authenticated', 't24ma240@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAHIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', '5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', format('{"sub":"%s","email":"%s"}', '5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', 't24ma240@gmail.com')::jsonb, 'email', '5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', 'FAHIMA', 't24ma240@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5d34b5d1-9b3c-4b92-95ad-31cd11d1f55c', 'T24MA240', now(), now());

    -- Teacher: FAHIMA THASNI (T25SP669)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '08f16375-3e2b-4151-aa6e-0ebe1f5707b1', 'authenticated', 'authenticated', 't25sp669@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAHIMA THASNI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '08f16375-3e2b-4151-aa6e-0ebe1f5707b1', '08f16375-3e2b-4151-aa6e-0ebe1f5707b1', format('{"sub":"%s","email":"%s"}', '08f16375-3e2b-4151-aa6e-0ebe1f5707b1', 't25sp669@gmail.com')::jsonb, 'email', '08f16375-3e2b-4151-aa6e-0ebe1f5707b1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('08f16375-3e2b-4151-aa6e-0ebe1f5707b1', 'FAHIMA THASNI', 't25sp669@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('08f16375-3e2b-4151-aa6e-0ebe1f5707b1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('08f16375-3e2b-4151-aa6e-0ebe1f5707b1', 'T25SP669', now(), now());

    -- Teacher: FAHMIDA AP (T25NV764)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '02e79224-5213-49c2-bb56-e9eb7227eac8', 'authenticated', 'authenticated', 't25nv764@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAHMIDA AP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '02e79224-5213-49c2-bb56-e9eb7227eac8', '02e79224-5213-49c2-bb56-e9eb7227eac8', format('{"sub":"%s","email":"%s"}', '02e79224-5213-49c2-bb56-e9eb7227eac8', 't25nv764@gmail.com')::jsonb, 'email', '02e79224-5213-49c2-bb56-e9eb7227eac8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('02e79224-5213-49c2-bb56-e9eb7227eac8', 'FAHMIDA AP', 't25nv764@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('02e79224-5213-49c2-bb56-e9eb7227eac8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('02e79224-5213-49c2-bb56-e9eb7227eac8', 'T25NV764', now(), now());

    -- Teacher: FAHMIDA K K (T25SP687)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9b96584b-1f6f-44ad-b3fd-3e769ee5182e', 'authenticated', 'authenticated', 't25sp687@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAHMIDA K K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9b96584b-1f6f-44ad-b3fd-3e769ee5182e', '9b96584b-1f6f-44ad-b3fd-3e769ee5182e', format('{"sub":"%s","email":"%s"}', '9b96584b-1f6f-44ad-b3fd-3e769ee5182e', 't25sp687@gmail.com')::jsonb, 'email', '9b96584b-1f6f-44ad-b3fd-3e769ee5182e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9b96584b-1f6f-44ad-b3fd-3e769ee5182e', 'FAHMIDA K K', 't25sp687@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9b96584b-1f6f-44ad-b3fd-3e769ee5182e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9b96584b-1f6f-44ad-b3fd-3e769ee5182e', 'T25SP687', now(), now());

    -- Teacher: FAHMIDHA JASMINE (T24NV414)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a0486418-2dfe-4308-9d85-2549831c5439', 'authenticated', 'authenticated', 't24nv414@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAHMIDHA JASMINE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a0486418-2dfe-4308-9d85-2549831c5439', 'a0486418-2dfe-4308-9d85-2549831c5439', format('{"sub":"%s","email":"%s"}', 'a0486418-2dfe-4308-9d85-2549831c5439', 't24nv414@gmail.com')::jsonb, 'email', 'a0486418-2dfe-4308-9d85-2549831c5439', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a0486418-2dfe-4308-9d85-2549831c5439', 'FAHMIDHA JASMINE', 't24nv414@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a0486418-2dfe-4308-9d85-2549831c5439', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a0486418-2dfe-4308-9d85-2549831c5439', 'T24NV414', now(), now());

    -- Teacher: FAHMIDHA SHIRIN (T23DC116)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', 'authenticated', 'authenticated', 't23dc116@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAHMIDHA SHIRIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', '29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', format('{"sub":"%s","email":"%s"}', '29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', 't23dc116@gmail.com')::jsonb, 'email', '29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', 'FAHMIDHA SHIRIN', 't23dc116@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('29a8b3d4-05b2-4f3a-9b45-e1115e476d7e', 'T23DC116', now(), now());

    -- Teacher: FARHANA (T25FB626)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ca8590f3-d141-4969-a580-9e0e888d2ba2', 'authenticated', 'authenticated', 't25fb626@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ca8590f3-d141-4969-a580-9e0e888d2ba2', 'ca8590f3-d141-4969-a580-9e0e888d2ba2', format('{"sub":"%s","email":"%s"}', 'ca8590f3-d141-4969-a580-9e0e888d2ba2', 't25fb626@gmail.com')::jsonb, 'email', 'ca8590f3-d141-4969-a580-9e0e888d2ba2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ca8590f3-d141-4969-a580-9e0e888d2ba2', 'FARHANA', 't25fb626@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ca8590f3-d141-4969-a580-9e0e888d2ba2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ca8590f3-d141-4969-a580-9e0e888d2ba2', 'T25FB626', now(), now());

    -- Teacher: FARHANA NAZRIN (T25AG642)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '502f5e2e-0127-477b-8180-9117c24b2b3a', 'authenticated', 'authenticated', 't25ag642@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARHANA NAZRIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '502f5e2e-0127-477b-8180-9117c24b2b3a', '502f5e2e-0127-477b-8180-9117c24b2b3a', format('{"sub":"%s","email":"%s"}', '502f5e2e-0127-477b-8180-9117c24b2b3a', 't25ag642@gmail.com')::jsonb, 'email', '502f5e2e-0127-477b-8180-9117c24b2b3a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('502f5e2e-0127-477b-8180-9117c24b2b3a', 'FARHANA NAZRIN', 't25ag642@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('502f5e2e-0127-477b-8180-9117c24b2b3a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('502f5e2e-0127-477b-8180-9117c24b2b3a', 'T25AG642', now(), now());

    -- Teacher: FARHANA P (T25FB485)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd4a0e0f1-a969-4c7d-b68a-009e7c25e52b', 'authenticated', 'authenticated', 't25fb485@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARHANA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd4a0e0f1-a969-4c7d-b68a-009e7c25e52b', 'd4a0e0f1-a969-4c7d-b68a-009e7c25e52b', format('{"sub":"%s","email":"%s"}', 'd4a0e0f1-a969-4c7d-b68a-009e7c25e52b', 't25fb485@gmail.com')::jsonb, 'email', 'd4a0e0f1-a969-4c7d-b68a-009e7c25e52b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d4a0e0f1-a969-4c7d-b68a-009e7c25e52b', 'FARHANA P', 't25fb485@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d4a0e0f1-a969-4c7d-b68a-009e7c25e52b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d4a0e0f1-a969-4c7d-b68a-009e7c25e52b', 'T25FB485', now(), now());

    -- Teacher: FARHEENA (T25OC704)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', 'authenticated', 'authenticated', 't25oc704@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARHEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', '8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', format('{"sub":"%s","email":"%s"}', '8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', 't25oc704@gmail.com')::jsonb, 'email', '8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', 'FARHEENA', 't25oc704@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8b61c7b0-2ab6-4a26-ac74-6f3b090854ab', 'T25OC704', now(), now());

    -- Teacher: FARISHA BINTH ABOOBACKER (T25AP518)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3e95ca34-26d5-4df6-bcba-d48bd3d90e58', 'authenticated', 'authenticated', 't25ap518@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARISHA BINTH ABOOBACKER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3e95ca34-26d5-4df6-bcba-d48bd3d90e58', '3e95ca34-26d5-4df6-bcba-d48bd3d90e58', format('{"sub":"%s","email":"%s"}', '3e95ca34-26d5-4df6-bcba-d48bd3d90e58', 't25ap518@gmail.com')::jsonb, 'email', '3e95ca34-26d5-4df6-bcba-d48bd3d90e58', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3e95ca34-26d5-4df6-bcba-d48bd3d90e58', 'FARISHA BINTH ABOOBACKER', 't25ap518@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3e95ca34-26d5-4df6-bcba-d48bd3d90e58', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3e95ca34-26d5-4df6-bcba-d48bd3d90e58', 'T25AP518', now(), now());

    -- Teacher: FARSANA O D (T24AG358)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fa39c645-c556-4ae5-8527-1d8ba4a02446', 'authenticated', 'authenticated', 't24ag358@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARSANA O D"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fa39c645-c556-4ae5-8527-1d8ba4a02446', 'fa39c645-c556-4ae5-8527-1d8ba4a02446', format('{"sub":"%s","email":"%s"}', 'fa39c645-c556-4ae5-8527-1d8ba4a02446', 't24ag358@gmail.com')::jsonb, 'email', 'fa39c645-c556-4ae5-8527-1d8ba4a02446', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fa39c645-c556-4ae5-8527-1d8ba4a02446', 'FARSANA O D', 't24ag358@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fa39c645-c556-4ae5-8527-1d8ba4a02446', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fa39c645-c556-4ae5-8527-1d8ba4a02446', 'T24AG358', now(), now());

    -- Teacher: FARSANA PM (T26FB829)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', 'authenticated', 'authenticated', 't26fb829@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARSANA PM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', 'fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', format('{"sub":"%s","email":"%s"}', 'fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', 't26fb829@gmail.com')::jsonb, 'email', 'fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', 'FARSANA PM', 't26fb829@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fcb3b1b0-4bee-4e4b-abd9-4ea78c82403e', 'T26FB829', now(), now());

    -- Teacher: FARZIN AHMED (T25JL602)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dba73d26-da85-4d7b-8f36-c682b40fefbf', 'authenticated', 'authenticated', 't25jl602@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FARZIN AHMED"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dba73d26-da85-4d7b-8f36-c682b40fefbf', 'dba73d26-da85-4d7b-8f36-c682b40fefbf', format('{"sub":"%s","email":"%s"}', 'dba73d26-da85-4d7b-8f36-c682b40fefbf', 't25jl602@gmail.com')::jsonb, 'email', 'dba73d26-da85-4d7b-8f36-c682b40fefbf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dba73d26-da85-4d7b-8f36-c682b40fefbf', 'FARZIN AHMED', 't25jl602@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dba73d26-da85-4d7b-8f36-c682b40fefbf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dba73d26-da85-4d7b-8f36-c682b40fefbf', 'T25JL602', now(), now());

    -- Teacher: FASLA (T25SP662)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c11128ee-ea97-4d1d-ad60-cf526f160404', 'authenticated', 'authenticated', 't25sp662@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FASLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c11128ee-ea97-4d1d-ad60-cf526f160404', 'c11128ee-ea97-4d1d-ad60-cf526f160404', format('{"sub":"%s","email":"%s"}', 'c11128ee-ea97-4d1d-ad60-cf526f160404', 't25sp662@gmail.com')::jsonb, 'email', 'c11128ee-ea97-4d1d-ad60-cf526f160404', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c11128ee-ea97-4d1d-ad60-cf526f160404', 'FASLA', 't25sp662@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c11128ee-ea97-4d1d-ad60-cf526f160404', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c11128ee-ea97-4d1d-ad60-cf526f160404', 'T25SP662', now(), now());

    -- Teacher: FASNA RISHIN (T25JL596)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7fb24302-3494-45b0-bd5a-df3a7c58d03e', 'authenticated', 'authenticated', 't25jl596@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FASNA RISHIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7fb24302-3494-45b0-bd5a-df3a7c58d03e', '7fb24302-3494-45b0-bd5a-df3a7c58d03e', format('{"sub":"%s","email":"%s"}', '7fb24302-3494-45b0-bd5a-df3a7c58d03e', 't25jl596@gmail.com')::jsonb, 'email', '7fb24302-3494-45b0-bd5a-df3a7c58d03e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7fb24302-3494-45b0-bd5a-df3a7c58d03e', 'FASNA RISHIN', 't25jl596@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7fb24302-3494-45b0-bd5a-df3a7c58d03e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7fb24302-3494-45b0-bd5a-df3a7c58d03e', 'T25JL596', now(), now());

    -- Teacher: FATHIMA A (T24MA249)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7dedb8da-dcac-490b-9ce7-25a59aaa8537', 'authenticated', 'authenticated', 't24ma249@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7dedb8da-dcac-490b-9ce7-25a59aaa8537', '7dedb8da-dcac-490b-9ce7-25a59aaa8537', format('{"sub":"%s","email":"%s"}', '7dedb8da-dcac-490b-9ce7-25a59aaa8537', 't24ma249@gmail.com')::jsonb, 'email', '7dedb8da-dcac-490b-9ce7-25a59aaa8537', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7dedb8da-dcac-490b-9ce7-25a59aaa8537', 'FATHIMA A', 't24ma249@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7dedb8da-dcac-490b-9ce7-25a59aaa8537', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7dedb8da-dcac-490b-9ce7-25a59aaa8537', 'T24MA249', now(), now());

    -- Teacher: FATHIMA ABDUL KAREEM (T25JU587)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '31808038-98ef-431e-92a1-e4b22d20c78e', 'authenticated', 'authenticated', 't25ju587@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA ABDUL KAREEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '31808038-98ef-431e-92a1-e4b22d20c78e', '31808038-98ef-431e-92a1-e4b22d20c78e', format('{"sub":"%s","email":"%s"}', '31808038-98ef-431e-92a1-e4b22d20c78e', 't25ju587@gmail.com')::jsonb, 'email', '31808038-98ef-431e-92a1-e4b22d20c78e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('31808038-98ef-431e-92a1-e4b22d20c78e', 'FATHIMA ABDUL KAREEM', 't25ju587@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('31808038-98ef-431e-92a1-e4b22d20c78e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('31808038-98ef-431e-92a1-e4b22d20c78e', 'T25JU587', now(), now());

    -- Teacher: FATHIMA ANJUM (T26FB843)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd03fb08a-f5f0-46b6-9afa-87e3a49128e6', 'authenticated', 'authenticated', 't26fb843@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA ANJUM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd03fb08a-f5f0-46b6-9afa-87e3a49128e6', 'd03fb08a-f5f0-46b6-9afa-87e3a49128e6', format('{"sub":"%s","email":"%s"}', 'd03fb08a-f5f0-46b6-9afa-87e3a49128e6', 't26fb843@gmail.com')::jsonb, 'email', 'd03fb08a-f5f0-46b6-9afa-87e3a49128e6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d03fb08a-f5f0-46b6-9afa-87e3a49128e6', 'FATHIMA ANJUM', 't26fb843@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d03fb08a-f5f0-46b6-9afa-87e3a49128e6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d03fb08a-f5f0-46b6-9afa-87e3a49128e6', 'T26FB843', now(), now());

    -- Teacher: FATHIMA ANSHIFA (T25NV752)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'da8cce73-7ed8-438e-9b63-56c3de3a0f40', 'authenticated', 'authenticated', 't25nv752@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA ANSHIFA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'da8cce73-7ed8-438e-9b63-56c3de3a0f40', 'da8cce73-7ed8-438e-9b63-56c3de3a0f40', format('{"sub":"%s","email":"%s"}', 'da8cce73-7ed8-438e-9b63-56c3de3a0f40', 't25nv752@gmail.com')::jsonb, 'email', 'da8cce73-7ed8-438e-9b63-56c3de3a0f40', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('da8cce73-7ed8-438e-9b63-56c3de3a0f40', 'FATHIMA ANSHIFA', 't25nv752@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('da8cce73-7ed8-438e-9b63-56c3de3a0f40', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('da8cce73-7ed8-438e-9b63-56c3de3a0f40', 'T25NV752', now(), now());

    -- Teacher: FATHIMA ASHRAF (T25DC795)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7f095e70-32f4-4190-afb5-3631cc5efecb', 'authenticated', 'authenticated', 't25dc795@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA ASHRAF"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7f095e70-32f4-4190-afb5-3631cc5efecb', '7f095e70-32f4-4190-afb5-3631cc5efecb', format('{"sub":"%s","email":"%s"}', '7f095e70-32f4-4190-afb5-3631cc5efecb', 't25dc795@gmail.com')::jsonb, 'email', '7f095e70-32f4-4190-afb5-3631cc5efecb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7f095e70-32f4-4190-afb5-3631cc5efecb', 'FATHIMA ASHRAF', 't25dc795@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7f095e70-32f4-4190-afb5-3631cc5efecb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7f095e70-32f4-4190-afb5-3631cc5efecb', 'T25DC795', now(), now());

    -- Teacher: FATHIMA ASLIDA V K (T25OC691)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', 'authenticated', 'authenticated', 't25oc691@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA ASLIDA V K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', 'cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', format('{"sub":"%s","email":"%s"}', 'cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', 't25oc691@gmail.com')::jsonb, 'email', 'cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', 'FATHIMA ASLIDA V K', 't25oc691@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cd1279e1-a5a9-473a-b7e4-21e4f8dfaac2', 'T25OC691', now(), now());

    -- Teacher: FATHIMA C K (T25NV749)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3cc39462-aeab-4b31-a06d-fa877278990f', 'authenticated', 'authenticated', 't25nv749@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA C K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3cc39462-aeab-4b31-a06d-fa877278990f', '3cc39462-aeab-4b31-a06d-fa877278990f', format('{"sub":"%s","email":"%s"}', '3cc39462-aeab-4b31-a06d-fa877278990f', 't25nv749@gmail.com')::jsonb, 'email', '3cc39462-aeab-4b31-a06d-fa877278990f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3cc39462-aeab-4b31-a06d-fa877278990f', 'FATHIMA C K', 't25nv749@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3cc39462-aeab-4b31-a06d-fa877278990f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3cc39462-aeab-4b31-a06d-fa877278990f', 'T25NV749', now(), now());

    -- Teacher: FATHIMA FAIHA (T25DC778)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7398bcda-96bf-4834-9fbd-905b789f5933', 'authenticated', 'authenticated', 't25dc778@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA FAIHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7398bcda-96bf-4834-9fbd-905b789f5933', '7398bcda-96bf-4834-9fbd-905b789f5933', format('{"sub":"%s","email":"%s"}', '7398bcda-96bf-4834-9fbd-905b789f5933', 't25dc778@gmail.com')::jsonb, 'email', '7398bcda-96bf-4834-9fbd-905b789f5933', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7398bcda-96bf-4834-9fbd-905b789f5933', 'FATHIMA FAIHA', 't25dc778@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7398bcda-96bf-4834-9fbd-905b789f5933', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7398bcda-96bf-4834-9fbd-905b789f5933', 'T25DC778', now(), now());

    -- Teacher: FATHIMA FAYAS (T25NV756)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '05df3d0b-0871-483c-af86-2522b30d0762', 'authenticated', 'authenticated', 't25nv756@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA FAYAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '05df3d0b-0871-483c-af86-2522b30d0762', '05df3d0b-0871-483c-af86-2522b30d0762', format('{"sub":"%s","email":"%s"}', '05df3d0b-0871-483c-af86-2522b30d0762', 't25nv756@gmail.com')::jsonb, 'email', '05df3d0b-0871-483c-af86-2522b30d0762', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('05df3d0b-0871-483c-af86-2522b30d0762', 'FATHIMA FAYAS', 't25nv756@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('05df3d0b-0871-483c-af86-2522b30d0762', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('05df3d0b-0871-483c-af86-2522b30d0762', 'T25NV756', now(), now());

    -- Teacher: FATHIMA FITHA PK (T24OC399)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7390b805-4cbd-4168-8c41-0e47d816543c', 'authenticated', 'authenticated', 't24oc399@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA FITHA PK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7390b805-4cbd-4168-8c41-0e47d816543c', '7390b805-4cbd-4168-8c41-0e47d816543c', format('{"sub":"%s","email":"%s"}', '7390b805-4cbd-4168-8c41-0e47d816543c', 't24oc399@gmail.com')::jsonb, 'email', '7390b805-4cbd-4168-8c41-0e47d816543c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7390b805-4cbd-4168-8c41-0e47d816543c', 'FATHIMA FITHA PK', 't24oc399@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7390b805-4cbd-4168-8c41-0e47d816543c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7390b805-4cbd-4168-8c41-0e47d816543c', 'T24OC399', now(), now());

    -- Teacher: FATHIMA HANANA (T23OC64)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2334eafa-35e5-4613-a74c-37ec6200a973', 'authenticated', 'authenticated', 't23oc64@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA HANANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2334eafa-35e5-4613-a74c-37ec6200a973', '2334eafa-35e5-4613-a74c-37ec6200a973', format('{"sub":"%s","email":"%s"}', '2334eafa-35e5-4613-a74c-37ec6200a973', 't23oc64@gmail.com')::jsonb, 'email', '2334eafa-35e5-4613-a74c-37ec6200a973', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2334eafa-35e5-4613-a74c-37ec6200a973', 'FATHIMA HANANA', 't23oc64@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2334eafa-35e5-4613-a74c-37ec6200a973', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2334eafa-35e5-4613-a74c-37ec6200a973', 'T23OC64', now(), now());

    -- Teacher: FATHIMA HIBA (T24MA207)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '348c031f-0b82-4003-a0b0-1d5e99d91fcf', 'authenticated', 'authenticated', 't24ma207@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA HIBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '348c031f-0b82-4003-a0b0-1d5e99d91fcf', '348c031f-0b82-4003-a0b0-1d5e99d91fcf', format('{"sub":"%s","email":"%s"}', '348c031f-0b82-4003-a0b0-1d5e99d91fcf', 't24ma207@gmail.com')::jsonb, 'email', '348c031f-0b82-4003-a0b0-1d5e99d91fcf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('348c031f-0b82-4003-a0b0-1d5e99d91fcf', 'FATHIMA HIBA', 't24ma207@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('348c031f-0b82-4003-a0b0-1d5e99d91fcf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('348c031f-0b82-4003-a0b0-1d5e99d91fcf', 'T24MA207', now(), now());

    -- Teacher: FATHIMA HIBA  ENG (T25AP537)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4f9808da-26f9-49d6-bf38-9ec4b5b0535e', 'authenticated', 'authenticated', 't25ap537@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA HIBA  ENG"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4f9808da-26f9-49d6-bf38-9ec4b5b0535e', '4f9808da-26f9-49d6-bf38-9ec4b5b0535e', format('{"sub":"%s","email":"%s"}', '4f9808da-26f9-49d6-bf38-9ec4b5b0535e', 't25ap537@gmail.com')::jsonb, 'email', '4f9808da-26f9-49d6-bf38-9ec4b5b0535e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4f9808da-26f9-49d6-bf38-9ec4b5b0535e', 'FATHIMA HIBA  ENG', 't25ap537@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4f9808da-26f9-49d6-bf38-9ec4b5b0535e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4f9808da-26f9-49d6-bf38-9ec4b5b0535e', 'T25AP537', now(), now());

    -- Teacher: FATHIMA HIBA CHEM (T25AP535)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', 'authenticated', 'authenticated', 't25ap535@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA HIBA CHEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', 'c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', format('{"sub":"%s","email":"%s"}', 'c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', 't25ap535@gmail.com')::jsonb, 'email', 'c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', 'FATHIMA HIBA CHEM', 't25ap535@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c6000b3b-d81f-4cfd-b99f-c2ddb4517d8f', 'T25AP535', now(), now());

    -- Teacher: FATHIMA HIMNA M.K (T25AP496)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '02b81d2d-8242-4868-8ad2-f91d28769a0b', 'authenticated', 'authenticated', 't25ap496@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA HIMNA M.K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '02b81d2d-8242-4868-8ad2-f91d28769a0b', '02b81d2d-8242-4868-8ad2-f91d28769a0b', format('{"sub":"%s","email":"%s"}', '02b81d2d-8242-4868-8ad2-f91d28769a0b', 't25ap496@gmail.com')::jsonb, 'email', '02b81d2d-8242-4868-8ad2-f91d28769a0b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('02b81d2d-8242-4868-8ad2-f91d28769a0b', 'FATHIMA HIMNA M.K', 't25ap496@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('02b81d2d-8242-4868-8ad2-f91d28769a0b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('02b81d2d-8242-4868-8ad2-f91d28769a0b', 'T25AP496', now(), now());

    -- Teacher: FATHIMA K (T24JL297)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', 'authenticated', 'authenticated', 't24jl297@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', '2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', format('{"sub":"%s","email":"%s"}', '2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', 't24jl297@gmail.com')::jsonb, 'email', '2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', 'FATHIMA K', 't24jl297@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2aa627f2-fae2-43fb-9ec9-7a0e788ed5a6', 'T24JL297', now(), now());

    -- Teacher: FATHIMA MAJEED (T24AG340)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5ef4c165-7d0f-4d24-b837-0d3260a56b58', 'authenticated', 'authenticated', 't24ag340@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA MAJEED"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5ef4c165-7d0f-4d24-b837-0d3260a56b58', '5ef4c165-7d0f-4d24-b837-0d3260a56b58', format('{"sub":"%s","email":"%s"}', '5ef4c165-7d0f-4d24-b837-0d3260a56b58', 't24ag340@gmail.com')::jsonb, 'email', '5ef4c165-7d0f-4d24-b837-0d3260a56b58', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5ef4c165-7d0f-4d24-b837-0d3260a56b58', 'FATHIMA MAJEED', 't24ag340@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5ef4c165-7d0f-4d24-b837-0d3260a56b58', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5ef4c165-7d0f-4d24-b837-0d3260a56b58', 'T24AG340', now(), now());

    -- Teacher: FATHIMA NASREEN (T24SP286)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd2eee708-dce7-4ecc-917d-3e56c782d44d', 'authenticated', 'authenticated', 't24sp286@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NASREEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd2eee708-dce7-4ecc-917d-3e56c782d44d', 'd2eee708-dce7-4ecc-917d-3e56c782d44d', format('{"sub":"%s","email":"%s"}', 'd2eee708-dce7-4ecc-917d-3e56c782d44d', 't24sp286@gmail.com')::jsonb, 'email', 'd2eee708-dce7-4ecc-917d-3e56c782d44d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d2eee708-dce7-4ecc-917d-3e56c782d44d', 'FATHIMA NASREEN', 't24sp286@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d2eee708-dce7-4ecc-917d-3e56c782d44d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d2eee708-dce7-4ecc-917d-3e56c782d44d', 'T24SP286', now(), now());

    -- Teacher: FATHIMA NASRIN (T25OC735)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bd7b9119-3175-4d48-907d-f3c9fcad37fb', 'authenticated', 'authenticated', 't25oc735@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NASRIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bd7b9119-3175-4d48-907d-f3c9fcad37fb', 'bd7b9119-3175-4d48-907d-f3c9fcad37fb', format('{"sub":"%s","email":"%s"}', 'bd7b9119-3175-4d48-907d-f3c9fcad37fb', 't25oc735@gmail.com')::jsonb, 'email', 'bd7b9119-3175-4d48-907d-f3c9fcad37fb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bd7b9119-3175-4d48-907d-f3c9fcad37fb', 'FATHIMA NASRIN', 't25oc735@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bd7b9119-3175-4d48-907d-f3c9fcad37fb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bd7b9119-3175-4d48-907d-f3c9fcad37fb', 'T25OC735', now(), now());

    -- Teacher: FATHIMA NEDA (T25JL610)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0efe6a32-4ffb-4d32-a7a7-de2a926e143b', 'authenticated', 'authenticated', 't25jl610@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NEDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0efe6a32-4ffb-4d32-a7a7-de2a926e143b', '0efe6a32-4ffb-4d32-a7a7-de2a926e143b', format('{"sub":"%s","email":"%s"}', '0efe6a32-4ffb-4d32-a7a7-de2a926e143b', 't25jl610@gmail.com')::jsonb, 'email', '0efe6a32-4ffb-4d32-a7a7-de2a926e143b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0efe6a32-4ffb-4d32-a7a7-de2a926e143b', 'FATHIMA NEDA', 't25jl610@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0efe6a32-4ffb-4d32-a7a7-de2a926e143b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0efe6a32-4ffb-4d32-a7a7-de2a926e143b', 'T25JL610', now(), now());

    -- Teacher: FATHIMA NOORA P (T25JN441)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '24c5d67c-d217-4c5f-bb81-d26bda50f4e2', 'authenticated', 'authenticated', 't25jn441@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NOORA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '24c5d67c-d217-4c5f-bb81-d26bda50f4e2', '24c5d67c-d217-4c5f-bb81-d26bda50f4e2', format('{"sub":"%s","email":"%s"}', '24c5d67c-d217-4c5f-bb81-d26bda50f4e2', 't25jn441@gmail.com')::jsonb, 'email', '24c5d67c-d217-4c5f-bb81-d26bda50f4e2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('24c5d67c-d217-4c5f-bb81-d26bda50f4e2', 'FATHIMA NOORA P', 't25jn441@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('24c5d67c-d217-4c5f-bb81-d26bda50f4e2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('24c5d67c-d217-4c5f-bb81-d26bda50f4e2', 'T25JN441', now(), now());

    -- Teacher: FATHIMA NOORAIN (T25DC777)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c4770d65-d9d4-4bb9-96ea-cfeec59c774b', 'authenticated', 'authenticated', 't25dc777@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NOORAIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c4770d65-d9d4-4bb9-96ea-cfeec59c774b', 'c4770d65-d9d4-4bb9-96ea-cfeec59c774b', format('{"sub":"%s","email":"%s"}', 'c4770d65-d9d4-4bb9-96ea-cfeec59c774b', 't25dc777@gmail.com')::jsonb, 'email', 'c4770d65-d9d4-4bb9-96ea-cfeec59c774b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c4770d65-d9d4-4bb9-96ea-cfeec59c774b', 'FATHIMA NOORAIN', 't25dc777@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c4770d65-d9d4-4bb9-96ea-cfeec59c774b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c4770d65-d9d4-4bb9-96ea-cfeec59c774b', 'T25DC777', now(), now());

    -- Teacher: FATHIMA NUBLATH (T25NV755)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '09514fff-ec43-4e9c-b29f-dafa8528e46d', 'authenticated', 'authenticated', 't25nv755@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NUBLATH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '09514fff-ec43-4e9c-b29f-dafa8528e46d', '09514fff-ec43-4e9c-b29f-dafa8528e46d', format('{"sub":"%s","email":"%s"}', '09514fff-ec43-4e9c-b29f-dafa8528e46d', 't25nv755@gmail.com')::jsonb, 'email', '09514fff-ec43-4e9c-b29f-dafa8528e46d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('09514fff-ec43-4e9c-b29f-dafa8528e46d', 'FATHIMA NUBLATH', 't25nv755@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('09514fff-ec43-4e9c-b29f-dafa8528e46d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('09514fff-ec43-4e9c-b29f-dafa8528e46d', 'T25NV755', now(), now());

    -- Teacher: FATHIMA NURA (T25AP497)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c2e5b76c-291b-46dd-8b4f-cee589b65e37', 'authenticated', 'authenticated', 't25ap497@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NURA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c2e5b76c-291b-46dd-8b4f-cee589b65e37', 'c2e5b76c-291b-46dd-8b4f-cee589b65e37', format('{"sub":"%s","email":"%s"}', 'c2e5b76c-291b-46dd-8b4f-cee589b65e37', 't25ap497@gmail.com')::jsonb, 'email', 'c2e5b76c-291b-46dd-8b4f-cee589b65e37', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c2e5b76c-291b-46dd-8b4f-cee589b65e37', 'FATHIMA NURA', 't25ap497@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c2e5b76c-291b-46dd-8b4f-cee589b65e37', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c2e5b76c-291b-46dd-8b4f-cee589b65e37', 'T25AP497', now(), now());

    -- Teacher: FATHIMA NUSREEL (T23NV86)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1a12e9d0-83f0-443c-815f-7f329f4f3218', 'authenticated', 'authenticated', 't23nv86@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NUSREEL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1a12e9d0-83f0-443c-815f-7f329f4f3218', '1a12e9d0-83f0-443c-815f-7f329f4f3218', format('{"sub":"%s","email":"%s"}', '1a12e9d0-83f0-443c-815f-7f329f4f3218', 't23nv86@gmail.com')::jsonb, 'email', '1a12e9d0-83f0-443c-815f-7f329f4f3218', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1a12e9d0-83f0-443c-815f-7f329f4f3218', 'FATHIMA NUSREEL', 't23nv86@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1a12e9d0-83f0-443c-815f-7f329f4f3218', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1a12e9d0-83f0-443c-815f-7f329f4f3218', 'T23NV86', now(), now());

    -- Teacher: FATHIMA NUZHA (T25AP555)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', 'authenticated', 'authenticated', 't25ap555@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA NUZHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', '1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', format('{"sub":"%s","email":"%s"}', '1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', 't25ap555@gmail.com')::jsonb, 'email', '1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', 'FATHIMA NUZHA', 't25ap555@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1bc8a2ca-9ab2-44ca-b692-e9fc9a9ca420', 'T25AP555', now(), now());

    -- Teacher: FATHIMA PTP (T25AP540)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f37fc971-b512-4953-ae09-b5a51e633433', 'authenticated', 'authenticated', 't25ap540@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA PTP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f37fc971-b512-4953-ae09-b5a51e633433', 'f37fc971-b512-4953-ae09-b5a51e633433', format('{"sub":"%s","email":"%s"}', 'f37fc971-b512-4953-ae09-b5a51e633433', 't25ap540@gmail.com')::jsonb, 'email', 'f37fc971-b512-4953-ae09-b5a51e633433', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f37fc971-b512-4953-ae09-b5a51e633433', 'FATHIMA PTP', 't25ap540@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f37fc971-b512-4953-ae09-b5a51e633433', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f37fc971-b512-4953-ae09-b5a51e633433', 'T25AP540', now(), now());

    -- Teacher: FATHIMA RANA (T25JL604)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5409fdbe-b303-48b7-a94e-1e2ead486b30', 'authenticated', 'authenticated', 't25jl604@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA RANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5409fdbe-b303-48b7-a94e-1e2ead486b30', '5409fdbe-b303-48b7-a94e-1e2ead486b30', format('{"sub":"%s","email":"%s"}', '5409fdbe-b303-48b7-a94e-1e2ead486b30', 't25jl604@gmail.com')::jsonb, 'email', '5409fdbe-b303-48b7-a94e-1e2ead486b30', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5409fdbe-b303-48b7-a94e-1e2ead486b30', 'FATHIMA RANA', 't25jl604@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5409fdbe-b303-48b7-a94e-1e2ead486b30', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5409fdbe-b303-48b7-a94e-1e2ead486b30', 'T25JL604', now(), now());

    -- Teacher: FATHIMA RIDHA (T25DC787)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7f637385-aa9c-4b26-9d31-949203297fea', 'authenticated', 'authenticated', 't25dc787@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA RIDHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7f637385-aa9c-4b26-9d31-949203297fea', '7f637385-aa9c-4b26-9d31-949203297fea', format('{"sub":"%s","email":"%s"}', '7f637385-aa9c-4b26-9d31-949203297fea', 't25dc787@gmail.com')::jsonb, 'email', '7f637385-aa9c-4b26-9d31-949203297fea', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7f637385-aa9c-4b26-9d31-949203297fea', 'FATHIMA RIDHA', 't25dc787@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7f637385-aa9c-4b26-9d31-949203297fea', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7f637385-aa9c-4b26-9d31-949203297fea', 'T25DC787', now(), now());

    -- Teacher: FATHIMA RIFNA (T25SP676)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '811fdf8e-071d-4202-adc3-16d27ffac0d6', 'authenticated', 'authenticated', 't25sp676@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA RIFNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '811fdf8e-071d-4202-adc3-16d27ffac0d6', '811fdf8e-071d-4202-adc3-16d27ffac0d6', format('{"sub":"%s","email":"%s"}', '811fdf8e-071d-4202-adc3-16d27ffac0d6', 't25sp676@gmail.com')::jsonb, 'email', '811fdf8e-071d-4202-adc3-16d27ffac0d6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('811fdf8e-071d-4202-adc3-16d27ffac0d6', 'FATHIMA RIFNA', 't25sp676@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('811fdf8e-071d-4202-adc3-16d27ffac0d6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('811fdf8e-071d-4202-adc3-16d27ffac0d6', 'T25SP676', now(), now());

    -- Teacher: FATHIMA RINSHANA (T26FB839)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', 'authenticated', 'authenticated', 't26fb839@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA RINSHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', '1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', format('{"sub":"%s","email":"%s"}', '1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', 't26fb839@gmail.com')::jsonb, 'email', '1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', 'FATHIMA RINSHANA', 't26fb839@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1c8ef3b2-1d60-474c-8cd8-c800e15aa9c6', 'T26FB839', now(), now());

    -- Teacher: FATHIMA RIYA NV (T24SP361)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f21c95e4-8f5c-48d3-a384-f628c5e0fff5', 'authenticated', 'authenticated', 't24sp361@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA RIYA NV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f21c95e4-8f5c-48d3-a384-f628c5e0fff5', 'f21c95e4-8f5c-48d3-a384-f628c5e0fff5', format('{"sub":"%s","email":"%s"}', 'f21c95e4-8f5c-48d3-a384-f628c5e0fff5', 't24sp361@gmail.com')::jsonb, 'email', 'f21c95e4-8f5c-48d3-a384-f628c5e0fff5', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f21c95e4-8f5c-48d3-a384-f628c5e0fff5', 'FATHIMA RIYA NV', 't24sp361@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f21c95e4-8f5c-48d3-a384-f628c5e0fff5', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f21c95e4-8f5c-48d3-a384-f628c5e0fff5', 'T24SP361', now(), now());

    -- Teacher: FATHIMA SABEENA (T26JN804)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ee2ef079-aa5f-4bc5-8231-dcec016a88e1', 'authenticated', 'authenticated', 't26jn804@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SABEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ee2ef079-aa5f-4bc5-8231-dcec016a88e1', 'ee2ef079-aa5f-4bc5-8231-dcec016a88e1', format('{"sub":"%s","email":"%s"}', 'ee2ef079-aa5f-4bc5-8231-dcec016a88e1', 't26jn804@gmail.com')::jsonb, 'email', 'ee2ef079-aa5f-4bc5-8231-dcec016a88e1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ee2ef079-aa5f-4bc5-8231-dcec016a88e1', 'FATHIMA SABEENA', 't26jn804@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ee2ef079-aa5f-4bc5-8231-dcec016a88e1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ee2ef079-aa5f-4bc5-8231-dcec016a88e1', 'T26JN804', now(), now());

    -- Teacher: FATHIMA SAHLA (T25AG631)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c6408b57-e2f1-416b-ac7f-246db0ae6bd7', 'authenticated', 'authenticated', 't25ag631@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SAHLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c6408b57-e2f1-416b-ac7f-246db0ae6bd7', 'c6408b57-e2f1-416b-ac7f-246db0ae6bd7', format('{"sub":"%s","email":"%s"}', 'c6408b57-e2f1-416b-ac7f-246db0ae6bd7', 't25ag631@gmail.com')::jsonb, 'email', 'c6408b57-e2f1-416b-ac7f-246db0ae6bd7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c6408b57-e2f1-416b-ac7f-246db0ae6bd7', 'FATHIMA SAHLA', 't25ag631@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c6408b57-e2f1-416b-ac7f-246db0ae6bd7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c6408b57-e2f1-416b-ac7f-246db0ae6bd7', 'T25AG631', now(), now());

    -- Teacher: FATHIMA SANA (T25JL595)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a3fe668f-219a-4684-8523-079dda94fa0b', 'authenticated', 'authenticated', 't25jl595@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a3fe668f-219a-4684-8523-079dda94fa0b', 'a3fe668f-219a-4684-8523-079dda94fa0b', format('{"sub":"%s","email":"%s"}', 'a3fe668f-219a-4684-8523-079dda94fa0b', 't25jl595@gmail.com')::jsonb, 'email', 'a3fe668f-219a-4684-8523-079dda94fa0b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a3fe668f-219a-4684-8523-079dda94fa0b', 'FATHIMA SANA', 't25jl595@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a3fe668f-219a-4684-8523-079dda94fa0b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a3fe668f-219a-4684-8523-079dda94fa0b', 'T25JL595', now(), now());

    -- Teacher: FATHIMA SHAIMA (T25OC700)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7514e6de-cc01-43f3-8e28-f070e9270b9d', 'authenticated', 'authenticated', 't25oc700@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SHAIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7514e6de-cc01-43f3-8e28-f070e9270b9d', '7514e6de-cc01-43f3-8e28-f070e9270b9d', format('{"sub":"%s","email":"%s"}', '7514e6de-cc01-43f3-8e28-f070e9270b9d', 't25oc700@gmail.com')::jsonb, 'email', '7514e6de-cc01-43f3-8e28-f070e9270b9d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7514e6de-cc01-43f3-8e28-f070e9270b9d', 'FATHIMA SHAIMA', 't25oc700@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7514e6de-cc01-43f3-8e28-f070e9270b9d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7514e6de-cc01-43f3-8e28-f070e9270b9d', 'T25OC700', now(), now());

    -- Teacher: FATHIMA SUADHA (T26JN811)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8e369d3b-c604-4011-9026-d6e619ac132b', 'authenticated', 'authenticated', 't26jn811@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SUADHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8e369d3b-c604-4011-9026-d6e619ac132b', '8e369d3b-c604-4011-9026-d6e619ac132b', format('{"sub":"%s","email":"%s"}', '8e369d3b-c604-4011-9026-d6e619ac132b', 't26jn811@gmail.com')::jsonb, 'email', '8e369d3b-c604-4011-9026-d6e619ac132b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8e369d3b-c604-4011-9026-d6e619ac132b', 'FATHIMA SUADHA', 't26jn811@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8e369d3b-c604-4011-9026-d6e619ac132b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8e369d3b-c604-4011-9026-d6e619ac132b', 'T26JN811', now(), now());

    -- Teacher: FATHIMA SUHAILA (T25OC734)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '08ab7007-dc65-48c3-ad4e-3bebe14aa270', 'authenticated', 'authenticated', 't25oc734@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SUHAILA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '08ab7007-dc65-48c3-ad4e-3bebe14aa270', '08ab7007-dc65-48c3-ad4e-3bebe14aa270', format('{"sub":"%s","email":"%s"}', '08ab7007-dc65-48c3-ad4e-3bebe14aa270', 't25oc734@gmail.com')::jsonb, 'email', '08ab7007-dc65-48c3-ad4e-3bebe14aa270', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('08ab7007-dc65-48c3-ad4e-3bebe14aa270', 'FATHIMA SUHAILA', 't25oc734@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('08ab7007-dc65-48c3-ad4e-3bebe14aa270', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('08ab7007-dc65-48c3-ad4e-3bebe14aa270', 'T25OC734', now(), now());

    -- Teacher: FATHIMA SUHARA (T25DC779)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9464c57c-8a4a-43fa-8928-699f43df1049', 'authenticated', 'authenticated', 't25dc779@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA SUHARA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9464c57c-8a4a-43fa-8928-699f43df1049', '9464c57c-8a4a-43fa-8928-699f43df1049', format('{"sub":"%s","email":"%s"}', '9464c57c-8a4a-43fa-8928-699f43df1049', 't25dc779@gmail.com')::jsonb, 'email', '9464c57c-8a4a-43fa-8928-699f43df1049', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9464c57c-8a4a-43fa-8928-699f43df1049', 'FATHIMA SUHARA', 't25dc779@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9464c57c-8a4a-43fa-8928-699f43df1049', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9464c57c-8a4a-43fa-8928-699f43df1049', 'T25DC779', now(), now());

    -- Teacher: FATHIMA THESNI (T24JL304)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', 'authenticated', 'authenticated', 't24jl304@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA THESNI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', '7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', format('{"sub":"%s","email":"%s"}', '7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', 't24jl304@gmail.com')::jsonb, 'email', '7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', 'FATHIMA THESNI', 't24jl304@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7a4c5786-fe36-4e15-83a5-2c18bf8f7c63', 'T24JL304', now(), now());

    -- Teacher: FATHIMA TS (T24SP362)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '828a711b-5d7d-417f-a076-6243781b1f3f', 'authenticated', 'authenticated', 't24sp362@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA TS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '828a711b-5d7d-417f-a076-6243781b1f3f', '828a711b-5d7d-417f-a076-6243781b1f3f', format('{"sub":"%s","email":"%s"}', '828a711b-5d7d-417f-a076-6243781b1f3f', 't24sp362@gmail.com')::jsonb, 'email', '828a711b-5d7d-417f-a076-6243781b1f3f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('828a711b-5d7d-417f-a076-6243781b1f3f', 'FATHIMA TS', 't24sp362@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('828a711b-5d7d-417f-a076-6243781b1f3f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('828a711b-5d7d-417f-a076-6243781b1f3f', 'T24SP362', now(), now());

    -- Teacher: FATHIMA VASEEM KT (T25AP545)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'df73633a-e40c-4458-bdcb-f0da7d9a5866', 'authenticated', 'authenticated', 't25ap545@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA VASEEM KT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'df73633a-e40c-4458-bdcb-f0da7d9a5866', 'df73633a-e40c-4458-bdcb-f0da7d9a5866', format('{"sub":"%s","email":"%s"}', 'df73633a-e40c-4458-bdcb-f0da7d9a5866', 't25ap545@gmail.com')::jsonb, 'email', 'df73633a-e40c-4458-bdcb-f0da7d9a5866', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('df73633a-e40c-4458-bdcb-f0da7d9a5866', 'FATHIMA VASEEM KT', 't25ap545@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('df73633a-e40c-4458-bdcb-f0da7d9a5866', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('df73633a-e40c-4458-bdcb-f0da7d9a5866', 'T25AP545', now(), now());

    -- Teacher: FATHIMA YUSUF (T25DC781)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '87748982-2500-4d24-85af-17717a7adf9a', 'authenticated', 'authenticated', 't25dc781@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMA YUSUF"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '87748982-2500-4d24-85af-17717a7adf9a', '87748982-2500-4d24-85af-17717a7adf9a', format('{"sub":"%s","email":"%s"}', '87748982-2500-4d24-85af-17717a7adf9a', 't25dc781@gmail.com')::jsonb, 'email', '87748982-2500-4d24-85af-17717a7adf9a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('87748982-2500-4d24-85af-17717a7adf9a', 'FATHIMA YUSUF', 't25dc781@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('87748982-2500-4d24-85af-17717a7adf9a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('87748982-2500-4d24-85af-17717a7adf9a', 'T25DC781', now(), now());

    -- Teacher: FATHIMATH IRFANA (T25AP564)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e93a84e5-f22d-464a-857f-3f221c335079', 'authenticated', 'authenticated', 't25ap564@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMATH IRFANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e93a84e5-f22d-464a-857f-3f221c335079', 'e93a84e5-f22d-464a-857f-3f221c335079', format('{"sub":"%s","email":"%s"}', 'e93a84e5-f22d-464a-857f-3f221c335079', 't25ap564@gmail.com')::jsonb, 'email', 'e93a84e5-f22d-464a-857f-3f221c335079', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e93a84e5-f22d-464a-857f-3f221c335079', 'FATHIMATH IRFANA', 't25ap564@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e93a84e5-f22d-464a-857f-3f221c335079', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e93a84e5-f22d-464a-857f-3f221c335079', 'T25AP564', now(), now());

    -- Teacher: FATHIMATH JASEERA KMC (T24SP383)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ae2ebca7-9875-4d71-8f5a-8d883e0208c8', 'authenticated', 'authenticated', 't24sp383@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMATH JASEERA KMC"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ae2ebca7-9875-4d71-8f5a-8d883e0208c8', 'ae2ebca7-9875-4d71-8f5a-8d883e0208c8', format('{"sub":"%s","email":"%s"}', 'ae2ebca7-9875-4d71-8f5a-8d883e0208c8', 't24sp383@gmail.com')::jsonb, 'email', 'ae2ebca7-9875-4d71-8f5a-8d883e0208c8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ae2ebca7-9875-4d71-8f5a-8d883e0208c8', 'FATHIMATH JASEERA KMC', 't24sp383@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ae2ebca7-9875-4d71-8f5a-8d883e0208c8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ae2ebca7-9875-4d71-8f5a-8d883e0208c8', 'T24SP383', now(), now());

    -- Teacher: FATHIMATH SAHLA (T25SP654)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '58b8dced-e298-49ee-a47b-541966f8a785', 'authenticated', 'authenticated', 't25sp654@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMATH SAHLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '58b8dced-e298-49ee-a47b-541966f8a785', '58b8dced-e298-49ee-a47b-541966f8a785', format('{"sub":"%s","email":"%s"}', '58b8dced-e298-49ee-a47b-541966f8a785', 't25sp654@gmail.com')::jsonb, 'email', '58b8dced-e298-49ee-a47b-541966f8a785', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('58b8dced-e298-49ee-a47b-541966f8a785', 'FATHIMATH SAHLA', 't25sp654@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('58b8dced-e298-49ee-a47b-541966f8a785', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('58b8dced-e298-49ee-a47b-541966f8a785', 'T25SP654', now(), now());

    -- Teacher: FATHIMATH SHALVA P (T25AP531)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '352e0167-7fa1-43ff-96bf-a2eb885d0a17', 'authenticated', 'authenticated', 't25ap531@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMATH SHALVA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '352e0167-7fa1-43ff-96bf-a2eb885d0a17', '352e0167-7fa1-43ff-96bf-a2eb885d0a17', format('{"sub":"%s","email":"%s"}', '352e0167-7fa1-43ff-96bf-a2eb885d0a17', 't25ap531@gmail.com')::jsonb, 'email', '352e0167-7fa1-43ff-96bf-a2eb885d0a17', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('352e0167-7fa1-43ff-96bf-a2eb885d0a17', 'FATHIMATH SHALVA P', 't25ap531@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('352e0167-7fa1-43ff-96bf-a2eb885d0a17', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('352e0167-7fa1-43ff-96bf-a2eb885d0a17', 'T25AP531', now(), now());

    -- Teacher: FATHIMATH SHIBLA (T25OC712)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8c2876ac-1935-4b32-ace9-b273e539dedb', 'authenticated', 'authenticated', 't25oc712@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMATH SHIBLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8c2876ac-1935-4b32-ace9-b273e539dedb', '8c2876ac-1935-4b32-ace9-b273e539dedb', format('{"sub":"%s","email":"%s"}', '8c2876ac-1935-4b32-ace9-b273e539dedb', 't25oc712@gmail.com')::jsonb, 'email', '8c2876ac-1935-4b32-ace9-b273e539dedb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8c2876ac-1935-4b32-ace9-b273e539dedb', 'FATHIMATH SHIBLA', 't25oc712@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8c2876ac-1935-4b32-ace9-b273e539dedb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8c2876ac-1935-4b32-ace9-b273e539dedb', 'T25OC712', now(), now());

    -- Teacher: FATHIMATHUL SANA ASAD (T26FB827)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dcbf244e-0af4-436b-b31c-5bb214d1d8a6', 'authenticated', 'authenticated', 't26fb827@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATHIMATHUL SANA ASAD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dcbf244e-0af4-436b-b31c-5bb214d1d8a6', 'dcbf244e-0af4-436b-b31c-5bb214d1d8a6', format('{"sub":"%s","email":"%s"}', 'dcbf244e-0af4-436b-b31c-5bb214d1d8a6', 't26fb827@gmail.com')::jsonb, 'email', 'dcbf244e-0af4-436b-b31c-5bb214d1d8a6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dcbf244e-0af4-436b-b31c-5bb214d1d8a6', 'FATHIMATHUL SANA ASAD', 't26fb827@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dcbf244e-0af4-436b-b31c-5bb214d1d8a6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dcbf244e-0af4-436b-b31c-5bb214d1d8a6', 'T26FB827', now(), now());

    -- Teacher: FATIMA BUSTHANA (T25AP544)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '00fb81b9-0146-4355-b14d-2e651c41ff7b', 'authenticated', 'authenticated', 't25ap544@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FATIMA BUSTHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '00fb81b9-0146-4355-b14d-2e651c41ff7b', '00fb81b9-0146-4355-b14d-2e651c41ff7b', format('{"sub":"%s","email":"%s"}', '00fb81b9-0146-4355-b14d-2e651c41ff7b', 't25ap544@gmail.com')::jsonb, 'email', '00fb81b9-0146-4355-b14d-2e651c41ff7b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('00fb81b9-0146-4355-b14d-2e651c41ff7b', 'FATIMA BUSTHANA', 't25ap544@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('00fb81b9-0146-4355-b14d-2e651c41ff7b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('00fb81b9-0146-4355-b14d-2e651c41ff7b', 'T25AP544', now(), now());

    -- Teacher: FAZILA RISWANA (T25OC714)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd3201484-ec84-496a-a6bb-39749c59f0e7', 'authenticated', 'authenticated', 't25oc714@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FAZILA RISWANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd3201484-ec84-496a-a6bb-39749c59f0e7', 'd3201484-ec84-496a-a6bb-39749c59f0e7', format('{"sub":"%s","email":"%s"}', 'd3201484-ec84-496a-a6bb-39749c59f0e7', 't25oc714@gmail.com')::jsonb, 'email', 'd3201484-ec84-496a-a6bb-39749c59f0e7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d3201484-ec84-496a-a6bb-39749c59f0e7', 'FAZILA RISWANA', 't25oc714@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d3201484-ec84-496a-a6bb-39749c59f0e7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d3201484-ec84-496a-a6bb-39749c59f0e7', 'T25OC714', now(), now());

    -- Teacher: FEBEENA T M (T25NV745)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c5510945-5af8-41fd-8167-13c429966a3c', 'authenticated', 'authenticated', 't25nv745@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FEBEENA T M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c5510945-5af8-41fd-8167-13c429966a3c', 'c5510945-5af8-41fd-8167-13c429966a3c', format('{"sub":"%s","email":"%s"}', 'c5510945-5af8-41fd-8167-13c429966a3c', 't25nv745@gmail.com')::jsonb, 'email', 'c5510945-5af8-41fd-8167-13c429966a3c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c5510945-5af8-41fd-8167-13c429966a3c', 'FEBEENA T M', 't25nv745@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c5510945-5af8-41fd-8167-13c429966a3c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c5510945-5af8-41fd-8167-13c429966a3c', 'T25NV745', now(), now());

    -- Teacher: FIDA FATHIMA (T24OC408)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd7ed5c26-9c82-4d49-9bbd-0577c40d77a1', 'authenticated', 'authenticated', 't24oc408@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FIDA FATHIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd7ed5c26-9c82-4d49-9bbd-0577c40d77a1', 'd7ed5c26-9c82-4d49-9bbd-0577c40d77a1', format('{"sub":"%s","email":"%s"}', 'd7ed5c26-9c82-4d49-9bbd-0577c40d77a1', 't24oc408@gmail.com')::jsonb, 'email', 'd7ed5c26-9c82-4d49-9bbd-0577c40d77a1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d7ed5c26-9c82-4d49-9bbd-0577c40d77a1', 'FIDA FATHIMA', 't24oc408@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d7ed5c26-9c82-4d49-9bbd-0577c40d77a1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d7ed5c26-9c82-4d49-9bbd-0577c40d77a1', 'T24OC408', now(), now());

    -- Teacher: FIDHA (T24MA229)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '72fa33d7-af5c-47a8-b945-ceab91a1d8bf', 'authenticated', 'authenticated', 't24ma229@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FIDHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '72fa33d7-af5c-47a8-b945-ceab91a1d8bf', '72fa33d7-af5c-47a8-b945-ceab91a1d8bf', format('{"sub":"%s","email":"%s"}', '72fa33d7-af5c-47a8-b945-ceab91a1d8bf', 't24ma229@gmail.com')::jsonb, 'email', '72fa33d7-af5c-47a8-b945-ceab91a1d8bf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('72fa33d7-af5c-47a8-b945-ceab91a1d8bf', 'FIDHA', 't24ma229@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('72fa33d7-af5c-47a8-b945-ceab91a1d8bf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('72fa33d7-af5c-47a8-b945-ceab91a1d8bf', 'T24MA229', now(), now());

    -- Teacher: FIDHA SUBAIR (T25OC730)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'db537983-c35f-42be-98b9-c81278f44a0f', 'authenticated', 'authenticated', 't25oc730@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FIDHA SUBAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'db537983-c35f-42be-98b9-c81278f44a0f', 'db537983-c35f-42be-98b9-c81278f44a0f', format('{"sub":"%s","email":"%s"}', 'db537983-c35f-42be-98b9-c81278f44a0f', 't25oc730@gmail.com')::jsonb, 'email', 'db537983-c35f-42be-98b9-c81278f44a0f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('db537983-c35f-42be-98b9-c81278f44a0f', 'FIDHA SUBAIR', 't25oc730@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('db537983-c35f-42be-98b9-c81278f44a0f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('db537983-c35f-42be-98b9-c81278f44a0f', 'T25OC730', now(), now());

    -- Teacher: FIDHA T (T25OC694)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6ec0c570-6b85-498a-9a96-5b8fe3bdc949', 'authenticated', 'authenticated', 't25oc694@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FIDHA T"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6ec0c570-6b85-498a-9a96-5b8fe3bdc949', '6ec0c570-6b85-498a-9a96-5b8fe3bdc949', format('{"sub":"%s","email":"%s"}', '6ec0c570-6b85-498a-9a96-5b8fe3bdc949', 't25oc694@gmail.com')::jsonb, 'email', '6ec0c570-6b85-498a-9a96-5b8fe3bdc949', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6ec0c570-6b85-498a-9a96-5b8fe3bdc949', 'FIDHA T', 't25oc694@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6ec0c570-6b85-498a-9a96-5b8fe3bdc949', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6ec0c570-6b85-498a-9a96-5b8fe3bdc949', 'T25OC694', now(), now());

    -- Teacher: FIDHA TAREEQ (T24OC407)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5b266418-1f1e-40d6-ad96-56982afb8de4', 'authenticated', 'authenticated', 't24oc407@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FIDHA TAREEQ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5b266418-1f1e-40d6-ad96-56982afb8de4', '5b266418-1f1e-40d6-ad96-56982afb8de4', format('{"sub":"%s","email":"%s"}', '5b266418-1f1e-40d6-ad96-56982afb8de4', 't24oc407@gmail.com')::jsonb, 'email', '5b266418-1f1e-40d6-ad96-56982afb8de4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5b266418-1f1e-40d6-ad96-56982afb8de4', 'FIDHA TAREEQ', 't24oc407@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5b266418-1f1e-40d6-ad96-56982afb8de4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5b266418-1f1e-40d6-ad96-56982afb8de4', 'T24OC407', now(), now());

    -- Teacher: FOUMIDHA HARSHA (T26JN825)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd6a2c678-4d14-4b59-93e0-c8c346d68293', 'authenticated', 'authenticated', 't26jn825@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FOUMIDHA HARSHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd6a2c678-4d14-4b59-93e0-c8c346d68293', 'd6a2c678-4d14-4b59-93e0-c8c346d68293', format('{"sub":"%s","email":"%s"}', 'd6a2c678-4d14-4b59-93e0-c8c346d68293', 't26jn825@gmail.com')::jsonb, 'email', 'd6a2c678-4d14-4b59-93e0-c8c346d68293', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d6a2c678-4d14-4b59-93e0-c8c346d68293', 'FOUMIDHA HARSHA', 't26jn825@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d6a2c678-4d14-4b59-93e0-c8c346d68293', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d6a2c678-4d14-4b59-93e0-c8c346d68293', 'T26JN825', now(), now());

    -- Teacher: FOUSIYA (T24MA285)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0a11558e-f756-42d1-9cb1-124ace35b698', 'authenticated', 'authenticated', 't24ma285@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FOUSIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0a11558e-f756-42d1-9cb1-124ace35b698', '0a11558e-f756-42d1-9cb1-124ace35b698', format('{"sub":"%s","email":"%s"}', '0a11558e-f756-42d1-9cb1-124ace35b698', 't24ma285@gmail.com')::jsonb, 'email', '0a11558e-f756-42d1-9cb1-124ace35b698', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0a11558e-f756-42d1-9cb1-124ace35b698', 'FOUSIYA', 't24ma285@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0a11558e-f756-42d1-9cb1-124ace35b698', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0a11558e-f756-42d1-9cb1-124ace35b698', 'T24MA285', now(), now());

    -- Teacher: FOUSIYA KA (T24NV422)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '503a0629-10df-416b-89d6-eb77c82ea816', 'authenticated', 'authenticated', 't24nv422@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"FOUSIYA KA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '503a0629-10df-416b-89d6-eb77c82ea816', '503a0629-10df-416b-89d6-eb77c82ea816', format('{"sub":"%s","email":"%s"}', '503a0629-10df-416b-89d6-eb77c82ea816', 't24nv422@gmail.com')::jsonb, 'email', '503a0629-10df-416b-89d6-eb77c82ea816', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('503a0629-10df-416b-89d6-eb77c82ea816', 'FOUSIYA KA', 't24nv422@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('503a0629-10df-416b-89d6-eb77c82ea816', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('503a0629-10df-416b-89d6-eb77c82ea816', 'T24NV422', now(), now());

    -- Teacher: Fuzilath Hena Mamuz (T25FB457)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '91161a0e-5c34-43c0-a72a-d27cea0da1f3', 'authenticated', 'authenticated', 't25fb457@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"Fuzilath Hena Mamuz"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '91161a0e-5c34-43c0-a72a-d27cea0da1f3', '91161a0e-5c34-43c0-a72a-d27cea0da1f3', format('{"sub":"%s","email":"%s"}', '91161a0e-5c34-43c0-a72a-d27cea0da1f3', 't25fb457@gmail.com')::jsonb, 'email', '91161a0e-5c34-43c0-a72a-d27cea0da1f3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('91161a0e-5c34-43c0-a72a-d27cea0da1f3', 'Fuzilath Hena Mamuz', 't25fb457@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('91161a0e-5c34-43c0-a72a-d27cea0da1f3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('91161a0e-5c34-43c0-a72a-d27cea0da1f3', 'T25FB457', now(), now());

    -- Teacher: GAYATHRI ES (T25JU588)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', 'authenticated', 'authenticated', 't25ju588@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"GAYATHRI ES"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', 'be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', format('{"sub":"%s","email":"%s"}', 'be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', 't25ju588@gmail.com')::jsonb, 'email', 'be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', 'GAYATHRI ES', 't25ju588@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('be1cb5b4-2a62-442f-9b6d-70c09f2acbf7', 'T25JU588', now(), now());

    -- Teacher: GAYATHRI S NAIR (T24OC397)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b81cb20f-e8f2-4504-8e79-2c524b1719f9', 'authenticated', 'authenticated', 't24oc397@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"GAYATHRI S NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b81cb20f-e8f2-4504-8e79-2c524b1719f9', 'b81cb20f-e8f2-4504-8e79-2c524b1719f9', format('{"sub":"%s","email":"%s"}', 'b81cb20f-e8f2-4504-8e79-2c524b1719f9', 't24oc397@gmail.com')::jsonb, 'email', 'b81cb20f-e8f2-4504-8e79-2c524b1719f9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b81cb20f-e8f2-4504-8e79-2c524b1719f9', 'GAYATHRI S NAIR', 't24oc397@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b81cb20f-e8f2-4504-8e79-2c524b1719f9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b81cb20f-e8f2-4504-8e79-2c524b1719f9', 'T24OC397', now(), now());

    -- Teacher: GHAZALA BEGUM (T25NV766)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '27c57666-94f3-4a72-9f6b-f6d7babc4cf6', 'authenticated', 'authenticated', 't25nv766@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"GHAZALA BEGUM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '27c57666-94f3-4a72-9f6b-f6d7babc4cf6', '27c57666-94f3-4a72-9f6b-f6d7babc4cf6', format('{"sub":"%s","email":"%s"}', '27c57666-94f3-4a72-9f6b-f6d7babc4cf6', 't25nv766@gmail.com')::jsonb, 'email', '27c57666-94f3-4a72-9f6b-f6d7babc4cf6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('27c57666-94f3-4a72-9f6b-f6d7babc4cf6', 'GHAZALA BEGUM', 't25nv766@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('27c57666-94f3-4a72-9f6b-f6d7babc4cf6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('27c57666-94f3-4a72-9f6b-f6d7babc4cf6', 'T25NV766', now(), now());

    -- Teacher: GOPIKA R (T25OC725)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e7ffb3c2-1591-4260-aecf-c763f635362b', 'authenticated', 'authenticated', 't25oc725@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"GOPIKA R"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e7ffb3c2-1591-4260-aecf-c763f635362b', 'e7ffb3c2-1591-4260-aecf-c763f635362b', format('{"sub":"%s","email":"%s"}', 'e7ffb3c2-1591-4260-aecf-c763f635362b', 't25oc725@gmail.com')::jsonb, 'email', 'e7ffb3c2-1591-4260-aecf-c763f635362b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e7ffb3c2-1591-4260-aecf-c763f635362b', 'GOPIKA R', 't25oc725@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e7ffb3c2-1591-4260-aecf-c763f635362b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e7ffb3c2-1591-4260-aecf-c763f635362b', 'T25OC725', now(), now());

    -- Teacher: GOURI N V (T25DC797)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', 'authenticated', 'authenticated', 't25dc797@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"GOURI N V"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', '7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', format('{"sub":"%s","email":"%s"}', '7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', 't25dc797@gmail.com')::jsonb, 'email', '7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', 'GOURI N V', 't25dc797@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7e2030f0-2eab-4d0a-9ce6-0a37ad8aa057', 'T25DC797', now(), now());

    -- Teacher: GOURI SANKAR (T26JN813)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '594f302b-8692-4e9e-a8e5-c3f155c4475b', 'authenticated', 'authenticated', 't26jn813@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"GOURI SANKAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '594f302b-8692-4e9e-a8e5-c3f155c4475b', '594f302b-8692-4e9e-a8e5-c3f155c4475b', format('{"sub":"%s","email":"%s"}', '594f302b-8692-4e9e-a8e5-c3f155c4475b', 't26jn813@gmail.com')::jsonb, 'email', '594f302b-8692-4e9e-a8e5-c3f155c4475b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('594f302b-8692-4e9e-a8e5-c3f155c4475b', 'GOURI SANKAR', 't26jn813@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('594f302b-8692-4e9e-a8e5-c3f155c4475b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('594f302b-8692-4e9e-a8e5-c3f155c4475b', 'T26JN813', now(), now());

    -- Teacher: HADIYA HIBA (T26JN820)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1f5cb196-b19f-4ce6-86a2-ed37958caf96', 'authenticated', 'authenticated', 't26jn820@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HADIYA HIBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1f5cb196-b19f-4ce6-86a2-ed37958caf96', '1f5cb196-b19f-4ce6-86a2-ed37958caf96', format('{"sub":"%s","email":"%s"}', '1f5cb196-b19f-4ce6-86a2-ed37958caf96', 't26jn820@gmail.com')::jsonb, 'email', '1f5cb196-b19f-4ce6-86a2-ed37958caf96', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1f5cb196-b19f-4ce6-86a2-ed37958caf96', 'HADIYA HIBA', 't26jn820@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1f5cb196-b19f-4ce6-86a2-ed37958caf96', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1f5cb196-b19f-4ce6-86a2-ed37958caf96', 'T26JN820', now(), now());

    -- Teacher: HAFILA NAUSHAD (T25OC692)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '47eb40f1-2d3e-4049-9e4c-80e671150040', 'authenticated', 'authenticated', 't25oc692@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HAFILA NAUSHAD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '47eb40f1-2d3e-4049-9e4c-80e671150040', '47eb40f1-2d3e-4049-9e4c-80e671150040', format('{"sub":"%s","email":"%s"}', '47eb40f1-2d3e-4049-9e4c-80e671150040', 't25oc692@gmail.com')::jsonb, 'email', '47eb40f1-2d3e-4049-9e4c-80e671150040', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('47eb40f1-2d3e-4049-9e4c-80e671150040', 'HAFILA NAUSHAD', 't25oc692@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('47eb40f1-2d3e-4049-9e4c-80e671150040', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('47eb40f1-2d3e-4049-9e4c-80e671150040', 'T25OC692', now(), now());

    -- Teacher: HAFIRA CK (T24OC404)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'eb8a8cac-be58-4077-8b46-06e3948b5676', 'authenticated', 'authenticated', 't24oc404@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HAFIRA CK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'eb8a8cac-be58-4077-8b46-06e3948b5676', 'eb8a8cac-be58-4077-8b46-06e3948b5676', format('{"sub":"%s","email":"%s"}', 'eb8a8cac-be58-4077-8b46-06e3948b5676', 't24oc404@gmail.com')::jsonb, 'email', 'eb8a8cac-be58-4077-8b46-06e3948b5676', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('eb8a8cac-be58-4077-8b46-06e3948b5676', 'HAFIRA CK', 't24oc404@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('eb8a8cac-be58-4077-8b46-06e3948b5676', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('eb8a8cac-be58-4077-8b46-06e3948b5676', 'T24OC404', now(), now());

    -- Teacher: HAIFA LIYANA KP (T25JN438)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', 'authenticated', 'authenticated', 't25jn438@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HAIFA LIYANA KP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', '33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', format('{"sub":"%s","email":"%s"}', '33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', 't25jn438@gmail.com')::jsonb, 'email', '33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', 'HAIFA LIYANA KP', 't25jn438@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('33b0081d-10b8-4dbc-b9fc-d7a65d21cbed', 'T25JN438', now(), now());

    -- Teacher: HAMNA ENG (T24SP377)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5f105e2a-9118-4c3f-b655-bce2dd6220a8', 'authenticated', 'authenticated', 't24sp377@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HAMNA ENG"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5f105e2a-9118-4c3f-b655-bce2dd6220a8', '5f105e2a-9118-4c3f-b655-bce2dd6220a8', format('{"sub":"%s","email":"%s"}', '5f105e2a-9118-4c3f-b655-bce2dd6220a8', 't24sp377@gmail.com')::jsonb, 'email', '5f105e2a-9118-4c3f-b655-bce2dd6220a8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5f105e2a-9118-4c3f-b655-bce2dd6220a8', 'HAMNA ENG', 't24sp377@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5f105e2a-9118-4c3f-b655-bce2dd6220a8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5f105e2a-9118-4c3f-b655-bce2dd6220a8', 'T24SP377', now(), now());

    -- Teacher: HANA (T26JN810)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2e4295de-1d97-41bf-b992-20b67deee8bd', 'authenticated', 'authenticated', 't26jn810@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2e4295de-1d97-41bf-b992-20b67deee8bd', '2e4295de-1d97-41bf-b992-20b67deee8bd', format('{"sub":"%s","email":"%s"}', '2e4295de-1d97-41bf-b992-20b67deee8bd', 't26jn810@gmail.com')::jsonb, 'email', '2e4295de-1d97-41bf-b992-20b67deee8bd', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2e4295de-1d97-41bf-b992-20b67deee8bd', 'HANA', 't26jn810@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2e4295de-1d97-41bf-b992-20b67deee8bd', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2e4295de-1d97-41bf-b992-20b67deee8bd', 'T26JN810', now(), now());

    -- Teacher: HANAN MOHAMMED HUSSAIN ISMAIL (T25DC791)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e1e7163a-3029-4561-842b-9659873cabca', 'authenticated', 'authenticated', 't25dc791@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HANAN MOHAMMED HUSSAIN ISMAIL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e1e7163a-3029-4561-842b-9659873cabca', 'e1e7163a-3029-4561-842b-9659873cabca', format('{"sub":"%s","email":"%s"}', 'e1e7163a-3029-4561-842b-9659873cabca', 't25dc791@gmail.com')::jsonb, 'email', 'e1e7163a-3029-4561-842b-9659873cabca', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e1e7163a-3029-4561-842b-9659873cabca', 'HANAN MOHAMMED HUSSAIN ISMAIL', 't25dc791@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e1e7163a-3029-4561-842b-9659873cabca', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e1e7163a-3029-4561-842b-9659873cabca', 'T25DC791', now(), now());

    -- Teacher: HANNA H (T25OC693)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c5687b03-298d-4d65-8730-7a2386f0aebf', 'authenticated', 'authenticated', 't25oc693@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HANNA H"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c5687b03-298d-4d65-8730-7a2386f0aebf', 'c5687b03-298d-4d65-8730-7a2386f0aebf', format('{"sub":"%s","email":"%s"}', 'c5687b03-298d-4d65-8730-7a2386f0aebf', 't25oc693@gmail.com')::jsonb, 'email', 'c5687b03-298d-4d65-8730-7a2386f0aebf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c5687b03-298d-4d65-8730-7a2386f0aebf', 'HANNA H', 't25oc693@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c5687b03-298d-4d65-8730-7a2386f0aebf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c5687b03-298d-4d65-8730-7a2386f0aebf', 'T25OC693', now(), now());

    -- Teacher: HANNATH BEEVI (T25MR491)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e13e5b45-a730-46a9-a480-a50c13c966d0', 'authenticated', 'authenticated', 't25mr491@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HANNATH BEEVI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e13e5b45-a730-46a9-a480-a50c13c966d0', 'e13e5b45-a730-46a9-a480-a50c13c966d0', format('{"sub":"%s","email":"%s"}', 'e13e5b45-a730-46a9-a480-a50c13c966d0', 't25mr491@gmail.com')::jsonb, 'email', 'e13e5b45-a730-46a9-a480-a50c13c966d0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e13e5b45-a730-46a9-a480-a50c13c966d0', 'HANNATH BEEVI', 't25mr491@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e13e5b45-a730-46a9-a480-a50c13c966d0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e13e5b45-a730-46a9-a480-a50c13c966d0', 'T25MR491', now(), now());

    -- Teacher: HARITHA MOL (T24AG332)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '60960881-0c72-4764-b80c-1a9e20ddd900', 'authenticated', 'authenticated', 't24ag332@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HARITHA MOL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '60960881-0c72-4764-b80c-1a9e20ddd900', '60960881-0c72-4764-b80c-1a9e20ddd900', format('{"sub":"%s","email":"%s"}', '60960881-0c72-4764-b80c-1a9e20ddd900', 't24ag332@gmail.com')::jsonb, 'email', '60960881-0c72-4764-b80c-1a9e20ddd900', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('60960881-0c72-4764-b80c-1a9e20ddd900', 'HARITHA MOL', 't24ag332@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('60960881-0c72-4764-b80c-1a9e20ddd900', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('60960881-0c72-4764-b80c-1a9e20ddd900', 'T24AG332', now(), now());

    -- Teacher: HARITHA T A (T24SP394)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7d7a1714-5c15-4c8f-a991-421b8b00fec2', 'authenticated', 'authenticated', 't24sp394@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HARITHA T A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7d7a1714-5c15-4c8f-a991-421b8b00fec2', '7d7a1714-5c15-4c8f-a991-421b8b00fec2', format('{"sub":"%s","email":"%s"}', '7d7a1714-5c15-4c8f-a991-421b8b00fec2', 't24sp394@gmail.com')::jsonb, 'email', '7d7a1714-5c15-4c8f-a991-421b8b00fec2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7d7a1714-5c15-4c8f-a991-421b8b00fec2', 'HARITHA T A', 't24sp394@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7d7a1714-5c15-4c8f-a991-421b8b00fec2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7d7a1714-5c15-4c8f-a991-421b8b00fec2', 'T24SP394', now(), now());

    -- Teacher: HASEENA K (T25OC696)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a7d3b266-c242-4098-8a4b-4c2501889945', 'authenticated', 'authenticated', 't25oc696@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HASEENA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a7d3b266-c242-4098-8a4b-4c2501889945', 'a7d3b266-c242-4098-8a4b-4c2501889945', format('{"sub":"%s","email":"%s"}', 'a7d3b266-c242-4098-8a4b-4c2501889945', 't25oc696@gmail.com')::jsonb, 'email', 'a7d3b266-c242-4098-8a4b-4c2501889945', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a7d3b266-c242-4098-8a4b-4c2501889945', 'HASEENA K', 't25oc696@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a7d3b266-c242-4098-8a4b-4c2501889945', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a7d3b266-c242-4098-8a4b-4c2501889945', 'T25OC696', now(), now());

    -- Teacher: HASHILA (T25NV754)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0b6f80d1-80e9-45db-b857-6bde280d8c91', 'authenticated', 'authenticated', 't25nv754@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HASHILA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0b6f80d1-80e9-45db-b857-6bde280d8c91', '0b6f80d1-80e9-45db-b857-6bde280d8c91', format('{"sub":"%s","email":"%s"}', '0b6f80d1-80e9-45db-b857-6bde280d8c91', 't25nv754@gmail.com')::jsonb, 'email', '0b6f80d1-80e9-45db-b857-6bde280d8c91', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0b6f80d1-80e9-45db-b857-6bde280d8c91', 'HASHILA', 't25nv754@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0b6f80d1-80e9-45db-b857-6bde280d8c91', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0b6f80d1-80e9-45db-b857-6bde280d8c91', 'T25NV754', now(), now());

    -- Teacher: HASNA NAVAS (T23OC72)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '55a7c3e6-edfd-4bde-96f4-6caebaca9603', 'authenticated', 'authenticated', 't23oc72@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HASNA NAVAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '55a7c3e6-edfd-4bde-96f4-6caebaca9603', '55a7c3e6-edfd-4bde-96f4-6caebaca9603', format('{"sub":"%s","email":"%s"}', '55a7c3e6-edfd-4bde-96f4-6caebaca9603', 't23oc72@gmail.com')::jsonb, 'email', '55a7c3e6-edfd-4bde-96f4-6caebaca9603', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('55a7c3e6-edfd-4bde-96f4-6caebaca9603', 'HASNA NAVAS', 't23oc72@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('55a7c3e6-edfd-4bde-96f4-6caebaca9603', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('55a7c3e6-edfd-4bde-96f4-6caebaca9603', 'T23OC72', now(), now());

    -- Teacher: HASNA RAHMAN (T24DC433)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '81ae8352-cdba-42ad-a39c-5d9586b4c469', 'authenticated', 'authenticated', 't24dc433@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HASNA RAHMAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '81ae8352-cdba-42ad-a39c-5d9586b4c469', '81ae8352-cdba-42ad-a39c-5d9586b4c469', format('{"sub":"%s","email":"%s"}', '81ae8352-cdba-42ad-a39c-5d9586b4c469', 't24dc433@gmail.com')::jsonb, 'email', '81ae8352-cdba-42ad-a39c-5d9586b4c469', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('81ae8352-cdba-42ad-a39c-5d9586b4c469', 'HASNA RAHMAN', 't24dc433@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('81ae8352-cdba-42ad-a39c-5d9586b4c469', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('81ae8352-cdba-42ad-a39c-5d9586b4c469', 'T24DC433', now(), now());

    -- Teacher: HASNASERI (T25SP657)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f0793203-9c90-44db-a902-654792cee089', 'authenticated', 'authenticated', 't25sp657@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HASNASERI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f0793203-9c90-44db-a902-654792cee089', 'f0793203-9c90-44db-a902-654792cee089', format('{"sub":"%s","email":"%s"}', 'f0793203-9c90-44db-a902-654792cee089', 't25sp657@gmail.com')::jsonb, 'email', 'f0793203-9c90-44db-a902-654792cee089', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f0793203-9c90-44db-a902-654792cee089', 'HASNASERI', 't25sp657@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f0793203-9c90-44db-a902-654792cee089', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f0793203-9c90-44db-a902-654792cee089', 'T25SP657', now(), now());

    -- Teacher: HEENA SIMON (T25NV761)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '64076609-760c-49a6-bc33-a9a846880523', 'authenticated', 'authenticated', 't25nv761@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HEENA SIMON"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '64076609-760c-49a6-bc33-a9a846880523', '64076609-760c-49a6-bc33-a9a846880523', format('{"sub":"%s","email":"%s"}', '64076609-760c-49a6-bc33-a9a846880523', 't25nv761@gmail.com')::jsonb, 'email', '64076609-760c-49a6-bc33-a9a846880523', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('64076609-760c-49a6-bc33-a9a846880523', 'HEENA SIMON', 't25nv761@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('64076609-760c-49a6-bc33-a9a846880523', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('64076609-760c-49a6-bc33-a9a846880523', 'T25NV761', now(), now());

    -- Teacher: HIBA (T25AP539)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '97c14f86-3f15-42b6-9789-349a995eb279', 'authenticated', 'authenticated', 't25ap539@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HIBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '97c14f86-3f15-42b6-9789-349a995eb279', '97c14f86-3f15-42b6-9789-349a995eb279', format('{"sub":"%s","email":"%s"}', '97c14f86-3f15-42b6-9789-349a995eb279', 't25ap539@gmail.com')::jsonb, 'email', '97c14f86-3f15-42b6-9789-349a995eb279', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('97c14f86-3f15-42b6-9789-349a995eb279', 'HIBA', 't25ap539@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('97c14f86-3f15-42b6-9789-349a995eb279', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('97c14f86-3f15-42b6-9789-349a995eb279', 'T25AP539', now(), now());

    -- Teacher: HIBA MATHS (T25OC731)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cc817df8-f4b4-4f79-9de7-54d3de809c75', 'authenticated', 'authenticated', 't25oc731@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HIBA MATHS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cc817df8-f4b4-4f79-9de7-54d3de809c75', 'cc817df8-f4b4-4f79-9de7-54d3de809c75', format('{"sub":"%s","email":"%s"}', 'cc817df8-f4b4-4f79-9de7-54d3de809c75', 't25oc731@gmail.com')::jsonb, 'email', 'cc817df8-f4b4-4f79-9de7-54d3de809c75', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cc817df8-f4b4-4f79-9de7-54d3de809c75', 'HIBA MATHS', 't25oc731@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cc817df8-f4b4-4f79-9de7-54d3de809c75', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cc817df8-f4b4-4f79-9de7-54d3de809c75', 'T25OC731', now(), now());

    -- Teacher: HIBA SHIRIN (T23DC158)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '75cfcadc-92f4-4bcf-875a-789dc9b5616e', 'authenticated', 'authenticated', 't23dc158@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HIBA SHIRIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '75cfcadc-92f4-4bcf-875a-789dc9b5616e', '75cfcadc-92f4-4bcf-875a-789dc9b5616e', format('{"sub":"%s","email":"%s"}', '75cfcadc-92f4-4bcf-875a-789dc9b5616e', 't23dc158@gmail.com')::jsonb, 'email', '75cfcadc-92f4-4bcf-875a-789dc9b5616e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('75cfcadc-92f4-4bcf-875a-789dc9b5616e', 'HIBA SHIRIN', 't23dc158@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('75cfcadc-92f4-4bcf-875a-789dc9b5616e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('75cfcadc-92f4-4bcf-875a-789dc9b5616e', 'T23DC158', now(), now());

    -- Teacher: HIBA UMMER (T25AG635)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '097d4da2-869e-4174-a803-f51c98974d53', 'authenticated', 'authenticated', 't25ag635@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HIBA UMMER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '097d4da2-869e-4174-a803-f51c98974d53', '097d4da2-869e-4174-a803-f51c98974d53', format('{"sub":"%s","email":"%s"}', '097d4da2-869e-4174-a803-f51c98974d53', 't25ag635@gmail.com')::jsonb, 'email', '097d4da2-869e-4174-a803-f51c98974d53', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('097d4da2-869e-4174-a803-f51c98974d53', 'HIBA UMMER', 't25ag635@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('097d4da2-869e-4174-a803-f51c98974d53', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('097d4da2-869e-4174-a803-f51c98974d53', 'T25AG635', now(), now());

    -- Teacher: HIMA HAREENDRAN M (T25FB482)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ecd038ab-3495-496b-ba63-0204786910c8', 'authenticated', 'authenticated', 't25fb482@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HIMA HAREENDRAN M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ecd038ab-3495-496b-ba63-0204786910c8', 'ecd038ab-3495-496b-ba63-0204786910c8', format('{"sub":"%s","email":"%s"}', 'ecd038ab-3495-496b-ba63-0204786910c8', 't25fb482@gmail.com')::jsonb, 'email', 'ecd038ab-3495-496b-ba63-0204786910c8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ecd038ab-3495-496b-ba63-0204786910c8', 'HIMA HAREENDRAN M', 't25fb482@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ecd038ab-3495-496b-ba63-0204786910c8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ecd038ab-3495-496b-ba63-0204786910c8', 'T25FB482', now(), now());

    -- Teacher: HIMA MATHEW (T26JN821)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '32d530ae-fbe2-4aa6-a681-ae533d30efac', 'authenticated', 'authenticated', 't26jn821@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HIMA MATHEW"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '32d530ae-fbe2-4aa6-a681-ae533d30efac', '32d530ae-fbe2-4aa6-a681-ae533d30efac', format('{"sub":"%s","email":"%s"}', '32d530ae-fbe2-4aa6-a681-ae533d30efac', 't26jn821@gmail.com')::jsonb, 'email', '32d530ae-fbe2-4aa6-a681-ae533d30efac', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('32d530ae-fbe2-4aa6-a681-ae533d30efac', 'HIMA MATHEW', 't26jn821@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('32d530ae-fbe2-4aa6-a681-ae533d30efac', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('32d530ae-fbe2-4aa6-a681-ae533d30efac', 'T26JN821', now(), now());

    -- Teacher: HUDA RAHMAN (T24OC405)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '67dc847b-f7b0-45af-8b26-880f63b115e3', 'authenticated', 'authenticated', 't24oc405@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HUDA RAHMAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '67dc847b-f7b0-45af-8b26-880f63b115e3', '67dc847b-f7b0-45af-8b26-880f63b115e3', format('{"sub":"%s","email":"%s"}', '67dc847b-f7b0-45af-8b26-880f63b115e3', 't24oc405@gmail.com')::jsonb, 'email', '67dc847b-f7b0-45af-8b26-880f63b115e3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('67dc847b-f7b0-45af-8b26-880f63b115e3', 'HUDA RAHMAN', 't24oc405@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('67dc847b-f7b0-45af-8b26-880f63b115e3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('67dc847b-f7b0-45af-8b26-880f63b115e3', 'T24OC405', now(), now());

    -- Teacher: HUSNA NIZAR (T25AP550)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', 'authenticated', 'authenticated', 't25ap550@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"HUSNA NIZAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', 'd4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', format('{"sub":"%s","email":"%s"}', 'd4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', 't25ap550@gmail.com')::jsonb, 'email', 'd4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', 'HUSNA NIZAR', 't25ap550@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d4ba3110-ea0e-4a59-b0f6-f1e58ce222ae', 'T25AP550', now(), now());

    -- Teacher: IHSAN ALI (T25OC710)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c7b13ad9-6131-4452-88db-20c6e6542416', 'authenticated', 'authenticated', 't25oc710@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"IHSAN ALI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c7b13ad9-6131-4452-88db-20c6e6542416', 'c7b13ad9-6131-4452-88db-20c6e6542416', format('{"sub":"%s","email":"%s"}', 'c7b13ad9-6131-4452-88db-20c6e6542416', 't25oc710@gmail.com')::jsonb, 'email', 'c7b13ad9-6131-4452-88db-20c6e6542416', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c7b13ad9-6131-4452-88db-20c6e6542416', 'IHSAN ALI', 't25oc710@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c7b13ad9-6131-4452-88db-20c6e6542416', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c7b13ad9-6131-4452-88db-20c6e6542416', 'T25OC710', now(), now());

    -- Teacher: ISHMA MASHOOD (T25JN451)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '327cbf7f-4f67-4194-9806-5d4ebf32dbdf', 'authenticated', 'authenticated', 't25jn451@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ISHMA MASHOOD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '327cbf7f-4f67-4194-9806-5d4ebf32dbdf', '327cbf7f-4f67-4194-9806-5d4ebf32dbdf', format('{"sub":"%s","email":"%s"}', '327cbf7f-4f67-4194-9806-5d4ebf32dbdf', 't25jn451@gmail.com')::jsonb, 'email', '327cbf7f-4f67-4194-9806-5d4ebf32dbdf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('327cbf7f-4f67-4194-9806-5d4ebf32dbdf', 'ISHMA MASHOOD', 't25jn451@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('327cbf7f-4f67-4194-9806-5d4ebf32dbdf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('327cbf7f-4f67-4194-9806-5d4ebf32dbdf', 'T25JN451', now(), now());

    -- Teacher: JAFARIYA (T24MA248)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ded197b8-001d-4b6f-b7c9-b850caee5b5d', 'authenticated', 'authenticated', 't24ma248@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JAFARIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ded197b8-001d-4b6f-b7c9-b850caee5b5d', 'ded197b8-001d-4b6f-b7c9-b850caee5b5d', format('{"sub":"%s","email":"%s"}', 'ded197b8-001d-4b6f-b7c9-b850caee5b5d', 't24ma248@gmail.com')::jsonb, 'email', 'ded197b8-001d-4b6f-b7c9-b850caee5b5d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ded197b8-001d-4b6f-b7c9-b850caee5b5d', 'JAFARIYA', 't24ma248@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ded197b8-001d-4b6f-b7c9-b850caee5b5d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ded197b8-001d-4b6f-b7c9-b850caee5b5d', 'T24MA248', now(), now());

    -- Teacher: JAFLA (T24MA215)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8abc0074-8f31-4a3f-a124-ad74890d384e', 'authenticated', 'authenticated', 't24ma215@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JAFLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8abc0074-8f31-4a3f-a124-ad74890d384e', '8abc0074-8f31-4a3f-a124-ad74890d384e', format('{"sub":"%s","email":"%s"}', '8abc0074-8f31-4a3f-a124-ad74890d384e', 't24ma215@gmail.com')::jsonb, 'email', '8abc0074-8f31-4a3f-a124-ad74890d384e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8abc0074-8f31-4a3f-a124-ad74890d384e', 'JAFLA', 't24ma215@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8abc0074-8f31-4a3f-a124-ad74890d384e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8abc0074-8f31-4a3f-a124-ad74890d384e', 'T24MA215', now(), now());

    -- Teacher: JAHANA SHERIN (T24JN160)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '26362815-efaf-42fa-af18-b4f0e447c3ab', 'authenticated', 'authenticated', 't24jn160@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JAHANA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '26362815-efaf-42fa-af18-b4f0e447c3ab', '26362815-efaf-42fa-af18-b4f0e447c3ab', format('{"sub":"%s","email":"%s"}', '26362815-efaf-42fa-af18-b4f0e447c3ab', 't24jn160@gmail.com')::jsonb, 'email', '26362815-efaf-42fa-af18-b4f0e447c3ab', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('26362815-efaf-42fa-af18-b4f0e447c3ab', 'JAHANA SHERIN', 't24jn160@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('26362815-efaf-42fa-af18-b4f0e447c3ab', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('26362815-efaf-42fa-af18-b4f0e447c3ab', 'T24JN160', now(), now());

    -- Teacher: JAISHA HILARIAN D CRUZ (T25FB469)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7dd826e0-ff26-49ff-8a5d-04591f63cc9d', 'authenticated', 'authenticated', 't25fb469@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JAISHA HILARIAN D CRUZ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7dd826e0-ff26-49ff-8a5d-04591f63cc9d', '7dd826e0-ff26-49ff-8a5d-04591f63cc9d', format('{"sub":"%s","email":"%s"}', '7dd826e0-ff26-49ff-8a5d-04591f63cc9d', 't25fb469@gmail.com')::jsonb, 'email', '7dd826e0-ff26-49ff-8a5d-04591f63cc9d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7dd826e0-ff26-49ff-8a5d-04591f63cc9d', 'JAISHA HILARIAN D CRUZ', 't25fb469@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7dd826e0-ff26-49ff-8a5d-04591f63cc9d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7dd826e0-ff26-49ff-8a5d-04591f63cc9d', 'T25FB469', now(), now());

    -- Teacher: JALIBHA (T24JN159)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', 'authenticated', 'authenticated', 't24jn159@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JALIBHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', 'e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', format('{"sub":"%s","email":"%s"}', 'e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', 't24jn159@gmail.com')::jsonb, 'email', 'e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', 'JALIBHA', 't24jn159@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e3f68a74-50ae-4fc7-a9f6-a3700b0e39c2', 'T24JN159', now(), now());

    -- Teacher: JASARUNNISA (T24AG321)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8df24ee5-0800-4f31-9446-f16e05a92bf1', 'authenticated', 'authenticated', 't24ag321@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASARUNNISA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8df24ee5-0800-4f31-9446-f16e05a92bf1', '8df24ee5-0800-4f31-9446-f16e05a92bf1', format('{"sub":"%s","email":"%s"}', '8df24ee5-0800-4f31-9446-f16e05a92bf1', 't24ag321@gmail.com')::jsonb, 'email', '8df24ee5-0800-4f31-9446-f16e05a92bf1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8df24ee5-0800-4f31-9446-f16e05a92bf1', 'JASARUNNISA', 't24ag321@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8df24ee5-0800-4f31-9446-f16e05a92bf1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8df24ee5-0800-4f31-9446-f16e05a92bf1', 'T24AG321', now(), now());

    -- Teacher: JASEELA THASNEEM (T25AP522)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', 'authenticated', 'authenticated', 't25ap522@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASEELA THASNEEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', 'fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', format('{"sub":"%s","email":"%s"}', 'fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', 't25ap522@gmail.com')::jsonb, 'email', 'fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', 'JASEELA THASNEEM', 't25ap522@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fe9866bf-3154-4a9c-85c2-f918b4c1e6a8', 'T25AP522', now(), now());

    -- Teacher: JASEENA ARB (T24OC409)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e15b2f33-e88e-47d5-878c-a5d06b872bc8', 'authenticated', 'authenticated', 't24oc409@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASEENA ARB"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e15b2f33-e88e-47d5-878c-a5d06b872bc8', 'e15b2f33-e88e-47d5-878c-a5d06b872bc8', format('{"sub":"%s","email":"%s"}', 'e15b2f33-e88e-47d5-878c-a5d06b872bc8', 't24oc409@gmail.com')::jsonb, 'email', 'e15b2f33-e88e-47d5-878c-a5d06b872bc8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e15b2f33-e88e-47d5-878c-a5d06b872bc8', 'JASEENA ARB', 't24oc409@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e15b2f33-e88e-47d5-878c-a5d06b872bc8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e15b2f33-e88e-47d5-878c-a5d06b872bc8', 'T24OC409', now(), now());

    -- Teacher: JASLIN ANTONY (T25AP501)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2bea7db9-46e3-462c-a9b0-e332a7c4ce18', 'authenticated', 'authenticated', 't25ap501@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASLIN ANTONY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2bea7db9-46e3-462c-a9b0-e332a7c4ce18', '2bea7db9-46e3-462c-a9b0-e332a7c4ce18', format('{"sub":"%s","email":"%s"}', '2bea7db9-46e3-462c-a9b0-e332a7c4ce18', 't25ap501@gmail.com')::jsonb, 'email', '2bea7db9-46e3-462c-a9b0-e332a7c4ce18', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2bea7db9-46e3-462c-a9b0-e332a7c4ce18', 'JASLIN ANTONY', 't25ap501@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2bea7db9-46e3-462c-a9b0-e332a7c4ce18', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2bea7db9-46e3-462c-a9b0-e332a7c4ce18', 'T25AP501', now(), now());

    -- Teacher: JASMIN ALAMEEN (T26JN800)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f3645b91-3c54-40fc-9140-a266c47da250', 'authenticated', 'authenticated', 't26jn800@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASMIN ALAMEEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f3645b91-3c54-40fc-9140-a266c47da250', 'f3645b91-3c54-40fc-9140-a266c47da250', format('{"sub":"%s","email":"%s"}', 'f3645b91-3c54-40fc-9140-a266c47da250', 't26jn800@gmail.com')::jsonb, 'email', 'f3645b91-3c54-40fc-9140-a266c47da250', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f3645b91-3c54-40fc-9140-a266c47da250', 'JASMIN ALAMEEN', 't26jn800@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f3645b91-3c54-40fc-9140-a266c47da250', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f3645b91-3c54-40fc-9140-a266c47da250', 'T26JN800', now(), now());

    -- Teacher: JASMINA NK (T24NV417)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e9988b1c-18c0-4607-a55f-d32567e64cc2', 'authenticated', 'authenticated', 't24nv417@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASMINA NK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e9988b1c-18c0-4607-a55f-d32567e64cc2', 'e9988b1c-18c0-4607-a55f-d32567e64cc2', format('{"sub":"%s","email":"%s"}', 'e9988b1c-18c0-4607-a55f-d32567e64cc2', 't24nv417@gmail.com')::jsonb, 'email', 'e9988b1c-18c0-4607-a55f-d32567e64cc2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e9988b1c-18c0-4607-a55f-d32567e64cc2', 'JASMINA NK', 't24nv417@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e9988b1c-18c0-4607-a55f-d32567e64cc2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e9988b1c-18c0-4607-a55f-d32567e64cc2', 'T24NV417', now(), now());

    -- Teacher: JASMINE JAMAL (T24OC402)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '85fede19-5ee7-43af-8af6-4905189a4d25', 'authenticated', 'authenticated', 't24oc402@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASMINE JAMAL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '85fede19-5ee7-43af-8af6-4905189a4d25', '85fede19-5ee7-43af-8af6-4905189a4d25', format('{"sub":"%s","email":"%s"}', '85fede19-5ee7-43af-8af6-4905189a4d25', 't24oc402@gmail.com')::jsonb, 'email', '85fede19-5ee7-43af-8af6-4905189a4d25', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('85fede19-5ee7-43af-8af6-4905189a4d25', 'JASMINE JAMAL', 't24oc402@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('85fede19-5ee7-43af-8af6-4905189a4d25', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('85fede19-5ee7-43af-8af6-4905189a4d25', 'T24OC402', now(), now());

    -- Teacher: JASNA K (T24NV426)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '21dadb21-fc97-4d1d-add6-c8cb6085121f', 'authenticated', 'authenticated', 't24nv426@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASNA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '21dadb21-fc97-4d1d-add6-c8cb6085121f', '21dadb21-fc97-4d1d-add6-c8cb6085121f', format('{"sub":"%s","email":"%s"}', '21dadb21-fc97-4d1d-add6-c8cb6085121f', 't24nv426@gmail.com')::jsonb, 'email', '21dadb21-fc97-4d1d-add6-c8cb6085121f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('21dadb21-fc97-4d1d-add6-c8cb6085121f', 'JASNA K', 't24nv426@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('21dadb21-fc97-4d1d-add6-c8cb6085121f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('21dadb21-fc97-4d1d-add6-c8cb6085121f', 'T24NV426', now(), now());

    -- Teacher: JASNA SIRAJ (T26FB834)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0493be34-0d50-46af-b59e-86fce83ac7fd', 'authenticated', 'authenticated', 't26fb834@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JASNA SIRAJ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0493be34-0d50-46af-b59e-86fce83ac7fd', '0493be34-0d50-46af-b59e-86fce83ac7fd', format('{"sub":"%s","email":"%s"}', '0493be34-0d50-46af-b59e-86fce83ac7fd', 't26fb834@gmail.com')::jsonb, 'email', '0493be34-0d50-46af-b59e-86fce83ac7fd', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0493be34-0d50-46af-b59e-86fce83ac7fd', 'JASNA SIRAJ', 't26fb834@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0493be34-0d50-46af-b59e-86fce83ac7fd', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0493be34-0d50-46af-b59e-86fce83ac7fd', 'T26FB834', now(), now());

    -- Teacher: JAUHARA BANU (T25AG634)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1dfc1554-7a53-400d-a73b-dfc96270a72d', 'authenticated', 'authenticated', 't25ag634@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JAUHARA BANU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1dfc1554-7a53-400d-a73b-dfc96270a72d', '1dfc1554-7a53-400d-a73b-dfc96270a72d', format('{"sub":"%s","email":"%s"}', '1dfc1554-7a53-400d-a73b-dfc96270a72d', 't25ag634@gmail.com')::jsonb, 'email', '1dfc1554-7a53-400d-a73b-dfc96270a72d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1dfc1554-7a53-400d-a73b-dfc96270a72d', 'JAUHARA BANU', 't25ag634@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1dfc1554-7a53-400d-a73b-dfc96270a72d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1dfc1554-7a53-400d-a73b-dfc96270a72d', 'T25AG634', now(), now());

    -- Teacher: JESLINE RANI JIJO (T24SP366)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7e112b16-fb05-4bfb-8dff-c18419b48904', 'authenticated', 'authenticated', 't24sp366@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JESLINE RANI JIJO"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7e112b16-fb05-4bfb-8dff-c18419b48904', '7e112b16-fb05-4bfb-8dff-c18419b48904', format('{"sub":"%s","email":"%s"}', '7e112b16-fb05-4bfb-8dff-c18419b48904', 't24sp366@gmail.com')::jsonb, 'email', '7e112b16-fb05-4bfb-8dff-c18419b48904', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7e112b16-fb05-4bfb-8dff-c18419b48904', 'JESLINE RANI JIJO', 't24sp366@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7e112b16-fb05-4bfb-8dff-c18419b48904', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7e112b16-fb05-4bfb-8dff-c18419b48904', 'T24SP366', now(), now());

    -- Teacher: JIJI JOS (T25MR490)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3f2edc93-77a5-4759-b16c-567c90c50492', 'authenticated', 'authenticated', 't25mr490@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JIJI JOS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3f2edc93-77a5-4759-b16c-567c90c50492', '3f2edc93-77a5-4759-b16c-567c90c50492', format('{"sub":"%s","email":"%s"}', '3f2edc93-77a5-4759-b16c-567c90c50492', 't25mr490@gmail.com')::jsonb, 'email', '3f2edc93-77a5-4759-b16c-567c90c50492', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3f2edc93-77a5-4759-b16c-567c90c50492', 'JIJI JOS', 't25mr490@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3f2edc93-77a5-4759-b16c-567c90c50492', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3f2edc93-77a5-4759-b16c-567c90c50492', 'T25MR490', now(), now());

    -- Teacher: JINSA BOSE (T24SP389)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '74c91f7a-277e-4a66-b923-cc41b5afab2e', 'authenticated', 'authenticated', 't24sp389@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JINSA BOSE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '74c91f7a-277e-4a66-b923-cc41b5afab2e', '74c91f7a-277e-4a66-b923-cc41b5afab2e', format('{"sub":"%s","email":"%s"}', '74c91f7a-277e-4a66-b923-cc41b5afab2e', 't24sp389@gmail.com')::jsonb, 'email', '74c91f7a-277e-4a66-b923-cc41b5afab2e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('74c91f7a-277e-4a66-b923-cc41b5afab2e', 'JINSA BOSE', 't24sp389@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('74c91f7a-277e-4a66-b923-cc41b5afab2e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('74c91f7a-277e-4a66-b923-cc41b5afab2e', 'T24SP389', now(), now());

    -- Teacher: JOAN MARIA DAVIS (T25SP646)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', 'authenticated', 'authenticated', 't25sp646@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JOAN MARIA DAVIS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', '2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', format('{"sub":"%s","email":"%s"}', '2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', 't25sp646@gmail.com')::jsonb, 'email', '2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', 'JOAN MARIA DAVIS', 't25sp646@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2d5f73f3-d3c4-4b02-a251-4fc38e9c0714', 'T25SP646', now(), now());

    -- Teacher: JUMANA (T26FB855)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e5b33d37-8da1-460f-b1e7-5239acfc9b72', 'authenticated', 'authenticated', 't26fb855@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JUMANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e5b33d37-8da1-460f-b1e7-5239acfc9b72', 'e5b33d37-8da1-460f-b1e7-5239acfc9b72', format('{"sub":"%s","email":"%s"}', 'e5b33d37-8da1-460f-b1e7-5239acfc9b72', 't26fb855@gmail.com')::jsonb, 'email', 'e5b33d37-8da1-460f-b1e7-5239acfc9b72', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e5b33d37-8da1-460f-b1e7-5239acfc9b72', 'JUMANA', 't26fb855@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e5b33d37-8da1-460f-b1e7-5239acfc9b72', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e5b33d37-8da1-460f-b1e7-5239acfc9b72', 'T26FB855', now(), now());

    -- Teacher: JYOTHI LAKSHMI (T25AP561)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', 'authenticated', 'authenticated', 't25ap561@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"JYOTHI LAKSHMI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', '756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', format('{"sub":"%s","email":"%s"}', '756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', 't25ap561@gmail.com')::jsonb, 'email', '756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', 'JYOTHI LAKSHMI', 't25ap561@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('756bf2f9-fd6d-443b-8ba1-0fdc511a7ccc', 'T25AP561', now(), now());

    -- Teacher: KADEEJA FAUMI (T24JL300)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'aaabddf0-5f87-4468-a36b-617f165166c6', 'authenticated', 'authenticated', 't24jl300@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"KADEEJA FAUMI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'aaabddf0-5f87-4468-a36b-617f165166c6', 'aaabddf0-5f87-4468-a36b-617f165166c6', format('{"sub":"%s","email":"%s"}', 'aaabddf0-5f87-4468-a36b-617f165166c6', 't24jl300@gmail.com')::jsonb, 'email', 'aaabddf0-5f87-4468-a36b-617f165166c6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('aaabddf0-5f87-4468-a36b-617f165166c6', 'KADEEJA FAUMI', 't24jl300@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('aaabddf0-5f87-4468-a36b-617f165166c6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('aaabddf0-5f87-4468-a36b-617f165166c6', 'T24JL300', now(), now());

    -- Teacher: KAVYA (T24AG342)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3c138d52-2831-4dd6-81bb-2e74c817b348', 'authenticated', 'authenticated', 't24ag342@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"KAVYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3c138d52-2831-4dd6-81bb-2e74c817b348', '3c138d52-2831-4dd6-81bb-2e74c817b348', format('{"sub":"%s","email":"%s"}', '3c138d52-2831-4dd6-81bb-2e74c817b348', 't24ag342@gmail.com')::jsonb, 'email', '3c138d52-2831-4dd6-81bb-2e74c817b348', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3c138d52-2831-4dd6-81bb-2e74c817b348', 'KAVYA', 't24ag342@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3c138d52-2831-4dd6-81bb-2e74c817b348', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3c138d52-2831-4dd6-81bb-2e74c817b348', 'T24AG342', now(), now());

    -- Teacher: KAVYA CHANDRAN K (T24SP353)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4dff852c-c2a8-4567-92a2-1b8be7baf58f', 'authenticated', 'authenticated', 't24sp353@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"KAVYA CHANDRAN K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4dff852c-c2a8-4567-92a2-1b8be7baf58f', '4dff852c-c2a8-4567-92a2-1b8be7baf58f', format('{"sub":"%s","email":"%s"}', '4dff852c-c2a8-4567-92a2-1b8be7baf58f', 't24sp353@gmail.com')::jsonb, 'email', '4dff852c-c2a8-4567-92a2-1b8be7baf58f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4dff852c-c2a8-4567-92a2-1b8be7baf58f', 'KAVYA CHANDRAN K', 't24sp353@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4dff852c-c2a8-4567-92a2-1b8be7baf58f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4dff852c-c2a8-4567-92a2-1b8be7baf58f', 'T24SP353', now(), now());

    -- Teacher: KRISHNAPRIYA K (T25NV741)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fafbfef8-2851-4b82-a753-6dfcaac1e7db', 'authenticated', 'authenticated', 't25nv741@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"KRISHNAPRIYA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fafbfef8-2851-4b82-a753-6dfcaac1e7db', 'fafbfef8-2851-4b82-a753-6dfcaac1e7db', format('{"sub":"%s","email":"%s"}', 'fafbfef8-2851-4b82-a753-6dfcaac1e7db', 't25nv741@gmail.com')::jsonb, 'email', 'fafbfef8-2851-4b82-a753-6dfcaac1e7db', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fafbfef8-2851-4b82-a753-6dfcaac1e7db', 'KRISHNAPRIYA K', 't25nv741@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fafbfef8-2851-4b82-a753-6dfcaac1e7db', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fafbfef8-2851-4b82-a753-6dfcaac1e7db', 'T25NV741', now(), now());

    -- Teacher: KRISHNENDU (T25AG644)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '45b39eef-eb56-4512-976b-5e53ecb590bf', 'authenticated', 'authenticated', 't25ag644@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"KRISHNENDU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '45b39eef-eb56-4512-976b-5e53ecb590bf', '45b39eef-eb56-4512-976b-5e53ecb590bf', format('{"sub":"%s","email":"%s"}', '45b39eef-eb56-4512-976b-5e53ecb590bf', 't25ag644@gmail.com')::jsonb, 'email', '45b39eef-eb56-4512-976b-5e53ecb590bf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('45b39eef-eb56-4512-976b-5e53ecb590bf', 'KRISHNENDU', 't25ag644@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('45b39eef-eb56-4512-976b-5e53ecb590bf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('45b39eef-eb56-4512-976b-5e53ecb590bf', 'T25AG644', now(), now());

    -- Teacher: LAIBA SHERIN (T25NV748)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5702849f-e8ba-4987-b879-12b392e18015', 'authenticated', 'authenticated', 't25nv748@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LAIBA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5702849f-e8ba-4987-b879-12b392e18015', '5702849f-e8ba-4987-b879-12b392e18015', format('{"sub":"%s","email":"%s"}', '5702849f-e8ba-4987-b879-12b392e18015', 't25nv748@gmail.com')::jsonb, 'email', '5702849f-e8ba-4987-b879-12b392e18015', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5702849f-e8ba-4987-b879-12b392e18015', 'LAIBA SHERIN', 't25nv748@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5702849f-e8ba-4987-b879-12b392e18015', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5702849f-e8ba-4987-b879-12b392e18015', 'T25NV748', now(), now());

    -- Teacher: LAKSHMI (T25AP513)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ae35ebec-8fe7-40b4-bb82-3e11e1217897', 'authenticated', 'authenticated', 't25ap513@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LAKSHMI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ae35ebec-8fe7-40b4-bb82-3e11e1217897', 'ae35ebec-8fe7-40b4-bb82-3e11e1217897', format('{"sub":"%s","email":"%s"}', 'ae35ebec-8fe7-40b4-bb82-3e11e1217897', 't25ap513@gmail.com')::jsonb, 'email', 'ae35ebec-8fe7-40b4-bb82-3e11e1217897', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ae35ebec-8fe7-40b4-bb82-3e11e1217897', 'LAKSHMI', 't25ap513@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ae35ebec-8fe7-40b4-bb82-3e11e1217897', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ae35ebec-8fe7-40b4-bb82-3e11e1217897', 'T25AP513', now(), now());

    -- Teacher: LAKSHMI S DUTT (T25SP668)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '92cd4a48-3376-42c2-b44d-1dc3448995d9', 'authenticated', 'authenticated', 't25sp668@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LAKSHMI S DUTT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '92cd4a48-3376-42c2-b44d-1dc3448995d9', '92cd4a48-3376-42c2-b44d-1dc3448995d9', format('{"sub":"%s","email":"%s"}', '92cd4a48-3376-42c2-b44d-1dc3448995d9', 't25sp668@gmail.com')::jsonb, 'email', '92cd4a48-3376-42c2-b44d-1dc3448995d9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('92cd4a48-3376-42c2-b44d-1dc3448995d9', 'LAKSHMI S DUTT', 't25sp668@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('92cd4a48-3376-42c2-b44d-1dc3448995d9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('92cd4a48-3376-42c2-b44d-1dc3448995d9', 'T25SP668', now(), now());

    -- Teacher: LEKHA CHANDRA (T24AG348)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '32685375-4bbe-4b18-9cc9-98cfd76b5e8d', 'authenticated', 'authenticated', 't24ag348@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LEKHA CHANDRA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '32685375-4bbe-4b18-9cc9-98cfd76b5e8d', '32685375-4bbe-4b18-9cc9-98cfd76b5e8d', format('{"sub":"%s","email":"%s"}', '32685375-4bbe-4b18-9cc9-98cfd76b5e8d', 't24ag348@gmail.com')::jsonb, 'email', '32685375-4bbe-4b18-9cc9-98cfd76b5e8d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('32685375-4bbe-4b18-9cc9-98cfd76b5e8d', 'LEKHA CHANDRA', 't24ag348@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('32685375-4bbe-4b18-9cc9-98cfd76b5e8d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('32685375-4bbe-4b18-9cc9-98cfd76b5e8d', 'T24AG348', now(), now());

    -- Teacher: LIJISHA (T25AG629)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f504757f-9b2d-41a3-b3d3-674c8856d99c', 'authenticated', 'authenticated', 't25ag629@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LIJISHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f504757f-9b2d-41a3-b3d3-674c8856d99c', 'f504757f-9b2d-41a3-b3d3-674c8856d99c', format('{"sub":"%s","email":"%s"}', 'f504757f-9b2d-41a3-b3d3-674c8856d99c', 't25ag629@gmail.com')::jsonb, 'email', 'f504757f-9b2d-41a3-b3d3-674c8856d99c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f504757f-9b2d-41a3-b3d3-674c8856d99c', 'LIJISHA', 't25ag629@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f504757f-9b2d-41a3-b3d3-674c8856d99c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f504757f-9b2d-41a3-b3d3-674c8856d99c', 'T25AG629', now(), now());

    -- Teacher: LIYA (T25AG620)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', 'authenticated', 'authenticated', 't25ag620@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', '38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', format('{"sub":"%s","email":"%s"}', '38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', 't25ag620@gmail.com')::jsonb, 'email', '38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', 'LIYA', 't25ag620@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('38bd3bbc-bbc7-41c9-a7f2-b10a2d5521c6', 'T25AG620', now(), now());

    -- Teacher: LIYA KHADHEEJA (T25FB462)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5dfe36af-af3c-471f-996c-61f27fc1ac26', 'authenticated', 'authenticated', 't25fb462@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LIYA KHADHEEJA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5dfe36af-af3c-471f-996c-61f27fc1ac26', '5dfe36af-af3c-471f-996c-61f27fc1ac26', format('{"sub":"%s","email":"%s"}', '5dfe36af-af3c-471f-996c-61f27fc1ac26', 't25fb462@gmail.com')::jsonb, 'email', '5dfe36af-af3c-471f-996c-61f27fc1ac26', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5dfe36af-af3c-471f-996c-61f27fc1ac26', 'LIYA KHADHEEJA', 't25fb462@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5dfe36af-af3c-471f-996c-61f27fc1ac26', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5dfe36af-af3c-471f-996c-61f27fc1ac26', 'T25FB462', now(), now());

    -- Teacher: LIYA NOURIN (T26FB845)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '62e929e1-3c9f-4711-8ff7-54ea109c4d36', 'authenticated', 'authenticated', 't26fb845@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LIYA NOURIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '62e929e1-3c9f-4711-8ff7-54ea109c4d36', '62e929e1-3c9f-4711-8ff7-54ea109c4d36', format('{"sub":"%s","email":"%s"}', '62e929e1-3c9f-4711-8ff7-54ea109c4d36', 't26fb845@gmail.com')::jsonb, 'email', '62e929e1-3c9f-4711-8ff7-54ea109c4d36', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('62e929e1-3c9f-4711-8ff7-54ea109c4d36', 'LIYA NOURIN', 't26fb845@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('62e929e1-3c9f-4711-8ff7-54ea109c4d36', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('62e929e1-3c9f-4711-8ff7-54ea109c4d36', 'T26FB845', now(), now());

    -- Teacher: LUBAIBA K A (T25FB465)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1ef1f08a-dfd8-4e88-8de1-b897730304f9', 'authenticated', 'authenticated', 't25fb465@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LUBAIBA K A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1ef1f08a-dfd8-4e88-8de1-b897730304f9', '1ef1f08a-dfd8-4e88-8de1-b897730304f9', format('{"sub":"%s","email":"%s"}', '1ef1f08a-dfd8-4e88-8de1-b897730304f9', 't25fb465@gmail.com')::jsonb, 'email', '1ef1f08a-dfd8-4e88-8de1-b897730304f9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1ef1f08a-dfd8-4e88-8de1-b897730304f9', 'LUBAIBA K A', 't25fb465@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1ef1f08a-dfd8-4e88-8de1-b897730304f9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1ef1f08a-dfd8-4e88-8de1-b897730304f9', 'T25FB465', now(), now());

    -- Teacher: LUBNA (T25AP511)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '409a6638-7d5a-4183-8e70-676fd1d61d08', 'authenticated', 'authenticated', 't25ap511@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LUBNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '409a6638-7d5a-4183-8e70-676fd1d61d08', '409a6638-7d5a-4183-8e70-676fd1d61d08', format('{"sub":"%s","email":"%s"}', '409a6638-7d5a-4183-8e70-676fd1d61d08', 't25ap511@gmail.com')::jsonb, 'email', '409a6638-7d5a-4183-8e70-676fd1d61d08', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('409a6638-7d5a-4183-8e70-676fd1d61d08', 'LUBNA', 't25ap511@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('409a6638-7d5a-4183-8e70-676fd1d61d08', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('409a6638-7d5a-4183-8e70-676fd1d61d08', 'T25AP511', now(), now());

    -- Teacher: LUBNA FAISAL (T26FB837)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a53c8527-93bd-4db9-9aef-3806b595c6ec', 'authenticated', 'authenticated', 't26fb837@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LUBNA FAISAL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a53c8527-93bd-4db9-9aef-3806b595c6ec', 'a53c8527-93bd-4db9-9aef-3806b595c6ec', format('{"sub":"%s","email":"%s"}', 'a53c8527-93bd-4db9-9aef-3806b595c6ec', 't26fb837@gmail.com')::jsonb, 'email', 'a53c8527-93bd-4db9-9aef-3806b595c6ec', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a53c8527-93bd-4db9-9aef-3806b595c6ec', 'LUBNA FAISAL', 't26fb837@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a53c8527-93bd-4db9-9aef-3806b595c6ec', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a53c8527-93bd-4db9-9aef-3806b595c6ec', 'T26FB837', now(), now());

    -- Teacher: LUBNA SHAHANAS (T25SP650)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', 'authenticated', 'authenticated', 't25sp650@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"LUBNA SHAHANAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', 'fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', format('{"sub":"%s","email":"%s"}', 'fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', 't25sp650@gmail.com')::jsonb, 'email', 'fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', 'LUBNA SHAHANAS', 't25sp650@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fb8662ed-467a-4647-9b8f-ef7bdf1ccc21', 'T25SP650', now(), now());

    -- Teacher: MAHIMA MATHEW (T25OC717)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cd5acdf9-c0a5-44ed-874c-11e10894f4f7', 'authenticated', 'authenticated', 't25oc717@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MAHIMA MATHEW"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cd5acdf9-c0a5-44ed-874c-11e10894f4f7', 'cd5acdf9-c0a5-44ed-874c-11e10894f4f7', format('{"sub":"%s","email":"%s"}', 'cd5acdf9-c0a5-44ed-874c-11e10894f4f7', 't25oc717@gmail.com')::jsonb, 'email', 'cd5acdf9-c0a5-44ed-874c-11e10894f4f7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cd5acdf9-c0a5-44ed-874c-11e10894f4f7', 'MAHIMA MATHEW', 't25oc717@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cd5acdf9-c0a5-44ed-874c-11e10894f4f7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cd5acdf9-c0a5-44ed-874c-11e10894f4f7', 'T25OC717', now(), now());

    -- Teacher: MAINTYMOL ANTONY (T25AP546)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', 'authenticated', 'authenticated', 't25ap546@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MAINTYMOL ANTONY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', 'aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', format('{"sub":"%s","email":"%s"}', 'aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', 't25ap546@gmail.com')::jsonb, 'email', 'aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', 'MAINTYMOL ANTONY', 't25ap546@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('aff401cd-b70b-4ca5-8b8a-0d40f5d0aa9e', 'T25AP546', now(), now());

    -- Teacher: MALAVIKA O (T24SP390)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3732e297-a656-4091-9560-f74a8e6ac96b', 'authenticated', 'authenticated', 't24sp390@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MALAVIKA O"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3732e297-a656-4091-9560-f74a8e6ac96b', '3732e297-a656-4091-9560-f74a8e6ac96b', format('{"sub":"%s","email":"%s"}', '3732e297-a656-4091-9560-f74a8e6ac96b', 't24sp390@gmail.com')::jsonb, 'email', '3732e297-a656-4091-9560-f74a8e6ac96b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3732e297-a656-4091-9560-f74a8e6ac96b', 'MALAVIKA O', 't24sp390@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3732e297-a656-4091-9560-f74a8e6ac96b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3732e297-a656-4091-9560-f74a8e6ac96b', 'T24SP390', now(), now());

    -- Teacher: MALAVIKA S (T25FB479)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3680e0a1-3d59-4206-88bd-83a0fe9e1fef', 'authenticated', 'authenticated', 't25fb479@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MALAVIKA S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3680e0a1-3d59-4206-88bd-83a0fe9e1fef', '3680e0a1-3d59-4206-88bd-83a0fe9e1fef', format('{"sub":"%s","email":"%s"}', '3680e0a1-3d59-4206-88bd-83a0fe9e1fef', 't25fb479@gmail.com')::jsonb, 'email', '3680e0a1-3d59-4206-88bd-83a0fe9e1fef', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3680e0a1-3d59-4206-88bd-83a0fe9e1fef', 'MALAVIKA S', 't25fb479@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3680e0a1-3d59-4206-88bd-83a0fe9e1fef', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3680e0a1-3d59-4206-88bd-83a0fe9e1fef', 'T25FB479', now(), now());

    -- Teacher: MANJU (T25AP499)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c8397653-121a-4315-9b0d-a363ea42cb01', 'authenticated', 'authenticated', 't25ap499@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MANJU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c8397653-121a-4315-9b0d-a363ea42cb01', 'c8397653-121a-4315-9b0d-a363ea42cb01', format('{"sub":"%s","email":"%s"}', 'c8397653-121a-4315-9b0d-a363ea42cb01', 't25ap499@gmail.com')::jsonb, 'email', 'c8397653-121a-4315-9b0d-a363ea42cb01', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c8397653-121a-4315-9b0d-a363ea42cb01', 'MANJU', 't25ap499@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c8397653-121a-4315-9b0d-a363ea42cb01', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c8397653-121a-4315-9b0d-a363ea42cb01', 'T25AP499', now(), now());

    -- Teacher: MANJUSHA (T24SP376)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '54029480-2bb1-4c6f-a957-6e4ba340f2eb', 'authenticated', 'authenticated', 't24sp376@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MANJUSHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '54029480-2bb1-4c6f-a957-6e4ba340f2eb', '54029480-2bb1-4c6f-a957-6e4ba340f2eb', format('{"sub":"%s","email":"%s"}', '54029480-2bb1-4c6f-a957-6e4ba340f2eb', 't24sp376@gmail.com')::jsonb, 'email', '54029480-2bb1-4c6f-a957-6e4ba340f2eb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('54029480-2bb1-4c6f-a957-6e4ba340f2eb', 'MANJUSHA', 't24sp376@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('54029480-2bb1-4c6f-a957-6e4ba340f2eb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('54029480-2bb1-4c6f-a957-6e4ba340f2eb', 'T24SP376', now(), now());

    -- Teacher: MARIYA FASNA (T24SP368)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', 'authenticated', 'authenticated', 't24sp368@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MARIYA FASNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', '518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', format('{"sub":"%s","email":"%s"}', '518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', 't24sp368@gmail.com')::jsonb, 'email', '518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', 'MARIYA FASNA', 't24sp368@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('518e3804-6af7-44d7-8db0-d2f0a8bdd8b1', 'T24SP368', now(), now());

    -- Teacher: MARIYAM SHAHIN (T23NV82)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'be6f2679-24a7-492e-a30b-0558f7123f56', 'authenticated', 'authenticated', 't23nv82@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MARIYAM SHAHIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'be6f2679-24a7-492e-a30b-0558f7123f56', 'be6f2679-24a7-492e-a30b-0558f7123f56', format('{"sub":"%s","email":"%s"}', 'be6f2679-24a7-492e-a30b-0558f7123f56', 't23nv82@gmail.com')::jsonb, 'email', 'be6f2679-24a7-492e-a30b-0558f7123f56', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('be6f2679-24a7-492e-a30b-0558f7123f56', 'MARIYAM SHAHIN', 't23nv82@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('be6f2679-24a7-492e-a30b-0558f7123f56', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('be6f2679-24a7-492e-a30b-0558f7123f56', 'T23NV82', now(), now());

    -- Teacher: MARJANA K (T24MA242)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9b2918b2-2b16-4c1f-b466-5a324468eec4', 'authenticated', 'authenticated', 't24ma242@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MARJANA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9b2918b2-2b16-4c1f-b466-5a324468eec4', '9b2918b2-2b16-4c1f-b466-5a324468eec4', format('{"sub":"%s","email":"%s"}', '9b2918b2-2b16-4c1f-b466-5a324468eec4', 't24ma242@gmail.com')::jsonb, 'email', '9b2918b2-2b16-4c1f-b466-5a324468eec4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9b2918b2-2b16-4c1f-b466-5a324468eec4', 'MARJANA K', 't24ma242@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9b2918b2-2b16-4c1f-b466-5a324468eec4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9b2918b2-2b16-4c1f-b466-5a324468eec4', 'T24MA242', now(), now());

    -- Teacher: MARY CJ (T25AP510)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fe8d5aa9-559f-4cad-95e3-1c696bcc104c', 'authenticated', 'authenticated', 't25ap510@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MARY CJ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fe8d5aa9-559f-4cad-95e3-1c696bcc104c', 'fe8d5aa9-559f-4cad-95e3-1c696bcc104c', format('{"sub":"%s","email":"%s"}', 'fe8d5aa9-559f-4cad-95e3-1c696bcc104c', 't25ap510@gmail.com')::jsonb, 'email', 'fe8d5aa9-559f-4cad-95e3-1c696bcc104c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fe8d5aa9-559f-4cad-95e3-1c696bcc104c', 'MARY CJ', 't25ap510@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fe8d5aa9-559f-4cad-95e3-1c696bcc104c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fe8d5aa9-559f-4cad-95e3-1c696bcc104c', 'T25AP510', now(), now());

    -- Teacher: MARYMOL JOSE (T25JU581)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c34e4140-595e-448a-af8e-f1ee0ba4fa5d', 'authenticated', 'authenticated', 't25ju581@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MARYMOL JOSE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c34e4140-595e-448a-af8e-f1ee0ba4fa5d', 'c34e4140-595e-448a-af8e-f1ee0ba4fa5d', format('{"sub":"%s","email":"%s"}', 'c34e4140-595e-448a-af8e-f1ee0ba4fa5d', 't25ju581@gmail.com')::jsonb, 'email', 'c34e4140-595e-448a-af8e-f1ee0ba4fa5d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c34e4140-595e-448a-af8e-f1ee0ba4fa5d', 'MARYMOL JOSE', 't25ju581@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c34e4140-595e-448a-af8e-f1ee0ba4fa5d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c34e4140-595e-448a-af8e-f1ee0ba4fa5d', 'T25JU581', now(), now());

    -- Teacher: MASNA (T25NV758)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b0c30269-0a7c-4afe-90d1-d300a21c2601', 'authenticated', 'authenticated', 't25nv758@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MASNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b0c30269-0a7c-4afe-90d1-d300a21c2601', 'b0c30269-0a7c-4afe-90d1-d300a21c2601', format('{"sub":"%s","email":"%s"}', 'b0c30269-0a7c-4afe-90d1-d300a21c2601', 't25nv758@gmail.com')::jsonb, 'email', 'b0c30269-0a7c-4afe-90d1-d300a21c2601', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b0c30269-0a7c-4afe-90d1-d300a21c2601', 'MASNA', 't25nv758@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b0c30269-0a7c-4afe-90d1-d300a21c2601', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b0c30269-0a7c-4afe-90d1-d300a21c2601', 'T25NV758', now(), now());

    -- Teacher: MAYOOKHA SHAJU (T25AG621)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd1ff3831-5df7-4502-a3c8-45b03d5bd071', 'authenticated', 'authenticated', 't25ag621@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MAYOOKHA SHAJU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd1ff3831-5df7-4502-a3c8-45b03d5bd071', 'd1ff3831-5df7-4502-a3c8-45b03d5bd071', format('{"sub":"%s","email":"%s"}', 'd1ff3831-5df7-4502-a3c8-45b03d5bd071', 't25ag621@gmail.com')::jsonb, 'email', 'd1ff3831-5df7-4502-a3c8-45b03d5bd071', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d1ff3831-5df7-4502-a3c8-45b03d5bd071', 'MAYOOKHA SHAJU', 't25ag621@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d1ff3831-5df7-4502-a3c8-45b03d5bd071', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d1ff3831-5df7-4502-a3c8-45b03d5bd071', 'T25AG621', now(), now());

    -- Teacher: MEENAKSHI (T25JL599)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c7c78e89-9f0c-4663-9876-bb8f9107af80', 'authenticated', 'authenticated', 't25jl599@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MEENAKSHI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c7c78e89-9f0c-4663-9876-bb8f9107af80', 'c7c78e89-9f0c-4663-9876-bb8f9107af80', format('{"sub":"%s","email":"%s"}', 'c7c78e89-9f0c-4663-9876-bb8f9107af80', 't25jl599@gmail.com')::jsonb, 'email', 'c7c78e89-9f0c-4663-9876-bb8f9107af80', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c7c78e89-9f0c-4663-9876-bb8f9107af80', 'MEENAKSHI', 't25jl599@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c7c78e89-9f0c-4663-9876-bb8f9107af80', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c7c78e89-9f0c-4663-9876-bb8f9107af80', 'T25JL599', now(), now());

    -- Teacher: MEENAKSHI SHOKEEN (T25AP515)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e62f4fd4-0960-4a4d-8cb4-0f741bb40086', 'authenticated', 'authenticated', 't25ap515@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MEENAKSHI SHOKEEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e62f4fd4-0960-4a4d-8cb4-0f741bb40086', 'e62f4fd4-0960-4a4d-8cb4-0f741bb40086', format('{"sub":"%s","email":"%s"}', 'e62f4fd4-0960-4a4d-8cb4-0f741bb40086', 't25ap515@gmail.com')::jsonb, 'email', 'e62f4fd4-0960-4a4d-8cb4-0f741bb40086', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e62f4fd4-0960-4a4d-8cb4-0f741bb40086', 'MEENAKSHI SHOKEEN', 't25ap515@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e62f4fd4-0960-4a4d-8cb4-0f741bb40086', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e62f4fd4-0960-4a4d-8cb4-0f741bb40086', 'T25AP515', now(), now());

    -- Teacher: MEERA KRISHNAN (T24MA255)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b6b3bb4a-90e8-47c3-9249-c7e388684c3e', 'authenticated', 'authenticated', 't24ma255@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MEERA KRISHNAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b6b3bb4a-90e8-47c3-9249-c7e388684c3e', 'b6b3bb4a-90e8-47c3-9249-c7e388684c3e', format('{"sub":"%s","email":"%s"}', 'b6b3bb4a-90e8-47c3-9249-c7e388684c3e', 't24ma255@gmail.com')::jsonb, 'email', 'b6b3bb4a-90e8-47c3-9249-c7e388684c3e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b6b3bb4a-90e8-47c3-9249-c7e388684c3e', 'MEERA KRISHNAN', 't24ma255@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b6b3bb4a-90e8-47c3-9249-c7e388684c3e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b6b3bb4a-90e8-47c3-9249-c7e388684c3e', 'T24MA255', now(), now());

    -- Teacher: MEERA P R (T25NV760)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '61b4af76-54bc-4106-a61b-9fe424df1358', 'authenticated', 'authenticated', 't25nv760@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MEERA P R"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '61b4af76-54bc-4106-a61b-9fe424df1358', '61b4af76-54bc-4106-a61b-9fe424df1358', format('{"sub":"%s","email":"%s"}', '61b4af76-54bc-4106-a61b-9fe424df1358', 't25nv760@gmail.com')::jsonb, 'email', '61b4af76-54bc-4106-a61b-9fe424df1358', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('61b4af76-54bc-4106-a61b-9fe424df1358', 'MEERA P R', 't25nv760@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('61b4af76-54bc-4106-a61b-9fe424df1358', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('61b4af76-54bc-4106-a61b-9fe424df1358', 'T25NV760', now(), now());

    -- Teacher: MEHNAS (T25NV763)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', 'authenticated', 'authenticated', 't25nv763@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MEHNAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', '3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', format('{"sub":"%s","email":"%s"}', '3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', 't25nv763@gmail.com')::jsonb, 'email', '3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', 'MEHNAS', 't25nv763@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3c5e10cb-0ffd-4ae5-92e0-0743ffc86c8a', 'T25NV763', now(), now());

    -- Teacher: MIHRA T (T24AG325)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', 'authenticated', 'authenticated', 't24ag325@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MIHRA T"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', '2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', format('{"sub":"%s","email":"%s"}', '2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', 't24ag325@gmail.com')::jsonb, 'email', '2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', 'MIHRA T', 't24ag325@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2534bf43-ed3c-46f8-bdae-c6c0cd0871dc', 'T24AG325', now(), now());

    -- Teacher: MOHAMMED SINAN (T26JN812)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3bdbde73-f5d9-4fd2-87ae-d02cda18f060', 'authenticated', 'authenticated', 't26jn812@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MOHAMMED SINAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3bdbde73-f5d9-4fd2-87ae-d02cda18f060', '3bdbde73-f5d9-4fd2-87ae-d02cda18f060', format('{"sub":"%s","email":"%s"}', '3bdbde73-f5d9-4fd2-87ae-d02cda18f060', 't26jn812@gmail.com')::jsonb, 'email', '3bdbde73-f5d9-4fd2-87ae-d02cda18f060', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3bdbde73-f5d9-4fd2-87ae-d02cda18f060', 'MOHAMMED SINAN', 't26jn812@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3bdbde73-f5d9-4fd2-87ae-d02cda18f060', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3bdbde73-f5d9-4fd2-87ae-d02cda18f060', 'T26JN812', now(), now());

    -- Teacher: MONISHA (T24FB169)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd0a8971f-0a4f-4ab3-886c-9f078d326326', 'authenticated', 'authenticated', 't24fb169@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MONISHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd0a8971f-0a4f-4ab3-886c-9f078d326326', 'd0a8971f-0a4f-4ab3-886c-9f078d326326', format('{"sub":"%s","email":"%s"}', 'd0a8971f-0a4f-4ab3-886c-9f078d326326', 't24fb169@gmail.com')::jsonb, 'email', 'd0a8971f-0a4f-4ab3-886c-9f078d326326', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d0a8971f-0a4f-4ab3-886c-9f078d326326', 'MONISHA', 't24fb169@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d0a8971f-0a4f-4ab3-886c-9f078d326326', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d0a8971f-0a4f-4ab3-886c-9f078d326326', 'T24FB169', now(), now());

    -- Teacher: MUBEEN BAI (T25AP563)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '88186f41-94b5-4daa-9e0f-a2c3c8384e26', 'authenticated', 'authenticated', 't25ap563@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUBEEN BAI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '88186f41-94b5-4daa-9e0f-a2c3c8384e26', '88186f41-94b5-4daa-9e0f-a2c3c8384e26', format('{"sub":"%s","email":"%s"}', '88186f41-94b5-4daa-9e0f-a2c3c8384e26', 't25ap563@gmail.com')::jsonb, 'email', '88186f41-94b5-4daa-9e0f-a2c3c8384e26', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('88186f41-94b5-4daa-9e0f-a2c3c8384e26', 'MUBEEN BAI', 't25ap563@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('88186f41-94b5-4daa-9e0f-a2c3c8384e26', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('88186f41-94b5-4daa-9e0f-a2c3c8384e26', 'T25AP563', now(), now());

    -- Teacher: MUFEEDHA K (T25OC726)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a5b2ecd3-3278-434e-b27e-7854df270bbf', 'authenticated', 'authenticated', 't25oc726@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUFEEDHA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a5b2ecd3-3278-434e-b27e-7854df270bbf', 'a5b2ecd3-3278-434e-b27e-7854df270bbf', format('{"sub":"%s","email":"%s"}', 'a5b2ecd3-3278-434e-b27e-7854df270bbf', 't25oc726@gmail.com')::jsonb, 'email', 'a5b2ecd3-3278-434e-b27e-7854df270bbf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a5b2ecd3-3278-434e-b27e-7854df270bbf', 'MUFEEDHA K', 't25oc726@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a5b2ecd3-3278-434e-b27e-7854df270bbf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a5b2ecd3-3278-434e-b27e-7854df270bbf', 'T25OC726', now(), now());

    -- Teacher: MUFSINA M (T24OC410)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '14878b24-017e-49c6-acee-ca0d39f80900', 'authenticated', 'authenticated', 't24oc410@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUFSINA M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '14878b24-017e-49c6-acee-ca0d39f80900', '14878b24-017e-49c6-acee-ca0d39f80900', format('{"sub":"%s","email":"%s"}', '14878b24-017e-49c6-acee-ca0d39f80900', 't24oc410@gmail.com')::jsonb, 'email', '14878b24-017e-49c6-acee-ca0d39f80900', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('14878b24-017e-49c6-acee-ca0d39f80900', 'MUFSINA M', 't24oc410@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('14878b24-017e-49c6-acee-ca0d39f80900', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('14878b24-017e-49c6-acee-ca0d39f80900', 'T24OC410', now(), now());

    -- Teacher: MUHAMMED RAMSHEED MKP (T25JN450)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '45f92dc9-1f07-4b99-98e8-da2a9486854e', 'authenticated', 'authenticated', 't25jn450@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUHAMMED RAMSHEED MKP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '45f92dc9-1f07-4b99-98e8-da2a9486854e', '45f92dc9-1f07-4b99-98e8-da2a9486854e', format('{"sub":"%s","email":"%s"}', '45f92dc9-1f07-4b99-98e8-da2a9486854e', 't25jn450@gmail.com')::jsonb, 'email', '45f92dc9-1f07-4b99-98e8-da2a9486854e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('45f92dc9-1f07-4b99-98e8-da2a9486854e', 'MUHAMMED RAMSHEED MKP', 't25jn450@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('45f92dc9-1f07-4b99-98e8-da2a9486854e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('45f92dc9-1f07-4b99-98e8-da2a9486854e', 'T25JN450', now(), now());

    -- Teacher: MUHSEENA (T26FB851)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e7be0b06-08e6-41db-80d5-e9f2c74c08e9', 'authenticated', 'authenticated', 't26fb851@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUHSEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e7be0b06-08e6-41db-80d5-e9f2c74c08e9', 'e7be0b06-08e6-41db-80d5-e9f2c74c08e9', format('{"sub":"%s","email":"%s"}', 'e7be0b06-08e6-41db-80d5-e9f2c74c08e9', 't26fb851@gmail.com')::jsonb, 'email', 'e7be0b06-08e6-41db-80d5-e9f2c74c08e9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e7be0b06-08e6-41db-80d5-e9f2c74c08e9', 'MUHSEENA', 't26fb851@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e7be0b06-08e6-41db-80d5-e9f2c74c08e9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e7be0b06-08e6-41db-80d5-e9f2c74c08e9', 'T26FB851', now(), now());

    -- Teacher: MUHSINA (T25JL614)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9fb418af-282e-4b3d-bd8e-294253e95839', 'authenticated', 'authenticated', 't25jl614@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUHSINA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9fb418af-282e-4b3d-bd8e-294253e95839', '9fb418af-282e-4b3d-bd8e-294253e95839', format('{"sub":"%s","email":"%s"}', '9fb418af-282e-4b3d-bd8e-294253e95839', 't25jl614@gmail.com')::jsonb, 'email', '9fb418af-282e-4b3d-bd8e-294253e95839', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9fb418af-282e-4b3d-bd8e-294253e95839', 'MUHSINA', 't25jl614@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9fb418af-282e-4b3d-bd8e-294253e95839', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9fb418af-282e-4b3d-bd8e-294253e95839', 'T25JL614', now(), now());

    -- Teacher: MUHSINA CK (T25FB488)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5ef0c419-5e22-47da-a2e7-207b6f563392', 'authenticated', 'authenticated', 't25fb488@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUHSINA CK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5ef0c419-5e22-47da-a2e7-207b6f563392', '5ef0c419-5e22-47da-a2e7-207b6f563392', format('{"sub":"%s","email":"%s"}', '5ef0c419-5e22-47da-a2e7-207b6f563392', 't25fb488@gmail.com')::jsonb, 'email', '5ef0c419-5e22-47da-a2e7-207b6f563392', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5ef0c419-5e22-47da-a2e7-207b6f563392', 'MUHSINA CK', 't25fb488@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5ef0c419-5e22-47da-a2e7-207b6f563392', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5ef0c419-5e22-47da-a2e7-207b6f563392', 'T25FB488', now(), now());

    -- Teacher: MUHSINA TE (T24SP374)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '170f4c72-15ae-44d1-a566-da1e4ad130e6', 'authenticated', 'authenticated', 't24sp374@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUHSINA TE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '170f4c72-15ae-44d1-a566-da1e4ad130e6', '170f4c72-15ae-44d1-a566-da1e4ad130e6', format('{"sub":"%s","email":"%s"}', '170f4c72-15ae-44d1-a566-da1e4ad130e6', 't24sp374@gmail.com')::jsonb, 'email', '170f4c72-15ae-44d1-a566-da1e4ad130e6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('170f4c72-15ae-44d1-a566-da1e4ad130e6', 'MUHSINA TE', 't24sp374@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('170f4c72-15ae-44d1-a566-da1e4ad130e6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('170f4c72-15ae-44d1-a566-da1e4ad130e6', 'T24SP374', now(), now());

    -- Teacher: MUMTHAZ (T24MA254)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9a96c85e-de29-4866-ab92-7d5bc04edb2b', 'authenticated', 'authenticated', 't24ma254@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUMTHAZ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9a96c85e-de29-4866-ab92-7d5bc04edb2b', '9a96c85e-de29-4866-ab92-7d5bc04edb2b', format('{"sub":"%s","email":"%s"}', '9a96c85e-de29-4866-ab92-7d5bc04edb2b', 't24ma254@gmail.com')::jsonb, 'email', '9a96c85e-de29-4866-ab92-7d5bc04edb2b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9a96c85e-de29-4866-ab92-7d5bc04edb2b', 'MUMTHAZ', 't24ma254@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9a96c85e-de29-4866-ab92-7d5bc04edb2b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9a96c85e-de29-4866-ab92-7d5bc04edb2b', 'T24MA254', now(), now());

    -- Teacher: MUNEERA (T25AP562)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6d658017-6075-4983-96ef-05eba0ba72fe', 'authenticated', 'authenticated', 't25ap562@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUNEERA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6d658017-6075-4983-96ef-05eba0ba72fe', '6d658017-6075-4983-96ef-05eba0ba72fe', format('{"sub":"%s","email":"%s"}', '6d658017-6075-4983-96ef-05eba0ba72fe', 't25ap562@gmail.com')::jsonb, 'email', '6d658017-6075-4983-96ef-05eba0ba72fe', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6d658017-6075-4983-96ef-05eba0ba72fe', 'MUNEERA', 't25ap562@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6d658017-6075-4983-96ef-05eba0ba72fe', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6d658017-6075-4983-96ef-05eba0ba72fe', 'T25AP562', now(), now());

    -- Teacher: MUNEERA TK (T26JN817)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f44595ae-9be0-4f1f-91ee-38dc8a842147', 'authenticated', 'authenticated', 't26jn817@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MUNEERA TK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f44595ae-9be0-4f1f-91ee-38dc8a842147', 'f44595ae-9be0-4f1f-91ee-38dc8a842147', format('{"sub":"%s","email":"%s"}', 'f44595ae-9be0-4f1f-91ee-38dc8a842147', 't26jn817@gmail.com')::jsonb, 'email', 'f44595ae-9be0-4f1f-91ee-38dc8a842147', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f44595ae-9be0-4f1f-91ee-38dc8a842147', 'MUNEERA TK', 't26jn817@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f44595ae-9be0-4f1f-91ee-38dc8a842147', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f44595ae-9be0-4f1f-91ee-38dc8a842147', 'T26JN817', now(), now());

    -- Teacher: Munshifa (T24AP203)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '701ffefb-d14c-42a1-bfa7-0eeb05d68725', 'authenticated', 'authenticated', 't24ap203@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"Munshifa"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '701ffefb-d14c-42a1-bfa7-0eeb05d68725', '701ffefb-d14c-42a1-bfa7-0eeb05d68725', format('{"sub":"%s","email":"%s"}', '701ffefb-d14c-42a1-bfa7-0eeb05d68725', 't24ap203@gmail.com')::jsonb, 'email', '701ffefb-d14c-42a1-bfa7-0eeb05d68725', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('701ffefb-d14c-42a1-bfa7-0eeb05d68725', 'Munshifa', 't24ap203@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('701ffefb-d14c-42a1-bfa7-0eeb05d68725', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('701ffefb-d14c-42a1-bfa7-0eeb05d68725', 'T24AP203', now(), now());

    -- Teacher: MURSHIDA (T25JU592)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '01f98dd2-21d1-412b-8618-0ca2238b896d', 'authenticated', 'authenticated', 't25ju592@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MURSHIDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '01f98dd2-21d1-412b-8618-0ca2238b896d', '01f98dd2-21d1-412b-8618-0ca2238b896d', format('{"sub":"%s","email":"%s"}', '01f98dd2-21d1-412b-8618-0ca2238b896d', 't25ju592@gmail.com')::jsonb, 'email', '01f98dd2-21d1-412b-8618-0ca2238b896d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('01f98dd2-21d1-412b-8618-0ca2238b896d', 'MURSHIDA', 't25ju592@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('01f98dd2-21d1-412b-8618-0ca2238b896d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('01f98dd2-21d1-412b-8618-0ca2238b896d', 'T25JU592', now(), now());

    -- Teacher: MURSHIDA (T25AG643)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e834c30b-fe80-474d-9c41-f8b536b3d29f', 'authenticated', 'authenticated', 't25ag643@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"MURSHIDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e834c30b-fe80-474d-9c41-f8b536b3d29f', 'e834c30b-fe80-474d-9c41-f8b536b3d29f', format('{"sub":"%s","email":"%s"}', 'e834c30b-fe80-474d-9c41-f8b536b3d29f', 't25ag643@gmail.com')::jsonb, 'email', 'e834c30b-fe80-474d-9c41-f8b536b3d29f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e834c30b-fe80-474d-9c41-f8b536b3d29f', 'MURSHIDA', 't25ag643@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e834c30b-fe80-474d-9c41-f8b536b3d29f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e834c30b-fe80-474d-9c41-f8b536b3d29f', 'T25AG643', now(), now());

    -- Teacher: NABEELA (T24MA220)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2456eb2d-dbe7-4f90-8999-e552d6229a29', 'authenticated', 'authenticated', 't24ma220@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NABEELA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2456eb2d-dbe7-4f90-8999-e552d6229a29', '2456eb2d-dbe7-4f90-8999-e552d6229a29', format('{"sub":"%s","email":"%s"}', '2456eb2d-dbe7-4f90-8999-e552d6229a29', 't24ma220@gmail.com')::jsonb, 'email', '2456eb2d-dbe7-4f90-8999-e552d6229a29', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2456eb2d-dbe7-4f90-8999-e552d6229a29', 'NABEELA', 't24ma220@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2456eb2d-dbe7-4f90-8999-e552d6229a29', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2456eb2d-dbe7-4f90-8999-e552d6229a29', 'T24MA220', now(), now());

    -- Teacher: NABIHA (T26FB846)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a5c6724e-9b35-45bd-8ef4-7f7019a8005b', 'authenticated', 'authenticated', 't26fb846@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NABIHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a5c6724e-9b35-45bd-8ef4-7f7019a8005b', 'a5c6724e-9b35-45bd-8ef4-7f7019a8005b', format('{"sub":"%s","email":"%s"}', 'a5c6724e-9b35-45bd-8ef4-7f7019a8005b', 't26fb846@gmail.com')::jsonb, 'email', 'a5c6724e-9b35-45bd-8ef4-7f7019a8005b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a5c6724e-9b35-45bd-8ef4-7f7019a8005b', 'NABIHA', 't26fb846@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a5c6724e-9b35-45bd-8ef4-7f7019a8005b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a5c6724e-9b35-45bd-8ef4-7f7019a8005b', 'T26FB846', now(), now());

    -- Teacher: NADA AFRA (T25AP538)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8b0d0eec-30ef-485c-9cac-0a5ec190ddff', 'authenticated', 'authenticated', 't25ap538@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NADA AFRA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8b0d0eec-30ef-485c-9cac-0a5ec190ddff', '8b0d0eec-30ef-485c-9cac-0a5ec190ddff', format('{"sub":"%s","email":"%s"}', '8b0d0eec-30ef-485c-9cac-0a5ec190ddff', 't25ap538@gmail.com')::jsonb, 'email', '8b0d0eec-30ef-485c-9cac-0a5ec190ddff', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8b0d0eec-30ef-485c-9cac-0a5ec190ddff', 'NADA AFRA', 't25ap538@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8b0d0eec-30ef-485c-9cac-0a5ec190ddff', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8b0d0eec-30ef-485c-9cac-0a5ec190ddff', 'T25AP538', now(), now());

    -- Teacher: NADHA (T25OC721)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '38df5781-1d82-4796-a6de-e8e8d8fa5f4a', 'authenticated', 'authenticated', 't25oc721@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NADHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '38df5781-1d82-4796-a6de-e8e8d8fa5f4a', '38df5781-1d82-4796-a6de-e8e8d8fa5f4a', format('{"sub":"%s","email":"%s"}', '38df5781-1d82-4796-a6de-e8e8d8fa5f4a', 't25oc721@gmail.com')::jsonb, 'email', '38df5781-1d82-4796-a6de-e8e8d8fa5f4a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('38df5781-1d82-4796-a6de-e8e8d8fa5f4a', 'NADHA', 't25oc721@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('38df5781-1d82-4796-a6de-e8e8d8fa5f4a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('38df5781-1d82-4796-a6de-e8e8d8fa5f4a', 'T25OC721', now(), now());

    -- Teacher: NADIYA NIZAM (T25AP520)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7ff632af-2e33-4194-80e1-b7579363598d', 'authenticated', 'authenticated', 't25ap520@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NADIYA NIZAM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7ff632af-2e33-4194-80e1-b7579363598d', '7ff632af-2e33-4194-80e1-b7579363598d', format('{"sub":"%s","email":"%s"}', '7ff632af-2e33-4194-80e1-b7579363598d', 't25ap520@gmail.com')::jsonb, 'email', '7ff632af-2e33-4194-80e1-b7579363598d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7ff632af-2e33-4194-80e1-b7579363598d', 'NADIYA NIZAM', 't25ap520@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7ff632af-2e33-4194-80e1-b7579363598d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7ff632af-2e33-4194-80e1-b7579363598d', 'T25AP520', now(), now());

    -- Teacher: NAFEESATH SABEENA (T25NV775)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2a38b555-2e67-4e1b-b0fd-5b4424a6225a', 'authenticated', 'authenticated', 't25nv775@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAFEESATH SABEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2a38b555-2e67-4e1b-b0fd-5b4424a6225a', '2a38b555-2e67-4e1b-b0fd-5b4424a6225a', format('{"sub":"%s","email":"%s"}', '2a38b555-2e67-4e1b-b0fd-5b4424a6225a', 't25nv775@gmail.com')::jsonb, 'email', '2a38b555-2e67-4e1b-b0fd-5b4424a6225a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2a38b555-2e67-4e1b-b0fd-5b4424a6225a', 'NAFEESATH SABEENA', 't25nv775@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2a38b555-2e67-4e1b-b0fd-5b4424a6225a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2a38b555-2e67-4e1b-b0fd-5b4424a6225a', 'T25NV775', now(), now());

    -- Teacher: NAFIA (T25AG675)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6499c030-a013-4e17-9584-55807bb82fd4', 'authenticated', 'authenticated', 't25ag675@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAFIA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6499c030-a013-4e17-9584-55807bb82fd4', '6499c030-a013-4e17-9584-55807bb82fd4', format('{"sub":"%s","email":"%s"}', '6499c030-a013-4e17-9584-55807bb82fd4', 't25ag675@gmail.com')::jsonb, 'email', '6499c030-a013-4e17-9584-55807bb82fd4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6499c030-a013-4e17-9584-55807bb82fd4', 'NAFIA', 't25ag675@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6499c030-a013-4e17-9584-55807bb82fd4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6499c030-a013-4e17-9584-55807bb82fd4', 'T25AG675', now(), now());

    -- Teacher: NAFIA K NASARUDEEN (T25SP675)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e6360c57-1b2a-4e2f-b947-ca64885e6ef8', 'authenticated', 'authenticated', 't25sp675@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAFIA K NASARUDEEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e6360c57-1b2a-4e2f-b947-ca64885e6ef8', 'e6360c57-1b2a-4e2f-b947-ca64885e6ef8', format('{"sub":"%s","email":"%s"}', 'e6360c57-1b2a-4e2f-b947-ca64885e6ef8', 't25sp675@gmail.com')::jsonb, 'email', 'e6360c57-1b2a-4e2f-b947-ca64885e6ef8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e6360c57-1b2a-4e2f-b947-ca64885e6ef8', 'NAFIA K NASARUDEEN', 't25sp675@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e6360c57-1b2a-4e2f-b947-ca64885e6ef8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e6360c57-1b2a-4e2f-b947-ca64885e6ef8', 'T25SP675', now(), now());

    -- Teacher: NAFIA PS (T25NV753)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ce32fa4a-3862-4640-8f3b-23e78155204e', 'authenticated', 'authenticated', 't25nv753@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAFIA PS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ce32fa4a-3862-4640-8f3b-23e78155204e', 'ce32fa4a-3862-4640-8f3b-23e78155204e', format('{"sub":"%s","email":"%s"}', 'ce32fa4a-3862-4640-8f3b-23e78155204e', 't25nv753@gmail.com')::jsonb, 'email', 'ce32fa4a-3862-4640-8f3b-23e78155204e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ce32fa4a-3862-4640-8f3b-23e78155204e', 'NAFIA PS', 't25nv753@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ce32fa4a-3862-4640-8f3b-23e78155204e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ce32fa4a-3862-4640-8f3b-23e78155204e', 'T25NV753', now(), now());

    -- Teacher: NAFILA RAZAQ (T25SP658)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '52a8865d-bbf0-4427-b239-b3be753bafb3', 'authenticated', 'authenticated', 't25sp658@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAFILA RAZAQ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '52a8865d-bbf0-4427-b239-b3be753bafb3', '52a8865d-bbf0-4427-b239-b3be753bafb3', format('{"sub":"%s","email":"%s"}', '52a8865d-bbf0-4427-b239-b3be753bafb3', 't25sp658@gmail.com')::jsonb, 'email', '52a8865d-bbf0-4427-b239-b3be753bafb3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('52a8865d-bbf0-4427-b239-b3be753bafb3', 'NAFILA RAZAQ', 't25sp658@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('52a8865d-bbf0-4427-b239-b3be753bafb3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('52a8865d-bbf0-4427-b239-b3be753bafb3', 'T25SP658', now(), now());

    -- Teacher: NAHLA FATHIMA (T25JL603)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '536f2a12-e68e-46df-8444-ee41ba526e7e', 'authenticated', 'authenticated', 't25jl603@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAHLA FATHIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '536f2a12-e68e-46df-8444-ee41ba526e7e', '536f2a12-e68e-46df-8444-ee41ba526e7e', format('{"sub":"%s","email":"%s"}', '536f2a12-e68e-46df-8444-ee41ba526e7e', 't25jl603@gmail.com')::jsonb, 'email', '536f2a12-e68e-46df-8444-ee41ba526e7e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('536f2a12-e68e-46df-8444-ee41ba526e7e', 'NAHLA FATHIMA', 't25jl603@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('536f2a12-e68e-46df-8444-ee41ba526e7e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('536f2a12-e68e-46df-8444-ee41ba526e7e', 'T25JL603', now(), now());

    -- Teacher: NAHLA.V (T25MR493)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7f27c5db-b8fc-46f9-957f-081947e49173', 'authenticated', 'authenticated', 't25mr493@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAHLA.V"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7f27c5db-b8fc-46f9-957f-081947e49173', '7f27c5db-b8fc-46f9-957f-081947e49173', format('{"sub":"%s","email":"%s"}', '7f27c5db-b8fc-46f9-957f-081947e49173', 't25mr493@gmail.com')::jsonb, 'email', '7f27c5db-b8fc-46f9-957f-081947e49173', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7f27c5db-b8fc-46f9-957f-081947e49173', 'NAHLA.V', 't25mr493@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7f27c5db-b8fc-46f9-957f-081947e49173', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7f27c5db-b8fc-46f9-957f-081947e49173', 'T25MR493', now(), now());

    -- Teacher: NAJA FATHIMA (T25JU580)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5c423d36-3c15-4597-9200-68567a92f388', 'authenticated', 'authenticated', 't25ju580@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAJA FATHIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5c423d36-3c15-4597-9200-68567a92f388', '5c423d36-3c15-4597-9200-68567a92f388', format('{"sub":"%s","email":"%s"}', '5c423d36-3c15-4597-9200-68567a92f388', 't25ju580@gmail.com')::jsonb, 'email', '5c423d36-3c15-4597-9200-68567a92f388', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5c423d36-3c15-4597-9200-68567a92f388', 'NAJA FATHIMA', 't25ju580@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5c423d36-3c15-4597-9200-68567a92f388', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5c423d36-3c15-4597-9200-68567a92f388', 'T25JU580', now(), now());

    -- Teacher: NAJA SHERIN (T25DC788)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', 'authenticated', 'authenticated', 't25dc788@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAJA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', 'a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', format('{"sub":"%s","email":"%s"}', 'a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', 't25dc788@gmail.com')::jsonb, 'email', 'a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', 'NAJA SHERIN', 't25dc788@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a9c45b0c-ac59-476d-bb1f-98f51bfcafd1', 'T25DC788', now(), now());

    -- Teacher: NAJIYA.A (T25AP504)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '47c2a36f-c322-4895-a8c0-20af795c4481', 'authenticated', 'authenticated', 't25ap504@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAJIYA.A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '47c2a36f-c322-4895-a8c0-20af795c4481', '47c2a36f-c322-4895-a8c0-20af795c4481', format('{"sub":"%s","email":"%s"}', '47c2a36f-c322-4895-a8c0-20af795c4481', 't25ap504@gmail.com')::jsonb, 'email', '47c2a36f-c322-4895-a8c0-20af795c4481', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('47c2a36f-c322-4895-a8c0-20af795c4481', 'NAJIYA.A', 't25ap504@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('47c2a36f-c322-4895-a8c0-20af795c4481', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('47c2a36f-c322-4895-a8c0-20af795c4481', 'T25AP504', now(), now());

    -- Teacher: NAJMA VK (T25FB471)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b9f61ccb-2405-468f-8aba-9ad9686832c4', 'authenticated', 'authenticated', 't25fb471@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAJMA VK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b9f61ccb-2405-468f-8aba-9ad9686832c4', 'b9f61ccb-2405-468f-8aba-9ad9686832c4', format('{"sub":"%s","email":"%s"}', 'b9f61ccb-2405-468f-8aba-9ad9686832c4', 't25fb471@gmail.com')::jsonb, 'email', 'b9f61ccb-2405-468f-8aba-9ad9686832c4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b9f61ccb-2405-468f-8aba-9ad9686832c4', 'NAJMA VK', 't25fb471@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b9f61ccb-2405-468f-8aba-9ad9686832c4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b9f61ccb-2405-468f-8aba-9ad9686832c4', 'T25FB471', now(), now());

    -- Teacher: NAMITHA NOUSHAD (T24AP205)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '26b7b2b1-1398-4c8c-83da-7a8301f64c62', 'authenticated', 'authenticated', 't24ap205@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NAMITHA NOUSHAD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '26b7b2b1-1398-4c8c-83da-7a8301f64c62', '26b7b2b1-1398-4c8c-83da-7a8301f64c62', format('{"sub":"%s","email":"%s"}', '26b7b2b1-1398-4c8c-83da-7a8301f64c62', 't24ap205@gmail.com')::jsonb, 'email', '26b7b2b1-1398-4c8c-83da-7a8301f64c62', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('26b7b2b1-1398-4c8c-83da-7a8301f64c62', 'NAMITHA NOUSHAD', 't24ap205@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('26b7b2b1-1398-4c8c-83da-7a8301f64c62', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('26b7b2b1-1398-4c8c-83da-7a8301f64c62', 'T24AP205', now(), now());

    -- Teacher: NANDANA (T25SP672)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '474c02bd-859e-48d8-8871-16d9b8aa0289', 'authenticated', 'authenticated', 't25sp672@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NANDANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '474c02bd-859e-48d8-8871-16d9b8aa0289', '474c02bd-859e-48d8-8871-16d9b8aa0289', format('{"sub":"%s","email":"%s"}', '474c02bd-859e-48d8-8871-16d9b8aa0289', 't25sp672@gmail.com')::jsonb, 'email', '474c02bd-859e-48d8-8871-16d9b8aa0289', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('474c02bd-859e-48d8-8871-16d9b8aa0289', 'NANDANA', 't25sp672@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('474c02bd-859e-48d8-8871-16d9b8aa0289', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('474c02bd-859e-48d8-8871-16d9b8aa0289', 'T25SP672', now(), now());

    -- Teacher: NANDANA RAJEEV (T25NV757)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8d468e5b-250d-4ad3-949e-5aaea2a689b2', 'authenticated', 'authenticated', 't25nv757@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NANDANA RAJEEV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8d468e5b-250d-4ad3-949e-5aaea2a689b2', '8d468e5b-250d-4ad3-949e-5aaea2a689b2', format('{"sub":"%s","email":"%s"}', '8d468e5b-250d-4ad3-949e-5aaea2a689b2', 't25nv757@gmail.com')::jsonb, 'email', '8d468e5b-250d-4ad3-949e-5aaea2a689b2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8d468e5b-250d-4ad3-949e-5aaea2a689b2', 'NANDANA RAJEEV', 't25nv757@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8d468e5b-250d-4ad3-949e-5aaea2a689b2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8d468e5b-250d-4ad3-949e-5aaea2a689b2', 'T25NV757', now(), now());

    -- Teacher: NASEEBA (T23NV78)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', 'authenticated', 'authenticated', 't23nv78@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NASEEBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', '7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', format('{"sub":"%s","email":"%s"}', '7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', 't23nv78@gmail.com')::jsonb, 'email', '7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', 'NASEEBA', 't23nv78@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7ecb1fbe-7a2f-4ad7-b3d3-e11e2dfc82d9', 'T23NV78', now(), now());

    -- Teacher: NASEELA (T24MA209)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a6738893-4b82-4c6d-8f77-6e38ee9dbc58', 'authenticated', 'authenticated', 't24ma209@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NASEELA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a6738893-4b82-4c6d-8f77-6e38ee9dbc58', 'a6738893-4b82-4c6d-8f77-6e38ee9dbc58', format('{"sub":"%s","email":"%s"}', 'a6738893-4b82-4c6d-8f77-6e38ee9dbc58', 't24ma209@gmail.com')::jsonb, 'email', 'a6738893-4b82-4c6d-8f77-6e38ee9dbc58', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a6738893-4b82-4c6d-8f77-6e38ee9dbc58', 'NASEELA', 't24ma209@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a6738893-4b82-4c6d-8f77-6e38ee9dbc58', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a6738893-4b82-4c6d-8f77-6e38ee9dbc58', 'T24MA209', now(), now());

    -- Teacher: NEELIMA (T25JL612)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'cb64843e-8055-4433-98bc-c2b195b381a8', 'authenticated', 'authenticated', 't25jl612@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEELIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'cb64843e-8055-4433-98bc-c2b195b381a8', 'cb64843e-8055-4433-98bc-c2b195b381a8', format('{"sub":"%s","email":"%s"}', 'cb64843e-8055-4433-98bc-c2b195b381a8', 't25jl612@gmail.com')::jsonb, 'email', 'cb64843e-8055-4433-98bc-c2b195b381a8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('cb64843e-8055-4433-98bc-c2b195b381a8', 'NEELIMA', 't25jl612@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('cb64843e-8055-4433-98bc-c2b195b381a8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('cb64843e-8055-4433-98bc-c2b195b381a8', 'T25JL612', now(), now());

    -- Teacher: NEEMA (T23NV77)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1f8291c7-ebbb-4ac6-9344-14c7a51095b1', 'authenticated', 'authenticated', 't23nv77@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEEMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1f8291c7-ebbb-4ac6-9344-14c7a51095b1', '1f8291c7-ebbb-4ac6-9344-14c7a51095b1', format('{"sub":"%s","email":"%s"}', '1f8291c7-ebbb-4ac6-9344-14c7a51095b1', 't23nv77@gmail.com')::jsonb, 'email', '1f8291c7-ebbb-4ac6-9344-14c7a51095b1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1f8291c7-ebbb-4ac6-9344-14c7a51095b1', 'NEEMA', 't23nv77@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1f8291c7-ebbb-4ac6-9344-14c7a51095b1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1f8291c7-ebbb-4ac6-9344-14c7a51095b1', 'T23NV77', now(), now());

    -- Teacher: NEENU T.P (T25SP685)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '028d2fd9-e310-48ba-a0a4-eb40db38d107', 'authenticated', 'authenticated', 't25sp685@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEENU T.P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '028d2fd9-e310-48ba-a0a4-eb40db38d107', '028d2fd9-e310-48ba-a0a4-eb40db38d107', format('{"sub":"%s","email":"%s"}', '028d2fd9-e310-48ba-a0a4-eb40db38d107', 't25sp685@gmail.com')::jsonb, 'email', '028d2fd9-e310-48ba-a0a4-eb40db38d107', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('028d2fd9-e310-48ba-a0a4-eb40db38d107', 'NEENU T.P', 't25sp685@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('028d2fd9-e310-48ba-a0a4-eb40db38d107', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('028d2fd9-e310-48ba-a0a4-eb40db38d107', 'T25SP685', now(), now());

    -- Teacher: NEETHU KRISHNA S (T25AP521)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9aaac676-39c3-42ac-8379-4eb288d6fe0e', 'authenticated', 'authenticated', 't25ap521@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEETHU KRISHNA S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9aaac676-39c3-42ac-8379-4eb288d6fe0e', '9aaac676-39c3-42ac-8379-4eb288d6fe0e', format('{"sub":"%s","email":"%s"}', '9aaac676-39c3-42ac-8379-4eb288d6fe0e', 't25ap521@gmail.com')::jsonb, 'email', '9aaac676-39c3-42ac-8379-4eb288d6fe0e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9aaac676-39c3-42ac-8379-4eb288d6fe0e', 'NEETHU KRISHNA S', 't25ap521@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9aaac676-39c3-42ac-8379-4eb288d6fe0e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9aaac676-39c3-42ac-8379-4eb288d6fe0e', 'T25AP521', now(), now());

    -- Teacher: NEETHU R P (T25OC727)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b1f11b58-1f3b-4db8-9297-5ee150939954', 'authenticated', 'authenticated', 't25oc727@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEETHU R P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b1f11b58-1f3b-4db8-9297-5ee150939954', 'b1f11b58-1f3b-4db8-9297-5ee150939954', format('{"sub":"%s","email":"%s"}', 'b1f11b58-1f3b-4db8-9297-5ee150939954', 't25oc727@gmail.com')::jsonb, 'email', 'b1f11b58-1f3b-4db8-9297-5ee150939954', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b1f11b58-1f3b-4db8-9297-5ee150939954', 'NEETHU R P', 't25oc727@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b1f11b58-1f3b-4db8-9297-5ee150939954', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b1f11b58-1f3b-4db8-9297-5ee150939954', 'T25OC727', now(), now());

    -- Teacher: NEHA (T25SP690)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '52863fcc-6d42-4003-bf6f-4e44a526888e', 'authenticated', 'authenticated', 't25sp690@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '52863fcc-6d42-4003-bf6f-4e44a526888e', '52863fcc-6d42-4003-bf6f-4e44a526888e', format('{"sub":"%s","email":"%s"}', '52863fcc-6d42-4003-bf6f-4e44a526888e', 't25sp690@gmail.com')::jsonb, 'email', '52863fcc-6d42-4003-bf6f-4e44a526888e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('52863fcc-6d42-4003-bf6f-4e44a526888e', 'NEHA', 't25sp690@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('52863fcc-6d42-4003-bf6f-4e44a526888e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('52863fcc-6d42-4003-bf6f-4e44a526888e', 'T25SP690', now(), now());

    -- Teacher: NEHALA (T25OC719)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ee81e629-5695-460e-9666-426eb765a101', 'authenticated', 'authenticated', 't25oc719@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NEHALA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ee81e629-5695-460e-9666-426eb765a101', 'ee81e629-5695-460e-9666-426eb765a101', format('{"sub":"%s","email":"%s"}', 'ee81e629-5695-460e-9666-426eb765a101', 't25oc719@gmail.com')::jsonb, 'email', 'ee81e629-5695-460e-9666-426eb765a101', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ee81e629-5695-460e-9666-426eb765a101', 'NEHALA', 't25oc719@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ee81e629-5695-460e-9666-426eb765a101', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ee81e629-5695-460e-9666-426eb765a101', 'T25OC719', now(), now());

    -- Teacher: NIDHA FASILA (T24JU257)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '926f663e-4f83-4f28-8f78-3ba150cbf281', 'authenticated', 'authenticated', 't24ju257@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NIDHA FASILA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '926f663e-4f83-4f28-8f78-3ba150cbf281', '926f663e-4f83-4f28-8f78-3ba150cbf281', format('{"sub":"%s","email":"%s"}', '926f663e-4f83-4f28-8f78-3ba150cbf281', 't24ju257@gmail.com')::jsonb, 'email', '926f663e-4f83-4f28-8f78-3ba150cbf281', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('926f663e-4f83-4f28-8f78-3ba150cbf281', 'NIDHA FASILA', 't24ju257@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('926f663e-4f83-4f28-8f78-3ba150cbf281', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('926f663e-4f83-4f28-8f78-3ba150cbf281', 'T24JU257', now(), now());

    -- Teacher: NIGITHA S NAMBIAR (T25MA567)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '96390784-4201-41b8-b555-7cdc62f29047', 'authenticated', 'authenticated', 't25ma567@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NIGITHA S NAMBIAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '96390784-4201-41b8-b555-7cdc62f29047', '96390784-4201-41b8-b555-7cdc62f29047', format('{"sub":"%s","email":"%s"}', '96390784-4201-41b8-b555-7cdc62f29047', 't25ma567@gmail.com')::jsonb, 'email', '96390784-4201-41b8-b555-7cdc62f29047', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('96390784-4201-41b8-b555-7cdc62f29047', 'NIGITHA S NAMBIAR', 't25ma567@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('96390784-4201-41b8-b555-7cdc62f29047', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('96390784-4201-41b8-b555-7cdc62f29047', 'T25MA567', now(), now());

    -- Teacher: NIHALA ASEEN (T25MR487)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '546fc1c1-383c-4075-9a1c-01b3a7ba76c0', 'authenticated', 'authenticated', 't25mr487@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NIHALA ASEEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '546fc1c1-383c-4075-9a1c-01b3a7ba76c0', '546fc1c1-383c-4075-9a1c-01b3a7ba76c0', format('{"sub":"%s","email":"%s"}', '546fc1c1-383c-4075-9a1c-01b3a7ba76c0', 't25mr487@gmail.com')::jsonb, 'email', '546fc1c1-383c-4075-9a1c-01b3a7ba76c0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('546fc1c1-383c-4075-9a1c-01b3a7ba76c0', 'NIHALA ASEEN', 't25mr487@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('546fc1c1-383c-4075-9a1c-01b3a7ba76c0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('546fc1c1-383c-4075-9a1c-01b3a7ba76c0', 'T25MR487', now(), now());

    -- Teacher: NIHALA HAMZA (T25OC739)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', 'authenticated', 'authenticated', 't25oc739@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NIHALA HAMZA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', '1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', format('{"sub":"%s","email":"%s"}', '1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', 't25oc739@gmail.com')::jsonb, 'email', '1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', 'NIHALA HAMZA', 't25oc739@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1e4ce41b-58a4-4248-9ac2-ad6a98bc500c', 'T25OC739', now(), now());

    -- Teacher: NIHALA ISHFAN (T25DC801)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'df857d2f-9634-41d4-9ab0-66956f3fa50e', 'authenticated', 'authenticated', 't25dc801@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NIHALA ISHFAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'df857d2f-9634-41d4-9ab0-66956f3fa50e', 'df857d2f-9634-41d4-9ab0-66956f3fa50e', format('{"sub":"%s","email":"%s"}', 'df857d2f-9634-41d4-9ab0-66956f3fa50e', 't25dc801@gmail.com')::jsonb, 'email', 'df857d2f-9634-41d4-9ab0-66956f3fa50e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('df857d2f-9634-41d4-9ab0-66956f3fa50e', 'NIHALA ISHFAN', 't25dc801@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('df857d2f-9634-41d4-9ab0-66956f3fa50e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('df857d2f-9634-41d4-9ab0-66956f3fa50e', 'T25DC801', now(), now());

    -- Teacher: NIMSHIDA (T23OC48)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b3d07144-d5e2-44ef-ace7-1563a71104fc', 'authenticated', 'authenticated', 't23oc48@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NIMSHIDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b3d07144-d5e2-44ef-ace7-1563a71104fc', 'b3d07144-d5e2-44ef-ace7-1563a71104fc', format('{"sub":"%s","email":"%s"}', 'b3d07144-d5e2-44ef-ace7-1563a71104fc', 't23oc48@gmail.com')::jsonb, 'email', 'b3d07144-d5e2-44ef-ace7-1563a71104fc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b3d07144-d5e2-44ef-ace7-1563a71104fc', 'NIMSHIDA', 't23oc48@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b3d07144-d5e2-44ef-ace7-1563a71104fc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b3d07144-d5e2-44ef-ace7-1563a71104fc', 'T23OC48', now(), now());

    -- Teacher: NINSHA (T24DC434)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '92674145-e81c-497d-8057-388e66c2d276', 'authenticated', 'authenticated', 't24dc434@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NINSHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '92674145-e81c-497d-8057-388e66c2d276', '92674145-e81c-497d-8057-388e66c2d276', format('{"sub":"%s","email":"%s"}', '92674145-e81c-497d-8057-388e66c2d276', 't24dc434@gmail.com')::jsonb, 'email', '92674145-e81c-497d-8057-388e66c2d276', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('92674145-e81c-497d-8057-388e66c2d276', 'NINSHA', 't24dc434@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('92674145-e81c-497d-8057-388e66c2d276', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('92674145-e81c-497d-8057-388e66c2d276', 'T24DC434', now(), now());

    -- Teacher: NISHANA (T25OC716)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c18de5a2-cc20-4f74-a1e0-00331ca7c312', 'authenticated', 'authenticated', 't25oc716@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NISHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c18de5a2-cc20-4f74-a1e0-00331ca7c312', 'c18de5a2-cc20-4f74-a1e0-00331ca7c312', format('{"sub":"%s","email":"%s"}', 'c18de5a2-cc20-4f74-a1e0-00331ca7c312', 't25oc716@gmail.com')::jsonb, 'email', 'c18de5a2-cc20-4f74-a1e0-00331ca7c312', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c18de5a2-cc20-4f74-a1e0-00331ca7c312', 'NISHANA', 't25oc716@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c18de5a2-cc20-4f74-a1e0-00331ca7c312', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c18de5a2-cc20-4f74-a1e0-00331ca7c312', 'T25OC716', now(), now());

    -- Teacher: NISHIDA V K (T25DC780)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '33840d95-f72c-448c-8b02-772480d93293', 'authenticated', 'authenticated', 't25dc780@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NISHIDA V K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '33840d95-f72c-448c-8b02-772480d93293', '33840d95-f72c-448c-8b02-772480d93293', format('{"sub":"%s","email":"%s"}', '33840d95-f72c-448c-8b02-772480d93293', 't25dc780@gmail.com')::jsonb, 'email', '33840d95-f72c-448c-8b02-772480d93293', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('33840d95-f72c-448c-8b02-772480d93293', 'NISHIDA V K', 't25dc780@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('33840d95-f72c-448c-8b02-772480d93293', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('33840d95-f72c-448c-8b02-772480d93293', 'T25DC780', now(), now());

    -- Teacher: NITHYA ACCNT (T25JN455)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bdec6ad1-862f-4464-99f5-1e56a152a148', 'authenticated', 'authenticated', 't25jn455@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NITHYA ACCNT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bdec6ad1-862f-4464-99f5-1e56a152a148', 'bdec6ad1-862f-4464-99f5-1e56a152a148', format('{"sub":"%s","email":"%s"}', 'bdec6ad1-862f-4464-99f5-1e56a152a148', 't25jn455@gmail.com')::jsonb, 'email', 'bdec6ad1-862f-4464-99f5-1e56a152a148', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bdec6ad1-862f-4464-99f5-1e56a152a148', 'NITHYA ACCNT', 't25jn455@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bdec6ad1-862f-4464-99f5-1e56a152a148', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bdec6ad1-862f-4464-99f5-1e56a152a148', 'T25JN455', now(), now());

    -- Teacher: NOORAH KUNHAHAMMED KOYA (T24NV423)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6de071a2-3cfd-4e6e-a364-bdc0317bcef3', 'authenticated', 'authenticated', 't24nv423@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NOORAH KUNHAHAMMED KOYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6de071a2-3cfd-4e6e-a364-bdc0317bcef3', '6de071a2-3cfd-4e6e-a364-bdc0317bcef3', format('{"sub":"%s","email":"%s"}', '6de071a2-3cfd-4e6e-a364-bdc0317bcef3', 't24nv423@gmail.com')::jsonb, 'email', '6de071a2-3cfd-4e6e-a364-bdc0317bcef3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6de071a2-3cfd-4e6e-a364-bdc0317bcef3', 'NOORAH KUNHAHAMMED KOYA', 't24nv423@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6de071a2-3cfd-4e6e-a364-bdc0317bcef3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6de071a2-3cfd-4e6e-a364-bdc0317bcef3', 'T24NV423', now(), now());

    -- Teacher: NOORBINA E (T24SP384)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a4f62108-bc5c-4d4a-9b3e-47cd2474a368', 'authenticated', 'authenticated', 't24sp384@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"NOORBINA E"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a4f62108-bc5c-4d4a-9b3e-47cd2474a368', 'a4f62108-bc5c-4d4a-9b3e-47cd2474a368', format('{"sub":"%s","email":"%s"}', 'a4f62108-bc5c-4d4a-9b3e-47cd2474a368', 't24sp384@gmail.com')::jsonb, 'email', 'a4f62108-bc5c-4d4a-9b3e-47cd2474a368', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a4f62108-bc5c-4d4a-9b3e-47cd2474a368', 'NOORBINA E', 't24sp384@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a4f62108-bc5c-4d4a-9b3e-47cd2474a368', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a4f62108-bc5c-4d4a-9b3e-47cd2474a368', 'T24SP384', now(), now());

    -- Teacher: P GREESHMA JAYAKUMAR (T26FB852)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd83783da-9545-439f-a090-b88ccc91c5f9', 'authenticated', 'authenticated', 't26fb852@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"P GREESHMA JAYAKUMAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd83783da-9545-439f-a090-b88ccc91c5f9', 'd83783da-9545-439f-a090-b88ccc91c5f9', format('{"sub":"%s","email":"%s"}', 'd83783da-9545-439f-a090-b88ccc91c5f9', 't26fb852@gmail.com')::jsonb, 'email', 'd83783da-9545-439f-a090-b88ccc91c5f9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d83783da-9545-439f-a090-b88ccc91c5f9', 'P GREESHMA JAYAKUMAR', 't26fb852@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d83783da-9545-439f-a090-b88ccc91c5f9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d83783da-9545-439f-a090-b88ccc91c5f9', 'T26FB852', now(), now());

    -- Teacher: PANCHAMI (T25JU582)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4ae4950c-292b-4b4d-9fbe-0e9e02cff437', 'authenticated', 'authenticated', 't25ju582@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"PANCHAMI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4ae4950c-292b-4b4d-9fbe-0e9e02cff437', '4ae4950c-292b-4b4d-9fbe-0e9e02cff437', format('{"sub":"%s","email":"%s"}', '4ae4950c-292b-4b4d-9fbe-0e9e02cff437', 't25ju582@gmail.com')::jsonb, 'email', '4ae4950c-292b-4b4d-9fbe-0e9e02cff437', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4ae4950c-292b-4b4d-9fbe-0e9e02cff437', 'PANCHAMI', 't25ju582@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4ae4950c-292b-4b4d-9fbe-0e9e02cff437', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4ae4950c-292b-4b4d-9fbe-0e9e02cff437', 'T25JU582', now(), now());

    -- Teacher: POOJA L NAIR (T25AP559)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7fb5fb23-96a7-401a-9470-48cb85aad0cf', 'authenticated', 'authenticated', 't25ap559@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"POOJA L NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7fb5fb23-96a7-401a-9470-48cb85aad0cf', '7fb5fb23-96a7-401a-9470-48cb85aad0cf', format('{"sub":"%s","email":"%s"}', '7fb5fb23-96a7-401a-9470-48cb85aad0cf', 't25ap559@gmail.com')::jsonb, 'email', '7fb5fb23-96a7-401a-9470-48cb85aad0cf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7fb5fb23-96a7-401a-9470-48cb85aad0cf', 'POOJA L NAIR', 't25ap559@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7fb5fb23-96a7-401a-9470-48cb85aad0cf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7fb5fb23-96a7-401a-9470-48cb85aad0cf', 'T25AP559', now(), now());

    -- Teacher: PRABHA (T25JU576)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a63d6154-9e59-4d7b-9619-a99bb1bfd64e', 'authenticated', 'authenticated', 't25ju576@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"PRABHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a63d6154-9e59-4d7b-9619-a99bb1bfd64e', 'a63d6154-9e59-4d7b-9619-a99bb1bfd64e', format('{"sub":"%s","email":"%s"}', 'a63d6154-9e59-4d7b-9619-a99bb1bfd64e', 't25ju576@gmail.com')::jsonb, 'email', 'a63d6154-9e59-4d7b-9619-a99bb1bfd64e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a63d6154-9e59-4d7b-9619-a99bb1bfd64e', 'PRABHA', 't25ju576@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a63d6154-9e59-4d7b-9619-a99bb1bfd64e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a63d6154-9e59-4d7b-9619-a99bb1bfd64e', 'T25JU576', now(), now());

    -- Teacher: PRINCY LOY (T25JU594)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1bc46b16-07cb-495c-a26e-ef40d9187317', 'authenticated', 'authenticated', 't25ju594@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"PRINCY LOY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1bc46b16-07cb-495c-a26e-ef40d9187317', '1bc46b16-07cb-495c-a26e-ef40d9187317', format('{"sub":"%s","email":"%s"}', '1bc46b16-07cb-495c-a26e-ef40d9187317', 't25ju594@gmail.com')::jsonb, 'email', '1bc46b16-07cb-495c-a26e-ef40d9187317', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1bc46b16-07cb-495c-a26e-ef40d9187317', 'PRINCY LOY', 't25ju594@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1bc46b16-07cb-495c-a26e-ef40d9187317', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1bc46b16-07cb-495c-a26e-ef40d9187317', 'T25JU594', now(), now());

    -- Teacher: RAFSHANA (T23DC195)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fe90734b-413f-47cd-a6ff-79c5b5050720', 'authenticated', 'authenticated', 't23dc195@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAFSHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fe90734b-413f-47cd-a6ff-79c5b5050720', 'fe90734b-413f-47cd-a6ff-79c5b5050720', format('{"sub":"%s","email":"%s"}', 'fe90734b-413f-47cd-a6ff-79c5b5050720', 't23dc195@gmail.com')::jsonb, 'email', 'fe90734b-413f-47cd-a6ff-79c5b5050720', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fe90734b-413f-47cd-a6ff-79c5b5050720', 'RAFSHANA', 't23dc195@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fe90734b-413f-47cd-a6ff-79c5b5050720', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fe90734b-413f-47cd-a6ff-79c5b5050720', 'T23DC195', now(), now());

    -- Teacher: RAHILA (T23DC140)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', 'authenticated', 'authenticated', 't23dc140@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAHILA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', 'bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', format('{"sub":"%s","email":"%s"}', 'bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', 't23dc140@gmail.com')::jsonb, 'email', 'bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', 'RAHILA', 't23dc140@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bfc0e2e5-61c1-4945-b1bd-a39b91e867e3', 'T23DC140', now(), now());

    -- Teacher: RAHILAA (T25NV773)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e92b9435-961b-4d26-a446-ec4d317898e7', 'authenticated', 'authenticated', 't25nv773@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAHILAA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e92b9435-961b-4d26-a446-ec4d317898e7', 'e92b9435-961b-4d26-a446-ec4d317898e7', format('{"sub":"%s","email":"%s"}', 'e92b9435-961b-4d26-a446-ec4d317898e7', 't25nv773@gmail.com')::jsonb, 'email', 'e92b9435-961b-4d26-a446-ec4d317898e7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e92b9435-961b-4d26-a446-ec4d317898e7', 'RAHILAA', 't25nv773@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e92b9435-961b-4d26-a446-ec4d317898e7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e92b9435-961b-4d26-a446-ec4d317898e7', 'T25NV773', now(), now());

    -- Teacher: RAHMATHUNISA (T25SP682)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5ef8bac0-5029-4bca-8c87-595fe693c326', 'authenticated', 'authenticated', 't25sp682@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAHMATHUNISA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5ef8bac0-5029-4bca-8c87-595fe693c326', '5ef8bac0-5029-4bca-8c87-595fe693c326', format('{"sub":"%s","email":"%s"}', '5ef8bac0-5029-4bca-8c87-595fe693c326', 't25sp682@gmail.com')::jsonb, 'email', '5ef8bac0-5029-4bca-8c87-595fe693c326', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5ef8bac0-5029-4bca-8c87-595fe693c326', 'RAHMATHUNISA', 't25sp682@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5ef8bac0-5029-4bca-8c87-595fe693c326', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5ef8bac0-5029-4bca-8c87-595fe693c326', 'T25SP682', now(), now());

    -- Teacher: RAHMATHUNISA MP (T25OC695)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '22164b76-8fed-4ddb-bc8f-5b237d690743', 'authenticated', 'authenticated', 't25oc695@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAHMATHUNISA MP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '22164b76-8fed-4ddb-bc8f-5b237d690743', '22164b76-8fed-4ddb-bc8f-5b237d690743', format('{"sub":"%s","email":"%s"}', '22164b76-8fed-4ddb-bc8f-5b237d690743', 't25oc695@gmail.com')::jsonb, 'email', '22164b76-8fed-4ddb-bc8f-5b237d690743', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('22164b76-8fed-4ddb-bc8f-5b237d690743', 'RAHMATHUNISA MP', 't25oc695@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('22164b76-8fed-4ddb-bc8f-5b237d690743', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('22164b76-8fed-4ddb-bc8f-5b237d690743', 'T25OC695', now(), now());

    -- Teacher: RAHNA (T25AG619)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a14ee8a8-180d-48b7-a80a-dc943025fd56', 'authenticated', 'authenticated', 't25ag619@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAHNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a14ee8a8-180d-48b7-a80a-dc943025fd56', 'a14ee8a8-180d-48b7-a80a-dc943025fd56', format('{"sub":"%s","email":"%s"}', 'a14ee8a8-180d-48b7-a80a-dc943025fd56', 't25ag619@gmail.com')::jsonb, 'email', 'a14ee8a8-180d-48b7-a80a-dc943025fd56', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a14ee8a8-180d-48b7-a80a-dc943025fd56', 'RAHNA', 't25ag619@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a14ee8a8-180d-48b7-a80a-dc943025fd56', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a14ee8a8-180d-48b7-a80a-dc943025fd56', 'T25AG619', now(), now());

    -- Teacher: RAHNA AT (T25NV772)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '18ec2ee8-4344-463c-827f-b133862393a1', 'authenticated', 'authenticated', 't25nv772@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAHNA AT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '18ec2ee8-4344-463c-827f-b133862393a1', '18ec2ee8-4344-463c-827f-b133862393a1', format('{"sub":"%s","email":"%s"}', '18ec2ee8-4344-463c-827f-b133862393a1', 't25nv772@gmail.com')::jsonb, 'email', '18ec2ee8-4344-463c-827f-b133862393a1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('18ec2ee8-4344-463c-827f-b133862393a1', 'RAHNA AT', 't25nv772@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('18ec2ee8-4344-463c-827f-b133862393a1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('18ec2ee8-4344-463c-827f-b133862393a1', 'T25NV772', now(), now());

    -- Teacher: RAICHEL ANN VARGHESE (T25AP533)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8ac9678b-ad36-4973-b51a-d86a235f49f6', 'authenticated', 'authenticated', 't25ap533@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAICHEL ANN VARGHESE"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8ac9678b-ad36-4973-b51a-d86a235f49f6', '8ac9678b-ad36-4973-b51a-d86a235f49f6', format('{"sub":"%s","email":"%s"}', '8ac9678b-ad36-4973-b51a-d86a235f49f6', 't25ap533@gmail.com')::jsonb, 'email', '8ac9678b-ad36-4973-b51a-d86a235f49f6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8ac9678b-ad36-4973-b51a-d86a235f49f6', 'RAICHEL ANN VARGHESE', 't25ap533@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8ac9678b-ad36-4973-b51a-d86a235f49f6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8ac9678b-ad36-4973-b51a-d86a235f49f6', 'T25AP533', now(), now());

    -- Teacher: RAIHANA (T25OC703)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3d39d9ee-a196-4198-823b-68e7c67ebbf4', 'authenticated', 'authenticated', 't25oc703@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAIHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3d39d9ee-a196-4198-823b-68e7c67ebbf4', '3d39d9ee-a196-4198-823b-68e7c67ebbf4', format('{"sub":"%s","email":"%s"}', '3d39d9ee-a196-4198-823b-68e7c67ebbf4', 't25oc703@gmail.com')::jsonb, 'email', '3d39d9ee-a196-4198-823b-68e7c67ebbf4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3d39d9ee-a196-4198-823b-68e7c67ebbf4', 'RAIHANA', 't25oc703@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3d39d9ee-a196-4198-823b-68e7c67ebbf4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3d39d9ee-a196-4198-823b-68e7c67ebbf4', 'T25OC703', now(), now());

    -- Teacher: RAIHANA KA (T25OC698)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '333b4be2-b3f7-44fa-b771-f149c4e86694', 'authenticated', 'authenticated', 't25oc698@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAIHANA KA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '333b4be2-b3f7-44fa-b771-f149c4e86694', '333b4be2-b3f7-44fa-b771-f149c4e86694', format('{"sub":"%s","email":"%s"}', '333b4be2-b3f7-44fa-b771-f149c4e86694', 't25oc698@gmail.com')::jsonb, 'email', '333b4be2-b3f7-44fa-b771-f149c4e86694', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('333b4be2-b3f7-44fa-b771-f149c4e86694', 'RAIHANA KA', 't25oc698@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('333b4be2-b3f7-44fa-b771-f149c4e86694', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('333b4be2-b3f7-44fa-b771-f149c4e86694', 'T25OC698', now(), now());

    -- Teacher: RAKHI KRISHNAN (T25AG648)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a34b13e8-a01f-4510-a599-5e615a0a7ab3', 'authenticated', 'authenticated', 't25ag648@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAKHI KRISHNAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a34b13e8-a01f-4510-a599-5e615a0a7ab3', 'a34b13e8-a01f-4510-a599-5e615a0a7ab3', format('{"sub":"%s","email":"%s"}', 'a34b13e8-a01f-4510-a599-5e615a0a7ab3', 't25ag648@gmail.com')::jsonb, 'email', 'a34b13e8-a01f-4510-a599-5e615a0a7ab3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a34b13e8-a01f-4510-a599-5e615a0a7ab3', 'RAKHI KRISHNAN', 't25ag648@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a34b13e8-a01f-4510-a599-5e615a0a7ab3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a34b13e8-a01f-4510-a599-5e615a0a7ab3', 'T25AG648', now(), now());

    -- Teacher: RALIYA (T25SP674)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '02e0fce7-c02d-4974-be1b-489a50f93b91', 'authenticated', 'authenticated', 't25sp674@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RALIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '02e0fce7-c02d-4974-be1b-489a50f93b91', '02e0fce7-c02d-4974-be1b-489a50f93b91', format('{"sub":"%s","email":"%s"}', '02e0fce7-c02d-4974-be1b-489a50f93b91', 't25sp674@gmail.com')::jsonb, 'email', '02e0fce7-c02d-4974-be1b-489a50f93b91', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('02e0fce7-c02d-4974-be1b-489a50f93b91', 'RALIYA', 't25sp674@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('02e0fce7-c02d-4974-be1b-489a50f93b91', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('02e0fce7-c02d-4974-be1b-489a50f93b91', 'T25SP674', now(), now());

    -- Teacher: RAMEEL BANU (T25OC737)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e1e55e0d-680f-43f6-a012-98d0ed1d2e67', 'authenticated', 'authenticated', 't25oc737@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RAMEEL BANU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e1e55e0d-680f-43f6-a012-98d0ed1d2e67', 'e1e55e0d-680f-43f6-a012-98d0ed1d2e67', format('{"sub":"%s","email":"%s"}', 'e1e55e0d-680f-43f6-a012-98d0ed1d2e67', 't25oc737@gmail.com')::jsonb, 'email', 'e1e55e0d-680f-43f6-a012-98d0ed1d2e67', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e1e55e0d-680f-43f6-a012-98d0ed1d2e67', 'RAMEEL BANU', 't25oc737@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e1e55e0d-680f-43f6-a012-98d0ed1d2e67', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e1e55e0d-680f-43f6-a012-98d0ed1d2e67', 'T25OC737', now(), now());

    -- Teacher: RASHA FATHIMA (T25OC736)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f70b4464-bd28-48d2-9a47-dd382300563d', 'authenticated', 'authenticated', 't25oc736@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RASHA FATHIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f70b4464-bd28-48d2-9a47-dd382300563d', 'f70b4464-bd28-48d2-9a47-dd382300563d', format('{"sub":"%s","email":"%s"}', 'f70b4464-bd28-48d2-9a47-dd382300563d', 't25oc736@gmail.com')::jsonb, 'email', 'f70b4464-bd28-48d2-9a47-dd382300563d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f70b4464-bd28-48d2-9a47-dd382300563d', 'RASHA FATHIMA', 't25oc736@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f70b4464-bd28-48d2-9a47-dd382300563d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f70b4464-bd28-48d2-9a47-dd382300563d', 'T25OC736', now(), now());

    -- Teacher: RASIYA ASEEM (T25NV762)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8ea948a3-f735-4db0-a8b4-437c358d947c', 'authenticated', 'authenticated', 't25nv762@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RASIYA ASEEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8ea948a3-f735-4db0-a8b4-437c358d947c', '8ea948a3-f735-4db0-a8b4-437c358d947c', format('{"sub":"%s","email":"%s"}', '8ea948a3-f735-4db0-a8b4-437c358d947c', 't25nv762@gmail.com')::jsonb, 'email', '8ea948a3-f735-4db0-a8b4-437c358d947c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8ea948a3-f735-4db0-a8b4-437c358d947c', 'RASIYA ASEEM', 't25nv762@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8ea948a3-f735-4db0-a8b4-437c358d947c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8ea948a3-f735-4db0-a8b4-437c358d947c', 'T25NV762', now(), now());

    -- Teacher: REKHA R NAIR (T26FB848)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c8b71a69-46df-4f2a-9496-ed4aa89da4d1', 'authenticated', 'authenticated', 't26fb848@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"REKHA R NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c8b71a69-46df-4f2a-9496-ed4aa89da4d1', 'c8b71a69-46df-4f2a-9496-ed4aa89da4d1', format('{"sub":"%s","email":"%s"}', 'c8b71a69-46df-4f2a-9496-ed4aa89da4d1', 't26fb848@gmail.com')::jsonb, 'email', 'c8b71a69-46df-4f2a-9496-ed4aa89da4d1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c8b71a69-46df-4f2a-9496-ed4aa89da4d1', 'REKHA R NAIR', 't26fb848@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c8b71a69-46df-4f2a-9496-ed4aa89da4d1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c8b71a69-46df-4f2a-9496-ed4aa89da4d1', 'T26FB848', now(), now());

    -- Teacher: REMYA KRISHNA KUMAR (T25FB477)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7e4d0156-d317-4615-9825-c8b729693540', 'authenticated', 'authenticated', 't25fb477@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"REMYA KRISHNA KUMAR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7e4d0156-d317-4615-9825-c8b729693540', '7e4d0156-d317-4615-9825-c8b729693540', format('{"sub":"%s","email":"%s"}', '7e4d0156-d317-4615-9825-c8b729693540', 't25fb477@gmail.com')::jsonb, 'email', '7e4d0156-d317-4615-9825-c8b729693540', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7e4d0156-d317-4615-9825-c8b729693540', 'REMYA KRISHNA KUMAR', 't25fb477@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7e4d0156-d317-4615-9825-c8b729693540', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7e4d0156-d317-4615-9825-c8b729693540', 'T25FB477', now(), now());

    -- Teacher: RENUKA KR (T25JN443)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '035fb35b-5ecf-4d8b-bb89-817d1041839e', 'authenticated', 'authenticated', 't25jn443@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RENUKA KR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '035fb35b-5ecf-4d8b-bb89-817d1041839e', '035fb35b-5ecf-4d8b-bb89-817d1041839e', format('{"sub":"%s","email":"%s"}', '035fb35b-5ecf-4d8b-bb89-817d1041839e', 't25jn443@gmail.com')::jsonb, 'email', '035fb35b-5ecf-4d8b-bb89-817d1041839e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('035fb35b-5ecf-4d8b-bb89-817d1041839e', 'RENUKA KR', 't25jn443@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('035fb35b-5ecf-4d8b-bb89-817d1041839e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('035fb35b-5ecf-4d8b-bb89-817d1041839e', 'T25JN443', now(), now());

    -- Teacher: RESHMA SHAJESH (T25DC796)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fe09c1ee-c565-490a-acbd-76b5b2950d16', 'authenticated', 'authenticated', 't25dc796@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RESHMA SHAJESH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fe09c1ee-c565-490a-acbd-76b5b2950d16', 'fe09c1ee-c565-490a-acbd-76b5b2950d16', format('{"sub":"%s","email":"%s"}', 'fe09c1ee-c565-490a-acbd-76b5b2950d16', 't25dc796@gmail.com')::jsonb, 'email', 'fe09c1ee-c565-490a-acbd-76b5b2950d16', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fe09c1ee-c565-490a-acbd-76b5b2950d16', 'RESHMA SHAJESH', 't25dc796@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fe09c1ee-c565-490a-acbd-76b5b2950d16', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fe09c1ee-c565-490a-acbd-76b5b2950d16', 'T25DC796', now(), now());

    -- Teacher: RESHMADAS M (T24NV413)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8e6976d3-9cd0-4237-9d3b-a565fca17cd0', 'authenticated', 'authenticated', 't24nv413@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RESHMADAS M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8e6976d3-9cd0-4237-9d3b-a565fca17cd0', '8e6976d3-9cd0-4237-9d3b-a565fca17cd0', format('{"sub":"%s","email":"%s"}', '8e6976d3-9cd0-4237-9d3b-a565fca17cd0', 't24nv413@gmail.com')::jsonb, 'email', '8e6976d3-9cd0-4237-9d3b-a565fca17cd0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8e6976d3-9cd0-4237-9d3b-a565fca17cd0', 'RESHMADAS M', 't24nv413@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8e6976d3-9cd0-4237-9d3b-a565fca17cd0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8e6976d3-9cd0-4237-9d3b-a565fca17cd0', 'T24NV413', now(), now());

    -- Teacher: REVATHY (T24OC627)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '873ce132-44b4-4dea-8a90-23a0bde859c5', 'authenticated', 'authenticated', 't24oc627@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"REVATHY"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '873ce132-44b4-4dea-8a90-23a0bde859c5', '873ce132-44b4-4dea-8a90-23a0bde859c5', format('{"sub":"%s","email":"%s"}', '873ce132-44b4-4dea-8a90-23a0bde859c5', 't24oc627@gmail.com')::jsonb, 'email', '873ce132-44b4-4dea-8a90-23a0bde859c5', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('873ce132-44b4-4dea-8a90-23a0bde859c5', 'REVATHY', 't24oc627@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('873ce132-44b4-4dea-8a90-23a0bde859c5', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('873ce132-44b4-4dea-8a90-23a0bde859c5', 'T24OC627', now(), now());

    -- Teacher: REVATHY K (T24OC398)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7105a1c4-3831-4c10-a2f6-59a8721601eb', 'authenticated', 'authenticated', 't24oc398@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"REVATHY K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7105a1c4-3831-4c10-a2f6-59a8721601eb', '7105a1c4-3831-4c10-a2f6-59a8721601eb', format('{"sub":"%s","email":"%s"}', '7105a1c4-3831-4c10-a2f6-59a8721601eb', 't24oc398@gmail.com')::jsonb, 'email', '7105a1c4-3831-4c10-a2f6-59a8721601eb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7105a1c4-3831-4c10-a2f6-59a8721601eb', 'REVATHY K', 't24oc398@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7105a1c4-3831-4c10-a2f6-59a8721601eb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7105a1c4-3831-4c10-a2f6-59a8721601eb', 'T24OC398', now(), now());

    -- Teacher: RIDHA (T25SP684)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '42633a77-8f9e-418c-9536-957defa963aa', 'authenticated', 'authenticated', 't25sp684@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RIDHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '42633a77-8f9e-418c-9536-957defa963aa', '42633a77-8f9e-418c-9536-957defa963aa', format('{"sub":"%s","email":"%s"}', '42633a77-8f9e-418c-9536-957defa963aa', 't25sp684@gmail.com')::jsonb, 'email', '42633a77-8f9e-418c-9536-957defa963aa', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('42633a77-8f9e-418c-9536-957defa963aa', 'RIDHA', 't25sp684@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('42633a77-8f9e-418c-9536-957defa963aa', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('42633a77-8f9e-418c-9536-957defa963aa', 'T25SP684', now(), now());

    -- Teacher: RIFA (T25SP659)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '199d0975-3683-4a59-86e4-66248d61d75f', 'authenticated', 'authenticated', 't25sp659@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RIFA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '199d0975-3683-4a59-86e4-66248d61d75f', '199d0975-3683-4a59-86e4-66248d61d75f', format('{"sub":"%s","email":"%s"}', '199d0975-3683-4a59-86e4-66248d61d75f', 't25sp659@gmail.com')::jsonb, 'email', '199d0975-3683-4a59-86e4-66248d61d75f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('199d0975-3683-4a59-86e4-66248d61d75f', 'RIFA', 't25sp659@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('199d0975-3683-4a59-86e4-66248d61d75f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('199d0975-3683-4a59-86e4-66248d61d75f', 'T25SP659', now(), now());

    -- Teacher: RINSHA K S (T25NV747)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1205319e-812a-4b2f-809a-5b571f524228', 'authenticated', 'authenticated', 't25nv747@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RINSHA K S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1205319e-812a-4b2f-809a-5b571f524228', '1205319e-812a-4b2f-809a-5b571f524228', format('{"sub":"%s","email":"%s"}', '1205319e-812a-4b2f-809a-5b571f524228', 't25nv747@gmail.com')::jsonb, 'email', '1205319e-812a-4b2f-809a-5b571f524228', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1205319e-812a-4b2f-809a-5b571f524228', 'RINSHA K S', 't25nv747@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1205319e-812a-4b2f-809a-5b571f524228', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1205319e-812a-4b2f-809a-5b571f524228', 'T25NV747', now(), now());

    -- Teacher: RINSHA MK (T24MA253)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b0579ce4-8ae0-47b2-aa58-d308c29c88c3', 'authenticated', 'authenticated', 't24ma253@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RINSHA MK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b0579ce4-8ae0-47b2-aa58-d308c29c88c3', 'b0579ce4-8ae0-47b2-aa58-d308c29c88c3', format('{"sub":"%s","email":"%s"}', 'b0579ce4-8ae0-47b2-aa58-d308c29c88c3', 't24ma253@gmail.com')::jsonb, 'email', 'b0579ce4-8ae0-47b2-aa58-d308c29c88c3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b0579ce4-8ae0-47b2-aa58-d308c29c88c3', 'RINSHA MK', 't24ma253@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b0579ce4-8ae0-47b2-aa58-d308c29c88c3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b0579ce4-8ae0-47b2-aa58-d308c29c88c3', 'T24MA253', now(), now());

    -- Teacher: RINSHA SHERIN (T25SP666)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6139875f-4f33-4ff0-9500-010d5ed3322b', 'authenticated', 'authenticated', 't25sp666@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RINSHA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6139875f-4f33-4ff0-9500-010d5ed3322b', '6139875f-4f33-4ff0-9500-010d5ed3322b', format('{"sub":"%s","email":"%s"}', '6139875f-4f33-4ff0-9500-010d5ed3322b', 't25sp666@gmail.com')::jsonb, 'email', '6139875f-4f33-4ff0-9500-010d5ed3322b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6139875f-4f33-4ff0-9500-010d5ed3322b', 'RINSHA SHERIN', 't25sp666@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6139875f-4f33-4ff0-9500-010d5ed3322b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6139875f-4f33-4ff0-9500-010d5ed3322b', 'T25SP666', now(), now());

    -- Teacher: RISHNA P (T26JN814)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6499000b-1849-472a-a18f-f15569db7406', 'authenticated', 'authenticated', 't26jn814@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RISHNA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6499000b-1849-472a-a18f-f15569db7406', '6499000b-1849-472a-a18f-f15569db7406', format('{"sub":"%s","email":"%s"}', '6499000b-1849-472a-a18f-f15569db7406', 't26jn814@gmail.com')::jsonb, 'email', '6499000b-1849-472a-a18f-f15569db7406', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6499000b-1849-472a-a18f-f15569db7406', 'RISHNA P', 't26jn814@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6499000b-1849-472a-a18f-f15569db7406', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6499000b-1849-472a-a18f-f15569db7406', 'T26JN814', now(), now());

    -- Teacher: RISNA SHABEEB (T25DC790)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '49696855-588f-4e50-9b84-5cddf113eca8', 'authenticated', 'authenticated', 't25dc790@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RISNA SHABEEB"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '49696855-588f-4e50-9b84-5cddf113eca8', '49696855-588f-4e50-9b84-5cddf113eca8', format('{"sub":"%s","email":"%s"}', '49696855-588f-4e50-9b84-5cddf113eca8', 't25dc790@gmail.com')::jsonb, 'email', '49696855-588f-4e50-9b84-5cddf113eca8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('49696855-588f-4e50-9b84-5cddf113eca8', 'RISNA SHABEEB', 't25dc790@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('49696855-588f-4e50-9b84-5cddf113eca8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('49696855-588f-4e50-9b84-5cddf113eca8', 'T25DC790', now(), now());

    -- Teacher: RISNA V (T25AP507)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e232f98d-20de-4999-8fc9-524a3896a3bc', 'authenticated', 'authenticated', 't25ap507@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RISNA V"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e232f98d-20de-4999-8fc9-524a3896a3bc', 'e232f98d-20de-4999-8fc9-524a3896a3bc', format('{"sub":"%s","email":"%s"}', 'e232f98d-20de-4999-8fc9-524a3896a3bc', 't25ap507@gmail.com')::jsonb, 'email', 'e232f98d-20de-4999-8fc9-524a3896a3bc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e232f98d-20de-4999-8fc9-524a3896a3bc', 'RISNA V', 't25ap507@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e232f98d-20de-4999-8fc9-524a3896a3bc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e232f98d-20de-4999-8fc9-524a3896a3bc', 'T25AP507', now(), now());

    -- Teacher: RISVANA KP (T25NV774)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '58f5a10e-9112-443a-b5f0-fe3b0e13d867', 'authenticated', 'authenticated', 't25nv774@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RISVANA KP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '58f5a10e-9112-443a-b5f0-fe3b0e13d867', '58f5a10e-9112-443a-b5f0-fe3b0e13d867', format('{"sub":"%s","email":"%s"}', '58f5a10e-9112-443a-b5f0-fe3b0e13d867', 't25nv774@gmail.com')::jsonb, 'email', '58f5a10e-9112-443a-b5f0-fe3b0e13d867', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('58f5a10e-9112-443a-b5f0-fe3b0e13d867', 'RISVANA KP', 't25nv774@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('58f5a10e-9112-443a-b5f0-fe3b0e13d867', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('58f5a10e-9112-443a-b5f0-fe3b0e13d867', 'T25NV774', now(), now());

    -- Teacher: RISWANA N (T24NV427)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', 'authenticated', 'authenticated', 't24nv427@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RISWANA N"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', 'c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', format('{"sub":"%s","email":"%s"}', 'c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', 't24nv427@gmail.com')::jsonb, 'email', 'c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', 'RISWANA N', 't24nv427@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c4e5f4fd-1d35-4be0-9040-ceb0c7126f7f', 'T24NV427', now(), now());

    -- Teacher: RIZLA SHERIN A (T24NV429)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ae9e1dd1-6c35-4972-b596-57cc7d869df4', 'authenticated', 'authenticated', 't24nv429@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RIZLA SHERIN A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ae9e1dd1-6c35-4972-b596-57cc7d869df4', 'ae9e1dd1-6c35-4972-b596-57cc7d869df4', format('{"sub":"%s","email":"%s"}', 'ae9e1dd1-6c35-4972-b596-57cc7d869df4', 't24nv429@gmail.com')::jsonb, 'email', 'ae9e1dd1-6c35-4972-b596-57cc7d869df4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ae9e1dd1-6c35-4972-b596-57cc7d869df4', 'RIZLA SHERIN A', 't24nv429@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ae9e1dd1-6c35-4972-b596-57cc7d869df4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ae9e1dd1-6c35-4972-b596-57cc7d869df4', 'T24NV429', now(), now());

    -- Teacher: ROSHIN SAJAN (T25FB468)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4beffaa8-a470-43b4-8b74-209383dd3737', 'authenticated', 'authenticated', 't25fb468@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ROSHIN SAJAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4beffaa8-a470-43b4-8b74-209383dd3737', '4beffaa8-a470-43b4-8b74-209383dd3737', format('{"sub":"%s","email":"%s"}', '4beffaa8-a470-43b4-8b74-209383dd3737', 't25fb468@gmail.com')::jsonb, 'email', '4beffaa8-a470-43b4-8b74-209383dd3737', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4beffaa8-a470-43b4-8b74-209383dd3737', 'ROSHIN SAJAN', 't25fb468@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4beffaa8-a470-43b4-8b74-209383dd3737', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4beffaa8-a470-43b4-8b74-209383dd3737', 'T25FB468', now(), now());

    -- Teacher: RUBA SHARIN (T25AP560)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '93153e7b-8cd7-465a-80a8-3f6d9cda00da', 'authenticated', 'authenticated', 't25ap560@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RUBA SHARIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '93153e7b-8cd7-465a-80a8-3f6d9cda00da', '93153e7b-8cd7-465a-80a8-3f6d9cda00da', format('{"sub":"%s","email":"%s"}', '93153e7b-8cd7-465a-80a8-3f6d9cda00da', 't25ap560@gmail.com')::jsonb, 'email', '93153e7b-8cd7-465a-80a8-3f6d9cda00da', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('93153e7b-8cd7-465a-80a8-3f6d9cda00da', 'RUBA SHARIN', 't25ap560@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('93153e7b-8cd7-465a-80a8-3f6d9cda00da', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('93153e7b-8cd7-465a-80a8-3f6d9cda00da', 'T25AP560', now(), now());

    -- Teacher: RUSTHA MEERAN K (T24SP352)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'da193bd1-e55e-4fee-ab34-167383832db1', 'authenticated', 'authenticated', 't24sp352@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"RUSTHA MEERAN K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'da193bd1-e55e-4fee-ab34-167383832db1', 'da193bd1-e55e-4fee-ab34-167383832db1', format('{"sub":"%s","email":"%s"}', 'da193bd1-e55e-4fee-ab34-167383832db1', 't24sp352@gmail.com')::jsonb, 'email', 'da193bd1-e55e-4fee-ab34-167383832db1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('da193bd1-e55e-4fee-ab34-167383832db1', 'RUSTHA MEERAN K', 't24sp352@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('da193bd1-e55e-4fee-ab34-167383832db1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('da193bd1-e55e-4fee-ab34-167383832db1', 'T24SP352', now(), now());

    -- Teacher: S. LEKSHMI PRIYA (T25NV742)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ffe126f5-6df3-4fe8-acac-ffd7f36f943f', 'authenticated', 'authenticated', 't25nv742@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"S. LEKSHMI PRIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ffe126f5-6df3-4fe8-acac-ffd7f36f943f', 'ffe126f5-6df3-4fe8-acac-ffd7f36f943f', format('{"sub":"%s","email":"%s"}', 'ffe126f5-6df3-4fe8-acac-ffd7f36f943f', 't25nv742@gmail.com')::jsonb, 'email', 'ffe126f5-6df3-4fe8-acac-ffd7f36f943f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ffe126f5-6df3-4fe8-acac-ffd7f36f943f', 'S. LEKSHMI PRIYA', 't25nv742@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ffe126f5-6df3-4fe8-acac-ffd7f36f943f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ffe126f5-6df3-4fe8-acac-ffd7f36f943f', 'T25NV742', now(), now());

    -- Teacher: SABINA PAREED (T26JN822)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7268ba71-112c-4e28-a1c8-0a6e0686bdf3', 'authenticated', 'authenticated', 't26jn822@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SABINA PAREED"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7268ba71-112c-4e28-a1c8-0a6e0686bdf3', '7268ba71-112c-4e28-a1c8-0a6e0686bdf3', format('{"sub":"%s","email":"%s"}', '7268ba71-112c-4e28-a1c8-0a6e0686bdf3', 't26jn822@gmail.com')::jsonb, 'email', '7268ba71-112c-4e28-a1c8-0a6e0686bdf3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7268ba71-112c-4e28-a1c8-0a6e0686bdf3', 'SABINA PAREED', 't26jn822@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7268ba71-112c-4e28-a1c8-0a6e0686bdf3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7268ba71-112c-4e28-a1c8-0a6e0686bdf3', 'T26JN822', now(), now());

    -- Teacher: SADEEDA (T25AP557)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'edfc24c7-fa12-420d-98b0-02d807148991', 'authenticated', 'authenticated', 't25ap557@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SADEEDA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'edfc24c7-fa12-420d-98b0-02d807148991', 'edfc24c7-fa12-420d-98b0-02d807148991', format('{"sub":"%s","email":"%s"}', 'edfc24c7-fa12-420d-98b0-02d807148991', 't25ap557@gmail.com')::jsonb, 'email', 'edfc24c7-fa12-420d-98b0-02d807148991', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('edfc24c7-fa12-420d-98b0-02d807148991', 'SADEEDA', 't25ap557@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('edfc24c7-fa12-420d-98b0-02d807148991', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('edfc24c7-fa12-420d-98b0-02d807148991', 'T25AP557', now(), now());

    -- Teacher: SAFA (T25SP667)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '51646983-a285-4805-8b0e-67131eee25cf', 'authenticated', 'authenticated', 't25sp667@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '51646983-a285-4805-8b0e-67131eee25cf', '51646983-a285-4805-8b0e-67131eee25cf', format('{"sub":"%s","email":"%s"}', '51646983-a285-4805-8b0e-67131eee25cf', 't25sp667@gmail.com')::jsonb, 'email', '51646983-a285-4805-8b0e-67131eee25cf', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('51646983-a285-4805-8b0e-67131eee25cf', 'SAFA', 't25sp667@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('51646983-a285-4805-8b0e-67131eee25cf', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('51646983-a285-4805-8b0e-67131eee25cf', 'T25SP667', now(), now());

    -- Teacher: SAFA FIROUS (T25MA571)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c064fbad-b22d-45e8-ae83-a9aa03d9fea1', 'authenticated', 'authenticated', 't25ma571@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFA FIROUS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c064fbad-b22d-45e8-ae83-a9aa03d9fea1', 'c064fbad-b22d-45e8-ae83-a9aa03d9fea1', format('{"sub":"%s","email":"%s"}', 'c064fbad-b22d-45e8-ae83-a9aa03d9fea1', 't25ma571@gmail.com')::jsonb, 'email', 'c064fbad-b22d-45e8-ae83-a9aa03d9fea1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c064fbad-b22d-45e8-ae83-a9aa03d9fea1', 'SAFA FIROUS', 't25ma571@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c064fbad-b22d-45e8-ae83-a9aa03d9fea1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c064fbad-b22d-45e8-ae83-a9aa03d9fea1', 'T25MA571', now(), now());

    -- Teacher: SAFA HAFSAH (T26FB850)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', 'authenticated', 'authenticated', 't26fb850@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFA HAFSAH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', 'b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', format('{"sub":"%s","email":"%s"}', 'b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', 't26fb850@gmail.com')::jsonb, 'email', 'b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', 'SAFA HAFSAH', 't26fb850@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b48d5a7f-d32f-4a4c-ae1e-2e1b02c880a9', 'T26FB850', now(), now());

    -- Teacher: SAFA JEBIN (T25NV765)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ef6b1b35-dd48-4291-846c-e8b577572c18', 'authenticated', 'authenticated', 't25nv765@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFA JEBIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ef6b1b35-dd48-4291-846c-e8b577572c18', 'ef6b1b35-dd48-4291-846c-e8b577572c18', format('{"sub":"%s","email":"%s"}', 'ef6b1b35-dd48-4291-846c-e8b577572c18', 't25nv765@gmail.com')::jsonb, 'email', 'ef6b1b35-dd48-4291-846c-e8b577572c18', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ef6b1b35-dd48-4291-846c-e8b577572c18', 'SAFA JEBIN', 't25nv765@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ef6b1b35-dd48-4291-846c-e8b577572c18', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ef6b1b35-dd48-4291-846c-e8b577572c18', 'T25NV765', now(), now());

    -- Teacher: SAFEERA RM (T24AG346)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '56abe0b4-a87e-4381-8933-45849b6549b5', 'authenticated', 'authenticated', 't24ag346@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFEERA RM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '56abe0b4-a87e-4381-8933-45849b6549b5', '56abe0b4-a87e-4381-8933-45849b6549b5', format('{"sub":"%s","email":"%s"}', '56abe0b4-a87e-4381-8933-45849b6549b5', 't24ag346@gmail.com')::jsonb, 'email', '56abe0b4-a87e-4381-8933-45849b6549b5', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('56abe0b4-a87e-4381-8933-45849b6549b5', 'SAFEERA RM', 't24ag346@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('56abe0b4-a87e-4381-8933-45849b6549b5', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('56abe0b4-a87e-4381-8933-45849b6549b5', 'T24AG346', now(), now());

    -- Teacher: SAFEERA SHAHANAS (T26JN806)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e3cc7cff-06df-444b-9975-a1d71d40b43a', 'authenticated', 'authenticated', 't26jn806@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFEERA SHAHANAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e3cc7cff-06df-444b-9975-a1d71d40b43a', 'e3cc7cff-06df-444b-9975-a1d71d40b43a', format('{"sub":"%s","email":"%s"}', 'e3cc7cff-06df-444b-9975-a1d71d40b43a', 't26jn806@gmail.com')::jsonb, 'email', 'e3cc7cff-06df-444b-9975-a1d71d40b43a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e3cc7cff-06df-444b-9975-a1d71d40b43a', 'SAFEERA SHAHANAS', 't26jn806@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e3cc7cff-06df-444b-9975-a1d71d40b43a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e3cc7cff-06df-444b-9975-a1d71d40b43a', 'T26JN806', now(), now());

    -- Teacher: SAFIYA THASNI (T25OC718)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', 'authenticated', 'authenticated', 't25oc718@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFIYA THASNI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', 'f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', format('{"sub":"%s","email":"%s"}', 'f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', 't25oc718@gmail.com')::jsonb, 'email', 'f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', 'SAFIYA THASNI', 't25oc718@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f88be85b-c8fc-48c4-a0f3-f4bf15a283e2', 'T25OC718', now(), now());

    -- Teacher: SAFNA E (T25JU585)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'e05dbeed-382a-404b-8000-995d96629de2', 'authenticated', 'authenticated', 't25ju585@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFNA E"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'e05dbeed-382a-404b-8000-995d96629de2', 'e05dbeed-382a-404b-8000-995d96629de2', format('{"sub":"%s","email":"%s"}', 'e05dbeed-382a-404b-8000-995d96629de2', 't25ju585@gmail.com')::jsonb, 'email', 'e05dbeed-382a-404b-8000-995d96629de2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('e05dbeed-382a-404b-8000-995d96629de2', 'SAFNA E', 't25ju585@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('e05dbeed-382a-404b-8000-995d96629de2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('e05dbeed-382a-404b-8000-995d96629de2', 'T25JU585', now(), now());

    -- Teacher: SAFNA PS (T25SP653)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '785c6092-cde8-48be-ad05-e10573729f48', 'authenticated', 'authenticated', 't25sp653@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFNA PS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '785c6092-cde8-48be-ad05-e10573729f48', '785c6092-cde8-48be-ad05-e10573729f48', format('{"sub":"%s","email":"%s"}', '785c6092-cde8-48be-ad05-e10573729f48', 't25sp653@gmail.com')::jsonb, 'email', '785c6092-cde8-48be-ad05-e10573729f48', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('785c6092-cde8-48be-ad05-e10573729f48', 'SAFNA PS', 't25sp653@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('785c6092-cde8-48be-ad05-e10573729f48', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('785c6092-cde8-48be-ad05-e10573729f48', 'T25SP653', now(), now());

    -- Teacher: SAFNA RASHID (T25NV767)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '01066f31-0d6d-4ce8-b79c-13ca86ae4d50', 'authenticated', 'authenticated', 't25nv767@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFNA RASHID"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '01066f31-0d6d-4ce8-b79c-13ca86ae4d50', '01066f31-0d6d-4ce8-b79c-13ca86ae4d50', format('{"sub":"%s","email":"%s"}', '01066f31-0d6d-4ce8-b79c-13ca86ae4d50', 't25nv767@gmail.com')::jsonb, 'email', '01066f31-0d6d-4ce8-b79c-13ca86ae4d50', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('01066f31-0d6d-4ce8-b79c-13ca86ae4d50', 'SAFNA RASHID', 't25nv767@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('01066f31-0d6d-4ce8-b79c-13ca86ae4d50', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('01066f31-0d6d-4ce8-b79c-13ca86ae4d50', 'T25NV767', now(), now());

    -- Teacher: SAFNATH AA (T24JU284)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '48b91f1e-1ec0-4e35-823c-80f3938f89f8', 'authenticated', 'authenticated', 't24ju284@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFNATH AA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '48b91f1e-1ec0-4e35-823c-80f3938f89f8', '48b91f1e-1ec0-4e35-823c-80f3938f89f8', format('{"sub":"%s","email":"%s"}', '48b91f1e-1ec0-4e35-823c-80f3938f89f8', 't24ju284@gmail.com')::jsonb, 'email', '48b91f1e-1ec0-4e35-823c-80f3938f89f8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('48b91f1e-1ec0-4e35-823c-80f3938f89f8', 'SAFNATH AA', 't24ju284@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('48b91f1e-1ec0-4e35-823c-80f3938f89f8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('48b91f1e-1ec0-4e35-823c-80f3938f89f8', 'T24JU284', now(), now());

    -- Teacher: SAFVANA (T23NV100)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '188ff20c-8276-4908-8070-1e9b9ddebb61', 'authenticated', 'authenticated', 't23nv100@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFVANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '188ff20c-8276-4908-8070-1e9b9ddebb61', '188ff20c-8276-4908-8070-1e9b9ddebb61', format('{"sub":"%s","email":"%s"}', '188ff20c-8276-4908-8070-1e9b9ddebb61', 't23nv100@gmail.com')::jsonb, 'email', '188ff20c-8276-4908-8070-1e9b9ddebb61', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('188ff20c-8276-4908-8070-1e9b9ddebb61', 'SAFVANA', 't23nv100@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('188ff20c-8276-4908-8070-1e9b9ddebb61', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('188ff20c-8276-4908-8070-1e9b9ddebb61', 'T23NV100', now(), now());

    -- Teacher: SAFWANA VS (T25FB458)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'fc957594-7c8d-42a0-8364-8318c5cdb08f', 'authenticated', 'authenticated', 't25fb458@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAFWANA VS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'fc957594-7c8d-42a0-8364-8318c5cdb08f', 'fc957594-7c8d-42a0-8364-8318c5cdb08f', format('{"sub":"%s","email":"%s"}', 'fc957594-7c8d-42a0-8364-8318c5cdb08f', 't25fb458@gmail.com')::jsonb, 'email', 'fc957594-7c8d-42a0-8364-8318c5cdb08f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('fc957594-7c8d-42a0-8364-8318c5cdb08f', 'SAFWANA VS', 't25fb458@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('fc957594-7c8d-42a0-8364-8318c5cdb08f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('fc957594-7c8d-42a0-8364-8318c5cdb08f', 'T25FB458', now(), now());

    -- Teacher: SAHALA JIBIN M (T24OC396)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '398756b6-f074-4ddd-97d9-7611250391e2', 'authenticated', 'authenticated', 't24oc396@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAHALA JIBIN M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '398756b6-f074-4ddd-97d9-7611250391e2', '398756b6-f074-4ddd-97d9-7611250391e2', format('{"sub":"%s","email":"%s"}', '398756b6-f074-4ddd-97d9-7611250391e2', 't24oc396@gmail.com')::jsonb, 'email', '398756b6-f074-4ddd-97d9-7611250391e2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('398756b6-f074-4ddd-97d9-7611250391e2', 'SAHALA JIBIN M', 't24oc396@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('398756b6-f074-4ddd-97d9-7611250391e2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('398756b6-f074-4ddd-97d9-7611250391e2', 'T24OC396', now(), now());

    -- Teacher: SAHLA K (T25JN444)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2762b854-2ce4-49c9-a8f3-54dd4314a085', 'authenticated', 'authenticated', 't25jn444@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAHLA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2762b854-2ce4-49c9-a8f3-54dd4314a085', '2762b854-2ce4-49c9-a8f3-54dd4314a085', format('{"sub":"%s","email":"%s"}', '2762b854-2ce4-49c9-a8f3-54dd4314a085', 't25jn444@gmail.com')::jsonb, 'email', '2762b854-2ce4-49c9-a8f3-54dd4314a085', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2762b854-2ce4-49c9-a8f3-54dd4314a085', 'SAHLA K', 't25jn444@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2762b854-2ce4-49c9-a8f3-54dd4314a085', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2762b854-2ce4-49c9-a8f3-54dd4314a085', 'T25JN444', now(), now());

    -- Teacher: SAHLA SHERIN (T25DC789)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1a6522e0-c407-440a-b85d-b0259b996a65', 'authenticated', 'authenticated', 't25dc789@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAHLA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1a6522e0-c407-440a-b85d-b0259b996a65', '1a6522e0-c407-440a-b85d-b0259b996a65', format('{"sub":"%s","email":"%s"}', '1a6522e0-c407-440a-b85d-b0259b996a65', 't25dc789@gmail.com')::jsonb, 'email', '1a6522e0-c407-440a-b85d-b0259b996a65', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1a6522e0-c407-440a-b85d-b0259b996a65', 'SAHLA SHERIN', 't25dc789@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1a6522e0-c407-440a-b85d-b0259b996a65', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1a6522e0-c407-440a-b85d-b0259b996a65', 'T25DC789', now(), now());

    -- Teacher: SAJITHA M (T25AP554)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', 'authenticated', 'authenticated', 't25ap554@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAJITHA M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', 'f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', format('{"sub":"%s","email":"%s"}', 'f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', 't25ap554@gmail.com')::jsonb, 'email', 'f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', 'SAJITHA M', 't25ap554@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f9a0d88d-3f8e-4a54-981b-2791bf45f6ce', 'T25AP554', now(), now());

    -- Teacher: SAJLI K (T25AP551)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '776118e8-0e98-4c5e-a334-4e262c140943', 'authenticated', 'authenticated', 't25ap551@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAJLI K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '776118e8-0e98-4c5e-a334-4e262c140943', '776118e8-0e98-4c5e-a334-4e262c140943', format('{"sub":"%s","email":"%s"}', '776118e8-0e98-4c5e-a334-4e262c140943', 't25ap551@gmail.com')::jsonb, 'email', '776118e8-0e98-4c5e-a334-4e262c140943', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('776118e8-0e98-4c5e-a334-4e262c140943', 'SAJLI K', 't25ap551@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('776118e8-0e98-4c5e-a334-4e262c140943', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('776118e8-0e98-4c5e-a334-4e262c140943', 'T25AP551', now(), now());

    -- Teacher: SAJMI AFRA (T24AG324)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '90ff09c8-6555-49d4-9a98-11f6623f7bb8', 'authenticated', 'authenticated', 't24ag324@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAJMI AFRA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '90ff09c8-6555-49d4-9a98-11f6623f7bb8', '90ff09c8-6555-49d4-9a98-11f6623f7bb8', format('{"sub":"%s","email":"%s"}', '90ff09c8-6555-49d4-9a98-11f6623f7bb8', 't24ag324@gmail.com')::jsonb, 'email', '90ff09c8-6555-49d4-9a98-11f6623f7bb8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('90ff09c8-6555-49d4-9a98-11f6623f7bb8', 'SAJMI AFRA', 't24ag324@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('90ff09c8-6555-49d4-9a98-11f6623f7bb8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('90ff09c8-6555-49d4-9a98-11f6623f7bb8', 'T24AG324', now(), now());

    -- Teacher: SAJMI K HAFEES (T25NV751)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '96b9a64d-0fbe-4087-bdad-2e57d750a7f4', 'authenticated', 'authenticated', 't25nv751@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAJMI K HAFEES"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '96b9a64d-0fbe-4087-bdad-2e57d750a7f4', '96b9a64d-0fbe-4087-bdad-2e57d750a7f4', format('{"sub":"%s","email":"%s"}', '96b9a64d-0fbe-4087-bdad-2e57d750a7f4', 't25nv751@gmail.com')::jsonb, 'email', '96b9a64d-0fbe-4087-bdad-2e57d750a7f4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('96b9a64d-0fbe-4087-bdad-2e57d750a7f4', 'SAJMI K HAFEES', 't25nv751@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('96b9a64d-0fbe-4087-bdad-2e57d750a7f4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('96b9a64d-0fbe-4087-bdad-2e57d750a7f4', 'T25NV751', now(), now());

    -- Teacher: SAJNA T I (T25OC709)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c54ef754-26d8-4aac-a1f4-432f8ffa20a6', 'authenticated', 'authenticated', 't25oc709@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAJNA T I"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c54ef754-26d8-4aac-a1f4-432f8ffa20a6', 'c54ef754-26d8-4aac-a1f4-432f8ffa20a6', format('{"sub":"%s","email":"%s"}', 'c54ef754-26d8-4aac-a1f4-432f8ffa20a6', 't25oc709@gmail.com')::jsonb, 'email', 'c54ef754-26d8-4aac-a1f4-432f8ffa20a6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c54ef754-26d8-4aac-a1f4-432f8ffa20a6', 'SAJNA T I', 't25oc709@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c54ef754-26d8-4aac-a1f4-432f8ffa20a6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c54ef754-26d8-4aac-a1f4-432f8ffa20a6', 'T25OC709', now(), now());

    -- Teacher: SALEENA (T25NV744)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7c4c26b5-9a21-453b-9dcd-f075e892ebf0', 'authenticated', 'authenticated', 't25nv744@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SALEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7c4c26b5-9a21-453b-9dcd-f075e892ebf0', '7c4c26b5-9a21-453b-9dcd-f075e892ebf0', format('{"sub":"%s","email":"%s"}', '7c4c26b5-9a21-453b-9dcd-f075e892ebf0', 't25nv744@gmail.com')::jsonb, 'email', '7c4c26b5-9a21-453b-9dcd-f075e892ebf0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7c4c26b5-9a21-453b-9dcd-f075e892ebf0', 'SALEENA', 't25nv744@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7c4c26b5-9a21-453b-9dcd-f075e892ebf0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7c4c26b5-9a21-453b-9dcd-f075e892ebf0', 'T25NV744', now(), now());

    -- Teacher: SALEENA BASHEER (T25SP656)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '24a8c829-125c-4944-8092-7b68e4e1140a', 'authenticated', 'authenticated', 't25sp656@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SALEENA BASHEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '24a8c829-125c-4944-8092-7b68e4e1140a', '24a8c829-125c-4944-8092-7b68e4e1140a', format('{"sub":"%s","email":"%s"}', '24a8c829-125c-4944-8092-7b68e4e1140a', 't25sp656@gmail.com')::jsonb, 'email', '24a8c829-125c-4944-8092-7b68e4e1140a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('24a8c829-125c-4944-8092-7b68e4e1140a', 'SALEENA BASHEER', 't25sp656@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('24a8c829-125c-4944-8092-7b68e4e1140a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('24a8c829-125c-4944-8092-7b68e4e1140a', 'T25SP656', now(), now());

    -- Teacher: SALMATH HARSHANA (T25OC728)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '274615fa-4cad-4841-bbba-fb5e80fd3173', 'authenticated', 'authenticated', 't25oc728@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SALMATH HARSHANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '274615fa-4cad-4841-bbba-fb5e80fd3173', '274615fa-4cad-4841-bbba-fb5e80fd3173', format('{"sub":"%s","email":"%s"}', '274615fa-4cad-4841-bbba-fb5e80fd3173', 't25oc728@gmail.com')::jsonb, 'email', '274615fa-4cad-4841-bbba-fb5e80fd3173', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('274615fa-4cad-4841-bbba-fb5e80fd3173', 'SALMATH HARSHANA', 't25oc728@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('274615fa-4cad-4841-bbba-fb5e80fd3173', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('274615fa-4cad-4841-bbba-fb5e80fd3173', 'T25OC728', now(), now());

    -- Teacher: SALWA IBRAHIM (T25NV771)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a7e72be9-ec1e-4321-b744-582b3212e50d', 'authenticated', 'authenticated', 't25nv771@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SALWA IBRAHIM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a7e72be9-ec1e-4321-b744-582b3212e50d', 'a7e72be9-ec1e-4321-b744-582b3212e50d', format('{"sub":"%s","email":"%s"}', 'a7e72be9-ec1e-4321-b744-582b3212e50d', 't25nv771@gmail.com')::jsonb, 'email', 'a7e72be9-ec1e-4321-b744-582b3212e50d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a7e72be9-ec1e-4321-b744-582b3212e50d', 'SALWA IBRAHIM', 't25nv771@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a7e72be9-ec1e-4321-b744-582b3212e50d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a7e72be9-ec1e-4321-b744-582b3212e50d', 'T25NV771', now(), now());

    -- Teacher: SAMEERA USMAN (T25AG617)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0e19a69e-0eab-41ae-9e7a-90d9074f5b03', 'authenticated', 'authenticated', 't25ag617@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAMEERA USMAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0e19a69e-0eab-41ae-9e7a-90d9074f5b03', '0e19a69e-0eab-41ae-9e7a-90d9074f5b03', format('{"sub":"%s","email":"%s"}', '0e19a69e-0eab-41ae-9e7a-90d9074f5b03', 't25ag617@gmail.com')::jsonb, 'email', '0e19a69e-0eab-41ae-9e7a-90d9074f5b03', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0e19a69e-0eab-41ae-9e7a-90d9074f5b03', 'SAMEERA USMAN', 't25ag617@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0e19a69e-0eab-41ae-9e7a-90d9074f5b03', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0e19a69e-0eab-41ae-9e7a-90d9074f5b03', 'T25AG617', now(), now());

    -- Teacher: SAMIKSHA (T25AP517)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f7690820-65dd-469b-a1d3-089c4912b61f', 'authenticated', 'authenticated', 't25ap517@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SAMIKSHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f7690820-65dd-469b-a1d3-089c4912b61f', 'f7690820-65dd-469b-a1d3-089c4912b61f', format('{"sub":"%s","email":"%s"}', 'f7690820-65dd-469b-a1d3-089c4912b61f', 't25ap517@gmail.com')::jsonb, 'email', 'f7690820-65dd-469b-a1d3-089c4912b61f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f7690820-65dd-469b-a1d3-089c4912b61f', 'SAMIKSHA', 't25ap517@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f7690820-65dd-469b-a1d3-089c4912b61f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f7690820-65dd-469b-a1d3-089c4912b61f', 'T25AP517', now(), now());

    -- Teacher: SANA (T23JL11)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'be633957-5cdd-46e2-b071-e6f393ed6e73', 'authenticated', 'authenticated', 't23jl11@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'be633957-5cdd-46e2-b071-e6f393ed6e73', 'be633957-5cdd-46e2-b071-e6f393ed6e73', format('{"sub":"%s","email":"%s"}', 'be633957-5cdd-46e2-b071-e6f393ed6e73', 't23jl11@gmail.com')::jsonb, 'email', 'be633957-5cdd-46e2-b071-e6f393ed6e73', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('be633957-5cdd-46e2-b071-e6f393ed6e73', 'SANA', 't23jl11@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('be633957-5cdd-46e2-b071-e6f393ed6e73', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('be633957-5cdd-46e2-b071-e6f393ed6e73', 'T23JL11', now(), now());

    -- Teacher: SANA TASNEEM (T24OC395)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b08e930e-f810-4feb-8a2b-bace2d659808', 'authenticated', 'authenticated', 't24oc395@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SANA TASNEEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b08e930e-f810-4feb-8a2b-bace2d659808', 'b08e930e-f810-4feb-8a2b-bace2d659808', format('{"sub":"%s","email":"%s"}', 'b08e930e-f810-4feb-8a2b-bace2d659808', 't24oc395@gmail.com')::jsonb, 'email', 'b08e930e-f810-4feb-8a2b-bace2d659808', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b08e930e-f810-4feb-8a2b-bace2d659808', 'SANA TASNEEM', 't24oc395@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b08e930e-f810-4feb-8a2b-bace2d659808', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b08e930e-f810-4feb-8a2b-bace2d659808', 'T24OC395', now(), now());

    -- Teacher: SANDRA AJITH (T25DC776)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '11a7532a-4906-4859-afad-d2209f45086c', 'authenticated', 'authenticated', 't25dc776@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SANDRA AJITH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '11a7532a-4906-4859-afad-d2209f45086c', '11a7532a-4906-4859-afad-d2209f45086c', format('{"sub":"%s","email":"%s"}', '11a7532a-4906-4859-afad-d2209f45086c', 't25dc776@gmail.com')::jsonb, 'email', '11a7532a-4906-4859-afad-d2209f45086c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('11a7532a-4906-4859-afad-d2209f45086c', 'SANDRA AJITH', 't25dc776@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('11a7532a-4906-4859-afad-d2209f45086c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('11a7532a-4906-4859-afad-d2209f45086c', 'T25DC776', now(), now());

    -- Teacher: SANDRA CHANDRAN (T25FB480)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b7243674-e0a8-46c3-bac0-c8d08300d23e', 'authenticated', 'authenticated', 't25fb480@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SANDRA CHANDRAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b7243674-e0a8-46c3-bac0-c8d08300d23e', 'b7243674-e0a8-46c3-bac0-c8d08300d23e', format('{"sub":"%s","email":"%s"}', 'b7243674-e0a8-46c3-bac0-c8d08300d23e', 't25fb480@gmail.com')::jsonb, 'email', 'b7243674-e0a8-46c3-bac0-c8d08300d23e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b7243674-e0a8-46c3-bac0-c8d08300d23e', 'SANDRA CHANDRAN', 't25fb480@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b7243674-e0a8-46c3-bac0-c8d08300d23e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b7243674-e0a8-46c3-bac0-c8d08300d23e', 'T25FB480', now(), now());

    -- Teacher: SANTHWANA V S (T24SP393)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd06557ad-d1fd-447b-8ff4-84553b683b64', 'authenticated', 'authenticated', 't24sp393@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SANTHWANA V S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd06557ad-d1fd-447b-8ff4-84553b683b64', 'd06557ad-d1fd-447b-8ff4-84553b683b64', format('{"sub":"%s","email":"%s"}', 'd06557ad-d1fd-447b-8ff4-84553b683b64', 't24sp393@gmail.com')::jsonb, 'email', 'd06557ad-d1fd-447b-8ff4-84553b683b64', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d06557ad-d1fd-447b-8ff4-84553b683b64', 'SANTHWANA V S', 't24sp393@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d06557ad-d1fd-447b-8ff4-84553b683b64', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d06557ad-d1fd-447b-8ff4-84553b683b64', 'T24SP393', now(), now());

    -- Teacher: SARANYA N (T25OC708)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dd4950b3-c533-4858-89f6-37e9e6efcf8f', 'authenticated', 'authenticated', 't25oc708@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SARANYA N"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dd4950b3-c533-4858-89f6-37e9e6efcf8f', 'dd4950b3-c533-4858-89f6-37e9e6efcf8f', format('{"sub":"%s","email":"%s"}', 'dd4950b3-c533-4858-89f6-37e9e6efcf8f', 't25oc708@gmail.com')::jsonb, 'email', 'dd4950b3-c533-4858-89f6-37e9e6efcf8f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dd4950b3-c533-4858-89f6-37e9e6efcf8f', 'SARANYA N', 't25oc708@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dd4950b3-c533-4858-89f6-37e9e6efcf8f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dd4950b3-c533-4858-89f6-37e9e6efcf8f', 'T25OC708', now(), now());

    -- Teacher: SARIKA (T25JL649)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '16136830-bd20-46f9-ade3-935c51d4c5ac', 'authenticated', 'authenticated', 't25jl649@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SARIKA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '16136830-bd20-46f9-ade3-935c51d4c5ac', '16136830-bd20-46f9-ade3-935c51d4c5ac', format('{"sub":"%s","email":"%s"}', '16136830-bd20-46f9-ade3-935c51d4c5ac', 't25jl649@gmail.com')::jsonb, 'email', '16136830-bd20-46f9-ade3-935c51d4c5ac', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('16136830-bd20-46f9-ade3-935c51d4c5ac', 'SARIKA', 't25jl649@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('16136830-bd20-46f9-ade3-935c51d4c5ac', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('16136830-bd20-46f9-ade3-935c51d4c5ac', 'T25JL649', now(), now());

    -- Teacher: SARIKA.S.S (T25AP498)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '611217b8-30fb-4ddf-8577-4b6ece8b20ab', 'authenticated', 'authenticated', 't25ap498@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SARIKA.S.S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '611217b8-30fb-4ddf-8577-4b6ece8b20ab', '611217b8-30fb-4ddf-8577-4b6ece8b20ab', format('{"sub":"%s","email":"%s"}', '611217b8-30fb-4ddf-8577-4b6ece8b20ab', 't25ap498@gmail.com')::jsonb, 'email', '611217b8-30fb-4ddf-8577-4b6ece8b20ab', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('611217b8-30fb-4ddf-8577-4b6ece8b20ab', 'SARIKA.S.S', 't25ap498@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('611217b8-30fb-4ddf-8577-4b6ece8b20ab', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('611217b8-30fb-4ddf-8577-4b6ece8b20ab', 'T25AP498', now(), now());

    -- Teacher: SELJA S (T25OC729)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c321d67d-a543-45fb-8fc5-7999c6beea2e', 'authenticated', 'authenticated', 't25oc729@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SELJA S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c321d67d-a543-45fb-8fc5-7999c6beea2e', 'c321d67d-a543-45fb-8fc5-7999c6beea2e', format('{"sub":"%s","email":"%s"}', 'c321d67d-a543-45fb-8fc5-7999c6beea2e', 't25oc729@gmail.com')::jsonb, 'email', 'c321d67d-a543-45fb-8fc5-7999c6beea2e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c321d67d-a543-45fb-8fc5-7999c6beea2e', 'SELJA S', 't25oc729@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c321d67d-a543-45fb-8fc5-7999c6beea2e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c321d67d-a543-45fb-8fc5-7999c6beea2e', 'T25OC729', now(), now());

    -- Teacher: SHABIYA (T25AG624)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '48fab933-0805-4f4d-8f67-eb88295b1589', 'authenticated', 'authenticated', 't25ag624@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHABIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '48fab933-0805-4f4d-8f67-eb88295b1589', '48fab933-0805-4f4d-8f67-eb88295b1589', format('{"sub":"%s","email":"%s"}', '48fab933-0805-4f4d-8f67-eb88295b1589', 't25ag624@gmail.com')::jsonb, 'email', '48fab933-0805-4f4d-8f67-eb88295b1589', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('48fab933-0805-4f4d-8f67-eb88295b1589', 'SHABIYA', 't25ag624@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('48fab933-0805-4f4d-8f67-eb88295b1589', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('48fab933-0805-4f4d-8f67-eb88295b1589', 'T25AG624', now(), now());

    -- Teacher: SHABNA PJ (T25AP558)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8eac0245-764d-4771-b7a6-12189c9948e7', 'authenticated', 'authenticated', 't25ap558@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHABNA PJ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8eac0245-764d-4771-b7a6-12189c9948e7', '8eac0245-764d-4771-b7a6-12189c9948e7', format('{"sub":"%s","email":"%s"}', '8eac0245-764d-4771-b7a6-12189c9948e7', 't25ap558@gmail.com')::jsonb, 'email', '8eac0245-764d-4771-b7a6-12189c9948e7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8eac0245-764d-4771-b7a6-12189c9948e7', 'SHABNA PJ', 't25ap558@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8eac0245-764d-4771-b7a6-12189c9948e7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8eac0245-764d-4771-b7a6-12189c9948e7', 'T25AP558', now(), now());

    -- Teacher: SHABNA R S (T25DC786)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c462dd91-93c3-41cd-b20f-8489f14120dc', 'authenticated', 'authenticated', 't25dc786@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHABNA R S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c462dd91-93c3-41cd-b20f-8489f14120dc', 'c462dd91-93c3-41cd-b20f-8489f14120dc', format('{"sub":"%s","email":"%s"}', 'c462dd91-93c3-41cd-b20f-8489f14120dc', 't25dc786@gmail.com')::jsonb, 'email', 'c462dd91-93c3-41cd-b20f-8489f14120dc', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c462dd91-93c3-41cd-b20f-8489f14120dc', 'SHABNA R S', 't25dc786@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c462dd91-93c3-41cd-b20f-8489f14120dc', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c462dd91-93c3-41cd-b20f-8489f14120dc', 'T25DC786', now(), now());

    -- Teacher: SHADIYA (T25NV750)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', 'authenticated', 'authenticated', 't25nv750@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHADIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', '2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', format('{"sub":"%s","email":"%s"}', '2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', 't25nv750@gmail.com')::jsonb, 'email', '2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', 'SHADIYA', 't25nv750@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2d5860ca-96ad-4c56-aa80-a80ebfbddd2f', 'T25NV750', now(), now());

    -- Teacher: SHAFEEDHA (T25JU591)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3d933512-9553-434b-a212-f55f14964741', 'authenticated', 'authenticated', 't25ju591@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAFEEDHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3d933512-9553-434b-a212-f55f14964741', '3d933512-9553-434b-a212-f55f14964741', format('{"sub":"%s","email":"%s"}', '3d933512-9553-434b-a212-f55f14964741', 't25ju591@gmail.com')::jsonb, 'email', '3d933512-9553-434b-a212-f55f14964741', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3d933512-9553-434b-a212-f55f14964741', 'SHAFEEDHA', 't25ju591@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3d933512-9553-434b-a212-f55f14964741', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3d933512-9553-434b-a212-f55f14964741', 'T25JU591', now(), now());

    -- Teacher: SHAHANA KS (T25AP549)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '24e48d4f-c9eb-48bb-aaf2-e851e99919c1', 'authenticated', 'authenticated', 't25ap549@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHANA KS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '24e48d4f-c9eb-48bb-aaf2-e851e99919c1', '24e48d4f-c9eb-48bb-aaf2-e851e99919c1', format('{"sub":"%s","email":"%s"}', '24e48d4f-c9eb-48bb-aaf2-e851e99919c1', 't25ap549@gmail.com')::jsonb, 'email', '24e48d4f-c9eb-48bb-aaf2-e851e99919c1', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('24e48d4f-c9eb-48bb-aaf2-e851e99919c1', 'SHAHANA KS', 't25ap549@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('24e48d4f-c9eb-48bb-aaf2-e851e99919c1', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('24e48d4f-c9eb-48bb-aaf2-e851e99919c1', 'T25AP549', now(), now());

    -- Teacher: SHAHANA SHABEEBA (T23NV120)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5fac5899-3630-451e-b4c9-8a72607581fa', 'authenticated', 'authenticated', 't23nv120@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHANA SHABEEBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5fac5899-3630-451e-b4c9-8a72607581fa', '5fac5899-3630-451e-b4c9-8a72607581fa', format('{"sub":"%s","email":"%s"}', '5fac5899-3630-451e-b4c9-8a72607581fa', 't23nv120@gmail.com')::jsonb, 'email', '5fac5899-3630-451e-b4c9-8a72607581fa', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5fac5899-3630-451e-b4c9-8a72607581fa', 'SHAHANA SHABEEBA', 't23nv120@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5fac5899-3630-451e-b4c9-8a72607581fa', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5fac5899-3630-451e-b4c9-8a72607581fa', 'T23NV120', now(), now());

    -- Teacher: SHAHANA SHERIN A (T24OC400)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6aab25f5-5f78-446d-8da1-00b572b23bf3', 'authenticated', 'authenticated', 't24oc400@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHANA SHERIN A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6aab25f5-5f78-446d-8da1-00b572b23bf3', '6aab25f5-5f78-446d-8da1-00b572b23bf3', format('{"sub":"%s","email":"%s"}', '6aab25f5-5f78-446d-8da1-00b572b23bf3', 't24oc400@gmail.com')::jsonb, 'email', '6aab25f5-5f78-446d-8da1-00b572b23bf3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6aab25f5-5f78-446d-8da1-00b572b23bf3', 'SHAHANA SHERIN A', 't24oc400@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6aab25f5-5f78-446d-8da1-00b572b23bf3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6aab25f5-5f78-446d-8da1-00b572b23bf3', 'T24OC400', now(), now());

    -- Teacher: SHAHANA SHIRIN (T23DC133)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ea75d2ad-8e2f-4731-babf-da39a58b8955', 'authenticated', 'authenticated', 't23dc133@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHANA SHIRIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ea75d2ad-8e2f-4731-babf-da39a58b8955', 'ea75d2ad-8e2f-4731-babf-da39a58b8955', format('{"sub":"%s","email":"%s"}', 'ea75d2ad-8e2f-4731-babf-da39a58b8955', 't23dc133@gmail.com')::jsonb, 'email', 'ea75d2ad-8e2f-4731-babf-da39a58b8955', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ea75d2ad-8e2f-4731-babf-da39a58b8955', 'SHAHANA SHIRIN', 't23dc133@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ea75d2ad-8e2f-4731-babf-da39a58b8955', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ea75d2ad-8e2f-4731-babf-da39a58b8955', 'T23DC133', now(), now());

    -- Teacher: SHAHANA SHIRIN VP (T26FB830)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c1b5ffe5-155e-4028-ae99-532d4754f5c4', 'authenticated', 'authenticated', 't26fb830@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHANA SHIRIN VP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c1b5ffe5-155e-4028-ae99-532d4754f5c4', 'c1b5ffe5-155e-4028-ae99-532d4754f5c4', format('{"sub":"%s","email":"%s"}', 'c1b5ffe5-155e-4028-ae99-532d4754f5c4', 't26fb830@gmail.com')::jsonb, 'email', 'c1b5ffe5-155e-4028-ae99-532d4754f5c4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c1b5ffe5-155e-4028-ae99-532d4754f5c4', 'SHAHANA SHIRIN VP', 't26fb830@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c1b5ffe5-155e-4028-ae99-532d4754f5c4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c1b5ffe5-155e-4028-ae99-532d4754f5c4', 'T26FB830', now(), now());

    -- Teacher: SHAHANAS (T24MA250)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '29ec2924-cfb9-4b29-8395-48baab0da2a2', 'authenticated', 'authenticated', 't24ma250@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHANAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '29ec2924-cfb9-4b29-8395-48baab0da2a2', '29ec2924-cfb9-4b29-8395-48baab0da2a2', format('{"sub":"%s","email":"%s"}', '29ec2924-cfb9-4b29-8395-48baab0da2a2', 't24ma250@gmail.com')::jsonb, 'email', '29ec2924-cfb9-4b29-8395-48baab0da2a2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('29ec2924-cfb9-4b29-8395-48baab0da2a2', 'SHAHANAS', 't24ma250@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('29ec2924-cfb9-4b29-8395-48baab0da2a2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('29ec2924-cfb9-4b29-8395-48baab0da2a2', 'T24MA250', now(), now());

    -- Teacher: SHAHLA RAHMAN (T25JN454)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9aa66602-bc5c-40ae-9f53-b36914661b58', 'authenticated', 'authenticated', 't25jn454@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHLA RAHMAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9aa66602-bc5c-40ae-9f53-b36914661b58', '9aa66602-bc5c-40ae-9f53-b36914661b58', format('{"sub":"%s","email":"%s"}', '9aa66602-bc5c-40ae-9f53-b36914661b58', 't25jn454@gmail.com')::jsonb, 'email', '9aa66602-bc5c-40ae-9f53-b36914661b58', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9aa66602-bc5c-40ae-9f53-b36914661b58', 'SHAHLA RAHMAN', 't25jn454@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9aa66602-bc5c-40ae-9f53-b36914661b58', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9aa66602-bc5c-40ae-9f53-b36914661b58', 'T25JN454', now(), now());

    -- Teacher: SHAHLA SAKEER (T25AP565)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', 'authenticated', 'authenticated', 't25ap565@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHLA SAKEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', '3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', format('{"sub":"%s","email":"%s"}', '3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', 't25ap565@gmail.com')::jsonb, 'email', '3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', 'SHAHLA SAKEER', 't25ap565@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3dd86bbf-8ba2-4e7c-bfb9-57010979bac9', 'T25AP565', now(), now());

    -- Teacher: SHAHMA T C (T25DC785)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '69e1c4b4-7651-4342-ad89-3f3debdae846', 'authenticated', 'authenticated', 't25dc785@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAHMA T C"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '69e1c4b4-7651-4342-ad89-3f3debdae846', '69e1c4b4-7651-4342-ad89-3f3debdae846', format('{"sub":"%s","email":"%s"}', '69e1c4b4-7651-4342-ad89-3f3debdae846', 't25dc785@gmail.com')::jsonb, 'email', '69e1c4b4-7651-4342-ad89-3f3debdae846', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('69e1c4b4-7651-4342-ad89-3f3debdae846', 'SHAHMA T C', 't25dc785@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('69e1c4b4-7651-4342-ad89-3f3debdae846', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('69e1c4b4-7651-4342-ad89-3f3debdae846', 'T25DC785', now(), now());

    -- Teacher: SHAIKHA MARIYAM (T25SP655)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a3db5131-bc29-4116-925f-7a270f59aa8a', 'authenticated', 'authenticated', 't25sp655@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAIKHA MARIYAM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a3db5131-bc29-4116-925f-7a270f59aa8a', 'a3db5131-bc29-4116-925f-7a270f59aa8a', format('{"sub":"%s","email":"%s"}', 'a3db5131-bc29-4116-925f-7a270f59aa8a', 't25sp655@gmail.com')::jsonb, 'email', 'a3db5131-bc29-4116-925f-7a270f59aa8a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a3db5131-bc29-4116-925f-7a270f59aa8a', 'SHAIKHA MARIYAM', 't25sp655@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a3db5131-bc29-4116-925f-7a270f59aa8a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a3db5131-bc29-4116-925f-7a270f59aa8a', 'T25SP655', now(), now());

    -- Teacher: SHAKEEBA FAHEEM (T24AG336)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '03964283-834c-4815-a8b9-7dd928234671', 'authenticated', 'authenticated', 't24ag336@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAKEEBA FAHEEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '03964283-834c-4815-a8b9-7dd928234671', '03964283-834c-4815-a8b9-7dd928234671', format('{"sub":"%s","email":"%s"}', '03964283-834c-4815-a8b9-7dd928234671', 't24ag336@gmail.com')::jsonb, 'email', '03964283-834c-4815-a8b9-7dd928234671', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('03964283-834c-4815-a8b9-7dd928234671', 'SHAKEEBA FAHEEM', 't24ag336@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('03964283-834c-4815-a8b9-7dd928234671', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('03964283-834c-4815-a8b9-7dd928234671', 'T24AG336', now(), now());

    -- Teacher: SHAMEEMA ALI (T25AP534)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '16be91d6-fcf5-46a2-9632-903c57def00b', 'authenticated', 'authenticated', 't25ap534@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMEEMA ALI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '16be91d6-fcf5-46a2-9632-903c57def00b', '16be91d6-fcf5-46a2-9632-903c57def00b', format('{"sub":"%s","email":"%s"}', '16be91d6-fcf5-46a2-9632-903c57def00b', 't25ap534@gmail.com')::jsonb, 'email', '16be91d6-fcf5-46a2-9632-903c57def00b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('16be91d6-fcf5-46a2-9632-903c57def00b', 'SHAMEEMA ALI', 't25ap534@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('16be91d6-fcf5-46a2-9632-903c57def00b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('16be91d6-fcf5-46a2-9632-903c57def00b', 'T25AP534', now(), now());

    -- Teacher: SHAMEENA KP (T25JN447)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '45d11697-090d-4071-8ad0-43f3fcebd08f', 'authenticated', 'authenticated', 't25jn447@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMEENA KP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '45d11697-090d-4071-8ad0-43f3fcebd08f', '45d11697-090d-4071-8ad0-43f3fcebd08f', format('{"sub":"%s","email":"%s"}', '45d11697-090d-4071-8ad0-43f3fcebd08f', 't25jn447@gmail.com')::jsonb, 'email', '45d11697-090d-4071-8ad0-43f3fcebd08f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('45d11697-090d-4071-8ad0-43f3fcebd08f', 'SHAMEENA KP', 't25jn447@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('45d11697-090d-4071-8ad0-43f3fcebd08f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('45d11697-090d-4071-8ad0-43f3fcebd08f', 'T25JN447', now(), now());

    -- Teacher: SHAMILA ASHRAF (T25DC794)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', 'authenticated', 'authenticated', 't25dc794@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMILA ASHRAF"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', '2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', format('{"sub":"%s","email":"%s"}', '2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', 't25dc794@gmail.com')::jsonb, 'email', '2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', 'SHAMILA ASHRAF', 't25dc794@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2c5b51ed-68ab-4cf2-8dac-78061be6f6f4', 'T25DC794', now(), now());

    -- Teacher: SHAMLA (T25AP524)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'd169b87b-e596-4491-9d3a-2eaf1913500c', 'authenticated', 'authenticated', 't25ap524@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMLA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'd169b87b-e596-4491-9d3a-2eaf1913500c', 'd169b87b-e596-4491-9d3a-2eaf1913500c', format('{"sub":"%s","email":"%s"}', 'd169b87b-e596-4491-9d3a-2eaf1913500c', 't25ap524@gmail.com')::jsonb, 'email', 'd169b87b-e596-4491-9d3a-2eaf1913500c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('d169b87b-e596-4491-9d3a-2eaf1913500c', 'SHAMLA', 't25ap524@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('d169b87b-e596-4491-9d3a-2eaf1913500c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('d169b87b-e596-4491-9d3a-2eaf1913500c', 'T25AP524', now(), now());

    -- Teacher: SHAMMA SUHARA (T26FB835)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '93a64202-0532-4a29-9ddc-bd51acbb212d', 'authenticated', 'authenticated', 't26fb835@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMMA SUHARA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '93a64202-0532-4a29-9ddc-bd51acbb212d', '93a64202-0532-4a29-9ddc-bd51acbb212d', format('{"sub":"%s","email":"%s"}', '93a64202-0532-4a29-9ddc-bd51acbb212d', 't26fb835@gmail.com')::jsonb, 'email', '93a64202-0532-4a29-9ddc-bd51acbb212d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('93a64202-0532-4a29-9ddc-bd51acbb212d', 'SHAMMA SUHARA', 't26fb835@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('93a64202-0532-4a29-9ddc-bd51acbb212d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('93a64202-0532-4a29-9ddc-bd51acbb212d', 'T26FB835', now(), now());

    -- Teacher: SHAMNA (T25AG638)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '81f39684-8d04-424b-9071-b693dc94b70e', 'authenticated', 'authenticated', 't25ag638@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '81f39684-8d04-424b-9071-b693dc94b70e', '81f39684-8d04-424b-9071-b693dc94b70e', format('{"sub":"%s","email":"%s"}', '81f39684-8d04-424b-9071-b693dc94b70e', 't25ag638@gmail.com')::jsonb, 'email', '81f39684-8d04-424b-9071-b693dc94b70e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('81f39684-8d04-424b-9071-b693dc94b70e', 'SHAMNA', 't25ag638@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('81f39684-8d04-424b-9071-b693dc94b70e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('81f39684-8d04-424b-9071-b693dc94b70e', 'T25AG638', now(), now());

    -- Teacher: SHAMNA K (T23JU175)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b46a602c-71fd-4a2e-b3e4-832e30af3b65', 'authenticated', 'authenticated', 't23ju175@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMNA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b46a602c-71fd-4a2e-b3e4-832e30af3b65', 'b46a602c-71fd-4a2e-b3e4-832e30af3b65', format('{"sub":"%s","email":"%s"}', 'b46a602c-71fd-4a2e-b3e4-832e30af3b65', 't23ju175@gmail.com')::jsonb, 'email', 'b46a602c-71fd-4a2e-b3e4-832e30af3b65', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b46a602c-71fd-4a2e-b3e4-832e30af3b65', 'SHAMNA K', 't23ju175@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b46a602c-71fd-4a2e-b3e4-832e30af3b65', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b46a602c-71fd-4a2e-b3e4-832e30af3b65', 'T23JU175', now(), now());

    -- Teacher: SHAMNA P (T24JN167)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0772fecc-3af1-4d1d-97e0-45a446a27245', 'authenticated', 'authenticated', 't24jn167@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMNA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0772fecc-3af1-4d1d-97e0-45a446a27245', '0772fecc-3af1-4d1d-97e0-45a446a27245', format('{"sub":"%s","email":"%s"}', '0772fecc-3af1-4d1d-97e0-45a446a27245', 't24jn167@gmail.com')::jsonb, 'email', '0772fecc-3af1-4d1d-97e0-45a446a27245', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0772fecc-3af1-4d1d-97e0-45a446a27245', 'SHAMNA P', 't24jn167@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0772fecc-3af1-4d1d-97e0-45a446a27245', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0772fecc-3af1-4d1d-97e0-45a446a27245', 'T24JN167', now(), now());

    -- Teacher: SHAMNA RAHIM (T25OC705)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '52f67ec5-b704-4a02-a36f-ddb18fc5e467', 'authenticated', 'authenticated', 't25oc705@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMNA RAHIM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '52f67ec5-b704-4a02-a36f-ddb18fc5e467', '52f67ec5-b704-4a02-a36f-ddb18fc5e467', format('{"sub":"%s","email":"%s"}', '52f67ec5-b704-4a02-a36f-ddb18fc5e467', 't25oc705@gmail.com')::jsonb, 'email', '52f67ec5-b704-4a02-a36f-ddb18fc5e467', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('52f67ec5-b704-4a02-a36f-ddb18fc5e467', 'SHAMNA RAHIM', 't25oc705@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('52f67ec5-b704-4a02-a36f-ddb18fc5e467', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('52f67ec5-b704-4a02-a36f-ddb18fc5e467', 'T25OC705', now(), now());

    -- Teacher: SHAMNA T.C (T23NV189)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', 'authenticated', 'authenticated', 't23nv189@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMNA T.C"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', '1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', format('{"sub":"%s","email":"%s"}', '1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', 't23nv189@gmail.com')::jsonb, 'email', '1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', 'SHAMNA T.C', 't23nv189@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1a7a6549-78dd-4a2a-b1b5-ffda22d682c0', 'T23NV189', now(), now());

    -- Teacher: SHAMSEENA FARSANA (T24AG338)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8250c245-54ba-4825-9e56-f0ffbb8c9a4a', 'authenticated', 'authenticated', 't24ag338@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHAMSEENA FARSANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8250c245-54ba-4825-9e56-f0ffbb8c9a4a', '8250c245-54ba-4825-9e56-f0ffbb8c9a4a', format('{"sub":"%s","email":"%s"}', '8250c245-54ba-4825-9e56-f0ffbb8c9a4a', 't24ag338@gmail.com')::jsonb, 'email', '8250c245-54ba-4825-9e56-f0ffbb8c9a4a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8250c245-54ba-4825-9e56-f0ffbb8c9a4a', 'SHAMSEENA FARSANA', 't24ag338@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8250c245-54ba-4825-9e56-f0ffbb8c9a4a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8250c245-54ba-4825-9e56-f0ffbb8c9a4a', 'T24AG338', now(), now());

    -- Teacher: SHANA SHIRIN NK (T24DC431)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6d0616c1-afc3-4a91-a8ee-d259f5d69662', 'authenticated', 'authenticated', 't24dc431@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHANA SHIRIN NK"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6d0616c1-afc3-4a91-a8ee-d259f5d69662', '6d0616c1-afc3-4a91-a8ee-d259f5d69662', format('{"sub":"%s","email":"%s"}', '6d0616c1-afc3-4a91-a8ee-d259f5d69662', 't24dc431@gmail.com')::jsonb, 'email', '6d0616c1-afc3-4a91-a8ee-d259f5d69662', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6d0616c1-afc3-4a91-a8ee-d259f5d69662', 'SHANA SHIRIN NK', 't24dc431@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6d0616c1-afc3-4a91-a8ee-d259f5d69662', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6d0616c1-afc3-4a91-a8ee-d259f5d69662', 'T24DC431', now(), now());

    -- Teacher: SHANIBA (T25MA568)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dab11c16-77b1-485c-af27-6b38f52beeb9', 'authenticated', 'authenticated', 't25ma568@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHANIBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dab11c16-77b1-485c-af27-6b38f52beeb9', 'dab11c16-77b1-485c-af27-6b38f52beeb9', format('{"sub":"%s","email":"%s"}', 'dab11c16-77b1-485c-af27-6b38f52beeb9', 't25ma568@gmail.com')::jsonb, 'email', 'dab11c16-77b1-485c-af27-6b38f52beeb9', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dab11c16-77b1-485c-af27-6b38f52beeb9', 'SHANIBA', 't25ma568@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dab11c16-77b1-485c-af27-6b38f52beeb9', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dab11c16-77b1-485c-af27-6b38f52beeb9', 'T25MA568', now(), now());

    -- Teacher: SHANIBA MARIYAM K (T25OC707)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', 'authenticated', 'authenticated', 't25oc707@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHANIBA MARIYAM K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', 'b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', format('{"sub":"%s","email":"%s"}', 'b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', 't25oc707@gmail.com')::jsonb, 'email', 'b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', 'SHANIBA MARIYAM K', 't25oc707@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b88f8b0a-fc3f-47ca-aeb8-03fbbc833ef8', 'T25OC707', now(), now());

    -- Teacher: SHARAFUNNISA (T25SP652)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3a976b8b-b7b6-44b2-9307-98cda0498657', 'authenticated', 'authenticated', 't25sp652@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHARAFUNNISA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3a976b8b-b7b6-44b2-9307-98cda0498657', '3a976b8b-b7b6-44b2-9307-98cda0498657', format('{"sub":"%s","email":"%s"}', '3a976b8b-b7b6-44b2-9307-98cda0498657', 't25sp652@gmail.com')::jsonb, 'email', '3a976b8b-b7b6-44b2-9307-98cda0498657', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3a976b8b-b7b6-44b2-9307-98cda0498657', 'SHARAFUNNISA', 't25sp652@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3a976b8b-b7b6-44b2-9307-98cda0498657', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3a976b8b-b7b6-44b2-9307-98cda0498657', 'T25SP652', now(), now());

    -- Teacher: SHARFA USMAN (T24JU289)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5e0463c9-e20e-48bb-9365-b6ea0bd65d30', 'authenticated', 'authenticated', 't24ju289@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHARFA USMAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5e0463c9-e20e-48bb-9365-b6ea0bd65d30', '5e0463c9-e20e-48bb-9365-b6ea0bd65d30', format('{"sub":"%s","email":"%s"}', '5e0463c9-e20e-48bb-9365-b6ea0bd65d30', 't24ju289@gmail.com')::jsonb, 'email', '5e0463c9-e20e-48bb-9365-b6ea0bd65d30', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5e0463c9-e20e-48bb-9365-b6ea0bd65d30', 'SHARFA USMAN', 't24ju289@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5e0463c9-e20e-48bb-9365-b6ea0bd65d30', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5e0463c9-e20e-48bb-9365-b6ea0bd65d30', 'T24JU289', now(), now());

    -- Teacher: SHARFINA P S (T26FB844)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5e1767d9-456c-4c50-86b1-0a2e5e460e08', 'authenticated', 'authenticated', 't26fb844@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHARFINA P S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5e1767d9-456c-4c50-86b1-0a2e5e460e08', '5e1767d9-456c-4c50-86b1-0a2e5e460e08', format('{"sub":"%s","email":"%s"}', '5e1767d9-456c-4c50-86b1-0a2e5e460e08', 't26fb844@gmail.com')::jsonb, 'email', '5e1767d9-456c-4c50-86b1-0a2e5e460e08', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5e1767d9-456c-4c50-86b1-0a2e5e460e08', 'SHARFINA P S', 't26fb844@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5e1767d9-456c-4c50-86b1-0a2e5e460e08', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5e1767d9-456c-4c50-86b1-0a2e5e460e08', 'T26FB844', now(), now());

    -- Teacher: SHARINA BANU (T25SP663)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '80189e97-c623-4f49-9dd9-8eade16bcbcb', 'authenticated', 'authenticated', 't25sp663@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHARINA BANU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '80189e97-c623-4f49-9dd9-8eade16bcbcb', '80189e97-c623-4f49-9dd9-8eade16bcbcb', format('{"sub":"%s","email":"%s"}', '80189e97-c623-4f49-9dd9-8eade16bcbcb', 't25sp663@gmail.com')::jsonb, 'email', '80189e97-c623-4f49-9dd9-8eade16bcbcb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('80189e97-c623-4f49-9dd9-8eade16bcbcb', 'SHARINA BANU', 't25sp663@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('80189e97-c623-4f49-9dd9-8eade16bcbcb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('80189e97-c623-4f49-9dd9-8eade16bcbcb', 'T25SP663', now(), now());

    -- Teacher: SHEHINA SHAMSEER (T25SP665)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1debd750-e082-4252-89f3-bda9e5e76706', 'authenticated', 'authenticated', 't25sp665@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHEHINA SHAMSEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1debd750-e082-4252-89f3-bda9e5e76706', '1debd750-e082-4252-89f3-bda9e5e76706', format('{"sub":"%s","email":"%s"}', '1debd750-e082-4252-89f3-bda9e5e76706', 't25sp665@gmail.com')::jsonb, 'email', '1debd750-e082-4252-89f3-bda9e5e76706', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1debd750-e082-4252-89f3-bda9e5e76706', 'SHEHINA SHAMSEER', 't25sp665@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1debd750-e082-4252-89f3-bda9e5e76706', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1debd750-e082-4252-89f3-bda9e5e76706', 'T25SP665', now(), now());

    -- Teacher: SHEYIMA (T25AP527)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '279a7d71-42dd-4dc7-9a0e-9dd7756f1132', 'authenticated', 'authenticated', 't25ap527@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHEYIMA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '279a7d71-42dd-4dc7-9a0e-9dd7756f1132', '279a7d71-42dd-4dc7-9a0e-9dd7756f1132', format('{"sub":"%s","email":"%s"}', '279a7d71-42dd-4dc7-9a0e-9dd7756f1132', 't25ap527@gmail.com')::jsonb, 'email', '279a7d71-42dd-4dc7-9a0e-9dd7756f1132', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('279a7d71-42dd-4dc7-9a0e-9dd7756f1132', 'SHEYIMA', 't25ap527@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('279a7d71-42dd-4dc7-9a0e-9dd7756f1132', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('279a7d71-42dd-4dc7-9a0e-9dd7756f1132', 'T25AP527', now(), now());

    -- Teacher: SHIBILA CH (T25OC699)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '069a39df-e9a4-4bdd-b929-6965f2da2acb', 'authenticated', 'authenticated', 't25oc699@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHIBILA CH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '069a39df-e9a4-4bdd-b929-6965f2da2acb', '069a39df-e9a4-4bdd-b929-6965f2da2acb', format('{"sub":"%s","email":"%s"}', '069a39df-e9a4-4bdd-b929-6965f2da2acb', 't25oc699@gmail.com')::jsonb, 'email', '069a39df-e9a4-4bdd-b929-6965f2da2acb', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('069a39df-e9a4-4bdd-b929-6965f2da2acb', 'SHIBILA CH', 't25oc699@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('069a39df-e9a4-4bdd-b929-6965f2da2acb', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('069a39df-e9a4-4bdd-b929-6965f2da2acb', 'T25OC699', now(), now());

    -- Teacher: SHIFA (T23SP32)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4ec6932a-ec80-41aa-9ebd-e334a6908097', 'authenticated', 'authenticated', 't23sp32@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHIFA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4ec6932a-ec80-41aa-9ebd-e334a6908097', '4ec6932a-ec80-41aa-9ebd-e334a6908097', format('{"sub":"%s","email":"%s"}', '4ec6932a-ec80-41aa-9ebd-e334a6908097', 't23sp32@gmail.com')::jsonb, 'email', '4ec6932a-ec80-41aa-9ebd-e334a6908097', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4ec6932a-ec80-41aa-9ebd-e334a6908097', 'SHIFA', 't23sp32@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4ec6932a-ec80-41aa-9ebd-e334a6908097', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4ec6932a-ec80-41aa-9ebd-e334a6908097', 'T23SP32', now(), now());

    -- Teacher: SHIFANA (T25OC701)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ce5e8717-f745-4b59-ae0e-a8dd3752f46f', 'authenticated', 'authenticated', 't25oc701@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHIFANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ce5e8717-f745-4b59-ae0e-a8dd3752f46f', 'ce5e8717-f745-4b59-ae0e-a8dd3752f46f', format('{"sub":"%s","email":"%s"}', 'ce5e8717-f745-4b59-ae0e-a8dd3752f46f', 't25oc701@gmail.com')::jsonb, 'email', 'ce5e8717-f745-4b59-ae0e-a8dd3752f46f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ce5e8717-f745-4b59-ae0e-a8dd3752f46f', 'SHIFANA', 't25oc701@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ce5e8717-f745-4b59-ae0e-a8dd3752f46f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ce5e8717-f745-4b59-ae0e-a8dd3752f46f', 'T25OC701', now(), now());

    -- Teacher: SHIFANA KHAIS (T25NV769)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ec18ee7c-88a7-4448-a469-7832eff8ad23', 'authenticated', 'authenticated', 't25nv769@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHIFANA KHAIS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ec18ee7c-88a7-4448-a469-7832eff8ad23', 'ec18ee7c-88a7-4448-a469-7832eff8ad23', format('{"sub":"%s","email":"%s"}', 'ec18ee7c-88a7-4448-a469-7832eff8ad23', 't25nv769@gmail.com')::jsonb, 'email', 'ec18ee7c-88a7-4448-a469-7832eff8ad23', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ec18ee7c-88a7-4448-a469-7832eff8ad23', 'SHIFANA KHAIS', 't25nv769@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ec18ee7c-88a7-4448-a469-7832eff8ad23', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ec18ee7c-88a7-4448-a469-7832eff8ad23', 'T25NV769', now(), now());

    -- Teacher: SHIHANA SHERIN M (T24SP378)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0886e207-08f5-432f-892c-df430115f32a', 'authenticated', 'authenticated', 't24sp378@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SHIHANA SHERIN M"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0886e207-08f5-432f-892c-df430115f32a', '0886e207-08f5-432f-892c-df430115f32a', format('{"sub":"%s","email":"%s"}', '0886e207-08f5-432f-892c-df430115f32a', 't24sp378@gmail.com')::jsonb, 'email', '0886e207-08f5-432f-892c-df430115f32a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0886e207-08f5-432f-892c-df430115f32a', 'SHIHANA SHERIN M', 't24sp378@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0886e207-08f5-432f-892c-df430115f32a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0886e207-08f5-432f-892c-df430115f32a', 'T24SP378', now(), now());

    -- Teacher: SIDDHARTH NAIR (T25JU593)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'de7e35fd-58c5-4eed-9411-997244bd30ef', 'authenticated', 'authenticated', 't25ju593@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SIDDHARTH NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'de7e35fd-58c5-4eed-9411-997244bd30ef', 'de7e35fd-58c5-4eed-9411-997244bd30ef', format('{"sub":"%s","email":"%s"}', 'de7e35fd-58c5-4eed-9411-997244bd30ef', 't25ju593@gmail.com')::jsonb, 'email', 'de7e35fd-58c5-4eed-9411-997244bd30ef', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('de7e35fd-58c5-4eed-9411-997244bd30ef', 'SIDDHARTH NAIR', 't25ju593@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('de7e35fd-58c5-4eed-9411-997244bd30ef', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('de7e35fd-58c5-4eed-9411-997244bd30ef', 'T25JU593', now(), now());

    -- Teacher: SIFLA FARSANA (T25AG632)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '21e64d67-bec2-44eb-a91f-4f0112d2eaa3', 'authenticated', 'authenticated', 't25ag632@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SIFLA FARSANA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '21e64d67-bec2-44eb-a91f-4f0112d2eaa3', '21e64d67-bec2-44eb-a91f-4f0112d2eaa3', format('{"sub":"%s","email":"%s"}', '21e64d67-bec2-44eb-a91f-4f0112d2eaa3', 't25ag632@gmail.com')::jsonb, 'email', '21e64d67-bec2-44eb-a91f-4f0112d2eaa3', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('21e64d67-bec2-44eb-a91f-4f0112d2eaa3', 'SIFLA FARSANA', 't25ag632@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('21e64d67-bec2-44eb-a91f-4f0112d2eaa3', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('21e64d67-bec2-44eb-a91f-4f0112d2eaa3', 'T25AG632', now(), now());

    -- Teacher: SINUMOL THOMAS (T25OC711)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '60ec122c-d90a-4270-9989-1f91c729e3b7', 'authenticated', 'authenticated', 't25oc711@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SINUMOL THOMAS"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '60ec122c-d90a-4270-9989-1f91c729e3b7', '60ec122c-d90a-4270-9989-1f91c729e3b7', format('{"sub":"%s","email":"%s"}', '60ec122c-d90a-4270-9989-1f91c729e3b7', 't25oc711@gmail.com')::jsonb, 'email', '60ec122c-d90a-4270-9989-1f91c729e3b7', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('60ec122c-d90a-4270-9989-1f91c729e3b7', 'SINUMOL THOMAS', 't25oc711@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('60ec122c-d90a-4270-9989-1f91c729e3b7', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('60ec122c-d90a-4270-9989-1f91c729e3b7', 'T25OC711', now(), now());

    -- Teacher: SIVA SANKARI (T24JN179)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', 'authenticated', 'authenticated', 't24jn179@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SIVA SANKARI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', '5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', format('{"sub":"%s","email":"%s"}', '5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', 't24jn179@gmail.com')::jsonb, 'email', '5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', 'SIVA SANKARI', 't24jn179@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5c53c0fa-350d-49a5-9a74-ad7eaa0d8d8e', 'T24JN179', now(), now());

    -- Teacher: SMITHA (T24JU265)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '095fdf60-a479-4d13-87f6-c976044e04a8', 'authenticated', 'authenticated', 't24ju265@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SMITHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '095fdf60-a479-4d13-87f6-c976044e04a8', '095fdf60-a479-4d13-87f6-c976044e04a8', format('{"sub":"%s","email":"%s"}', '095fdf60-a479-4d13-87f6-c976044e04a8', 't24ju265@gmail.com')::jsonb, 'email', '095fdf60-a479-4d13-87f6-c976044e04a8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('095fdf60-a479-4d13-87f6-c976044e04a8', 'SMITHA', 't24ju265@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('095fdf60-a479-4d13-87f6-c976044e04a8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('095fdf60-a479-4d13-87f6-c976044e04a8', 'T24JU265', now(), now());

    -- Teacher: SNEHA CHANDRAN (T25JL605)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7f840359-d8ab-462e-8d33-f6346201ac39', 'authenticated', 'authenticated', 't25jl605@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SNEHA CHANDRAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7f840359-d8ab-462e-8d33-f6346201ac39', '7f840359-d8ab-462e-8d33-f6346201ac39', format('{"sub":"%s","email":"%s"}', '7f840359-d8ab-462e-8d33-f6346201ac39', 't25jl605@gmail.com')::jsonb, 'email', '7f840359-d8ab-462e-8d33-f6346201ac39', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7f840359-d8ab-462e-8d33-f6346201ac39', 'SNEHA CHANDRAN', 't25jl605@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7f840359-d8ab-462e-8d33-f6346201ac39', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7f840359-d8ab-462e-8d33-f6346201ac39', 'T25JL605', now(), now());

    -- Teacher: SNEHA GIRISH (T26FB836)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '57ddb996-a260-47b2-b727-12c380b16b3a', 'authenticated', 'authenticated', 't26fb836@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SNEHA GIRISH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '57ddb996-a260-47b2-b727-12c380b16b3a', '57ddb996-a260-47b2-b727-12c380b16b3a', format('{"sub":"%s","email":"%s"}', '57ddb996-a260-47b2-b727-12c380b16b3a', 't26fb836@gmail.com')::jsonb, 'email', '57ddb996-a260-47b2-b727-12c380b16b3a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('57ddb996-a260-47b2-b727-12c380b16b3a', 'SNEHA GIRISH', 't26fb836@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('57ddb996-a260-47b2-b727-12c380b16b3a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('57ddb996-a260-47b2-b727-12c380b16b3a', 'T26FB836', now(), now());

    -- Teacher: SNEHA K (T25OC723)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a507017c-e0c7-407d-b1f5-8eeaf1c74176', 'authenticated', 'authenticated', 't25oc723@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SNEHA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a507017c-e0c7-407d-b1f5-8eeaf1c74176', 'a507017c-e0c7-407d-b1f5-8eeaf1c74176', format('{"sub":"%s","email":"%s"}', 'a507017c-e0c7-407d-b1f5-8eeaf1c74176', 't25oc723@gmail.com')::jsonb, 'email', 'a507017c-e0c7-407d-b1f5-8eeaf1c74176', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a507017c-e0c7-407d-b1f5-8eeaf1c74176', 'SNEHA K', 't25oc723@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a507017c-e0c7-407d-b1f5-8eeaf1c74176', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a507017c-e0c7-407d-b1f5-8eeaf1c74176', 'T25OC723', now(), now());

    -- Teacher: SNEHA UNNI (T24JU286)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', 'authenticated', 'authenticated', 't24ju286@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SNEHA UNNI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', '8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', format('{"sub":"%s","email":"%s"}', '8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', 't24ju286@gmail.com')::jsonb, 'email', '8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', 'SNEHA UNNI', 't24ju286@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8cf2d0a4-54f6-41a3-b409-8af2b1d94d0c', 'T24JU286', now(), now());

    -- Teacher: SREEDEVI (T25NV740)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '0f7765c5-957a-462d-bb27-91a6090295ce', 'authenticated', 'authenticated', 't25nv740@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREEDEVI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '0f7765c5-957a-462d-bb27-91a6090295ce', '0f7765c5-957a-462d-bb27-91a6090295ce', format('{"sub":"%s","email":"%s"}', '0f7765c5-957a-462d-bb27-91a6090295ce', 't25nv740@gmail.com')::jsonb, 'email', '0f7765c5-957a-462d-bb27-91a6090295ce', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('0f7765c5-957a-462d-bb27-91a6090295ce', 'SREEDEVI', 't25nv740@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('0f7765c5-957a-462d-bb27-91a6090295ce', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('0f7765c5-957a-462d-bb27-91a6090295ce', 'T25NV740', now(), now());

    -- Teacher: SREELA (T25JU577)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '3b01b189-2150-47ac-8407-57f8dc106719', 'authenticated', 'authenticated', 't25ju577@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREELA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '3b01b189-2150-47ac-8407-57f8dc106719', '3b01b189-2150-47ac-8407-57f8dc106719', format('{"sub":"%s","email":"%s"}', '3b01b189-2150-47ac-8407-57f8dc106719', 't25ju577@gmail.com')::jsonb, 'email', '3b01b189-2150-47ac-8407-57f8dc106719', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('3b01b189-2150-47ac-8407-57f8dc106719', 'SREELA', 't25ju577@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('3b01b189-2150-47ac-8407-57f8dc106719', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('3b01b189-2150-47ac-8407-57f8dc106719', 'T25JU577', now(), now());

    -- Teacher: SREELAKSHMI P (T25SP689)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '35cbbf7f-4735-48ae-857f-bb64fd5f581a', 'authenticated', 'authenticated', 't25sp689@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREELAKSHMI P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '35cbbf7f-4735-48ae-857f-bb64fd5f581a', '35cbbf7f-4735-48ae-857f-bb64fd5f581a', format('{"sub":"%s","email":"%s"}', '35cbbf7f-4735-48ae-857f-bb64fd5f581a', 't25sp689@gmail.com')::jsonb, 'email', '35cbbf7f-4735-48ae-857f-bb64fd5f581a', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('35cbbf7f-4735-48ae-857f-bb64fd5f581a', 'SREELAKSHMI P', 't25sp689@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('35cbbf7f-4735-48ae-857f-bb64fd5f581a', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('35cbbf7f-4735-48ae-857f-bb64fd5f581a', 'T25SP689', now(), now());

    -- Teacher: SREELAKSHMI TV (T25MR486)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', 'authenticated', 'authenticated', 't25mr486@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREELAKSHMI TV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', 'ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', format('{"sub":"%s","email":"%s"}', 'ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', 't25mr486@gmail.com')::jsonb, 'email', 'ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', 'SREELAKSHMI TV', 't25mr486@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ef0d7036-0dc9-4ae3-b217-1e588e4ee2b0', 'T25MR486', now(), now());

    -- Teacher: SREELAXMI MURALI (T25FB460)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '19eb1f14-f65b-4f64-bbac-b58bba687454', 'authenticated', 'authenticated', 't25fb460@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREELAXMI MURALI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '19eb1f14-f65b-4f64-bbac-b58bba687454', '19eb1f14-f65b-4f64-bbac-b58bba687454', format('{"sub":"%s","email":"%s"}', '19eb1f14-f65b-4f64-bbac-b58bba687454', 't25fb460@gmail.com')::jsonb, 'email', '19eb1f14-f65b-4f64-bbac-b58bba687454', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('19eb1f14-f65b-4f64-bbac-b58bba687454', 'SREELAXMI MURALI', 't25fb460@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('19eb1f14-f65b-4f64-bbac-b58bba687454', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('19eb1f14-f65b-4f64-bbac-b58bba687454', 'T25FB460', now(), now());

    -- Teacher: SREENA LAL (T24JL305)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9fea50f0-9e2b-479e-9b1e-0aa7554f0322', 'authenticated', 'authenticated', 't24jl305@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREENA LAL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9fea50f0-9e2b-479e-9b1e-0aa7554f0322', '9fea50f0-9e2b-479e-9b1e-0aa7554f0322', format('{"sub":"%s","email":"%s"}', '9fea50f0-9e2b-479e-9b1e-0aa7554f0322', 't24jl305@gmail.com')::jsonb, 'email', '9fea50f0-9e2b-479e-9b1e-0aa7554f0322', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9fea50f0-9e2b-479e-9b1e-0aa7554f0322', 'SREENA LAL', 't24jl305@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9fea50f0-9e2b-479e-9b1e-0aa7554f0322', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9fea50f0-9e2b-479e-9b1e-0aa7554f0322', 'T24JL305', now(), now());

    -- Teacher: SREESHA KC (T25FB475)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1a5ee18c-a467-4763-aa10-49fd82b4d879', 'authenticated', 'authenticated', 't25fb475@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREESHA KC"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1a5ee18c-a467-4763-aa10-49fd82b4d879', '1a5ee18c-a467-4763-aa10-49fd82b4d879', format('{"sub":"%s","email":"%s"}', '1a5ee18c-a467-4763-aa10-49fd82b4d879', 't25fb475@gmail.com')::jsonb, 'email', '1a5ee18c-a467-4763-aa10-49fd82b4d879', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1a5ee18c-a467-4763-aa10-49fd82b4d879', 'SREESHA KC', 't25fb475@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1a5ee18c-a467-4763-aa10-49fd82b4d879', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1a5ee18c-a467-4763-aa10-49fd82b4d879', 'T25FB475', now(), now());

    -- Teacher: SREYA B N (T26JN809)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8d138fb9-a4eb-4613-a363-b2be52da3200', 'authenticated', 'authenticated', 't26jn809@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SREYA B N"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8d138fb9-a4eb-4613-a363-b2be52da3200', '8d138fb9-a4eb-4613-a363-b2be52da3200', format('{"sub":"%s","email":"%s"}', '8d138fb9-a4eb-4613-a363-b2be52da3200', 't26jn809@gmail.com')::jsonb, 'email', '8d138fb9-a4eb-4613-a363-b2be52da3200', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8d138fb9-a4eb-4613-a363-b2be52da3200', 'SREYA B N', 't26jn809@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8d138fb9-a4eb-4613-a363-b2be52da3200', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8d138fb9-a4eb-4613-a363-b2be52da3200', 'T26JN809', now(), now());

    -- Teacher: SRUTHI KD (T25JU589)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5840b8b0-36cd-4fdf-8863-4899346b827c', 'authenticated', 'authenticated', 't25ju589@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SRUTHI KD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5840b8b0-36cd-4fdf-8863-4899346b827c', '5840b8b0-36cd-4fdf-8863-4899346b827c', format('{"sub":"%s","email":"%s"}', '5840b8b0-36cd-4fdf-8863-4899346b827c', 't25ju589@gmail.com')::jsonb, 'email', '5840b8b0-36cd-4fdf-8863-4899346b827c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5840b8b0-36cd-4fdf-8863-4899346b827c', 'SRUTHI KD', 't25ju589@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5840b8b0-36cd-4fdf-8863-4899346b827c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5840b8b0-36cd-4fdf-8863-4899346b827c', 'T25JU589', now(), now());

    -- Teacher: SRUTHI RANJITH (T25JN453)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '10e4676c-e6af-41c9-8a27-d7d069b06fb8', 'authenticated', 'authenticated', 't25jn453@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SRUTHI RANJITH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '10e4676c-e6af-41c9-8a27-d7d069b06fb8', '10e4676c-e6af-41c9-8a27-d7d069b06fb8', format('{"sub":"%s","email":"%s"}', '10e4676c-e6af-41c9-8a27-d7d069b06fb8', 't25jn453@gmail.com')::jsonb, 'email', '10e4676c-e6af-41c9-8a27-d7d069b06fb8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('10e4676c-e6af-41c9-8a27-d7d069b06fb8', 'SRUTHI RANJITH', 't25jn453@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('10e4676c-e6af-41c9-8a27-d7d069b06fb8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('10e4676c-e6af-41c9-8a27-d7d069b06fb8', 'T25JN453', now(), now());

    -- Teacher: SRUTHI S (T25AP566)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '195943b6-67dc-4bcd-8596-7b5155c4c8ac', 'authenticated', 'authenticated', 't25ap566@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SRUTHI S"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '195943b6-67dc-4bcd-8596-7b5155c4c8ac', '195943b6-67dc-4bcd-8596-7b5155c4c8ac', format('{"sub":"%s","email":"%s"}', '195943b6-67dc-4bcd-8596-7b5155c4c8ac', 't25ap566@gmail.com')::jsonb, 'email', '195943b6-67dc-4bcd-8596-7b5155c4c8ac', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('195943b6-67dc-4bcd-8596-7b5155c4c8ac', 'SRUTHI S', 't25ap566@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('195943b6-67dc-4bcd-8596-7b5155c4c8ac', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('195943b6-67dc-4bcd-8596-7b5155c4c8ac', 'T25AP566', now(), now());

    -- Teacher: SUDHI RAJ (T25JL609)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', 'authenticated', 'authenticated', 't25jl609@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUDHI RAJ"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', '2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', format('{"sub":"%s","email":"%s"}', '2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', 't25jl609@gmail.com')::jsonb, 'email', '2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', 'SUDHI RAJ', 't25jl609@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('2b1465f9-54c6-44ed-a32b-09ca9d24f7e5', 'T25JL609', now(), now());

    -- Teacher: SUHARABI (T24MA247)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1ba2a331-3e15-48da-99b7-0c2374c34d02', 'authenticated', 'authenticated', 't24ma247@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUHARABI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1ba2a331-3e15-48da-99b7-0c2374c34d02', '1ba2a331-3e15-48da-99b7-0c2374c34d02', format('{"sub":"%s","email":"%s"}', '1ba2a331-3e15-48da-99b7-0c2374c34d02', 't24ma247@gmail.com')::jsonb, 'email', '1ba2a331-3e15-48da-99b7-0c2374c34d02', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1ba2a331-3e15-48da-99b7-0c2374c34d02', 'SUHARABI', 't24ma247@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1ba2a331-3e15-48da-99b7-0c2374c34d02', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1ba2a331-3e15-48da-99b7-0c2374c34d02', 'T24MA247', now(), now());

    -- Teacher: SUJISHA C (T26JN808)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c3458efc-cdf5-4e51-bff3-b7abc0e37b74', 'authenticated', 'authenticated', 't26jn808@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUJISHA C"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c3458efc-cdf5-4e51-bff3-b7abc0e37b74', 'c3458efc-cdf5-4e51-bff3-b7abc0e37b74', format('{"sub":"%s","email":"%s"}', 'c3458efc-cdf5-4e51-bff3-b7abc0e37b74', 't26jn808@gmail.com')::jsonb, 'email', 'c3458efc-cdf5-4e51-bff3-b7abc0e37b74', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c3458efc-cdf5-4e51-bff3-b7abc0e37b74', 'SUJISHA C', 't26jn808@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c3458efc-cdf5-4e51-bff3-b7abc0e37b74', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c3458efc-cdf5-4e51-bff3-b7abc0e37b74', 'T26JN808', now(), now());

    -- Teacher: SULFY ZAKEER (T25AP532)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bbcaa2f4-3484-4f7b-be40-5770eef49904', 'authenticated', 'authenticated', 't25ap532@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SULFY ZAKEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bbcaa2f4-3484-4f7b-be40-5770eef49904', 'bbcaa2f4-3484-4f7b-be40-5770eef49904', format('{"sub":"%s","email":"%s"}', 'bbcaa2f4-3484-4f7b-be40-5770eef49904', 't25ap532@gmail.com')::jsonb, 'email', 'bbcaa2f4-3484-4f7b-be40-5770eef49904', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bbcaa2f4-3484-4f7b-be40-5770eef49904', 'SULFY ZAKEER', 't25ap532@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bbcaa2f4-3484-4f7b-be40-5770eef49904', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bbcaa2f4-3484-4f7b-be40-5770eef49904', 'T25AP532', now(), now());

    -- Teacher: SUMAYYA BHAI (T24AG313)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '42ddda48-227b-4b6c-baea-956695b17d32', 'authenticated', 'authenticated', 't24ag313@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUMAYYA BHAI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '42ddda48-227b-4b6c-baea-956695b17d32', '42ddda48-227b-4b6c-baea-956695b17d32', format('{"sub":"%s","email":"%s"}', '42ddda48-227b-4b6c-baea-956695b17d32', 't24ag313@gmail.com')::jsonb, 'email', '42ddda48-227b-4b6c-baea-956695b17d32', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('42ddda48-227b-4b6c-baea-956695b17d32', 'SUMAYYA BHAI', 't24ag313@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('42ddda48-227b-4b6c-baea-956695b17d32', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('42ddda48-227b-4b6c-baea-956695b17d32', 'T24AG313', now(), now());

    -- Teacher: SUMAYYA MALIYEKKAL (T25NV768)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c6327672-8250-406a-aebb-fb6fe5eea832', 'authenticated', 'authenticated', 't25nv768@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUMAYYA MALIYEKKAL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c6327672-8250-406a-aebb-fb6fe5eea832', 'c6327672-8250-406a-aebb-fb6fe5eea832', format('{"sub":"%s","email":"%s"}', 'c6327672-8250-406a-aebb-fb6fe5eea832', 't25nv768@gmail.com')::jsonb, 'email', 'c6327672-8250-406a-aebb-fb6fe5eea832', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c6327672-8250-406a-aebb-fb6fe5eea832', 'SUMAYYA MALIYEKKAL', 't25nv768@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c6327672-8250-406a-aebb-fb6fe5eea832', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c6327672-8250-406a-aebb-fb6fe5eea832', 'T25NV768', now(), now());

    -- Teacher: SUMAYYA PARVEEN (T25AP541)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', 'authenticated', 'authenticated', 't25ap541@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUMAYYA PARVEEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', '7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', format('{"sub":"%s","email":"%s"}', '7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', 't25ap541@gmail.com')::jsonb, 'email', '7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', 'SUMAYYA PARVEEN', 't25ap541@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7ccc9955-51d3-4f4a-a7d4-8e4f9bbef22c', 'T25AP541', now(), now());

    -- Teacher: SUMETHA SAGEER (T26JN828)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6337d7d1-7481-4b4d-9399-7255f34b81c5', 'authenticated', 'authenticated', 't26jn828@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUMETHA SAGEER"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6337d7d1-7481-4b4d-9399-7255f34b81c5', '6337d7d1-7481-4b4d-9399-7255f34b81c5', format('{"sub":"%s","email":"%s"}', '6337d7d1-7481-4b4d-9399-7255f34b81c5', 't26jn828@gmail.com')::jsonb, 'email', '6337d7d1-7481-4b4d-9399-7255f34b81c5', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6337d7d1-7481-4b4d-9399-7255f34b81c5', 'SUMETHA SAGEER', 't26jn828@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6337d7d1-7481-4b4d-9399-7255f34b81c5', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6337d7d1-7481-4b4d-9399-7255f34b81c5', 'T26JN828', now(), now());

    -- Teacher: SUMINA P (T25MR495)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ac578e49-b9b2-4cb2-9d98-41ead0e1462e', 'authenticated', 'authenticated', 't25mr495@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUMINA P"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ac578e49-b9b2-4cb2-9d98-41ead0e1462e', 'ac578e49-b9b2-4cb2-9d98-41ead0e1462e', format('{"sub":"%s","email":"%s"}', 'ac578e49-b9b2-4cb2-9d98-41ead0e1462e', 't25mr495@gmail.com')::jsonb, 'email', 'ac578e49-b9b2-4cb2-9d98-41ead0e1462e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ac578e49-b9b2-4cb2-9d98-41ead0e1462e', 'SUMINA P', 't25mr495@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ac578e49-b9b2-4cb2-9d98-41ead0e1462e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ac578e49-b9b2-4cb2-9d98-41ead0e1462e', 'T25MR495', now(), now());

    -- Teacher: SUMITHA S NAIR (T25AP512)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1d7b4ffc-4815-4e3b-900c-00f7a2821df0', 'authenticated', 'authenticated', 't25ap512@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUMITHA S NAIR"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1d7b4ffc-4815-4e3b-900c-00f7a2821df0', '1d7b4ffc-4815-4e3b-900c-00f7a2821df0', format('{"sub":"%s","email":"%s"}', '1d7b4ffc-4815-4e3b-900c-00f7a2821df0', 't25ap512@gmail.com')::jsonb, 'email', '1d7b4ffc-4815-4e3b-900c-00f7a2821df0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1d7b4ffc-4815-4e3b-900c-00f7a2821df0', 'SUMITHA S NAIR', 't25ap512@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1d7b4ffc-4815-4e3b-900c-00f7a2821df0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1d7b4ffc-4815-4e3b-900c-00f7a2821df0', 'T25AP512', now(), now());

    -- Teacher: SUNEERA (T25OC732)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '671bd4dd-222e-473c-9b2f-9e12ee232e32', 'authenticated', 'authenticated', 't25oc732@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUNEERA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '671bd4dd-222e-473c-9b2f-9e12ee232e32', '671bd4dd-222e-473c-9b2f-9e12ee232e32', format('{"sub":"%s","email":"%s"}', '671bd4dd-222e-473c-9b2f-9e12ee232e32', 't25oc732@gmail.com')::jsonb, 'email', '671bd4dd-222e-473c-9b2f-9e12ee232e32', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('671bd4dd-222e-473c-9b2f-9e12ee232e32', 'SUNEERA', 't25oc732@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('671bd4dd-222e-473c-9b2f-9e12ee232e32', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('671bd4dd-222e-473c-9b2f-9e12ee232e32', 'T25OC732', now(), now());

    -- Teacher: SUREKHA (T23SP44)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'ae0966a7-65ce-4df7-be7d-193bd086446b', 'authenticated', 'authenticated', 't23sp44@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUREKHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'ae0966a7-65ce-4df7-be7d-193bd086446b', 'ae0966a7-65ce-4df7-be7d-193bd086446b', format('{"sub":"%s","email":"%s"}', 'ae0966a7-65ce-4df7-be7d-193bd086446b', 't23sp44@gmail.com')::jsonb, 'email', 'ae0966a7-65ce-4df7-be7d-193bd086446b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('ae0966a7-65ce-4df7-be7d-193bd086446b', 'SUREKHA', 't23sp44@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('ae0966a7-65ce-4df7-be7d-193bd086446b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('ae0966a7-65ce-4df7-be7d-193bd086446b', 'T23SP44', now(), now());

    -- Teacher: SURVE AFREEN (T24SP357)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '1aa88416-0de0-447f-9811-cec35ddf8d5b', 'authenticated', 'authenticated', 't24sp357@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SURVE AFREEN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '1aa88416-0de0-447f-9811-cec35ddf8d5b', '1aa88416-0de0-447f-9811-cec35ddf8d5b', format('{"sub":"%s","email":"%s"}', '1aa88416-0de0-447f-9811-cec35ddf8d5b', 't24sp357@gmail.com')::jsonb, 'email', '1aa88416-0de0-447f-9811-cec35ddf8d5b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('1aa88416-0de0-447f-9811-cec35ddf8d5b', 'SURVE AFREEN', 't24sp357@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('1aa88416-0de0-447f-9811-cec35ddf8d5b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('1aa88416-0de0-447f-9811-cec35ddf8d5b', 'T24SP357', now(), now());

    -- Teacher: SURYA NARAYAN A (T24OC406)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bd2d61ad-40d1-41af-80fa-06040fa7d056', 'authenticated', 'authenticated', 't24oc406@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SURYA NARAYAN A"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bd2d61ad-40d1-41af-80fa-06040fa7d056', 'bd2d61ad-40d1-41af-80fa-06040fa7d056', format('{"sub":"%s","email":"%s"}', 'bd2d61ad-40d1-41af-80fa-06040fa7d056', 't24oc406@gmail.com')::jsonb, 'email', 'bd2d61ad-40d1-41af-80fa-06040fa7d056', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bd2d61ad-40d1-41af-80fa-06040fa7d056', 'SURYA NARAYAN A', 't24oc406@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bd2d61ad-40d1-41af-80fa-06040fa7d056', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bd2d61ad-40d1-41af-80fa-06040fa7d056', 'T24OC406', now(), now());

    -- Teacher: SUSEELA (T25NV746)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b3c50fb1-269a-4d91-a9ff-d82292c72d78', 'authenticated', 'authenticated', 't25nv746@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUSEELA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b3c50fb1-269a-4d91-a9ff-d82292c72d78', 'b3c50fb1-269a-4d91-a9ff-d82292c72d78', format('{"sub":"%s","email":"%s"}', 'b3c50fb1-269a-4d91-a9ff-d82292c72d78', 't25nv746@gmail.com')::jsonb, 'email', 'b3c50fb1-269a-4d91-a9ff-d82292c72d78', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b3c50fb1-269a-4d91-a9ff-d82292c72d78', 'SUSEELA', 't25nv746@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b3c50fb1-269a-4d91-a9ff-d82292c72d78', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b3c50fb1-269a-4d91-a9ff-d82292c72d78', 'T25NV746', now(), now());

    -- Teacher: SUVARNA (T25AG641)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', 'authenticated', 'authenticated', 't25ag641@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SUVARNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', 'a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', format('{"sub":"%s","email":"%s"}', 'a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', 't25ag641@gmail.com')::jsonb, 'email', 'a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', 'SUVARNA', 't25ag641@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a8bf97d5-9e04-4b24-a8e2-66ae9486ba34', 'T25AG641', now(), now());

    -- Teacher: SWALIHATH (T25DC792)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '79aa502b-4613-4af3-889d-c7501c849a1b', 'authenticated', 'authenticated', 't25dc792@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SWALIHATH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '79aa502b-4613-4af3-889d-c7501c849a1b', '79aa502b-4613-4af3-889d-c7501c849a1b', format('{"sub":"%s","email":"%s"}', '79aa502b-4613-4af3-889d-c7501c849a1b', 't25dc792@gmail.com')::jsonb, 'email', '79aa502b-4613-4af3-889d-c7501c849a1b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('79aa502b-4613-4af3-889d-c7501c849a1b', 'SWALIHATH', 't25dc792@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('79aa502b-4613-4af3-889d-c7501c849a1b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('79aa502b-4613-4af3-889d-c7501c849a1b', 'T25DC792', now(), now());

    -- Teacher: THASHREEFA (T25AG637)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'aec482f9-3db7-4165-bf3f-6a6b6e1031a2', 'authenticated', 'authenticated', 't25ag637@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"THASHREEFA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'aec482f9-3db7-4165-bf3f-6a6b6e1031a2', 'aec482f9-3db7-4165-bf3f-6a6b6e1031a2', format('{"sub":"%s","email":"%s"}', 'aec482f9-3db7-4165-bf3f-6a6b6e1031a2', 't25ag637@gmail.com')::jsonb, 'email', 'aec482f9-3db7-4165-bf3f-6a6b6e1031a2', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('aec482f9-3db7-4165-bf3f-6a6b6e1031a2', 'THASHREEFA', 't25ag637@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('aec482f9-3db7-4165-bf3f-6a6b6e1031a2', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('aec482f9-3db7-4165-bf3f-6a6b6e1031a2', 'T25AG637', now(), now());

    -- Teacher: THASNEEM (T25SP661)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', 'authenticated', 'authenticated', 't25sp661@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"THASNEEM"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', '9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', format('{"sub":"%s","email":"%s"}', '9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', 't25sp661@gmail.com')::jsonb, 'email', '9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', 'THASNEEM', 't25sp661@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9cfe9a5b-06d4-41f0-8a20-7d03e6f7b403', 'T25SP661', now(), now());

    -- Teacher: THASNEEM HASHMI (T25JU573)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'f2f09fe1-6dc1-41cf-a059-5306dbcb9447', 'authenticated', 'authenticated', 't25ju573@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"THASNEEM HASHMI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'f2f09fe1-6dc1-41cf-a059-5306dbcb9447', 'f2f09fe1-6dc1-41cf-a059-5306dbcb9447', format('{"sub":"%s","email":"%s"}', 'f2f09fe1-6dc1-41cf-a059-5306dbcb9447', 't25ju573@gmail.com')::jsonb, 'email', 'f2f09fe1-6dc1-41cf-a059-5306dbcb9447', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('f2f09fe1-6dc1-41cf-a059-5306dbcb9447', 'THASNEEM HASHMI', 't25ju573@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('f2f09fe1-6dc1-41cf-a059-5306dbcb9447', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('f2f09fe1-6dc1-41cf-a059-5306dbcb9447', 'T25JU573', now(), now());

    -- Teacher: THASNEEM KHALID (T25AG622)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8ca220b9-9aa0-4190-9b67-c5edccae78b4', 'authenticated', 'authenticated', 't25ag622@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"THASNEEM KHALID"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8ca220b9-9aa0-4190-9b67-c5edccae78b4', '8ca220b9-9aa0-4190-9b67-c5edccae78b4', format('{"sub":"%s","email":"%s"}', '8ca220b9-9aa0-4190-9b67-c5edccae78b4', 't25ag622@gmail.com')::jsonb, 'email', '8ca220b9-9aa0-4190-9b67-c5edccae78b4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8ca220b9-9aa0-4190-9b67-c5edccae78b4', 'THASNEEM KHALID', 't25ag622@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8ca220b9-9aa0-4190-9b67-c5edccae78b4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8ca220b9-9aa0-4190-9b67-c5edccae78b4', 'T25AG622', now(), now());

    -- Teacher: THEERTHA (T24MA234)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '556d70d3-31f5-4bdd-8707-e0804f3dd373', 'authenticated', 'authenticated', 't24ma234@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"THEERTHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '556d70d3-31f5-4bdd-8707-e0804f3dd373', '556d70d3-31f5-4bdd-8707-e0804f3dd373', format('{"sub":"%s","email":"%s"}', '556d70d3-31f5-4bdd-8707-e0804f3dd373', 't24ma234@gmail.com')::jsonb, 'email', '556d70d3-31f5-4bdd-8707-e0804f3dd373', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('556d70d3-31f5-4bdd-8707-e0804f3dd373', 'THEERTHA', 't24ma234@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('556d70d3-31f5-4bdd-8707-e0804f3dd373', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('556d70d3-31f5-4bdd-8707-e0804f3dd373', 'T24MA234', now(), now());

    -- Teacher: THOUFIRA K (T25AP552)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '7b594f76-d6c4-401d-9900-17aa0dda7849', 'authenticated', 'authenticated', 't25ap552@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"THOUFIRA K"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '7b594f76-d6c4-401d-9900-17aa0dda7849', '7b594f76-d6c4-401d-9900-17aa0dda7849', format('{"sub":"%s","email":"%s"}', '7b594f76-d6c4-401d-9900-17aa0dda7849', 't25ap552@gmail.com')::jsonb, 'email', '7b594f76-d6c4-401d-9900-17aa0dda7849', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('7b594f76-d6c4-401d-9900-17aa0dda7849', 'THOUFIRA K', 't25ap552@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('7b594f76-d6c4-401d-9900-17aa0dda7849', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('7b594f76-d6c4-401d-9900-17aa0dda7849', 'T25AP552', now(), now());

    -- Teacher: UMMU HABEEBA (T25JN446)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '53cc775f-28f8-45b5-bee1-3b9e6220c680', 'authenticated', 'authenticated', 't25jn446@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"UMMU HABEEBA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '53cc775f-28f8-45b5-bee1-3b9e6220c680', '53cc775f-28f8-45b5-bee1-3b9e6220c680', format('{"sub":"%s","email":"%s"}', '53cc775f-28f8-45b5-bee1-3b9e6220c680', 't25jn446@gmail.com')::jsonb, 'email', '53cc775f-28f8-45b5-bee1-3b9e6220c680', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('53cc775f-28f8-45b5-bee1-3b9e6220c680', 'UMMU HABEEBA', 't25jn446@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('53cc775f-28f8-45b5-bee1-3b9e6220c680', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('53cc775f-28f8-45b5-bee1-3b9e6220c680', 'T25JN446', now(), now());

    -- Teacher: UMMUL AMEENA (T25SP683)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dfd4bed4-10eb-40e4-8c99-a67639b2248b', 'authenticated', 'authenticated', 't25sp683@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"UMMUL AMEENA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dfd4bed4-10eb-40e4-8c99-a67639b2248b', 'dfd4bed4-10eb-40e4-8c99-a67639b2248b', format('{"sub":"%s","email":"%s"}', 'dfd4bed4-10eb-40e4-8c99-a67639b2248b', 't25sp683@gmail.com')::jsonb, 'email', 'dfd4bed4-10eb-40e4-8c99-a67639b2248b', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dfd4bed4-10eb-40e4-8c99-a67639b2248b', 'UMMUL AMEENA', 't25sp683@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dfd4bed4-10eb-40e4-8c99-a67639b2248b', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dfd4bed4-10eb-40e4-8c99-a67639b2248b', 'T25SP683', now(), now());

    -- Teacher: USHA SUDHISH (T26MR856)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bcf31b6f-06da-4164-851d-ff30be605a9f', 'authenticated', 'authenticated', 't26mr856@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"USHA SUDHISH"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bcf31b6f-06da-4164-851d-ff30be605a9f', 'bcf31b6f-06da-4164-851d-ff30be605a9f', format('{"sub":"%s","email":"%s"}', 'bcf31b6f-06da-4164-851d-ff30be605a9f', 't26mr856@gmail.com')::jsonb, 'email', 'bcf31b6f-06da-4164-851d-ff30be605a9f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bcf31b6f-06da-4164-851d-ff30be605a9f', 'USHA SUDHISH', 't26mr856@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bcf31b6f-06da-4164-851d-ff30be605a9f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bcf31b6f-06da-4164-851d-ff30be605a9f', 'T26MR856', now(), now());

    -- Teacher: VAFA SHERIN (T25AP553)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4e54cf12-26b7-4560-8b59-595b5530fca8', 'authenticated', 'authenticated', 't25ap553@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VAFA SHERIN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4e54cf12-26b7-4560-8b59-595b5530fca8', '4e54cf12-26b7-4560-8b59-595b5530fca8', format('{"sub":"%s","email":"%s"}', '4e54cf12-26b7-4560-8b59-595b5530fca8', 't25ap553@gmail.com')::jsonb, 'email', '4e54cf12-26b7-4560-8b59-595b5530fca8', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4e54cf12-26b7-4560-8b59-595b5530fca8', 'VAFA SHERIN', 't25ap553@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4e54cf12-26b7-4560-8b59-595b5530fca8', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4e54cf12-26b7-4560-8b59-595b5530fca8', 'T25AP553', now(), now());

    -- Teacher: VARDHA (T25SP651)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '5b1100f2-27fd-474a-9841-11efdbadea5d', 'authenticated', 'authenticated', 't25sp651@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VARDHA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '5b1100f2-27fd-474a-9841-11efdbadea5d', '5b1100f2-27fd-474a-9841-11efdbadea5d', format('{"sub":"%s","email":"%s"}', '5b1100f2-27fd-474a-9841-11efdbadea5d', 't25sp651@gmail.com')::jsonb, 'email', '5b1100f2-27fd-474a-9841-11efdbadea5d', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('5b1100f2-27fd-474a-9841-11efdbadea5d', 'VARDHA', 't25sp651@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('5b1100f2-27fd-474a-9841-11efdbadea5d', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('5b1100f2-27fd-474a-9841-11efdbadea5d', 'T25SP651', now(), now());

    -- Teacher: VARSHA MP (T26JN824)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '9107f47f-45fc-4aad-9dc0-15ab24803a02', 'authenticated', 'authenticated', 't26jn824@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VARSHA MP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '9107f47f-45fc-4aad-9dc0-15ab24803a02', '9107f47f-45fc-4aad-9dc0-15ab24803a02', format('{"sub":"%s","email":"%s"}', '9107f47f-45fc-4aad-9dc0-15ab24803a02', 't26jn824@gmail.com')::jsonb, 'email', '9107f47f-45fc-4aad-9dc0-15ab24803a02', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('9107f47f-45fc-4aad-9dc0-15ab24803a02', 'VARSHA MP', 't26jn824@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('9107f47f-45fc-4aad-9dc0-15ab24803a02', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('9107f47f-45fc-4aad-9dc0-15ab24803a02', 'T26JN824', now(), now());

    -- Teacher: VASILA JAHAN (T24MA244)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '75006799-0a24-4a82-a89e-85388a7d274f', 'authenticated', 'authenticated', 't24ma244@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VASILA JAHAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '75006799-0a24-4a82-a89e-85388a7d274f', '75006799-0a24-4a82-a89e-85388a7d274f', format('{"sub":"%s","email":"%s"}', '75006799-0a24-4a82-a89e-85388a7d274f', 't24ma244@gmail.com')::jsonb, 'email', '75006799-0a24-4a82-a89e-85388a7d274f', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('75006799-0a24-4a82-a89e-85388a7d274f', 'VASILA JAHAN', 't24ma244@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('75006799-0a24-4a82-a89e-85388a7d274f', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('75006799-0a24-4a82-a89e-85388a7d274f', 'T24MA244', now(), now());

    -- Teacher: VIBINA PV (T25JN445)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'bfbb119f-5021-4cda-ba20-61cf5c1644e4', 'authenticated', 'authenticated', 't25jn445@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VIBINA PV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'bfbb119f-5021-4cda-ba20-61cf5c1644e4', 'bfbb119f-5021-4cda-ba20-61cf5c1644e4', format('{"sub":"%s","email":"%s"}', 'bfbb119f-5021-4cda-ba20-61cf5c1644e4', 't25jn445@gmail.com')::jsonb, 'email', 'bfbb119f-5021-4cda-ba20-61cf5c1644e4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('bfbb119f-5021-4cda-ba20-61cf5c1644e4', 'VIBINA PV', 't25jn445@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('bfbb119f-5021-4cda-ba20-61cf5c1644e4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('bfbb119f-5021-4cda-ba20-61cf5c1644e4', 'T25JN445', now(), now());

    -- Teacher: VINAYA KU (T24MA231)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'b5325a92-6b22-422e-a4f3-8c45ab7224c0', 'authenticated', 'authenticated', 't24ma231@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VINAYA KU"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'b5325a92-6b22-422e-a4f3-8c45ab7224c0', 'b5325a92-6b22-422e-a4f3-8c45ab7224c0', format('{"sub":"%s","email":"%s"}', 'b5325a92-6b22-422e-a4f3-8c45ab7224c0', 't24ma231@gmail.com')::jsonb, 'email', 'b5325a92-6b22-422e-a4f3-8c45ab7224c0', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('b5325a92-6b22-422e-a4f3-8c45ab7224c0', 'VINAYA KU', 't24ma231@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('b5325a92-6b22-422e-a4f3-8c45ab7224c0', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('b5325a92-6b22-422e-a4f3-8c45ab7224c0', 'T24MA231', now(), now());

    -- Teacher: VISHNU PRIYA KV (T24DC432)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '96c23fac-6a12-4b21-aea9-9da3e26d0121', 'authenticated', 'authenticated', 't24dc432@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VISHNU PRIYA KV"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '96c23fac-6a12-4b21-aea9-9da3e26d0121', '96c23fac-6a12-4b21-aea9-9da3e26d0121', format('{"sub":"%s","email":"%s"}', '96c23fac-6a12-4b21-aea9-9da3e26d0121', 't24dc432@gmail.com')::jsonb, 'email', '96c23fac-6a12-4b21-aea9-9da3e26d0121', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('96c23fac-6a12-4b21-aea9-9da3e26d0121', 'VISHNU PRIYA KV', 't24dc432@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('96c23fac-6a12-4b21-aea9-9da3e26d0121', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('96c23fac-6a12-4b21-aea9-9da3e26d0121', 'T24DC432', now(), now());

    -- Teacher: VISHNUPRIYA (T24SP351)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a392e24c-c52e-4bd8-b0b4-d622cf5ab558', 'authenticated', 'authenticated', 't24sp351@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VISHNUPRIYA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a392e24c-c52e-4bd8-b0b4-d622cf5ab558', 'a392e24c-c52e-4bd8-b0b4-d622cf5ab558', format('{"sub":"%s","email":"%s"}', 'a392e24c-c52e-4bd8-b0b4-d622cf5ab558', 't24sp351@gmail.com')::jsonb, 'email', 'a392e24c-c52e-4bd8-b0b4-d622cf5ab558', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a392e24c-c52e-4bd8-b0b4-d622cf5ab558', 'VISHNUPRIYA', 't24sp351@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a392e24c-c52e-4bd8-b0b4-d622cf5ab558', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a392e24c-c52e-4bd8-b0b4-d622cf5ab558', 'T24SP351', now(), now());

    -- Teacher: VISMAYA CHANDRAN (T25JU583)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '197f7602-b9c4-4db6-b4db-d1cf92f3cf93', 'authenticated', 'authenticated', 't25ju583@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"VISMAYA CHANDRAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '197f7602-b9c4-4db6-b4db-d1cf92f3cf93', '197f7602-b9c4-4db6-b4db-d1cf92f3cf93', format('{"sub":"%s","email":"%s"}', '197f7602-b9c4-4db6-b4db-d1cf92f3cf93', 't25ju583@gmail.com')::jsonb, 'email', '197f7602-b9c4-4db6-b4db-d1cf92f3cf93', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('197f7602-b9c4-4db6-b4db-d1cf92f3cf93', 'VISMAYA CHANDRAN', 't25ju583@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('197f7602-b9c4-4db6-b4db-d1cf92f3cf93', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('197f7602-b9c4-4db6-b4db-d1cf92f3cf93', 'T25JU583', now(), now());

    -- Teacher: WAFA CHOLAYIL (T24NV420)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', 'authenticated', 'authenticated', 't24nv420@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"WAFA CHOLAYIL"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', '31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', format('{"sub":"%s","email":"%s"}', '31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', 't24nv420@gmail.com')::jsonb, 'email', '31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', 'WAFA CHOLAYIL', 't24nv420@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('31e1fc10-0cdd-4f17-bdfb-9273cc5ff027', 'T24NV420', now(), now());

    -- Teacher: YADHU KRISHNA (T25MA569)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '15675ecc-d0d0-4b8c-8733-37ff0ea751af', 'authenticated', 'authenticated', 't25ma569@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"YADHU KRISHNA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '15675ecc-d0d0-4b8c-8733-37ff0ea751af', '15675ecc-d0d0-4b8c-8733-37ff0ea751af', format('{"sub":"%s","email":"%s"}', '15675ecc-d0d0-4b8c-8733-37ff0ea751af', 't25ma569@gmail.com')::jsonb, 'email', '15675ecc-d0d0-4b8c-8733-37ff0ea751af', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('15675ecc-d0d0-4b8c-8733-37ff0ea751af', 'YADHU KRISHNA', 't25ma569@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('15675ecc-d0d0-4b8c-8733-37ff0ea751af', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('15675ecc-d0d0-4b8c-8733-37ff0ea751af', 'T25MA569', now(), now());

    -- Teacher: ZANHA KP (T25FB467)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '4cd3ec6f-7c91-42ed-8609-dc09ace22a11', 'authenticated', 'authenticated', 't25fb467@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ZANHA KP"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '4cd3ec6f-7c91-42ed-8609-dc09ace22a11', '4cd3ec6f-7c91-42ed-8609-dc09ace22a11', format('{"sub":"%s","email":"%s"}', '4cd3ec6f-7c91-42ed-8609-dc09ace22a11', 't25fb467@gmail.com')::jsonb, 'email', '4cd3ec6f-7c91-42ed-8609-dc09ace22a11', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('4cd3ec6f-7c91-42ed-8609-dc09ace22a11', 'ZANHA KP', 't25fb467@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('4cd3ec6f-7c91-42ed-8609-dc09ace22a11', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('4cd3ec6f-7c91-42ed-8609-dc09ace22a11', 'T25FB467', now(), now());

    -- Teacher: ZAYAN (T25SP664)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'a347f594-3335-4261-9033-88e88bdf61b6', 'authenticated', 'authenticated', 't25sp664@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ZAYAN"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'a347f594-3335-4261-9033-88e88bdf61b6', 'a347f594-3335-4261-9033-88e88bdf61b6', format('{"sub":"%s","email":"%s"}', 'a347f594-3335-4261-9033-88e88bdf61b6', 't25sp664@gmail.com')::jsonb, 'email', 'a347f594-3335-4261-9033-88e88bdf61b6', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('a347f594-3335-4261-9033-88e88bdf61b6', 'ZAYAN', 't25sp664@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('a347f594-3335-4261-9033-88e88bdf61b6', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('a347f594-3335-4261-9033-88e88bdf61b6', 'T25SP664', now(), now());

    -- Teacher: ZEENATH MT (T25AG645)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '8a33054a-995a-4528-b906-ceb52ea0d7f4', 'authenticated', 'authenticated', 't25ag645@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ZEENATH MT"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '8a33054a-995a-4528-b906-ceb52ea0d7f4', '8a33054a-995a-4528-b906-ceb52ea0d7f4', format('{"sub":"%s","email":"%s"}', '8a33054a-995a-4528-b906-ceb52ea0d7f4', 't25ag645@gmail.com')::jsonb, 'email', '8a33054a-995a-4528-b906-ceb52ea0d7f4', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('8a33054a-995a-4528-b906-ceb52ea0d7f4', 'ZEENATH MT', 't25ag645@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('8a33054a-995a-4528-b906-ceb52ea0d7f4', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('8a33054a-995a-4528-b906-ceb52ea0d7f4', 'T25AG645', now(), now());

    -- Teacher: ZUHRA (T25AG630)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'dd22cf2a-5301-426c-ad06-601403cf9582', 'authenticated', 'authenticated', 't25ag630@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ZUHRA"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'dd22cf2a-5301-426c-ad06-601403cf9582', 'dd22cf2a-5301-426c-ad06-601403cf9582', format('{"sub":"%s","email":"%s"}', 'dd22cf2a-5301-426c-ad06-601403cf9582', 't25ag630@gmail.com')::jsonb, 'email', 'dd22cf2a-5301-426c-ad06-601403cf9582', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('dd22cf2a-5301-426c-ad06-601403cf9582', 'ZUHRA', 't25ag630@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('dd22cf2a-5301-426c-ad06-601403cf9582', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('dd22cf2a-5301-426c-ad06-601403cf9582', 'T25AG630', now(), now());

    -- Teacher: SONIA SAJI (T26MR858)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', 'c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', 'authenticated', 'authenticated', 't26mr858@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"SONIA SAJI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        'c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', 'c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', format('{"sub":"%s","email":"%s"}', 'c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', 't26mr858@gmail.com')::jsonb, 'email', 'c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', 'SONIA SAJI', 't26mr858@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('c1e4c0e9-82f6-4e56-a8cb-aedf8136e840', 'T26MR858', now(), now());

    -- Teacher: ARWA ALI (T26MR857)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '6cca369c-fdde-4256-a2b0-d44246fdcf9e', 'authenticated', 'authenticated', 't26mr857@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"ARWA ALI"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '6cca369c-fdde-4256-a2b0-d44246fdcf9e', '6cca369c-fdde-4256-a2b0-d44246fdcf9e', format('{"sub":"%s","email":"%s"}', '6cca369c-fdde-4256-a2b0-d44246fdcf9e', 't26mr857@gmail.com')::jsonb, 'email', '6cca369c-fdde-4256-a2b0-d44246fdcf9e', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('6cca369c-fdde-4256-a2b0-d44246fdcf9e', 'ARWA ALI', 't26mr857@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('6cca369c-fdde-4256-a2b0-d44246fdcf9e', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('6cca369c-fdde-4256-a2b0-d44246fdcf9e', 'T26MR857', now(), now());

    -- Teacher: DIYA MIRZA ASHRAD (T26MR859)
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '02767e48-a9cb-4b48-b763-ecaabd0b5d04', 'authenticated', 'authenticated', 't26mr859@gmail.com', 
        extensions.crypt('Teacher@Edusolve', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"DIYA MIRZA ASHRAD"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '02767e48-a9cb-4b48-b763-ecaabd0b5d04', '02767e48-a9cb-4b48-b763-ecaabd0b5d04', format('{"sub":"%s","email":"%s"}', '02767e48-a9cb-4b48-b763-ecaabd0b5d04', 't26mr859@gmail.com')::jsonb, 'email', '02767e48-a9cb-4b48-b763-ecaabd0b5d04', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('02767e48-a9cb-4b48-b763-ecaabd0b5d04', 'DIYA MIRZA ASHRAD', 't26mr859@gmail.com');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('02767e48-a9cb-4b48-b763-ecaabd0b5d04', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('02767e48-a9cb-4b48-b763-ecaabd0b5d04', 'T26MR859', now(), now());

END $$;