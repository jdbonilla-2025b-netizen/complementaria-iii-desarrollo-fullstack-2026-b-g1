const { Pool, types } = require('pg');
const config = require('./config');

// Las columnas DATE (OID 1082) se devuelven como texto "AAAA-MM-DD" para
// evitar que la zona horaria del servidor corra la fecha un día.
types.setTypeParser(1082, (value) => value);

// El pool se crea de forma perezosa. En las pruebas de integración se
// reemplaza por una base PostgreSQL en memoria (pg-mem) con setPool().
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: config.databaseUrl });
  }
  return pool;
}

module.exports = {
  query: (text, params) => getPool().query(text, params),
  setPool: (newPool) => {
    pool = newPool;
  },
};
