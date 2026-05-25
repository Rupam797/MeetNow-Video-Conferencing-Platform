import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Fetch current user details
          const response = await api.get('/auth/me');
          setUser(response.data);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { token: jwtToken, name, email: userEmail } = response.data;
      
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser({ name, email: userEmail });
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/register', { name, email, password });
      const { token: jwtToken, name: userName, email: userEmail } = response.data;

      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser({ name: userName, email: userEmail });
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
