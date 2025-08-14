  const getSchoolsByStatus = async (status) => {
    try {
      return await apiService.getSchoolsByStatus(status);
    } catch (error) {
      throw error;
    }
  };
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on app start
    const token = apiService.getAdminToken();
    const adminData = apiService.getAdminUser();
    const userType = apiService.getUserType();
    
    if (token && adminData && userType === 'admin') {
      setAdmin(adminData);
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (credentials) => {
    try {
      const response = await apiService.loginAdmin(credentials);
      setAdmin(response.admin);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutAdmin = async () => {
    try {
      await apiService.logoutAdmin();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setAdmin(null);
    }
  };

  // School management functions
  const getPendingSchools = async () => {
    try {
      return await apiService.getPendingSchools();
    } catch (error) {
      throw error;
    }
  };

  const getSchoolDetails = async (schoolId) => {
    try {
      return await apiService.getSchoolById(schoolId);
    } catch (error) {
      throw error;
    }
  };

  const approveSchool = async (schoolId, comments = '') => {
    try {
      return await apiService.approveSchool(schoolId, comments);
    } catch (error) {
      throw error;
    }
  };

  const rejectSchool = async (schoolId, comments) => {
    try {
      return await apiService.rejectSchool(schoolId, comments);
    } catch (error) {
      throw error;
    }
  };

  const getApprovalHistory = async (schoolId) => {
    try {
      return await apiService.getSchoolApprovalHistory(schoolId);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    admin,
    loginAdmin,
    logoutAdmin,
    getPendingSchools,
    getSchoolDetails,
    approveSchool,
    rejectSchool,
    getApprovalHistory,
    getSchoolsByStatus,
    isAdminAuthenticated: !!admin,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
