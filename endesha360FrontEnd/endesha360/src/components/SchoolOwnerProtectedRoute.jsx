import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SchoolOwnerProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated || !(user?.roles?.includes('SCHOOL_OWNER'))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default SchoolOwnerProtectedRoute;
