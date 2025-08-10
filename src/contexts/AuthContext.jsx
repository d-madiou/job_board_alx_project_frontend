import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth';
import api from '../utils/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        console.log('Stored tokens:', { accessToken, refreshToken });
        if (storedUser && accessToken && refreshToken) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  

  const login = async (formData) => {
    try {
      const response = await api.post('/auth/login/', { 
        email: formData.email,
        password: formData.password,
      });
      console.log('Login response:', response.data); 
      const { user, tokens } = response.data; 
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        phone: formData.phone,
        location: formData.location,
      });
      console.log('Register response:', response.data); 
      const { user, tokens } = response.data; 
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join(', ') ||
        'An error occurred during registration';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};