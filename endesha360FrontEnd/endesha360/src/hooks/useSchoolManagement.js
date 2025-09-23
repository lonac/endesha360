import { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { useAdmin } from '../context/AdminContext';
import { createAlertProps } from '../utils/errorHandler';

export const useSchoolManagement = () => {
  const fetchWithAuth = useAuthenticatedFetch();
  const { admin } = useAdmin();

  // State for schools list
  const [schools, setSchools] = useState([]);
  const [totalSchools, setTotalSchools] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // State for statistics
  const [statistics, setStatistics] = useState(null);

  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // State for form data
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    website: '',
    description: '',
    ownerName: '',
    ownerEmail: ''
  });

  // State for alerts
  const [alert, setAlert] = useState({ type: '', message: '', show: false });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load data on component mount
  useEffect(() => {
    loadSchools();
    loadStatistics();
    // eslint-disable-next-line
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (sortBy || selectedStatus || debouncedSearchTerm || selectedLocation || currentPage || pageSize) {
      loadSchools();
    }
    // eslint-disable-next-line
  }, [sortBy, selectedStatus, debouncedSearchTerm, selectedLocation, currentPage, pageSize]);

  const loadSchools = async () => {
    try {
      setIsLoading(true);

      // Build query parameters for server-side filtering
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sort: sortBy,
        direction: 'ASC'
      });
      if (selectedStatus) {
        params.append('status', selectedStatus.toLowerCase());
      }
      if (debouncedSearchTerm.trim()) {
        params.append('search', debouncedSearchTerm.trim());
      }
      const url = `/api/schools?${params.toString()}`;
      const response = await fetchWithAuth(url);

      if (response.ok) {
        const result = await response.json();
        // Use backend response format: { success, schools, count }
        const schoolsArray = Array.isArray(result.schools) ? result.schools : [];
        let filteredSchools = schoolsArray;
        if (selectedLocation.trim()) {
          const locationLower = selectedLocation.toLowerCase();
          filteredSchools = schoolsArray.filter(school =>
            school.city?.toLowerCase().includes(locationLower) ||
            school.country?.toLowerCase().includes(locationLower) ||
            school.address?.toLowerCase().includes(locationLower)
          );
        }
        setSchools(filteredSchools);
        setTotalSchools(result.count || filteredSchools.length);
      } else if (response.status === 401) {
        // Token expired or invalid
        console.error('Authentication failed. Token may be expired.');
        setSchools([]);
        setTotalSchools(0);
        setAlert({
          type: 'error',
          message: 'Your session has expired. Please login again.',
          show: true
        });
        // Optionally clear the invalid token
        localStorage.removeItem('adminToken');
      } else {
        console.error('API Error:', response.status, response.statusText);
        throw new Error('Failed to load schools');
      }
    } catch (error) {
      console.error('Load schools error:', error);
      const alertProps = createAlertProps(error, 'schools');
      showAlert(alertProps);
      // Ensure schools is always an array
      setSchools([]);
      setTotalSchools(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const adminId = admin?.id || '';
      if (!adminId) return;
      const response = await fetchWithAuth(`/api/schools/admin/${adminId}/statistics`);

      if (response.ok) {
        const result = await response.json();
        // Handle wrapped response format from SystemAdminServices
        const stats = result.data || result;

        // Transform backend stats to frontend format
        const transformedStats = {
          totalSchools: stats.totalSchools || 0,
          pendingSchools: stats.pendingApproval || 0,
          approvedSchools: stats.activeSchools || 0,
          rejectedSchools: stats.rejectedSchools || 0
        };
        setStatistics(transformedStats);
      } else if (response.status === 401) {
        console.error('Authentication failed for statistics. Token may be expired.');
        setStatistics({
          totalSchools: 0,
          pendingSchools: 0,
          approvedSchools: 0,
          rejectedSchools: 0
        });
      } else {
        console.error('Statistics API Error:', response.status, response.statusText);
        setStatistics({
          totalSchools: 0,
          pendingSchools: 0,
          approvedSchools: 0,
          rejectedSchools: 0
        });
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setStatistics({
        totalSchools: 0,
        pendingSchools: 0,
        approvedSchools: 0,
        rejectedSchools: 0
      });
    }
  };

  const showAlert = (type, message, details = null, retryable = false, onRetry = null) => {
    if (typeof type === 'object') {
      // Enhanced alert props from ErrorHandler
      setAlert({ ...type, show: true });
    } else {
      // Legacy string alert
      setAlert({ type, message, details, retryable, onRetry, show: true });
    }
    setTimeout(() => setAlert({ type: '', message: '', show: false }), 5000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedLocation('');
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedLocation('');
    setCurrentPage(0);
  };

  const resetForm = () => {
    setSchoolForm({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      country: '',
      website: '',
      description: '',
      ownerName: '',
      ownerEmail: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (school) => {
    setSelectedSchool(school);
    setSchoolForm({
      name: school.name,
      email: school.email,
      phoneNumber: school.phoneNumber || '',
      address: school.address || '',
      city: school.city || '',
      country: school.country || '',
      website: school.website || '',
      description: school.description || '',
      ownerName: school.ownerName || '',
      ownerEmail: school.ownerEmail || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (school) => {
    setSelectedSchool(school);
    setShowViewModal(true);
  };

  const openDeleteModal = (schoolId) => {
    setSchoolToDelete(schoolId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSchoolToDelete(null);
  };

  const handleCreateSchool = async () => {
    try {
      const response = await fetchWithAuth('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolForm),
      });

      if (response.ok) {
        showAlert('success', 'School created successfully!');
        setShowCreateModal(false);
        resetForm();
        loadSchools();
        loadStatistics();
      } else if (response.status === 401) {
        setAlert({
          type: 'error',
          message: 'Your session has expired. Please login again.',
          show: true
        });
        localStorage.removeItem('adminToken');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create school');
      }
    } catch (error) {
      const alertProps = createAlertProps(error, 'schools');
      showAlert(alertProps);
    }
  };

  const handleUpdateSchool = async () => {
    try {
      const response = await fetchWithAuth(`/api/schools/${selectedSchool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolForm),
      });

      if (response.ok) {
        showAlert('success', 'School updated successfully!');
        setShowEditModal(false);
        resetForm();
        loadSchools();
      } else if (response.status === 401) {
        setAlert({
          type: 'error',
          message: 'Your session has expired. Please login again.',
          show: true
        });
        localStorage.removeItem('adminToken');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update school');
      }
    } catch (error) {
      showAlert('error', 'Failed to update school: ' + error.message);
    }
  };

  const handleApproveSchool = async (schoolId) => {
    try {
      const response = await fetchWithAuth(`/api/schools/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schoolId, action: 'APPROVE' }),
      });

      if (response.ok) {
        showAlert('success', 'School approved successfully!');
        loadSchools();
        loadStatistics();
      } else if (response.status === 401) {
        setAlert({
          type: 'error',
          message: 'Your session has expired. Please login again.',
          show: true
        });
        localStorage.removeItem('adminToken');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve school');
      }
    } catch (error) {
      showAlert('error', 'Failed to approve school: ' + error.message);
    }
  };

  const handleRejectSchool = async (schoolId) => {
    try {
      const response = await fetchWithAuth(`/api/schools/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schoolId, action: 'REJECT' }),
      });

      if (response.ok) {
        showAlert('success', 'School rejected successfully!');
        loadSchools();
        loadStatistics();
      } else if (response.status === 401) {
        setAlert({
          type: 'error',
          message: 'Your session has expired. Please login again.',
          show: true
        });
        localStorage.removeItem('adminToken');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject school');
      }
    } catch (error) {
      showAlert('error', 'Failed to reject school: ' + error.message);
    }
  };

  const handleDeleteSchool = async () => {
    if (!schoolToDelete) return;

    try {
      const response = await fetchWithAuth(`/api/schools/${schoolToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showAlert('success', 'School deleted successfully!');
        closeDeleteModal();
        loadSchools();
        loadStatistics();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete school');
      }
    } catch (error) {
      showAlert('error', 'Failed to delete school: ' + error.message);
      closeDeleteModal();
    }
  };

  const totalPages = Math.ceil(totalSchools / pageSize);

  return {
    // State
    schools,
    totalSchools,
    currentPage,
    pageSize,
    isLoading,
    searchTerm,
    selectedStatus,
    selectedLocation,
    sortBy,
    statistics,
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    selectedSchool,
    schoolForm,
    alert,
    totalPages,

    // Setters
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setSelectedStatus,
    setSelectedLocation,
    setSortBy,
    setSchoolForm,
    setAlert,
    setShowCreateModal,
    setShowEditModal,
    setShowViewModal,

    // Actions
    resetFilters,
    clearFilters,
    openCreateModal,
    openEditModal,
    openViewModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateSchool,
    handleUpdateSchool,
    handleApproveSchool,
    handleRejectSchool,
    handleDeleteSchool,
    loadSchools
  };
};
