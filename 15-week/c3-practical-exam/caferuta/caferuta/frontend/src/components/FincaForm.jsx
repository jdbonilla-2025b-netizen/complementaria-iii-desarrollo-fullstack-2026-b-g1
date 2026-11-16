import { useState } from 'react';

const EMPTY = { name: '', municipio: '', departamento: '', altitud_msnm: 1600, variedades: '', description: '' };
const DEPARTAMENTOS = ['Antioquia', 'Caldas', 'Cauca', 'Cundinamarca', 'Huila', 'Nariño', 'Quindío', 'Risaralda', 'Santander', 'Tolima', 'Valle del Cauca'];

export default function FincaForm({ initial = EMPTY, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await onSubmit({ ...form, altitud_msnm: Number(form.altitud_msnm) });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Nombre de la finca<input value={form.name} onChange={set('name')} required /></label>
        <label>
          Departamento
          <select value={form.departamento} onChange={set('departamento')} required>
            <option value="">Selecciona...</option>
            {DEPARTAMENTOS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>Municipio<input value={form.municipio} onChange={set('municipio')} required /></label>
        <label>Altitud (m s. n. m.)<input type="number" min="500" max="3000" value={form.altitud_msnm} onChange={set('altitud_msnm')} required /></label>
      </div>
      <label>Variedades de café<input value={form.variedades} onChange={set('variedades')} placeholder="Castillo, Caturra..." required /></label>
      <label>Descripción<textarea rows="4" value={form.description} onChange={set('description')} minLength={20} required /></label>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={sending}>{sending ? 'Guardando...' : submitLabel}</button>
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
