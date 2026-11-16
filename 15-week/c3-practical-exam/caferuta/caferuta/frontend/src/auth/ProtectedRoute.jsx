import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Protección en el FRONTEND: solo mejora la experiencia (oculta pantallas).
// La seguridad real está en el backend, que valida el JWT en cada petición.
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="card empty">
        <h2>Acceso restringido</h2>
        <p>Tu cuenta ({user.role}) no tiene permiso para ver esta sección.</p>
      </div>
    );
  }
  return <Outlet />;
}
