export default function Stars({ value, count }) {
  if (!value) return <span className="stars muted">Sin reseñas aún</span>;
  const full = Math.round(value);
  return (
    <span className="stars" aria-label={`${value} de 5 estrellas`}>
      {'★'.repeat(full)}
      <span className="muted">{'★'.repeat(5 - full)}</span> {value}
      {count !== undefined && <span className="muted"> ({count})</span>}
    </span>
  );
}
