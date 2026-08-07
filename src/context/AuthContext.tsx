import React, { createContext, useContext, useState } from 'react';
import API from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
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
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (identifier: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Attempt backend login
      const response = await API.post('/auth/login', { identifier, email: identifier, password });
      const { token: jwtToken, user: userData } = response.data;
      
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials or server connection.';
      throw new Error(message);
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
      const response = await API.post('/auth/signup/student', data);
      const { token: jwtToken, user: userData } = response.data;

      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please check your inputs.';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signupStudent, logout, isLoading }}>
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
