
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createRequestsTable() {
    console.log('Creating "requests" table...');

    // SQL to create the table
    // Note: RLS policies might be needed, but for now we rely on backend logic/admin client.
    const query = `
    CREATE TABLE IF NOT EXISTS public.requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      counselor_id UUID REFERENCES auth.users(id) NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
      resolution_note TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      resolved_at TIMESTAMPTZ
    );

    -- Enable RLS
    ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

    -- Policy: Counselors can see their own requests
    CREATE POLICY "Counselors can view own requests" 
    ON public.requests FOR SELECT 
    USING (auth.uid() = counselor_id);

    -- Policy: Counselors can insert their own requests
    CREATE POLICY "Counselors can create requests" 
    ON public.requests FOR INSERT 
    WITH CHECK (auth.uid() = counselor_id);

    -- Policy: Counselor Head/Admins can see all (handled via service role mainly, but good for client side if used)
    -- For now, the API uses service role, so RLS doesn't block it, but good practice.
  `;

    // We can't run raw SQL easily with JS client without a function. 
    // checking if rpc 'exec_sql' exists or similar. 
    // If not, we might have to instruct user. 
    // BUT, we can try to use the 'pg' library if we had connection string. 
    // For now, let's assume we can't easily run DDL from here without a helper.

    // ALTERNATIVE: Write to a file asking user to run it in SQL Editor.
    console.log('SQL to run in Supabase SQL Editor:');
    console.log(query);
}

createRequestsTable();
