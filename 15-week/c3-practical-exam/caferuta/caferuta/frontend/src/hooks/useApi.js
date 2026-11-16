import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

// Hook genérico para GET: expone los tres estados que la UI debe manejar.
//   loading -> mostrar indicador de carga
//   error   -> mostrar el mensaje y un botón de reintentar
//   data    -> pintar los datos
export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(path));
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    // AbortController cancela la petición si el componente se desmonta
    // o si cambia la ruta antes de que llegue la respuesta.
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    apiFetch(path, { signal: controller.signal })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [path, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { data, loading, error, reload, setData };
}
