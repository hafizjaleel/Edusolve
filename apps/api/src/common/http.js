export function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.WEB_ORIGIN || 'http://localhost:5173',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role, x-user-id, Accept, Origin',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

export function getBearerToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice('Bearer '.length).trim();
}
