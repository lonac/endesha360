import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  // Debug log for troubleshooting
  console.log('[StudentProtectedRoute]', { user, isAuthenticated, loading });

  if (loading) return null;

  if (!isAuthenticated || !user?.roles?.includes('STUDENT')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default StudentProtectedRoute;
