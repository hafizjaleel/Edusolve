import { createClient } from '@supabase/supabase-js';
import { env } from './src/config/env.js';

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

async function test() {
    // try a raw insert with minimal data
    const { data, error } = await supabase.from('whatsapp_messages').upsert({
        id: 'test_msg_id_' + Date.now(),
        session_name: 'test_session',
        timestamp: Math.floor(Date.now() / 1000),
        from_jid: '123@c.us',
        to_jid: '456@c.us',
        from_me: false,
        body: 'test body',
        contact_phone: '8139046545',
        contact_type: 'teacher'
    });
    console.log('Result:', data);
    console.log('Error:', error);
}
test();
