import { useState } from 'react'
import Login from './components/Login'
import Productos from './components/Productos'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function handleLogin(t) { localStorage.setItem('token', t); setToken(t) }
  function handleLogout() { localStorage.removeItem('token'); setToken(null) }

  return (
    <main>
      <header>
        <h1>UrbanStyle</h1>
        {token && <button onClick={handleLogout}>Cerrar sesión</button>}
      </header>
      {token ? <Productos token={token} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </main>
  )
}
