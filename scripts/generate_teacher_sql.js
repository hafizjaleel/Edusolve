import fs from 'fs';
import crypto from 'crypto';

const teachers = JSON.parse(fs.readFileSync('./data_collection/teachers_master.json', 'utf8'));
const password = 'Teacher@Edusolve';

let sql = `-- Teacher Injection SQL (Fixed - V4 - No Duplicates)
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    teacher_role_id UUID;
BEGIN
    SELECT id INTO teacher_role_id FROM public.roles WHERE code = 'teacher';
    IF teacher_role_id IS NULL THEN
        RAISE EXCEPTION 'Teacher role not found';
    END IF;

`;

const seenIds = new Set();
let count = 0;
let duplicates = 0;

// Process teachers
teachers.forEach(t => {
    const teacherId = (t['Teacher ID'] || 'UNKNOWN').trim().toUpperCase();
    
    if (seenIds.has(teacherId)) {
        duplicates++;
        return;
    }
    seenIds.add(teacherId);

    const id = crypto.randomUUID();
    const name = (t['Teacher Nmae'] || 'Unknown').replace(/'/g, "''").trim();
    const email = `${teacherId.toLowerCase()}@gmail.com`;

    sql += `    -- Teacher: ${name} (${teacherId})
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', '${id}', 'authenticated', 'authenticated', '${email}', 
        extensions.crypt('${password}', extensions.gen_salt('bf')), now(), 
        '{"provider":"email","providers":["email"]}', '{"role":"teacher","full_name":"${name}"}', 
        now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        '${id}', '${id}', format('{"sub":"%s","email":"%s"}', '${id}', '${email}')::jsonb, 'email', '${id}', now(), now(), now()
    );

    INSERT INTO public.users (id, full_name, email)
    VALUES ('${id}', '${name}', '${email}');

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES ('${id}', teacher_role_id);

    INSERT INTO public.teacher_profiles (user_id, teacher_code, created_at, updated_at)
    VALUES ('${id}', '${teacherId}', now(), now());

`;
    count++;
});

sql += `END $$;`;

fs.writeFileSync('./data_collection/inject_teachers.sql', sql);
console.log('SQL generated: ./data_collection/inject_teachers.sql');
console.log(`Summary: ${count} teachers added, ${duplicates} duplicates skipped.`);
