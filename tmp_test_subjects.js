const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/subjects',
  method: 'GET',
  headers: {
    'x-user-role': 'academic_coordinator'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data);
  });
});

req.on('error', err => console.error('Error:', err.message));
req.end();
