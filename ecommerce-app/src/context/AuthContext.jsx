import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AUTH_STORAGE_KEY,
  authenticate,
  parseStoredUser,
} from '../logic/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = parseStoredUser(stored);
    if (!parsed && stored) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setUser(parsed);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = authenticate(email, password);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.user));
    setUser(result.user);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
