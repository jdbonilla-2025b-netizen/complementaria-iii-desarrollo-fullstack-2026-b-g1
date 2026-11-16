const db = require('../db');

// Normaliza la columna DATE a "YYYY-MM-DD" sin importar el driver.
function fmt(row) {
  if (!row) return row;
  const d = row.date;
  return { ...row, date: d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10) };
}

const FIELDS = `r.id, r.tour_id, r.user_id, r.date, r.people, r.total_cop, r.status, r.created_at,
  t.title AS tour_title, f.id AS finca_id, f.name AS finca_name, f.municipio, f.owner_id,
  u.name AS visitante_name, u.email AS visitante_email`;

const FROM = `FROM reservas r
  JOIN tours t ON t.id = r.tour_id
  JOIN fincas f ON f.id = t.finca_id
  JOIN users u ON u.id = r.user_id`;

// Personas ya reservadas (pendientes o confirmadas) para un tour en una fecha.
async function bookedPeople(tourId, date) {
  const { rows } = await db.query(
    `SELECT people FROM reservas
     WHERE tour_id = $1 AND date = $2 AND status IN ('pendiente', 'confirmada')`,
    [tourId, date]
  );
  return rows.reduce((sum, r) => sum + Number(r.people), 0);
}

async function findById(id) {
  const { rows } = await db.query(`SELECT ${FIELDS} ${FROM} WHERE r.id = $1`, [id]);
  return fmt(rows[0] || null);
}

async function create({ tourId, userId, date, people, totalCop }) {
  const { rows } = await db.query(
    `INSERT INTO reservas (tour_id, user_id, date, people, total_cop)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [tourId, userId, date, people, totalCop]
  );
  return findById(rows[0].id);
}

async function listByUser(userId) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} ${FROM} WHERE r.user_id = $1 ORDER BY r.date DESC`,
    [userId]
  );
  return rows.map(fmt);
}

// Reservas recibidas en las fincas de un caficultor.
async function listForOwner(ownerId) {
  const { rows } = await db.query(
    `SELECT ${FIELDS} ${FROM} WHERE f.owner_id = $1 ORDER BY r.date`,
    [ownerId]
  );
  return rows.map(fmt);
}

async function setStatus(id, status) {
  await db.query('UPDATE reservas SET status = $2 WHERE id = $1', [id, status]);
  return findById(id);
}

async function hasConfirmedAtFinca(userId, fincaId) {
  const { rows } = await db.query(
    `SELECT r.id FROM reservas r JOIN tours t ON t.id = r.tour_id
     WHERE r.user_id = $1 AND t.finca_id = $2 AND r.status = 'confirmada'`,
    [userId, fincaId]
  );
  return rows.length > 0;
}

module.exports = { bookedPeople, findById, create, listByUser, listForOwner, setStatus, hasConfirmedAtFinca };
