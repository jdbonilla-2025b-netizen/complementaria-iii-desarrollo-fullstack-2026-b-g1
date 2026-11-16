const db = require('../db');

const FIELDS = `t.id, t.finca_id, t.title, t.description, t.duration_hours, t.price_cop,
  t.capacity, t.active, f.owner_id, f.name AS finca_name, f.status AS finca_status`;

async function listByFinca(fincaId, { onlyActive = true } = {}) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} FROM tours t JOIN fincas f ON f.id = t.finca_id
     WHERE t.finca_id = $1 ${onlyActive ? 'AND t.active = TRUE' : ''} ORDER BY t.price_cop`,
    [fincaId]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} FROM tours t JOIN fincas f ON f.id = t.finca_id WHERE t.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function create(fincaId, t) {
  const { rows } = await db.query(
    `INSERT INTO tours (finca_id, title, description, duration_hours, price_cop, capacity)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [fincaId, t.title, t.description, t.duration_hours, t.price_cop, t.capacity]
  );
  return findById(rows[0].id);
}

async function update(id, t) {
  await db.query(
    `UPDATE tours SET title = $2, description = $3, duration_hours = $4, price_cop = $5,
       capacity = $6, active = $7
     WHERE id = $1`,
    [id, t.title, t.description, t.duration_hours, t.price_cop, t.capacity, t.active]
  );
  return findById(id);
}

async function remove(id) {
  await db.query('DELETE FROM tours WHERE id = $1', [id]);
}

module.exports = { listByFinca, findById, create, update, remove };
