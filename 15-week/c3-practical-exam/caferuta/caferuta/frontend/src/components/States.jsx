// Componentes reutilizables para los estados de carga, error y vacío.
export function Loading({ text = 'Cargando...' }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="state error" role="alert">
      <p>{error?.message || 'Ocurrió un error'}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="state empty">{children}</div>;
}
