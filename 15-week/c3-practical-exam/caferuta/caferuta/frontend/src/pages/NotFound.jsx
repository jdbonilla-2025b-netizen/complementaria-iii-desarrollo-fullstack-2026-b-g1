import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card empty">
      <h1>Página no encontrada</h1>
      <p>Este camino no lleva a ninguna finca.</p>
      <Link className="btn btn-primary" to="/">Volver al inicio</Link>
    </div>
  );
}
