import { useEffect, useState } from 'react'
import { getProductos } from '../api'

export default function Productos({ token, onLogout }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProductos(token)
      .then(setProductos)
      .catch(err => {
        if (err.message === 'SESION_EXPIRADA') onLogout()
        else setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p role="alert" className="error">{error}</p>
  return (
    <ul>
      {productos.map(p => (
        <li key={p.id}>{p.nombre} — ${p.precio.toLocaleString('es-CO')}</li>
      ))}
    </ul>
  )
}
