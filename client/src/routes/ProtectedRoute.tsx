import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Verifying authentication session..." size="lg" />
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultRoute =
      user.role === 'ADMIN'
        ? '/admin/dashboard'
        : user.role === 'LECTURER'
        ? '/lecturer/dashboard'
        : '/student/dashboard';

    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};
