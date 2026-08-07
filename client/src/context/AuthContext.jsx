import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('krishi_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('krishi_token');
      if (token) {
        try {
          const res = await API.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('krishi_user', JSON.stringify(res.data.user));
          }
        } catch (e) {
          console.warn('Profile fetch note:', e.message);
          if (e.response?.status === 401) {
            localStorage.removeItem('krishi_token');
            localStorage.removeItem('krishi_user');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (phoneOrEmail, password) => {
    const res = await API.post('/auth/login', { phone: phoneOrEmail, password });
    if (res.data.success) {
      localStorage.setItem('krishi_token', res.data.token);
      localStorage.setItem('krishi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('krishi_token', res.data.token);
      localStorage.setItem('krishi_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
