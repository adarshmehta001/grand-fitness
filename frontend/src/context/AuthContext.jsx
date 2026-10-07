import React, { createContext, useContext, useState, useEffect } from 'react';
import { silentRefresh, fetchJson, setToken } from '../lib/api';



















const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initial load

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      const token = await silentRefresh();
      if (token && mounted) {
        try {
          const userData = await fetchJson('/me');
          if (mounted) {
            setUser(userData);
          }
        } catch (err) {
          if (mounted) setUser(null);
        }
      }
      if (mounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      mounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetchJson('/auth/logout', { method: 'POST' });
    } catch (e) {

      // Ignore if logout fails network-wise
    } finally {setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>);

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};