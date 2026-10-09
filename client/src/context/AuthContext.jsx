import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('campusfind_user')) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('campusfind_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user);
        localStorage.setItem('campusfind_user', JSON.stringify(res.data.user));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('campusfind_token', res.data.token);
    localStorage.setItem('campusfind_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('campusfind_token', res.data.token);
    localStorage.setItem('campusfind_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem('campusfind_token');
    localStorage.removeItem('campusfind_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
