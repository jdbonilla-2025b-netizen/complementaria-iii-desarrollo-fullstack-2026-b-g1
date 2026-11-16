// Crea una base PostgreSQL EN MEMORIA (pg-mem) con el esquema y los datos
// de demostración reales, y la conecta a la app. Así las pruebas de
// integración ejecutan SQL de verdad sin instalar PostgreSQL.
const fs = require('fs');
const path = require('path');
const { newDb } = require('pg-mem');
const db = require('../../src/db');

function createTestDb() {
  const mem = newDb();
  const schema = fs.readFileSync(path.join(__dirname, '../../db/schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, '../../db/seed.sql'), 'utf8');
  mem.public.none(schema);
  mem.public.none(seed);

  const { Pool } = mem.adapters.createPg();
  db.setPool(new Pool());
  return mem.backup(); // permite restaurar el estado inicial entre pruebas
}

module.exports = { createTestDb, PASSWORD: 'Cafe2026!' };
