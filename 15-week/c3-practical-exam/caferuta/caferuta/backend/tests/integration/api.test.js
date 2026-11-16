// PRUEBAS DE INTEGRACIÓN: levantan la app Express completa (rutas, CORS,
// middlewares, validación, SQL) y le hacen peticiones HTTP reales con
// Supertest contra una base PostgreSQL en memoria con los datos de demo.
const request = require('supertest');
const { createTestDb, PASSWORD } = require('../helpers/testDb');
const app = require('../../src/app');

let backup;
beforeAll(() => {
  backup = createTestDb();
});
beforeEach(() => backup.restore());

async function loginAs(email) {
  const res = await request(app).post('/api/auth/login').send({ email, password: PASSWORD });
  return res.body.token;
}
const bearer = (token) => ({ Authorization: `Bearer ${token}` });
const futureDate = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);

describe('Login y endpoint protegido', () => {
  test('login correcto devuelve un JWT y los datos públicos del usuario', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'laura@caferuta.co', password: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.token.split('.')).toHaveLength(3);
    expect(res.body.user).toEqual({ id: 4, name: 'Laura Gómez', email: 'laura@caferuta.co', role: 'visitante' });
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('clave incorrecta -> 401 con mensaje genérico', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'laura@caferuta.co', password: 'otra123456' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Correo o contraseña incorrectos');
  });

  test('GET /api/reservas/mine sin token -> 401; con token -> solo mis reservas', async () => {
    expect((await request(app).get('/api/reservas/mine')).status).toBe(401);

    const token = await loginAs('laura@caferuta.co');
    const res = await request(app).get('/api/reservas/mine').set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body.every((r) => r.user_id === 4)).toBe(true);
  });

  test('nadie puede registrarse como admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Intruso', email: 'x@x.co', password: 'Clave12345', role: 'admin' });
    expect(res.status).toBe(400);
  });
});

describe('Autorización por rol y por propiedad', () => {
  test('un visitante no entra al panel de admin (403)', async () => {
    const token = await loginAs('laura@caferuta.co');
    const res = await request(app).get('/api/admin/stats').set(bearer(token));
    expect(res.status).toBe(403);
  });

  test('un caficultor NO puede editar la finca de otro caficultor (403)', async () => {
    const jorge = await loginAs('jorge@caferuta.co');
    // La finca 3 (Alto de la Neblina) es de Marta
    const res = await request(app)
      .put('/api/fincas/3')
      .set(bearer(jorge))
      .send({
        name: 'Hackeada', municipio: 'X', departamento: 'Huila', altitud_msnm: 1500,
        variedades: 'X', description: 'Intento de modificar una finca ajena',
      });
    expect(res.status).toBe(403);
  });

  test('flujo completo: caficultor registra finca, queda pendiente, admin la aprueba y aparece en el catálogo', async () => {
    const marta = await loginAs('marta@caferuta.co');
    const created = await request(app)
      .post('/api/fincas')
      .set(bearer(marta))
      .send({
        name: 'Finca El Mirador', municipio: 'Filandia', departamento: 'Quindío', altitud_msnm: 1900,
        variedades: 'Castillo', description: 'Mirador sobre el cañón del río Barbas con cafetal joven.',
      });
    expect(created.status).toBe(201);
    expect(created.body.status).toBe('pendiente');

    const before = await request(app).get('/api/fincas');
    expect(before.body.map((f) => f.name)).not.toContain('Finca El Mirador');

    const admin = await loginAs('admin@caferuta.co');
    const approved = await request(app)
      .patch(`/api/admin/fincas/${created.body.id}/status`)
      .set(bearer(admin))
      .send({ status: 'aprobada' });
    expect(approved.status).toBe(200);

    const after = await request(app).get('/api/fincas');
    expect(after.body.map((f) => f.name)).toContain('Finca El Mirador');
  });
});

describe('Reservas', () => {
  test('un visitante reserva y el caficultor dueño la confirma', async () => {
    const andres = await loginAs('andres@caferuta.co');
    const reserva = await request(app)
      .post('/api/reservas')
      .set(bearer(andres))
      .send({ tour_id: 2, date: futureDate, people: 2 });

    expect(reserva.status).toBe(201);
    expect(reserva.body.total_cop).toBe(120000);
    expect(reserva.body.status).toBe('pendiente');

    const marta = await loginAs('marta@caferuta.co'); // no es dueña del tour 2
    const ajena = await request(app)
      .patch(`/api/reservas/${reserva.body.id}/status`)
      .set(bearer(marta))
      .send({ status: 'confirmada' });
    expect(ajena.status).toBe(403);

    const jorge = await loginAs('jorge@caferuta.co'); // dueño de Hacienda Monteverde
    const ok = await request(app)
      .patch(`/api/reservas/${reserva.body.id}/status`)
      .set(bearer(jorge))
      .send({ status: 'confirmada' });
    expect(ok.status).toBe(200);
    expect(ok.body.status).toBe('confirmada');
  });

  test('no se puede reservar más personas que los cupos libres (409)', async () => {
    const andres = await loginAs('andres@caferuta.co');
    // Tour 4 tiene capacidad 6
    const res = await request(app)
      .post('/api/reservas')
      .set(bearer(andres))
      .send({ tour_id: 4, date: futureDate, people: 7 });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('Solo quedan 6 cupos para esa fecha');
  });
});

describe('CORS', () => {
  test('preflight desde el origen del frontend devuelve las cabeceras CORS', async () => {
    const res = await request(app)
      .options('/api/reservas')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Authorization, Content-Type');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-headers']).toMatch(/Authorization/);
  });

  test('un origen desconocido no recibe Access-Control-Allow-Origin', async () => {
    const res = await request(app).get('/api/fincas').set('Origin', 'https://sitio-malicioso.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
