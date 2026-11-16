import { useState } from 'react';

const EMPTY = { title: '', description: '', duration_hours: 3, price_cop: 80000, capacity: 10 };

export default function TourForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await onSubmit({
        ...form,
        duration_hours: Number(form.duration_hours),
        price_cop: Number(form.price_cop),
        capacity: Number(form.capacity),
      });
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form tour-form" onSubmit={handleSubmit}>
      <label>Nombre del tour<input value={form.title} onChange={set('title')} required /></label>
      <label>Descripción<textarea rows="2" value={form.description} onChange={set('description')} minLength={10} required /></label>
      <div className="form-row three">
        <label>Horas<input type="number" min="1" max="12" value={form.duration_hours} onChange={set('duration_hours')} /></label>
        <label>Precio por persona (COP)<input type="number" min="1000" step="1000" value={form.price_cop} onChange={set('price_cop')} /></label>
        <label>Cupos por día<input type="number" min="1" max="100" value={form.capacity} onChange={set('capacity')} /></label>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary btn-sm" disabled={sending}>{sending ? 'Guardando...' : 'Agregar tour'}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancelar</button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
