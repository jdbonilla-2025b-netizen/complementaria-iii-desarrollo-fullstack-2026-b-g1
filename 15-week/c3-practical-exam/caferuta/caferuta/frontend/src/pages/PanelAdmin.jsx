import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { Empty, ErrorBox, Loading } from '../components/States';
import { formatCOP } from '../utils/format';

function Stats() {
  const { data: s, loading, error, reload } = useApi('/api/admin/stats');
  if (loading) return <Loading text="Calculando indicadores..." />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  const items = [
    ['Usuarios', s.usuarios],
    ['Fincas aprobadas', s.fincasAprobadas],
    ['Fincas por revisar', s.fincasPendientes],
    ['Tours activos', s.tours],
    ['Reservas vigentes', s.reservas],
    ['Ingresos confirmados', formatCOP(s.ingresosConfirmadosCop)],
  ];
  return (
    <div className="stats">
      {items.map(([label, value]) => (
        <div key={label} className="stat">
          <span className="stat-value">{value}</span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PanelAdmin() {
  const [status, setStatus] = useState('pendiente');
  const { data: fincas, loading, error, reload, setData } = useApi(`/api/admin/fincas?status=${status}`);
  const [actionError, setActionError] = useState('');

  async function decide(id, newStatus) {
    setActionError('');
    try {
      await api.patch(`/api/admin/fincas/${id}/status`, { status: newStatus });
      setData((list) => list.filter((f) => f.id !== id));
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <section>
      <div className="section-head">
        <h1>Administración</h1>
      </div>
      <Stats />

      <h2>Revisión de fincas</h2>
      <div className="tabs" role="tablist">
        {['pendiente', 'aprobada', 'rechazada'].map((s) => (
          <button key={s} role="tab" aria-selected={status === s} className={status === s ? 'active' : ''} onClick={() => setStatus(s)}>
            {s === 'pendiente' ? 'Por revisar' : s === 'aprobada' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>

      {actionError && <p className="alert danger" role="alert">{actionError}</p>}
      {loading && <Loading />}
      {error && <ErrorBox error={error} onRetry={reload} />}
      {!loading && !error && fincas.length === 0 && <Empty>No hay fincas en este estado.</Empty>}
      {!loading && !error &&
        fincas.map((f) => (
          <div key={f.id} className="card panel-finca">
            <div className="panel-finca-head">
              <div>
                <h3>{f.name} <StatusBadge status={f.status} /></h3>
                <p className="muted small">
                  {f.municipio}, {f.departamento} · {f.altitud_msnm} m s. n. m. · Caficultor: {f.owner_name}
                </p>
              </div>
              <div className="form-actions">
                {f.status !== 'aprobada' && (
                  <button className="btn btn-primary btn-sm" onClick={() => decide(f.id, 'aprobada')}>Aprobar</button>
                )}
                {f.status !== 'rechazada' && (
                  <button className="btn btn-ghost btn-sm danger" onClick={() => decide(f.id, 'rechazada')}>Rechazar</button>
                )}
              </div>
            </div>
            <p>{f.description}</p>
            <p className="small muted">Variedades: {f.variedades}</p>
          </div>
        ))}
    </section>
  );
}
