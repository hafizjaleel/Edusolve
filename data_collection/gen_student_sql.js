const fs = require('fs');
const crypto = require('crypto');

const jsonData = JSON.parse(fs.readFileSync('C:/Users/HP/AppData/Local/Temp/AC5_data.json', 'utf8'));
const students = jsonData.Sheet1 || [];

const AC_NAME = "AC5";
const AC_EMAIL = "edusolve5ac@gmail.com";
const AC_ID = 'e5555555-5555-4555-a555-555555555555'; // Deterministic UUID for AC5
const PASSWORD_HASH = "extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf'))";

let sql = `-- Direct Student and AC Injection for AC5 (Pure Direct, No Finance/Leads)
-- Already Paid - Setting initial hours directly

DO $$
DECLARE
    ac_role_id UUID;
BEGIN
    SELECT id INTO ac_role_id FROM public.roles WHERE code = 'academic_coordinator';
    
    IF ac_role_id IS NULL THEN
        RAISE EXCEPTION 'Required Academic Coordinator role not found';
    END IF;

    -- Create AC User: ${AC_NAME}
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '${AC_EMAIL}') THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
            confirmation_token, recovery_token, email_change_token_new, email_change
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', '${AC_ID}', 'authenticated', 'authenticated', '${AC_EMAIL}', 
            ${PASSWORD_HASH}, now(), 
            '{"provider":"email","providers":["email"]}', '{"role":"academic_coordinator","full_name":"${AC_NAME}"}', 
            now(), now(), '', '', '', ''
        );

        INSERT INTO auth.identities (
            id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
        ) VALUES (
            '${AC_ID}', '${AC_ID}', format('{"sub":"%s","email":"%s"}', '${AC_ID}', '${AC_EMAIL}')::jsonb, 'email', '${AC_ID}', now(), now(), now()
        );

        INSERT INTO public.users (id, full_name, email)
        VALUES ('${AC_ID}', '${AC_NAME}', '${AC_EMAIL}');

        INSERT INTO public.user_roles (user_id, role_id)
        VALUES ('${AC_ID}', ac_role_id);
    END IF;

`;

function excelDateToISO(serial) {
    if (!serial) return 'now()';
    let d;
    if (typeof serial === 'string') {
        const parts = serial.split('/');
        if (parts.length === 3) {
            // new Date(year, monthIndex, day) - month is 0-indexed
            d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        } else {
            d = new Date(serial);
        }
    } else {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        d = new Date(utc_value * 1000);
    }
    
    if (isNaN(d.getTime())) return 'now()';
    return d.toISOString().split('T')[0];
}

students.forEach((s, index) => {
    // Generate unique UUID for student
    const studentId = `55${index.toString().padStart(6, '0')}-0000-4000-8000-${index.toString(16).padStart(12, '0')}`;
    
    // Date of joining
    const joinedAt = excelDateToISO(s["JOINED AT"]);
    
    // Phone numbers
    const countryCode = s["COUNTRY CODE"] ? String(s["COUNTRY CODE"]) : "";
    const contactRaw = s["CONTACT NUMBER"] ? String(s["CONTACT NUMBER"]) : "";
    const contact = (countryCode + contactRaw).replace(/ /g, "");
    
    const parentPhone = s["PARENT NUMBER"] ? String(s["PARENT NUMBER"]).replace(/ /g, "") : null;
    const altNumber = s["ALTERNATIVE NUMBER"] ? String(s["ALTERNATIVE NUMBER"]).replace(/ /g, "") : null;
    
    const studentCode = s["STUDENT CODE"] || `AC5-STU-${index + 1}`;

    const contactVal = contact ? `'${contact}'` : 'NULL';
    const parentPhoneVal = parentPhone ? `'${parentPhone}'` : 'NULL';
    const altNumberVal = altNumber ? `'${altNumber}'` : 'NULL';
    
    // Status normalization
    let rawStatus = (s["STATUS"] || 'active').toLowerCase().trim();
    let status = 'inactive';
    if (rawStatus.includes('active')) status = 'active';
    else if (rawStatus.includes('vacation')) status = 'vacation';
    
    sql += `    -- Student: ${s["STUDENT NAME"]}
    INSERT INTO public.students (
        id, academic_coordinator_id, student_name, student_code, 
        contact_number, parent_phone, alternative_number, messaging_number,
        class_level, board, medium, package_name, 
        total_hours, remaining_hours, status, 
        joined_at, source, created_at, updated_at
    ) VALUES (
        '${studentId}', '${AC_ID}', '${(s["STUDENT NAME"] || '').replace(/'/g, "''")}', '${studentCode}', 
        ${contactVal}, ${parentPhoneVal}, ${altNumberVal}, 'contact',
        '${s["CLASS LEVEL"] || ''}', '${s["BOARD"] || ''}', '${s["MEDIUM"] || ''}', '${s["PACKAGE NAME"] || ''}', 
        ${s["TOTAL HOURS"] || 0}, ${s["TOTAL HOURS"] || 0}, '${status}', 
        ${joinedAt === 'now()' ? 'now()' : "'" + joinedAt + "'"}, '${s["SOURCE"] || 'Import'}', now(), now()
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

`;
});

sql += `
END $$;
`;

fs.writeFileSync('e:/Qubes/Edusolve/data_collection/inject_AC5_students.sql', sql);
console.log('Success: SQL updated and written to e:/Qubes/Edusolve/data_collection/inject_AC5_students.sql');
