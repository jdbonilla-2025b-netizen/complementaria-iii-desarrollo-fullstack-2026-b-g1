import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { homeFor, useAuth } from '../auth/AuthContext';

const DEMO = [
  ['laura@caferuta.co', 'Visitante'],
  ['jorge@caferuta.co', 'Caficultor'],
  ['admin@caferuta.co', 'Admin'],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(location.state?.from || homeFor(user.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Ingresar</h1>
        <label>
          Correo
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="small">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>

        <div className="demo">
          <p className="small muted">Cuentas de prueba (contraseña <code>Cafe2026!</code>):</p>
          {DEMO.map(([mail, label]) => (
            <button type="button" key={mail} className="btn btn-outline btn-sm" onClick={() => { setEmail(mail); setPassword('Cafe2026!'); }}>
              {label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
