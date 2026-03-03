import { createClient } from '@supabase/supabase-js';
import { env } from './src/config/env.js';
import { WaappaService } from './src/waappa/waappa.service.js';

const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
const waappaService = new WaappaService();

async function syncWebhooks() {
    console.log('Fetching active sessions...');
    const { data: sessions, error } = await supabase
        .from('whatsapp_sessions')
        .select('session_name, webhook_url')
        .not('status', 'eq', 'STOPPED');

    if (error) {
        console.error('Error fetching sessions:', error);
        return;
    }

    if (!sessions || sessions.length === 0) {
        console.log('No active sessions found to sync.');
        return;
    }

    console.log(`Found ${sessions.length} active sessions. Syncing webhooks...`);

    for (const session of sessions) {
        try {
            console.log(`Syncing ${session.session_name}...`);
            await waappaService.configureWebhookEvents(session.session_name, session.webhook_url);
            console.log(`✅ ${session.session_name} webhooks synced successfully.`);
        } catch (err) {
            console.error(`❌ Failed to sync ${session.session_name}:`, err.message);
        }
    }

    console.log('Done.');
}

syncWebhooks();
