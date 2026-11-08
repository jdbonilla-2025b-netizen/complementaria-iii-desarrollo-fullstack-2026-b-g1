const { test } = require('node:test');
const assert = require('node:assert');
const { createApi } = require('./api');

const fakeFetch = (status, body) => async () => ({ ok: status < 400, status, json: async () => body });

test('login devuelve el token cuando el servidor responde 200', async () => {
  const api = createApi('http://x', fakeFetch(200, { token: 'abc' }));
  assert.strictEqual(await api.login('gamer', '1234'), 'abc');
});

test('CASO DE ERROR: login lanza error cuando el servidor responde 401', async () => {
  const api = createApi('http://x', fakeFetch(401, { error: 'Invalid credentials' }));
  await assert.rejects(() => api.login('gamer', 'mala'), /Invalid credentials/);
});

test('getConsoles envía el header Authorization con el token', async () => {
  let sent;
  const api = createApi('http://x', async (url, opts) => {
    sent = opts.headers.Authorization;
    return { ok: true, json: async () => ({ consoles: [{ id: 1 }] }) };
  });
  assert.deepStrictEqual(await api.getConsoles('tok'), [{ id: 1 }]);
  assert.strictEqual(sent, 'Bearer tok');
});

test('CASO DE ERROR: getConsoles sin token falla sin llamar a la red', async () => {
  const api = createApi('http://x', fakeFetch(200, {}));
  await assert.rejects(() => api.getConsoles(null), /iniciar sesión/);
});
