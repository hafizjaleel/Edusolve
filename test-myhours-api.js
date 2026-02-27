const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/api/.env' });

async function run() {
  const tokenUrl = 'http://localhost:4000/auth/login';
  const loginRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'hmhdthoalib7@gmail.com', password: 'password123', role: 'teacher' })
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginData);

  if (loginData.token) {
    const hoursRes = await fetch('http://localhost:4000/teachers/my-hours', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    const hoursData = await hoursRes.json();
    console.log('Hours Response:', hoursData);
  }
}
run();
