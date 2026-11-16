import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import FincaForm from '../components/FincaForm';
import TourForm from '../components/TourForm';
import StatusBadge from '../components/StatusBadge';
import { Empty, ErrorBox, Loading } from '../components/States';
import { formatCOP, formatDate } from '../utils/format';

function MisFincas() {
  const { data: fincas, loading, error, reload } = useApi('/api/fincas/mine');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addingTourTo, setAddingTourTo] = useState(null);
  const [actionError, setActionError] = useState('');

  async function createFinca(data) {
    await api.post('/api/fincas', data);
    setCreating(false);
    reload();
  }
  async function updateFinca(data) {
    await api.put(`/api/fincas/${editing.id}`, data);
    setEditing(null);
    reload();
  }
  async function createTour(fincaId, data) {
    await api.post(`/api/fincas/${fincaId}/tours`, data);
    setAddingTourTo(null);
    reload();
  }
  async function toggleTour(tour) {
    setActionError('');
    try {
      await api.put(`/api/tours/${tour.id}`, { ...tour, active: !tour.active });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }
  async function deleteTour(tour) {
    if (!window.confirm(`¿Eliminar el tour "${tour.title}"? También se eliminan sus reservas.`)) return;
    setActionError('');
    try {
      await api.del(`/api/tours/${tour.id}`);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <Loading text="Cargando tus fincas..." />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  return (
    <>
      {actionError && <p className="alert danger" role="alert">{actionError}</p>}
      {!creating && (
        <button className="btn btn-primary" onClick={() => setCreating(true)}>+ Registrar una finca</button>
      )}
      {creating && (
        <>
          <p className="muted">La finca quedará <strong>pendiente</strong> hasta que el equipo de CafeRuta la apruebe.</p>
          <FincaForm submitLabel="Enviar a revisión" onSubmit={createFinca} onCancel={() => setCreating(false)} />
        </>
      )}

      {fincas.length === 0 && !creating && <Empty>Todavía no has registrado ninguna finca.</Empty>}

      {fincas.map((f) =>
        editing?.id === f.id ? (
          <FincaForm key={f.id} initial={f} submitLabel="Guardar cambios" onSubmit={updateFinca} onCancel={() => setEditing(null)} />
        ) : (
          <div key={f.id} className="card panel-finca">
            <div className="panel-finca-head">
              <div>
                <h3>{f.name} <StatusBadge status={f.status} /></h3>
                <p className="muted small">{f.municipio}, {f.departamento} · {f.altitud_msnm} m s. n. m.</p>
              </div>
              <div className="form-actions">
                {f.status === 'aprobada' && <Link className="btn btn-ghost btn-sm" to={`/fincas/${f.id}`}>Ver pública</Link>}
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(f)}>Editar</button>
              </div>
            </div>

            <h4>Tours</h4>
            {f.tours.length === 0 && <p className="muted small">Sin tours. Agrega uno para recibir reservas.</p>}
            <ul className="tour-list">
              {f.tours.map((t) => (
                <li key={t.id} className={t.active ? '' : 'inactive'}>
                  <span>
                    <strong>{t.title}</strong> · {formatCOP(t.price_cop)} · {t.capacity} cupos · {t.duration_hours} h
                    {!t.active && <em> (pausado)</em>}
                  </span>
                  <span className="form-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleTour(t)}>{t.active ? 'Pausar' : 'Activar'}</button>
                    <button className="btn btn-ghost btn-sm danger" onClick={() => deleteTour(t)}>Eliminar</button>
                  </span>
                </li>
              ))}
            </ul>
            {addingTourTo === f.id ? (
              <TourForm onSubmit={(data) => createTour(f.id, data)} onCancel={() => setAddingTourTo(null)} />
            ) : (
              <button className="btn btn-outline btn-sm" onClick={() => setAddingTourTo(f.id)}>+ Agregar tour</button>
            )}
          </div>
        )
      )}
    </>
  );
}

function ReservasRecibidas() {
  const { data: reservas, loading, error, reload, setData } = useApi('/api/reservas/recibidas');
  const [actionError, setActionError] = useState('');

  async function changeStatus(id, status) {
    setActionError('');
    try {
      const updated = await api.patch(`/api/reservas/${id}/status`, { status });
      setData((list) => list.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <Loading text="Cargando reservas..." />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (reservas.length === 0) return <Empty>Aún no has recibido reservas.</Empty>;

  return (
    <>
      {actionError && <p className="alert danger" role="alert">{actionError}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Fecha</th><th>Visitante</th><th>Tour</th><th>Personas</th><th>Total</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td>{formatDate(r.date)}</td>
                <td>{r.visitante_name}<div className="small muted">{r.visitante_email}</div></td>
                <td>{r.tour_title}<div className="small muted">{r.finca_name}</div></td>
                <td>{r.people}</td>
                <td>{formatCOP(r.total_cop)}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="form-actions">
                  {r.status === 'pendiente' && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => changeStatus(r.id, 'confirmada')}>Confirmar</button>
                      <button className="btn btn-ghost btn-sm danger" onClick={() => changeStatus(r.id, 'rechazada')}>Rechazar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function PanelCaficultor() {
  const [tab, setTab] = useState('fincas');
  return (
    <section>
      <div className="section-head">
        <h1>Panel del caficultor</h1>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'fincas'} className={tab === 'fincas' ? 'active' : ''} onClick={() => setTab('fincas')}>Mis fincas y tours</button>
        <button role="tab" aria-selected={tab === 'reservas'} className={tab === 'reservas' ? 'active' : ''} onClick={() => setTab('reservas')}>Reservas recibidas</button>
      </div>
      {tab === 'fincas' ? <MisFincas /> : <ReservasRecibidas />}
    </section>
  );
}
