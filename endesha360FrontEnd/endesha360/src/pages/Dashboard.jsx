import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { School, Users, BookOpen, BarChart3, Plus, CheckCircle, Clock, AlertCircle, UserPlus, UserCheck, LogIn, Edit, Shield, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Dashboard = () => {
  const { user, getMySchool, getMyStudentCount, getMyRecentActivities } = useAuth();
  const [school, setSchool] = useState(null);
  const [schoolLoading, setSchoolLoading] = useState(true);
  const [schoolError, setSchoolError] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [studentCountLoading, setStudentCountLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  // Fetch school info for school owner
  useEffect(() => {
    const fetchSchool = async () => {
      setSchoolLoading(true);
      setSchoolError(null);
      try {
        console.log("Calling getMySchool");
        const data = await getMySchool();
        console.log("getMySchool result:", data);
        setSchool(data);
      } catch (err) {
        setSchoolError(err.message);
      } finally {
        setSchoolLoading(false);
      }
    };
    if (user && (user.role === 'SCHOOL_OWNER' || (user.roles && user.roles.includes('SCHOOL_OWNER')))) {
      fetchSchool();
    }
  }, [user, getMySchool]);

  // Fetch student count for school owner
  useEffect(() => {
    const fetchStudentCount = async () => {
      if (school && school.isApproved) {
        console.log("Fetching student count for approved school:", school.name, "tenantCode:", school.tenantCode);
        setStudentCountLoading(true);
        try {
          const count = await getMyStudentCount();
          console.log("Student count fetched:", count, "type:", typeof count);
          setStudentCount(count);
        } catch (err) {
          console.error("Failed to fetch student count:", err);
          setStudentCount(0);
        } finally {
          setStudentCountLoading(false);
        }
      } else {
        console.log("School not ready for student count fetch. School:", school, "isApproved:", school?.isApproved);
      }
    };

    fetchStudentCount();
  }, [school, getMyStudentCount]);

  // Fetch recent activities for school owner
  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (school && school.isApproved) {
        console.log("Fetching recent activities for approved school:", school.name);
        setActivitiesLoading(true);
        try {
          const activities = await getMyRecentActivities(10);
          console.log("Recent activities fetched:", activities);
          setRecentActivities(activities);
        } catch (err) {
          console.error("Failed to fetch recent activities:", err);
          setRecentActivities([]);
        } finally {
          setActivitiesLoading(false);
        }
      } else {
        console.log("School not ready for activities fetch. School:", school, "isApproved:", school?.isApproved);
      }
    };

    fetchRecentActivities();
  }, [school, getMyRecentActivities]);

  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setAlertMessage(location.state.message);
      setAlertType(location.state.type || 'success');
      setShowAlert(true);
      
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Helper function to get icon for activity type
  const getIconForActivityType = (type) => {
    switch (type) {
      case 'STUDENT_REGISTRATION':
        return UserPlus;
      case 'INSTRUCTOR_REGISTRATION':
        return UserCheck;
      case 'STUDENT_ACTIVITY':
        return BookOpen;
      case 'INSTRUCTOR_ACTIVITY':
        return Users;
      case 'SCHOOL_UPDATE':
        return Edit;
      case 'SCHOOL_APPROVED':
        return CheckCircle;
      case 'SCHOOL_REJECTED':
        return AlertCircle;
      case 'SYSTEM':
        return Shield;
      default:
        return Activity;
    }
  };

  // Helper function to format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const stats = [
    {
      name: 'Total Students',
      value: studentCountLoading ? 'Loading...' : studentCount.toString(),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Courses',
      value: '0',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      name: 'Instructors',
      value: '0',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Revenue',
      value: '$0',
      icon: BarChart3,
      color: 'bg-yellow-500'
    }
  ];

  const quickActions = [
    // Show 'Register Your School' if no school exists
    ...(!school ? [{
      title: 'Register Your School',
      description: 'Complete your school registration to get started',
      icon: School,
      action: () => navigate('/school-registration'),
      variant: 'primary'
    }] : []),
    // Show 'Edit School Details' if school exists and is approved
    ...(school && school.isApproved ? [{
      title: 'Edit School Details',
      description: 'Update your school information',
      icon: School,
      action: () => navigate('/school-registration?edit=true'),
      variant: 'primary'
    }] : []),
    // Show 'Add Students' only if school is approved
    ...(school && school.isApproved ? [{
      title: 'Add Students',
      description: 'Enroll new students to your driving school',
      icon: Users,
      action: () => {
        console.log('Add Students clicked');
        navigate('/register?role=student&mode=add');
      },
      variant: 'secondary'
    }] : []),
    {
      title: 'Create Courses',
      description: 'Set up driving courses and programs',
      icon: BookOpen,
      action: () => {},
      variant: 'secondary',
      disabled: true
    }
  ];

  console.log("Dashboard user:", user, "role:", user.role, "roles:", user.roles);

  return (
  <div className="min-h-screen bg-[#FFFBE6] pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#D5ED9F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#00712D]">
                Welcome, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your driving school today
              </p>
            </div>
            {/* Show Register School button only if no school exists */}
            {!school && (
              <Button 
                onClick={() => navigate('/school-registration')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Register School</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Alert */}
        {showAlert && (
          <div className="mb-6">
            <Alert
              type={alertType}
              message={alertMessage}
              onClose={() => setShowAlert(false)}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-[#00712D]">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#D5ED9F]">
              <h2 className="text-xl font-semibold text-[#00712D] mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 border-2 border-dashed rounded-lg transition-all duration-200 ${
                        action.disabled 
                          ? 'border-gray-300 bg-gray-50' 
                          : 'border-[#00712D] hover:bg-[#D5ED9F]/20 cursor-pointer'
                      }`}
                      onClick={!action.disabled ? action.action : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${
                            action.disabled ? 'bg-gray-300' : 'bg-[#00712D]'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              action.disabled ? 'text-gray-500' : 'text-white'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              action.disabled ? 'text-gray-500' : 'text-[#00712D]'
                            }`}>
                              {action.title}
                            </h3>
                            <p className={`text-sm ${
                              action.disabled ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {action.description}
                            </p>
                          </div>
                        </div>
                        {action.disabled && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* School Status */}
          <div className="space-y-6">
            {/* Registration Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#14274E] mb-4">School Status</h3>
              <div className="space-y-4">
                {schoolLoading ? (
                  <div className="text-gray-500 text-sm">Loading school status...</div>
                ) : schoolError ? (
                  <div className="text-red-500 text-sm">{schoolError}</div>
                ) : !school ? (
                  <div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-[#14274E]">Registration</p>
                        <p className="text-xs text-[#394867]">Not registered</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Approval</p>
                        <p className="text-xs text-gray-400">Pending registration</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Status</p>
                        <p className="text-xs text-gray-400">Pending registration</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      {school.isApproved ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#14274E]">Registration</p>
                        <p className="text-xs text-[#394867]">
                          {school.name} ({school.registrationNumber})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {school.isApproved ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500">Approval</p>
                        <p className="text-xs text-gray-500">
                          {school.isApproved ? 'Approved' : 'Pending admin approval'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {school.isActive && school.isApproved ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500">Active Status</p>
                        <p className="text-xs text-gray-500">
                          {school.isActive && school.isApproved ? 'Active' : 'Inactive or pending approval'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#14274E] mb-4">Recent Activity</h3>
              
              {activitiesLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Activity className="h-12 w-12 mx-auto animate-pulse" />
                  </div>
                  <p className="text-[#394867]">Loading activities...</p>
                </div>
              ) : recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = getIconForActivityType(activity.activityType);
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {recentActivities.length >= 10 && (
                    <div className="text-center pt-2">
                      <p className="text-xs text-gray-500">Showing latest 10 activities</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Activity className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-[#394867]">No recent activity</p>
                  <p className="text-sm text-[#9BA4B4]">
                    {school && school.isApproved 
                      ? "Activities will appear here when students register or login"
                      : "Activities will appear after your school is approved"
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Removed Getting Started section */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;