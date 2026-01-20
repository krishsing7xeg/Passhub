// src/context/AuthContext.jsx - UPDATED
import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      api.get('/auth/me')
        .then(res => {
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, role, name, email: userEmail, subscription } = response.data;
        localStorage.setItem('token', token);
        
        // ✅ Extract user ID from token or response
        const userData = { 
          id: response.data.id || response.data.userId || 'temp', // ✅ Get ID from response
          role, 
          name, 
          email: userEmail,
          subscription: subscription || { isActive: false }
        };
        
        setUser(userData);
        return { success: true, role };
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        const { token, user: newUser } = response.data;
        localStorage.setItem('token', token);
        
        // ✅ Ensure user has ID
        const userData = {
          ...newUser,
          id: newUser._id || newUser.id
        };
        
        setUser(userData);
        return { success: true };
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      console.error('Register error:', error);
      throw error.response?.data || { message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};