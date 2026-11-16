const db = require('../db');

const FIELDS = `f.id, f.owner_id, f.name, f.municipio, f.departamento, f.altitud_msnm,
  f.variedades, f.description, f.status, f.created_at, u.name AS owner_name`;

async function listApproved({ departamento, q } = {}) {
  const params = [];
  let sql = `SELECT ${FIELDS} FROM fincas f JOIN users u ON u.id = f.owner_id WHERE f.status = 'aprobada'`;
  if (departamento) {
    params.push(departamento);
    sql += ` AND f.departamento = $${params.length}`;
  }
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    sql += ` AND (LOWER(f.name) LIKE $${params.length} OR LOWER(f.municipio) LIKE $${params.length})`;
  }
  sql += ' ORDER BY f.name';
  const { rows } = await db.query(sql, params);
  return rows;
}

async function listByOwner(ownerId) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} FROM fincas f JOIN users u ON u.id = f.owner_id
     WHERE f.owner_id = $1 ORDER BY f.created_at DESC`,
    [ownerId]
  );
  return rows;
}

async function listByStatus(status) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} FROM fincas f JOIN users u ON u.id = f.owner_id
     WHERE f.status = $1 ORDER BY f.created_at`,
    [status]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} FROM fincas f JOIN users u ON u.id = f.owner_id WHERE f.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function listDepartamentos() {
  const { rows } = await db.query(
    "SELECT DISTINCT departamento FROM fincas WHERE status = 'aprobada' ORDER BY departamento"
  );
  return rows.map((r) => r.departamento);
}

async function create(ownerId, f) {
  const { rows } = await db.query(
    `INSERT INTO fincas (owner_id, name, municipio, departamento, altitud_msnm, variedades, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [ownerId, f.name, f.municipio, f.departamento, f.altitud_msnm, f.variedades, f.description]
  );
  return findById(rows[0].id);
}

async function update(id, f) {
  await db.query(
    `UPDATE fincas SET name = $2, municipio = $3, departamento = $4, altitud_msnm = $5,
       variedades = $6, description = $7
     WHERE id = $1`,
    [id, f.name, f.municipio, f.departamento, f.altitud_msnm, f.variedades, f.description]
  );
  return findById(id);
}

async function setStatus(id, status) {
  await db.query('UPDATE fincas SET status = $2 WHERE id = $1', [id, status]);
  return findById(id);
}

module.exports = { listApproved, listByOwner, listByStatus, findById, listDepartamentos, create, update, setStatus };
