const { Client } = require('pg');
require('dotenv').config({ path: 'apps/api/.env' });

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query('ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_type text;');
    console.log('ALTER TABLE complete', res);
    await client.query('NOTIFY pgrst, \'reload schema\';');
    console.log('NOTIFY Sent');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
