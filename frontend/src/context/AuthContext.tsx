'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'patient' | 'therapist' | 'admin';
  weight?: number;
  medical_history?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    weight?: number,
    medicalHistory?: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user profile on mount if token exists
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.get<User>('/users/me');
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user info', err);
        // Token was invalid/expired, clear it
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'patient') {
        router.push('/dashboard/patient');
      } else {
        router.push('/dashboard/therapist');
      }
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    weight?: number,
    medicalHistory?: string
  ) => {
    setLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
        weight: weight ? Number(weight) : undefined,
        medical_history: medicalHistory || undefined,
      });

      localStorage.setItem('token', response.token);
      setUser(response.user);
      router.push('/dashboard/patient');
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
