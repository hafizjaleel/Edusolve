import { createClient } from '@supabase/supabase-js';
import pkg from 'dotenv';
const { config } = pkg;

config({ path: 'apps/api/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANONKEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in apps/api/.env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
    try {
        console.log("Checking DB...");

        const { data: contacts } = await supabase.from('whatsapp_contacts').select('*');
        console.log("Cached Maps (whatsapp_contacts):", contacts || "none");

        const { data: teachers } = await supabase.from('teacher_profiles').select('id, phone');
        console.log("Teacher phones:", teachers);

        const { data: students } = await supabase.from('students').select('id, messaging_number, contact_number, alternative_number, parent_phone').limit(5);
        console.log("Student phones (first 5):", students);

    } catch (e) {
        console.error("DB Check Failed:", e);
    }
}

checkDb();
