
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from apps/api
dotenv.config({ path: path.resolve('apps', 'api', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking schema...');

    // Check 'mediums' table existence by selecting from it
    const { error: tableError } = await supabase.from('mediums').select('count', { count: 'exact', head: true });
    
    if (tableError && tableError.code === '42P01') { // 42P01 is undefined_table
        console.log('❌ "mediums" table is MISSING.');
    } else if (tableError) {
        console.error('Error checking mediums table:', tableError.message);
    } else {
        console.log('✅ "mediums" table EXISTS.');
    }

    // Check 'mediums' table content
    const { data: mediumData } = await supabase.from('mediums').select('*').limit(5);
    if(mediumData) {
        console.log('   Mediums found:', mediumData.map(m => m.name).join(', '));
    }

    // Check 'teacher_leads' table column 'mediums'
    // We can try to select 'mediums' from one row
    const { data: leads, error: colError } = await supabase.from('teacher_leads').select('mediums').limit(1);
    
    if (colError) {
        console.log('❌ "mediums" column in "teacher_leads" might be MISSING or error occurred:', colError.message);
    } else {
        console.log('✅ "mediums" column in "teacher_leads" EXISTS.');
    }
}

checkSchema();
