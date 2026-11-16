import { Link } from 'react-router-dom';
import Stars from './Stars';
import { coverStyle } from '../utils/format';

export default function FincaCard({ finca }) {
  return (
    <Link to={`/fincas/${finca.id}`} className="finca-card">
      <div className="finca-cover" style={coverStyle(finca.departamento)}>
        <span className="altitude">{finca.altitud_msnm.toLocaleString('es-CO')} m s. n. m.</span>
        <span className="cover-initial" aria-hidden="true">{finca.name.charAt(0)}</span>
      </div>
      <div className="finca-body">
        <p className="eyebrow">{finca.municipio}, {finca.departamento}</p>
        <h3>{finca.name}</h3>
        <p className="muted small">Variedades: {finca.variedades}</p>
        <Stars value={finca.rating?.average} count={finca.rating?.count} />
      </div>
    </Link>
  );
}
