const fs = require('fs');
const crypto = require('crypto');

const acConfigs = [
    {
        name: "AC2",
        email: "edusolve2ac@gmail.com",
        id: 'e2222222-2222-4222-a222-222222222222',
        jsonPath: 'e:/Qubes/Edusolve/data_collection/AC2_data.json',
        sheet: 'Sheet1',
        mapping: (row) => ({
            name: row["student_name"],
            code: row["student_code"],
            country: row["country_code"],
            contact: row["contact_number"],
            parent_phone: row["parent_phone"],
            alt: row["alternative_number"],
            level: row["class_level"],
            board: row["board"],
            medium: row["medium"],
            pkg: row["package_name"],
            hours: row["total_hours"],
            status: row["status"],
            joined: row["joined_at"],
            source: row["source"]
        })
    },
    {
        name: "AC4",
        email: "edusolve4ac@gmail.com",
        id: 'e4444444-4444-4444-a444-444444444444',
        jsonPath: 'e:/Qubes/Edusolve/data_collection/ac4_data.json',
        sheet: 'Sheet1',
        skipRows: 1, // First row is headers in the JSON array
        mapping: (row) => ({
            name: row["__EMPTY"],
            code: row["__EMPTY_1"],
            country: row["__EMPTY_3"],
            contact: row["__EMPTY_4"],
            alt: row["__EMPTY_5"],
            parent_phone: row["__EMPTY_6"],
            level: row["__EMPTY_7"],
            board: row["__EMPTY_9"],
            medium: row["__EMPTY_10"],
            pkg: row["__EMPTY_11"],
            hours: 20, // Defaulting if not found or using remaining?
            status: row["__EMPTY_13"],
            joined: row["__EMPTY_14"],
            source: row["__EMPTY_15"]
        })
    },
    {
        name: "AC6",
        email: "edusolve6ac@gmail.com",
        id: 'e6666666-6666-4666-a666-666666666666',
        jsonPath: 'e:/Qubes/Edusolve/data_collection/AC6_data.json',
        sheet: 'students_master (1)',
        mapping: (row) => ({
            name: row["student_name"],
            code: row["student_code"],
            country: row["country_code"],
            contact: row["contact_number"],
            alt: row["alternative_number"],
            level: row["class_level"],
            board: row["board"],
            medium: row["medium"],
            pkg: row["package_name"],
            hours: row["total_hours"],
            status: row["status"],
            joined: row["joined_at"],
            source: row["source"]
        })
    },
    {
        name: "AC8",
        email: "edusolve8ac@gmail.com",
        id: 'e8888888-8888-4888-a888-888888888888',
        jsonPath: 'e:/Qubes/Edusolve/data_collection/AC8_data.json',
        sheet: 'Sheet1',
        mapping: (row) => ({
            name: row["student_name"],
            code: row["student_code"],
            country: row["Country_code"],
            contact: row["Contact_number"],
            alt: row["Alternative_number"],
            parent_phone: row["Parent_phone"],
            level: row["Class_level"],
            board: row["Board"],
            medium: row["Medium"],
            pkg: row["Package_name"],
            hours: row["Total_hours"],
            status: row["Status"],
            joined: row["Joined_at"],
            source: row["source"]
        })
    }
];

const PASS_HASH = "extensions.crypt('AC@Edusolve123', extensions.gen_salt('bf'))";

function excelDateToISO(serial) {
    if (!serial) return 'now()';
    let d;
    if (typeof serial === 'string') {
        const parts = serial.split('/');
        if (parts.length === 3) {
            d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        } else if (serial.split('-').length === 3) {
            d = new Date(serial);
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

let fullSql = `-- Consolidated Direct Injection for AC2, AC4, AC6, AC8
DO $$
DECLARE
    ac_role_id UUID;
BEGIN
    SELECT id INTO ac_role_id FROM public.roles WHERE code = 'academic_coordinator';
    IF ac_role_id IS NULL THEN RAISE EXCEPTION 'Required role not found'; END IF;
`;

acConfigs.forEach(ac => {
    fullSql += `\n    -- Processing ${ac.name} --\n`;
    
    // AC Account
    fullSql += `    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '${ac.email}') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES ('${ac.id}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${ac.email}', ${PASS_HASH}, now(), '{"provider":"email","providers":["email"]}', '{"role":"academic_coordinator","full_name":"${ac.name}"}', now(), now());
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES ('${ac.id}', '${ac.id}', format('{"sub":"%s","email":"%s"}', '${ac.id}', '${ac.email}')::jsonb, 'email', '${ac.id}', now(), now(), now());
        INSERT INTO public.users (id, full_name, email) VALUES ('${ac.id}', '${ac.name}', '${ac.email}');
        INSERT INTO public.user_roles (user_id, role_id) VALUES ('${ac.id}', ac_role_id);
    END IF;\n`;

    const jsonData = JSON.parse(fs.readFileSync(ac.jsonPath, 'utf8'));
    let rows = jsonData[ac.sheet] || [];
    if (ac.skipRows) rows = rows.slice(ac.skipRows);

    rows.forEach((row, i) => {
        const m = ac.mapping(row);
        if (!m.name || !m.code) return; // Skip empty rows

        const studentId = `5${ac.name.slice(-1)}${i.toString().padStart(6, '0')}-0000-4000-8000-${i.toString(16).padStart(12, '0')}`;
        const joinedAt = excelDateToISO(m.joined);
        
        const cc = m.country ? String(m.country).trim() : "";
        const cRaw = m.contact ? String(m.contact).trim() : "";
        const contact = (cc + cRaw).replace(/ /g, "");
        const parentPhone = m.parent_phone ? String(m.parent_phone).replace(/ /g, "") : null;
        const altNumber = m.alt ? String(m.alt).replace(/ /g, "") : null;

        const contactVal = contact ? `'${contact}'` : 'NULL';
        const parentPhoneVal = parentPhone ? `'${parentPhone}'` : 'NULL';
        const altNumberVal = altNumber ? `'${altNumber}'` : 'NULL';

        let rStatus = (m.status || 'active').toLowerCase().trim();
        let status = 'inactive';
        if (rStatus.includes('active')) status = 'active';
        else if (rStatus.includes('vacation')) status = 'vacation';

        fullSql += `    INSERT INTO public.students (id, academic_coordinator_id, student_name, student_code, contact_number, parent_phone, alternative_number, messaging_number, class_level, board, medium, package_name, total_hours, remaining_hours, status, joined_at, source, created_at, updated_at)
    VALUES ('${studentId}', '${ac.id}', '${(m.name || '').replace(/'/g, "''").trim()}', '${m.code.trim()}', ${contactVal}, ${parentPhoneVal}, ${altNumberVal}, 'contact', '${String(m.level || '').trim()}', '${String(m.board || '').trim()}', '${String(m.medium || '').trim()}', '${String(m.pkg || '').trim()}', ${parseFloat(m.hours) || 0}, ${parseFloat(m.hours) || 0}, '${status}', ${joinedAt === 'now()' ? 'now()' : "'" + joinedAt + "'"}, '${m.source || 'Import'}', now(), now())
    ON CONFLICT (student_code) DO UPDATE SET academic_coordinator_id = EXCLUDED.academic_coordinator_id, student_name = EXCLUDED.student_name, contact_number = EXCLUDED.contact_number, parent_phone = EXCLUDED.parent_phone, alternative_number = EXCLUDED.alternative_number, class_level = EXCLUDED.class_level, board = EXCLUDED.board, medium = EXCLUDED.medium, package_name = EXCLUDED.package_name, total_hours = EXCLUDED.total_hours, remaining_hours = EXCLUDED.remaining_hours, status = EXCLUDED.status, updated_at = now();\n`;
    });
});

fullSql += `\nEND $$;`;

fs.writeFileSync('e:/Qubes/Edusolve/data_collection/inject_batch_remaining.sql', fullSql);
console.log('Success: SQL written to e:/Qubes/Edusolve/data_collection/inject_batch_remaining.sql');
