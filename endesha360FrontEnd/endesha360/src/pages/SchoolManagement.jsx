import React, { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  BarChart3,
  Camera,
  X,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import AdminLayout from '../components/AdminLayout';
import Select from 'react-select';
import CustomSelect from '../components/CustomSelect';
import { ErrorHandler, createAlertProps } from '../utils/errorHandler';

const SchoolManagement = () => {
  const fetchWithAuth = useAuthenticatedFetch();
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

  const { admin } = useAdmin();
  const navigate = useNavigate();

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedLocation('');
    setCurrentPage(0);
  };

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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const handleCreateSchool = async () => {
    try {
      // Check if admin token exists
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

  const handleDeleteSchool = (schoolId) => {
    setSchoolToDelete(schoolId);
    setShowDeleteModal(true);
  };

  const handleApproveSchool = async (schoolId) => {
    try {
      // Check if admin token exists
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

  const confirmDeleteSchool = async () => {
    if (!schoolToDelete) return;

    try {
      const response = await fetchWithAuth(`/api/schools/${schoolToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showAlert('success', 'School deleted successfully!');
        setShowDeleteModal(false);
        setSchoolToDelete(null);
        loadSchools();
        loadStatistics();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete school');
      }
    } catch (error) {
      showAlert('error', 'Failed to delete school: ' + error.message);
      setShowDeleteModal(false);
      setSchoolToDelete(null);
    }
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

  const totalPages = Math.ceil(totalSchools / pageSize);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#00712D]">School Management</h2>
              <p className="text-gray-600 mt-1">Manage driving school registrations and approvals</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add School</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <Alert
            {...alert}
            onClose={() => setAlert({ ...alert, show: false })}
            onRetry={alert.retryable ? () => loadSchools() : undefined}
            className="mb-6"
          />
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Schools</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalSchools || totalSchools}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.pendingSchools || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.approvedSchools || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.rejectedSchools || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Schools</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <CustomSelect
                label="Status"
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'REJECTED', label: 'Rejected' }
                ]}
                value={selectedStatus}
                onChange={option => setSelectedStatus(option ? option.value : '')}
                placeholder="All Statuses"
                isClearable={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Filter by city/country"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
              />
            </div>
            <div>
              <CustomSelect
                label="Sort By"
                options={[
                  { value: 'id', label: 'ID' },
                  { value: 'name', label: 'Name' },
                  { value: 'email', label: 'Email' },
                  { value: 'createdAt', label: 'Created Date' }
                ]}
                value={sortBy}
                onChange={option => setSortBy(option ? option.value : 'id')}
                placeholder="Sort by..."
                isClearable={false}
                isSearchable={false}
              />
            </div>
          </div>

          {/* Filter actions */}
          {(searchTerm || selectedStatus || selectedLocation) && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00712D] mr-2"></div>
                      Searching...
                    </span>
                  ) : (
                    <>
                      {totalSchools} school{totalSchools !== 1 ? 's' : ''} found
                      {searchTerm && ` matching "${searchTerm}"`}
                      {selectedStatus && ` with status ${selectedStatus}`}
                      {selectedLocation && ` in "${selectedLocation}"`}
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setSelectedLocation('');
                  setCurrentPage(0);
                }}
                className="text-sm"
                disabled={isLoading}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Schools Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Schools ({totalSchools})</h2>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00712D] mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading schools...</p>
              </div>
            ) : schools.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No schools found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schools.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">{school.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{school.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {school.city && school.country ? `${school.city}, ${school.country}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const status = school.approvalStatus || 'PENDING';
                          const statusClass =
                            status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800';
                          return (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
                              {status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewModal(school)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(school)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {school.approvalStatus === 'PENDING' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveSchool(school.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRejectSchool(school.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSchool(school.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <div className="w-20">
                    <CustomSelect
                      options={[
                        { value: 10, label: '10' },
                        { value: 25, label: '25' },
                        { value: 50, label: '50' }
                      ]}
                      value={pageSize}
                      onChange={option => setPageSize(Number(option.value))}
                      isClearable={false}
                      isSearchable={false}
                      className="min-w-0"
                    />
                  </div>
                  <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create School Modal */}
        {showCreateModal && (
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New School"
            className="max-w-2xl"
          >
            <SchoolForm
              schoolForm={schoolForm}
              setSchoolForm={setSchoolForm}
              onSubmit={handleCreateSchool}
              onCancel={() => setShowCreateModal(false)}
              submitLabel="Create School"
            />
          </Modal>
        )}

        {/* Edit School Modal */}
        {showEditModal && (
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit School"
            className="max-w-2xl"
          >
            <SchoolForm
              schoolForm={schoolForm}
              setSchoolForm={setSchoolForm}
              onSubmit={handleUpdateSchool}
              onCancel={() => setShowEditModal(false)}
              submitLabel="Update School"
            />
          </Modal>
        )}

        {/* View School Modal */}
        {showViewModal && selectedSchool && (
          <Modal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            title="View School"
          >
            <SchoolView school={selectedSchool} />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSchoolToDelete(null);
            }}
            title="Confirm Delete"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Delete School
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this school? This action cannot be undone and the school will be permanently removed from the system.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Deleting this school may affect any students or instructors associated with it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSchoolToDelete(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmDeleteSchool}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete School
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
};

// School Form Component
const SchoolForm = ({ schoolForm, setSchoolForm, onSubmit, onCancel, submitLabel }) => {
  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="space-y-4 pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
          <input
            type="text"
            value={schoolForm.name}
            onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
            placeholder="Enter school name..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={schoolForm.email}
              onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
              placeholder="school@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={schoolForm.phoneNumber}
              onChange={(e) => setSchoolForm({ ...schoolForm, phoneNumber: e.target.value })}
              placeholder="+1234567890"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={schoolForm.address}
            onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
            placeholder="Street address..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={schoolForm.city}
              onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
              placeholder="City name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={schoolForm.country}
              onChange={(e) => setSchoolForm({ ...schoolForm, country: e.target.value })}
              placeholder="Country name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={schoolForm.website}
            onChange={(e) => setSchoolForm({ ...schoolForm, website: e.target.value })}
            placeholder="https://www.schoolwebsite.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={schoolForm.description}
            onChange={(e) => setSchoolForm({ ...schoolForm, description: e.target.value })}
            placeholder="Brief description of the school..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
            <input
              type="text"
              value={schoolForm.ownerName}
              onChange={(e) => setSchoolForm({ ...schoolForm, ownerName: e.target.value })}
              placeholder="Owner/Administrator name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner Email</label>
            <input
              type="email"
              value={schoolForm.ownerEmail}
              onChange={(e) => setSchoolForm({ ...schoolForm, ownerEmail: e.target.value })}
              placeholder="owner@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} className="flex-1">
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// School View Component
const SchoolView = ({ school }) => {
  // Debug log to inspect school object and status logic
  console.log('SchoolView school object:', school);
  console.log('SchoolView approvalStatus:', school.approvalStatus);
  console.log('SchoolView isApproved:', school.isApproved);
  console.log('SchoolView isActive:', school.isActive);
  // Helper to derive status from isApproved/isActive or approvalStatus
  // Helper to derive status from isApproved/isActive or approvalStatus
  const getStatus = (school) => {
    if (typeof school.isApproved === 'boolean' && typeof school.isActive === 'boolean') {
      if (school.isApproved === true && school.isActive === true) return 'APPROVED';
      if (school.isApproved === false) return 'REJECTED';
      return 'PENDING';
    }
    // Fallback to approvalStatus if booleans are missing
    if (school.approvalStatus) return school.approvalStatus;
    return 'PENDING';
  };

  const status = getStatus(school);
  const statusClass =
    status === 'APPROVED'
      ? 'bg-green-100 text-green-800'
      : status === 'REJECTED'
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">School Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Basic Information</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {school.name}</p>
              <p><span className="font-medium">Email:</span> {school.email}</p>
              <p><span className="font-medium">Phone:</span> {school.phoneNumber || 'N/A'}</p>
              <p><span className="font-medium">Website:</span> {school.website || 'N/A'}</p>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Location</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Address:</span> {school.address || 'N/A'}</p>
              <p><span className="font-medium">City:</span> {school.city || 'N/A'}</p>
              <p><span className="font-medium">Country:</span> {school.country || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Owner/Administrator</h4>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {school.ownerName || 'N/A'}</p>
          <p><span className="font-medium">Email:</span> {school.ownerEmail || 'N/A'}</p>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700">{school.description || 'No description available'}</p>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Status</h4>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default SchoolManagement;
