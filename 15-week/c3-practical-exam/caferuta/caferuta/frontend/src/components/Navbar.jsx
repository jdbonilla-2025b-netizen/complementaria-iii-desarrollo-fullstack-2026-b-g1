import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout, sessionExpired } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">●</span> CafeRuta
          </Link>
          <nav className="nav-links">
            <NavLink to="/" end>Explorar fincas</NavLink>
            {user?.role === 'visitante' && <NavLink to="/mis-reservas">Mis reservas</NavLink>}
            {user?.role === 'caficultor' && <NavLink to="/panel">Mi finca</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin">Administración</NavLink>}
          </nav>
          <div className="nav-user">
            {user ? (
              <>
                <span className="user-chip">
                  {user.name.split(' ')[0]} · <em>{user.role}</em>
                </span>
                <button className="btn btn-ghost" onClick={handleLogout}>Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Ingresar</Link>
                <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {sessionExpired && (
        <div className="banner" role="alert">
          Tu sesión expiró. <Link to="/login">Vuelve a ingresar</Link> para continuar.
        </div>
      )}
    </>
  );
}
