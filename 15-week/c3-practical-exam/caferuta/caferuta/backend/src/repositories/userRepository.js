const db = require('../db');

const PUBLIC_FIELDS = 'id, name, email, role, created_at';

async function findByEmail(email) {
  const { rows } = await db.query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await db.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function create({ name, email, passwordHash, role }) {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)
     RETURNING ${PUBLIC_FIELDS}`,
    [name, email, passwordHash, role]
  );
  return rows[0];
}

module.exports = { findByEmail, findById, create };
