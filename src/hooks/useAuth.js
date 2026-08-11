'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import api from '@/lib/api';
import { getAuthToken, setAuthToken, removeAuthToken, getMe } from '@/lib/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  loginUser: async () => ({}),
  registerUser: async () => ({}),
  logoutUser: async () => {},
  updateUser: async () => ({}),
  checkAuth: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginUser = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.data.token) setAuthToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const registerUser = async (userData) => {
    const data = await api.post('/auth/register', userData);
    if (data.data.token) setAuthToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const logoutUser = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    removeAuthToken();
    setUser(null);
  };

  const updateUser = async (userData) => {
    const { data } = await api.put('/auth/profile', userData);
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
