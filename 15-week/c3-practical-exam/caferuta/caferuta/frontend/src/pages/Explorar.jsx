import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import FincaCard from '../components/FincaCard';
import { Empty, ErrorBox, Loading } from '../components/States';

export default function Explorar() {
  const [departamento, setDepartamento] = useState('');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');

  const params = new URLSearchParams();
  if (departamento) params.set('departamento', departamento);
  if (q) params.set('q', q);
  const query = params.toString();

  const { data: fincas, loading, error, reload } = useApi(`/api/fincas${query ? `?${query}` : ''}`);
  const { data: departamentos } = useApi('/api/fincas/departamentos');

  function handleSearch(e) {
    e.preventDefault();
    setQ(search.trim());
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow light">Turismo cafetero en Colombia</p>
        <h1>Conoce el café desde la mata hasta la taza</h1>
        <p>
          Reserva recorridos directamente con las familias caficultoras del Eje Cafetero, Huila,
          Antioquia y Nariño.
        </p>
        <form className="search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Busca por finca o municipio (ej. Salento)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar fincas"
          />
          <select value={departamento} onChange={(e) => setDepartamento(e.target.value)} aria-label="Departamento">
            <option value="">Todos los departamentos</option>
            {departamentos?.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit">Buscar</button>
        </form>
      </section>

      <section>
        <div className="section-head">
          <h2>Fincas para visitar</h2>
          {fincas && <span className="muted">{fincas.length} resultados</span>}
        </div>

        {loading && <Loading text="Buscando fincas..." />}
        {error && <ErrorBox error={error} onRetry={reload} />}
        {!loading && !error && fincas?.length === 0 && (
          <Empty>No encontramos fincas con esos filtros. Prueba con otro municipio o departamento.</Empty>
        )}
        {!loading && !error && fincas?.length > 0 && (
          <div className="grid">
            {fincas.map((f) => (
              <FincaCard key={f.id} finca={f} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
