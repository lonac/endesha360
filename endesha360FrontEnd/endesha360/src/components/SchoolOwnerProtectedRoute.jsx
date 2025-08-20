import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SchoolOwnerProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.roles?.includes('SCHOOL_OWNER')) {
    return children;
  }

  // If authenticated but not a school owner, redirect based on role
  if (user?.roles?.includes('STUDENT')) {
    return <Navigate to="/student-dashboard" replace />;
  }

  // Default fallback: redirect to login
  return <Navigate to="/login" replace />;
};

export default SchoolOwnerProtectedRoute;
