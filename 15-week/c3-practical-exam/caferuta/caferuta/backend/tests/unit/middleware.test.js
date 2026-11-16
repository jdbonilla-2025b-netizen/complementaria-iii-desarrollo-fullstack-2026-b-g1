// PRUEBA UNITARIA: prueba los middlewares aislados, sin Express, sin red
// y sin base de datos. req/res/next son objetos falsos (mocks).
const { authenticate, authorize } = require('../../src/auth/middleware');
const { signAccessToken } = require('../../src/auth/jwt');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('authenticate (autenticación)', () => {
  test('acepta un token válido y deja el usuario en req.user', () => {
    const token = signAccessToken({ id: 4, role: 'visitante', name: 'Laura' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();

    authenticate(req, mockRes(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 4, role: 'visitante', name: 'Laura' });
  });

  test('responde 401 si no hay cabecera Authorization', () => {
    const res = mockRes();
    const next = jest.fn();

    authenticate({ headers: {} }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('responde 401 si alguien altera el token (por ejemplo, para hacerse admin)', () => {
    const token = signAccessToken({ id: 4, role: 'visitante', name: 'Laura' });
    const [header, , signature] = token.split('.');
    const fakePayload = Buffer.from(JSON.stringify({ sub: '4', role: 'admin', iss: 'caferuta-api' })).toString('base64url');
    const req = { headers: { authorization: `Bearer ${header}.${fakePayload}.${signature}` } };
    const res = mockRes();

    authenticate(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
  });
});

describe('authorize (autorización por rol)', () => {
  test('deja pasar a un caficultor en una ruta de caficultores', () => {
    const next = jest.fn();
    authorize('caficultor')({ user: { id: 2, role: 'caficultor' } }, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  test('responde 403 a un visitante autenticado en una ruta de admin', () => {
    const res = mockRes();
    const next = jest.fn();
    authorize('admin')({ user: { id: 4, role: 'visitante' } }, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
