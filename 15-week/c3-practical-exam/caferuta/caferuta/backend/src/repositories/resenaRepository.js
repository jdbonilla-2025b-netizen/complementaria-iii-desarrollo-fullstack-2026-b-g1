const db = require('../db');

async function listByFinca(fincaId) {
  const { rows } = await db.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS author
     FROM resenas r JOIN users u ON u.id = r.user_id
     WHERE r.finca_id = $1 ORDER BY r.created_at DESC`,
    [fincaId]
  );
  return rows;
}

async function exists(fincaId, userId) {
  const { rows } = await db.query('SELECT id FROM resenas WHERE finca_id = $1 AND user_id = $2', [fincaId, userId]);
  return rows.length > 0;
}

async function create({ fincaId, userId, rating, comment }) {
  const { rows } = await db.query(
    'INSERT INTO resenas (finca_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING id, rating, comment, created_at',
    [fincaId, userId, rating, comment]
  );
  return rows[0];
}

// { fincaId: { average, count } } para pintar las estrellas en el catálogo.
async function summaries() {
  const { rows } = await db.query('SELECT finca_id, rating FROM resenas');
  const acc = {};
  for (const r of rows) {
    acc[r.finca_id] = acc[r.finca_id] || { total: 0, count: 0 };
    acc[r.finca_id].total += Number(r.rating);
    acc[r.finca_id].count += 1;
  }
  const out = {};
  for (const [id, { total, count }] of Object.entries(acc)) {
    out[id] = { average: Math.round((total / count) * 10) / 10, count };
  }
  return out;
}

module.exports = { listByFinca, exists, create, summaries };
