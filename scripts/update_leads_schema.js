
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    console.log('Running migration to add email to leads...');

    // 1. Add email column to leads if not exists
    const { error: emailError } = await supabase.rpc('exec_sql', {
        sql: `
      alter table public.leads add column if not exists email text;
    `
    });

    if (emailError) {
        console.error('Error adding email column (might need raw SQL in dashboard):', emailError.message);
        console.log('SQL to run manually:\n ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text;');
    } else {
        console.log('Added email column to leads.');
    }

    console.log('Migration check complete.');
}

runMigration();
