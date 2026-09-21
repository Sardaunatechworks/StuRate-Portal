import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signupStudent: (data: {
    name: string;
    email: string;
    password: string;
    studentId: string;
    departmentId: string;
    level: number;
  }) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('srtes_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('srtes_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('srtes_token');
      if (storedToken) {
        try {
          const currentUser = await authApi.getMe();
          setUser(currentUser);
          localStorage.setItem('srtes_user', JSON.stringify(currentUser));
        } catch (err) {
          console.warn('Session verification failed, logging out.');
          localStorage.removeItem('srtes_token');
          localStorage.removeItem('srtes_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const result = await authApi.login({ email, password });
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('srtes_token', result.token);
      localStorage.setItem('srtes_user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signupStudent = async (data: {
    name: string;
    email: string;
    password: string;
    studentId: string;
    departmentId: string;
    level: number;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const result = await authApi.signupStudent(data);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('srtes_token', result.token);
      localStorage.setItem('srtes_user', JSON.stringify(result.user));
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('srtes_token');
    localStorage.removeItem('srtes_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('srtes_user', JSON.stringify(updatedUser));
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signupStudent, logout, updateUser }}>
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
