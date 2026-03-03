import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANONKEY || process.env.SUPABASE_ANON_KEY);

async function check() {
    const { data: cachedContact } = await supabase
        .from('whatsapp_contacts')
        .select('*');
    console.log("whatsapp_contacts records:", cachedContact);
    
    const { data: teacherData } = await supabase
        .from('teacher_profiles')
        .select('*');
    console.log("teacher_profiles records:", teacherData);
    
    // Test the logic using exact phone
    const testJid = "57690067845318@lid"; // from your logs
    let contactJidRaw = testJid;
    let cleanPhone = contactJidRaw;
    
    // mock resolving lid to pn... let's just pretend Waappa resolved it
    const resolvedPn = "918086251335@c.us"; // assuming this is what Waappa returns
    
    cleanPhone = resolvedPn;
    
    const last10 = cleanPhone.split('@')[0].replace(/[^0-9]/g, '').slice(-10);
    console.log("Extracted last10:", last10); // should be 8086251335
    
    const { data: stData } = await supabase
                    .from('students')
                    .select('id, messaging_number, contact_number, alternative_number, parent_phone')
                    .or([
                        `contact_number.ilike.%${last10}`,
                        `alternative_number.ilike.%${last10}`,
                        `parent_phone.ilike.%${last10}`
                    ].join(','));
                    
    console.log("matched students:", stData);
    
    const { data: tData } = await supabase
                        .from('teacher_profiles')
                        .select('id, phone')
                        .ilike('phone', `%${last10}`)
                        .maybeSingle();

    console.log("matched teachers:", tData);
    
}
check();
