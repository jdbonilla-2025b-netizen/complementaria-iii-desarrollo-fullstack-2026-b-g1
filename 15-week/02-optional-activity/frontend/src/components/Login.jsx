import { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Ingresa usuario y contraseña')
      return
    }
    setLoading(true)
    try {
      const token = await login(username, password)
      onLogin(token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <label>Usuario
        <input value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>Contraseña
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  )
}
