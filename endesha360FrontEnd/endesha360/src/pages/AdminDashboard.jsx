import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  LogOut,
  Shield,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import AdminLayout from '../components/AdminLayout';
import { ErrorHandler, createAlertProps } from '../utils/errorHandler';

const AdminDashboard = () => {
  const [pendingSchools, setPendingSchools] = useState([]);
  const [approvedSchools, setApprovedSchools] = useState([]);
  const [rejectedSchools, setRejectedSchools] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComments, setRejectComments] = useState('');
  const [showApprovalHistory, setShowApprovalHistory] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState([]);
  
  const { 
    admin, 
    logoutAdmin, 
    getPendingSchools, 
    getSchoolDetails, 
    approveSchool, 
    rejectSchool,
    getApprovalHistory,
    getSchoolsByStatus
  } = useAdmin();
  const navigate = useNavigate();


  useEffect(() => {
    loadSchoolsByTab(activeTab);
    // eslint-disable-next-line
  }, [activeTab]);

  const loadSchoolsByTab = async (tab) => {
    setIsLoading(true);
    setError('');
    try {
      if (tab === 'PENDING') {
        const response = await getSchoolsByStatus('PENDING');
        setPendingSchools(response.schools || []);
      } else if (tab === 'APPROVED') {
        const response = await getSchoolsByStatus('APPROVED');
        setApprovedSchools(response.schools || []);
      } else if (tab === 'REJECTED') {
        const response = await getSchoolsByStatus('REJECTED');
        setRejectedSchools(response.schools || []);
      }
    } catch (error) {
      const alertProps = createAlertProps(error, 'schools');
      setError(alertProps);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (schoolId) => {
    try {
      const response = await getSchoolDetails(schoolId);
      setSelectedSchool(response.school);
    } catch (error) {
      const alertProps = createAlertProps(error, 'schools');
      setError(alertProps);
    }
  };

  const handleApprove = async (schoolId) => {
    try {
      setActionLoading(true);
      setError('');
      await approveSchool(schoolId, 'School approved by admin');
      setSuccess('School approved successfully!');
      await loadSchoolsByTab('PENDING');
      setSelectedSchool(null);
    } catch (error) {
      const alertProps = createAlertProps(error, 'approval');
      setError(alertProps);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedSchool || !rejectComments.trim()) {
      setError({
        type: 'warning',
        title: 'Missing Information',
        message: 'Please provide rejection comments before proceeding.'
      });
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await rejectSchool(selectedSchool.id, rejectComments);
      setSuccess('School rejected successfully!');
      await loadSchoolsByTab('PENDING');
      setSelectedSchool(null);
      setShowRejectModal(false);
      setRejectComments('');
    } catch (error) {
      const alertProps = createAlertProps(error, 'rejection');
      setError(alertProps);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewHistory = async (schoolId) => {
    try {
      const response = await getApprovalHistory(schoolId);
      setApprovalHistory(response.history || []);
      setShowApprovalHistory(true);
    } catch (error) {
      const alertProps = createAlertProps(error, 'history');
      setError(alertProps);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#00712D]">School Management</h2>
              <p className="text-gray-600 mt-1">Review and approve school registrations</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/questions')}
                className="flex items-center space-x-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Manage Questions</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Alerts */}
        {error && (
          <Alert 
            {...(typeof error === 'string' ? {
              type: 'error',
              message: error
            } : error)}
            onClose={() => setError('')}
            onRetry={error?.retryable ? () => loadSchoolsByTab(activeTab) : undefined}
            className="mb-6"
          />
        )}
        {success && (
          <Alert 
            type="success" 
            message={success}
            onClose={() => setSuccess('')}
            className="mb-6"
          />
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Schools</p>
                <p className="text-2xl font-bold text-gray-900">{pendingSchools.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schools List with Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    {['PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-t-lg font-semibold focus:outline-none transition-colors ${
                          activeTab === tab
                            ? 'bg-[#00712D] text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setActiveTab(tab);
                          setSelectedSchool(null);
                        }}
                      >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadSchoolsByTab(activeTab)}
                    disabled={isLoading}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00712D] mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading schools...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(activeTab === 'PENDING' ? pendingSchools : activeTab === 'APPROVED' ? approvedSchools : rejectedSchools).length === 0 ? (
                      <div className="text-center py-8">
                        <School className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No {activeTab.toLowerCase()} schools to display</p>
                      </div>
                    ) : (
                      (activeTab === 'PENDING' ? pendingSchools : activeTab === 'APPROVED' ? approvedSchools : rejectedSchools).map((school) => (
                        <div
                          key={school.id}
                          className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                            selectedSchool?.id === school.id
                              ? 'border-[#00712D] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleViewDetails(school.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{school.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{school.email}</p>
                              <p className="text-sm text-gray-600">{school.address}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Owner: {school.ownerName || 'N/A'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewHistory(school.id);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* School Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">School Details</h2>
              </div>
              
              <div className="p-6">
                {selectedSchool ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{selectedSchool.name}</h3>
                      <p className="text-sm text-gray-600">{selectedSchool.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600">{selectedSchool.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phone</p>
                        <p className="text-sm text-gray-600">{selectedSchool.phoneNumber || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Address</p>
                        <p className="text-sm text-gray-600">{selectedSchool.address}</p>
                        <p className="text-sm text-gray-600">{selectedSchool.city}, {selectedSchool.country}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Website</p>
                        <p className="text-sm text-gray-600">{selectedSchool.website || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Owner</p>
                        <p className="text-sm text-gray-600">{selectedSchool.ownerName || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{selectedSchool.ownerEmail || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleApprove(selectedSchool.id)}
                        disabled={actionLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve School
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject School
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <School className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Select a school to view details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject School</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this school application:
            </p>
            <textarea
              value={rejectComments}
              onChange={(e) => setRejectComments(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
              rows={4}
              placeholder="Enter rejection reason..."
            />
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComments('');
                }}
                className="flex-1"
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRejectSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={actionLoading || !rejectComments.trim()}
              >
                {actionLoading ? 'Rejecting...' : 'Reject School'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approval History Modal */}
      {showApprovalHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Approval History</h3>
              <Button
                variant="ghost"
                onClick={() => setShowApprovalHistory(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {approvalHistory.length === 0 ? (
                <p className="text-gray-600">No approval history found</p>
              ) : (
                approvalHistory.map((record, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        record.actionType === 'APPROVED' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.actionType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(record.actionTimestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      By: {record.adminUsername}
                    </p>
                    <p className="text-sm text-gray-900">{record.comments}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
