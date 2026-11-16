import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../auth/AuthContext';

const ROLES = [
  { value: 'visitante', title: 'Quiero visitar fincas', text: 'Reserva tours y deja reseñas.' },
  { value: 'caficultor', title: 'Tengo una finca', text: 'Publica tu finca y recibe visitantes.' },
];

export default function Registro() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'visitante' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(form);
      navigate(homeFor(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <div className="role-picker" role="radiogroup" aria-label="Tipo de cuenta">
          {ROLES.map((r) => (
            <label key={r.value} className={`role-option ${form.role === r.value ? 'selected' : ''}`}>
              <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set('role')} />
              <strong>{r.title}</strong>
              <span className="small muted">{r.text}</span>
            </label>
          ))}
        </div>
        <label>
          Nombre completo
          <input value={form.name} onChange={set('name')} required minLength={2} />
        </label>
        <label>
          Correo
          <input type="email" value={form.email} onChange={set('email')} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={form.password} onChange={set('password')} required minLength={8} />
          <span className="small muted">Mínimo 8 caracteres, con letras y números.</span>
        </label>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="small">¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
      </form>
    </div>
  );
}
