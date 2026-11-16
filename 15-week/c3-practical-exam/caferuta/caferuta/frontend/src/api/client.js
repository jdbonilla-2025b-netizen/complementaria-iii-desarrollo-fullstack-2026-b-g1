// Cliente HTTP central: TODAS las peticiones pasan por aquí, así el token
// se agrega en un solo lugar y los errores se tratan de forma uniforme.
const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'caferuta_token';

export const tokenStore = {
  // sessionStorage: sobrevive a un F5 pero se borra al cerrar la pestaña.
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Se registra desde AuthContext para cerrar sesión cuando el token expira.
let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export async function apiFetch(path, { method = 'GET', body, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`; // 1. adjunta el token

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // 2. Red caída o bloqueo CORS: el navegador no da más detalles.
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexión.');
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));

  // 3. Token vencido o inválido -> cerrar sesión y volver al login.
  if (response.status === 401 && token) onUnauthorized();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || `Error ${response.status}`);
  }
  return data;
}

export const api = {
  get: (path, opts) => apiFetch(path, opts),
  post: (path, body) => apiFetch(path, { method: 'POST', body }),
  put: (path, body) => apiFetch(path, { method: 'PUT', body }),
  patch: (path, body) => apiFetch(path, { method: 'PATCH', body }),
  del: (path) => apiFetch(path, { method: 'DELETE' }),
};
