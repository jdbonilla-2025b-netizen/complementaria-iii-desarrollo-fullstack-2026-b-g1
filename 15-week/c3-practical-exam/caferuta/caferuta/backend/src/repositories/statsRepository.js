const db = require('../db');

async function count(sql) {
  const { rows } = await db.query(sql);
  return Number(rows[0].n);
}

async function overview() {
  const [usuarios, fincasAprobadas, fincasPendientes, tours, reservas] = await Promise.all([
    count('SELECT COUNT(*) AS n FROM users'),
    count("SELECT COUNT(*) AS n FROM fincas WHERE status = 'aprobada'"),
    count("SELECT COUNT(*) AS n FROM fincas WHERE status = 'pendiente'"),
    count('SELECT COUNT(*) AS n FROM tours WHERE active = TRUE'),
    count("SELECT COUNT(*) AS n FROM reservas WHERE status IN ('pendiente', 'confirmada')"),
  ]);
  const { rows } = await db.query("SELECT total_cop FROM reservas WHERE status = 'confirmada'");
  const ingresosConfirmadosCop = rows.reduce((s, r) => s + Number(r.total_cop), 0);
  return { usuarios, fincasAprobadas, fincasPendientes, tours, reservas, ingresosConfirmadosCop };
}

module.exports = { overview };
