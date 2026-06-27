'use client';

import React, { createContext, use, useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '../types';
import { fetchData } from '../api';
import { getStoredToken } from '../auth';

interface AuthContextType {
  user: User | null;
  roles: string[];
  isAdmin: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchData<User>(`${API_URL}/app/oauth/me`);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const roles = useMemo(() => user?.roles || [], [user]);
  const isAdmin = useMemo(() => roles.includes('admin'), [roles]);

  const value = useMemo(() => ({
    user,
    roles,
    isAdmin,
    loading,
    refreshUser: fetchUser
  }), [user, roles, isAdmin, loading, fetchUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
