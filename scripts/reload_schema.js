
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function reloadSchema() {
    console.log('Reloading Supabase schema cache...');

    const { error } = await supabase.rpc('exec_sql', {
        sql: "NOTIFY pgrst, 'reload config';"
    });

    if (error) {
        console.error('Error reloading schema:', error.message);
    } else {
        console.log('Schema cache reload notified.');
    }
}

reloadSchema();
