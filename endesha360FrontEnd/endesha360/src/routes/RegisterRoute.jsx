import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Register from '../pages/Register';

const RegisterRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role');
  const mode = searchParams.get('mode');

  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isSchoolOwner = user && (user.role === 'SCHOOL_OWNER' || (user.roles && user.roles.includes('SCHOOL_OWNER')));
    // Allow school owners to add students
    if (role === 'student' && mode === 'add' && isSchoolOwner) {
      return <Register />;
    }
    // Redirect other authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Allow non-authenticated users to register
  return <Register />;
};

export default RegisterRoute;
