-- Login Fix for AC2, AC4, AC6, AC8
DO $$
BEGIN
    -- Ensure AC2 user is correctly configured
    UPDATE auth.users 
    SET encrypted_password = extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = '',
        recovery_token = '',
        email_change_token_new = '',
        email_change = '',
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"role":"academic_coordinator","full_name":"AC2"}'
    WHERE email = 'edusolve2ac@gmail.com';

    -- Ensure AC4 user is correctly configured
    UPDATE auth.users 
    SET encrypted_password = extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = '',
        recovery_token = '',
        email_change_token_new = '',
        email_change = '',
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"role":"academic_coordinator","full_name":"AC4"}'
    WHERE email = 'edusolve4ac@gmail.com';

    -- Ensure AC6 user is correctly configured
    UPDATE auth.users 
    SET encrypted_password = extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = '',
        recovery_token = '',
        email_change_token_new = '',
        email_change = '',
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"role":"academic_coordinator","full_name":"AC6"}'
    WHERE email = 'edusolve6ac@gmail.com';

    -- Ensure AC8 user is correctly configured
    UPDATE auth.users 
    SET encrypted_password = extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = '',
        recovery_token = '',
        email_change_token_new = '',
        email_change = '',
        raw_app_meta_data = '{"provider":"email","providers":["email"]}',
        raw_user_meta_data = '{"role":"academic_coordinator","full_name":"AC8"}'
    WHERE email = 'edusolve8ac@gmail.com';

    -- Also check identities
    -- (Assuming they were already created, but let's make sure provider_id matches)
    UPDATE auth.identities SET identity_data = format('{"sub":"%s","email":"%s"}', user_id, 'edusolve2ac@gmail.com')::jsonb WHERE user_id = 'e2222222-2222-4222-a222-222222222222';
    UPDATE auth.identities SET identity_data = format('{"sub":"%s","email":"%s"}', user_id, 'edusolve4ac@gmail.com')::jsonb WHERE user_id = 'e4444444-4444-4444-a444-444444444444';
    UPDATE auth.identities SET identity_data = format('{"sub":"%s","email":"%s"}', user_id, 'edusolve6ac@gmail.com')::jsonb WHERE user_id = 'e6666666-6666-4666-a666-666666666666';
    UPDATE auth.identities SET identity_data = format('{"sub":"%s","email":"%s"}', user_id, 'edusolve8ac@gmail.com')::jsonb WHERE user_id = 'e8888888-8888-4888-a888-888888888888';

END $$;
