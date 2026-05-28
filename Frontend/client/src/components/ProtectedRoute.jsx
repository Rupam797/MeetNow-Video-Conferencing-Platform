import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-offwhite dark:bg-primary text-secondary dark:text-offwhite/70 transition-colors duration-300">
        <div className="w-10 h-10 border-3 border-gray-200 dark:border-border-primary border-t-brand rounded-full animate-spin" />
        <p className="font-[Outfit]">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
