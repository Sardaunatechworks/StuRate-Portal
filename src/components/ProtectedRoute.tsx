import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if unauthorized for this specific role route
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STUDENT' ? '/student/dashboard' : '/lecturer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex min-h-screen bg-academic-50 dark:bg-[#0C1A12] text-[#1A2E22] dark:text-zinc-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
