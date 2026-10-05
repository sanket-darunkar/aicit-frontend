import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/api.js';
import { instituteLogin as apiInstituteLogin } from '../services/instituteService.js';

const InstituteAuthContext = createContext(null);

export function InstituteAuthProvider({ children }) {
  const [user,    setUser]    = useState(() => auth.getInstituteUser());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const isAuthenticated = !!user && !!auth.getInstituteToken();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiInstituteLogin(email, password);
      // res = full body: { success, message, data: { token, role, ... } }
      // res.data = { token, role, email, fullName, instituteId, instituteName, ... }
      const userData = res?.data;
      if (!userData?.token) {
        throw new Error(res?.message || 'Login failed. Please try again.');
      }
      auth.setInstituteToken(userData.token);
      auth.setInstituteUser(userData);
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    auth.clearInstitute();
    setUser(null);
  }, []);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('aicit:unauthorized', handler);
    return () => window.removeEventListener('aicit:unauthorized', handler);
  }, [logout]);

  return (
    <InstituteAuthContext.Provider value={{ user, isAuthenticated, loading, error, login, logout }}>
      {children}
    </InstituteAuthContext.Provider>
  );
}

export const useInstituteAuth = () => {
  const ctx = useContext(InstituteAuthContext);
  if (!ctx) throw new Error('useInstituteAuth must be used inside InstituteAuthProvider');
  return ctx;
};
