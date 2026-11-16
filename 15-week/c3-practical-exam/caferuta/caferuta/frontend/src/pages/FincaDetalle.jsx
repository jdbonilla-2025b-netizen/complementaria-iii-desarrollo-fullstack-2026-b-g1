import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import Stars from '../components/Stars';
import StatusBadge from '../components/StatusBadge';
import { ErrorBox, Loading } from '../components/States';
import { coverStyle, formatCOP, formatDate, tomorrow } from '../utils/format';

function ReservaForm({ tour }) {
  const [date, setDate] = useState(tomorrow());
  const [people, setPeople] = useState(2);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const reserva = await api.post('/api/reservas', { tour_id: tour.id, date, people: Number(people) });
      setDone(reserva);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="alert success">
        Reserva enviada para el {formatDate(done.date)} ({done.people} personas, {formatCOP(done.total_cop)}).
        El caficultor la confirmará pronto. <Link to="/mis-reservas">Ver mis reservas</Link>
      </div>
    );
  }

  return (
    <form className="reserva-form" onSubmit={handleSubmit}>
      <label>
        Fecha
        <input type="date" min={tomorrow()} value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        Personas
        <input type="number" min="1" max={tour.capacity} value={people} onChange={(e) => setPeople(e.target.value)} required />
      </label>
      <div className="total">
        Total <strong>{formatCOP(tour.price_cop * (Number(people) || 0))}</strong>
      </div>
      <button className="btn btn-primary" disabled={sending}>{sending ? 'Reservando...' : 'Reservar'}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}

function ResenaForm({ fincaId, onCreated }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const resena = await api.post(`/api/fincas/${fincaId}/resenas`, { rating: Number(rating), comment });
      onCreated(resena);
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>Cuenta tu experiencia</h3>
      <label>
        Calificación
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
          ))}
        </select>
      </label>
      <label>
        Comentario
        <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} required minLength={5} />
      </label>
      <button className="btn btn-primary" disabled={sending}>{sending ? 'Publicando...' : 'Publicar reseña'}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}

export default function FincaDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: finca, loading, error, reload, setData } = useApi(`/api/fincas/${id}`);

  if (loading) return <Loading text="Cargando finca..." />;
  if (error) return <ErrorBox error={error} onRetry={error.status === 404 ? undefined : reload} />;

  const addResena = (r) => setData((f) => ({ ...f, resenas: [r, ...f.resenas] }));

  return (
    <article className="detalle">
      <div className="detalle-cover" style={coverStyle(finca.departamento)}>
        <div>
          <p className="eyebrow light">{finca.municipio}, {finca.departamento}</p>
          <h1>{finca.name}</h1>
          <Stars value={finca.rating.average} count={finca.rating.count} />
        </div>
        {finca.status !== 'aprobada' && <StatusBadge status={finca.status} />}
      </div>

      <div className="detalle-grid">
        <section>
          <h2>La finca</h2>
          <p>{finca.description}</p>
          <ul className="facts">
            <li><span>Altitud</span>{finca.altitud_msnm.toLocaleString('es-CO')} m s. n. m.</li>
            <li><span>Variedades</span>{finca.variedades}</li>
            <li><span>Caficultor</span>{finca.owner_name}</li>
          </ul>

          <h2>Reseñas</h2>
          {user?.role === 'visitante' && <ResenaForm fincaId={finca.id} onCreated={addResena} />}
          {finca.resenas.length === 0 && <p className="muted">Todavía no hay reseñas.</p>}
          {finca.resenas.map((r) => (
            <blockquote key={r.id} className="resena">
              <Stars value={r.rating} />
              <p>{r.comment}</p>
              <cite>{r.author}</cite>
            </blockquote>
          ))}
        </section>

        <aside>
          <h2>Tours disponibles</h2>
          {finca.tours.length === 0 && <p className="muted">Esta finca aún no tiene tours activos.</p>}
          {finca.tours.map((t) => (
            <div key={t.id} className="card tour">
              <div className="tour-head">
                <h3>{t.title}</h3>
                <strong>{formatCOP(t.price_cop)}</strong>
              </div>
              <p className="muted small">{t.duration_hours} h · máx. {t.capacity} personas · precio por persona</p>
              <p>{t.description}</p>
              {user?.role === 'visitante' && <ReservaForm tour={t} />}
              {!user && (
                <p className="small">
                  <Link to="/login" state={{ from: `/fincas/${finca.id}` }}>Ingresa</Link> para reservar.
                </p>
              )}
            </div>
          ))}
        </aside>
      </div>
    </article>
  );
}
