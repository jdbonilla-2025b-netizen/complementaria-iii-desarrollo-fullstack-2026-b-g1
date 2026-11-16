import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { Empty, ErrorBox, Loading } from '../components/States';
import { formatCOP, formatDate } from '../utils/format';

export default function MisReservas() {
  const { data: reservas, loading, error, reload, setData } = useApi('/api/reservas/mine');
  const [actionError, setActionError] = useState('');

  async function cancelar(id) {
    if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    setActionError('');
    try {
      const updated = await api.patch(`/api/reservas/${id}/status`, { status: 'cancelada' });
      setData((list) => list.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setActionError(err.message);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section>
      <div className="section-head">
        <h1>Mis reservas</h1>
      </div>
      {actionError && <p className="alert danger" role="alert">{actionError}</p>}
      {loading && <Loading text="Cargando tus reservas..." />}
      {error && <ErrorBox error={error} onRetry={reload} />}
      {!loading && !error && reservas.length === 0 && (
        <Empty>
          Aún no tienes reservas. <Link to="/">Explora las fincas</Link> y agenda tu primera visita.
        </Empty>
      )}
      {!loading && !error && reservas.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th><th>Finca y tour</th><th>Personas</th><th>Total</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.date)}</td>
                  <td>
                    <Link to={`/fincas/${r.finca_id}`}>{r.finca_name}</Link>
                    <div className="small muted">{r.tour_title} · {r.municipio}</div>
                  </td>
                  <td>{r.people}</td>
                  <td>{formatCOP(r.total_cop)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    {['pendiente', 'confirmada'].includes(r.status) && r.date >= today && (
                      <button className="btn btn-outline btn-sm" onClick={() => cancelar(r.id)}>Cancelar</button>
                    )}
                    {r.status === 'confirmada' && r.date < today && (
                      <Link className="btn btn-outline btn-sm" to={`/fincas/${r.finca_id}`}>Reseñar</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
