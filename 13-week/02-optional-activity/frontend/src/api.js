const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function login(username, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(res.status === 401 ? 'Usuario o contraseña incorrectos' : 'Error del servidor')
  return (await res.json()).token
}

export async function getProductos(token) {
  const res = await fetch(`${API}/api/productos`, { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 401) throw new Error('SESION_EXPIRADA')
  if (!res.ok) throw new Error('No se pudieron cargar los productos')
  return res.json()
}
