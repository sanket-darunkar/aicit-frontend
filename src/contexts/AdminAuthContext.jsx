import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/api.js';
import { adminLogin as apiAdminLogin } from '../services/adminService.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user,    setUser]    = useState(() => auth.getAdminUser());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const isAuthenticated = !!user && !!auth.getAdminToken();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiAdminLogin(email, password);
      // res = full body: { success, message, data: { token, role, ... } }
      // res.data = { token, role, email, fullName, ... }
      const userData = res?.data;
      if (!userData?.token) {
        throw new Error(res?.message || 'Login failed. Please try again.');
      }
      auth.setAdminToken(userData.token);
      auth.setAdminUser(userData);
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
    auth.clearAdmin();
    setUser(null);
  }, []);

  // Listen for 401 events
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('aicit:unauthorized', handler);
    return () => window.removeEventListener('aicit:unauthorized', handler);
  }, [logout]);

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated, loading, error, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
};
