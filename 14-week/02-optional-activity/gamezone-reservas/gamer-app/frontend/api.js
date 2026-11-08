// Lógica de comunicación con la API (separada del DOM para poder probarla).
(function (root) {
  function createApi(baseUrl, fetchFn) {
    const f = fetchFn || root.fetch.bind(root);

    async function login(username, password) {
      const res = await f(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data.token;
    }

    async function getConsoles(token) {
      if (!token) throw new Error('Debes iniciar sesión primero');
      const res = await f(`${baseUrl}/api/consoles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data.consoles;
    }

    return { login, getConsoles };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { createApi };
  else root.createApi = createApi;
})(typeof window !== 'undefined' ? window : globalThis);
