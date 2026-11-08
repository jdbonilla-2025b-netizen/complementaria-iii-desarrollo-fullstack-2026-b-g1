const { test, before, after } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const { createApp } = require('./app');

const SECRET = 'test-secret';
let server, base;

before(async () => {
  const app = createApp({ secret: SECRET, allowedOrigin: 'http://localhost:5173' });
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const login = (username, password) =>
  fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

test('login correcto devuelve un token', async () => {
  const res = await login('gamer', '1234');
  assert.strictEqual(res.status, 200);
  assert.ok((await res.json()).token);
});

test('CASO DE ERROR: login con clave incorrecta devuelve 401', async () => {
  const res = await login('gamer', 'mala');
  assert.strictEqual(res.status, 401);
});

test('CASO DE ERROR: /api/consoles sin token devuelve 401', async () => {
  const res = await fetch(`${base}/api/consoles`);
  assert.strictEqual(res.status, 401);
});

test('CASO DE ERROR: token firmado con otro secreto devuelve 401', async () => {
  const fake = jwt.sign({ sub: 'gamer' }, 'otro-secreto');
  const res = await fetch(`${base}/api/consoles`, { headers: { Authorization: `Bearer ${fake}` } });
  assert.strictEqual(res.status, 401);
});

test('/api/consoles con token válido devuelve las consolas', async () => {
  const { token } = await (await login('gamer', '1234')).json();
  const res = await fetch(`${base}/api/consoles`, { headers: { Authorization: `Bearer ${token}` } });
  assert.strictEqual(res.status, 200);
  assert.ok((await res.json()).consoles.length > 0);
});

test('CORS: el preflight permite el origen del frontend', async () => {
  const res = await fetch(`${base}/api/consoles`, {
    method: 'OPTIONS',
    headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'GET' },
  });
  assert.strictEqual(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});
