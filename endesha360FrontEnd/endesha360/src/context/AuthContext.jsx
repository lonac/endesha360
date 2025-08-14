  // Update school details (edit mode)
  const updateMySchool = async (schoolData) => {
    try {
      const response = await apiService.updateMySchool(schoolData);
      return response;
    } catch (error) {
      throw error;
    }
  };
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = apiService.getToken();
    const userData = apiService.getUser();
    
    if (token && userData) {
      setUser(userData);
      // Optionally validate token with backend
      validateCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const validateCurrentUser = async () => {
    try {
      const isValid = await apiService.validateToken();
      if (!isValid) {
        logout();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.loginUser(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // School owner registration (for the platform)
  const registerSchoolOwner = async (userData) => {
    try {
      const response = await apiService.registerSchoolOwner(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // School registration (by school owner)
  const registerSchool = async (schoolData) => {
    try {
      const response = await apiService.registerSchool(schoolData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Get current user's school
  const getMySchool = async () => {
    try {
      const response = await apiService.getMySchool();
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Regular user registration (for specific tenants)
  const register = async (userData) => {
    try {
      const response = await apiService.registerUser(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    registerSchoolOwner,
    registerSchool,
    updateMySchool,
    getMySchool,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
