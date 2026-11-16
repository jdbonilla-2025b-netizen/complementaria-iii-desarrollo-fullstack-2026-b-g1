import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setUnauthorizedHandler, tokenStore } from '../api/client';

const AuthContext = createContext(null);
const USER_KEY = 'caferuta_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem(USER_KEY);
    return saved && tokenStore.get() ? JSON.parse(saved) : null;
  });
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setSessionExpired(true);
    });
  }, [clearSession]);

  function saveSession({ token, user: u }) {
    tokenStore.set(token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
    setSessionExpired(false);
    return u;
  }

  const login = async (email, password) => saveSession(await api.post('/api/auth/login', { email, password }));
  const register = async (data) => saveSession(await api.post('/api/auth/register', data));
  const logout = () => {
    clearSession();
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, sessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// A dónde llevar a cada rol después de iniciar sesión.
export function homeFor(role) {
  return { visitante: '/', caficultor: '/panel', admin: '/admin' }[role] || '/';
}
