import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  School,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  Plus,
  ArrowRight,
  Calendar,
  Shield,
  Globe,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import AdminLayout from '../components/AdminLayout';
import { ErrorHandler, createAlertProps } from '../utils/errorHandler';

const AdminOverview = () => {
  const navigate = useNavigate();
  const { admin, getSchoolsByStatus } = useAdmin();
  
  // Enhanced state for comprehensive dashboard
  const [dashboardData, setDashboardData] = useState({
    schools: { total: 0, pending: 0, active: 0, suspended: 0 },
    users: { total: 0, students: 0, instructors: 0, admins: 0 },
    financial: { monthlyRevenue: 0, totalRevenue: 0, pendingPayments: 0 },
    system: { questionsCount: 0, activeSchools: 0, systemHealth: 'Good' }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '', show: false });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const showAlert = (type, message, details = null, retryable = false, onRetry = null) => {
    if (typeof type === 'object') {
      setAlert({ ...type, show: true });
    } else {
      setAlert({ type, message, details, retryable, onRetry, show: true });
    }
    setTimeout(() => setAlert({ type: '', message: '', show: false }), 5000);
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load school statistics from existing admin context
      const [pendingResponse, approvedResponse] = await Promise.all([
        getSchoolsByStatus('PENDING'),
        getSchoolsByStatus('APPROVED')
      ]);

      const pendingSchools = pendingResponse?.schools || [];
      const approvedSchools = approvedResponse?.schools || [];
      
      // Mock additional data for comprehensive dashboard
      const schoolsData = {
        total: pendingSchools.length + approvedSchools.length + 3, // +3 for demo suspended schools
        pending: pendingSchools.length,
        active: approvedSchools.length,
        suspended: 3
      };

      // Mock additional system data based on user stories
      const usersData = { total: 1250, students: 980, instructors: 65, admins: 12 };
      const financialData = { monthlyRevenue: 45000, totalRevenue: 180000, pendingPayments: 5000 };
      const systemData = { questionsCount: 450, activeSchools: approvedSchools.length, systemHealth: 'Good' };

      setDashboardData({
        schools: schoolsData,
        users: usersData,
        financial: financialData,
        system: systemData
      });

      // Create recent activities from pending schools and mock data
      const activities = [
        ...pendingSchools.slice(0, 3).map(school => ({
          id: school.id,
          type: 'school_registration',
          message: `New school "${school.schoolName}" registered`,
          time: new Date(school.createdAt).toLocaleDateString(),
          icon: School
        })),
        { id: 'mock1', type: 'payment', message: 'Payment received from DriveRight School ($500)', time: '4 hours ago', icon: DollarSign },
        { id: 'mock2', type: 'system', message: 'System backup completed successfully', time: '6 hours ago', icon: Shield },
        { id: 'mock3', type: 'alert', message: 'High traffic detected on platform', time: '8 hours ago', icon: TrendingUp }
      ];

      setRecentActivities(activities);
      
      // Generate system alerts based on data
      const alerts = [];
      if (schoolsData.pending > 0) {
        alerts.push({
          type: 'warning',
          message: `${schoolsData.pending} school${schoolsData.pending > 1 ? 's' : ''} pending approval`,
          action: () => navigate('/admin/schools')
        });
      }
      if (financialData.pendingPayments > 1000) {
        alerts.push({
          type: 'info', 
          message: `$${financialData.pendingPayments.toLocaleString()} in pending payments`,
          action: () => navigate('/admin/financial')
        });
      }
      setSystemAlerts(alerts);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      const alertProps = createAlertProps(error, 'dashboard data');
      showAlert(alertProps);
      
      // Set fallback data
      setDashboardData({
        schools: { total: 12, pending: 3, active: 8, suspended: 1 },
        users: { total: 1250, students: 980, instructors: 65, admins: 12 },
        financial: { monthlyRevenue: 45000, totalRevenue: 180000, pendingPayments: 5000 },
        system: { questionsCount: 450, activeSchools: 8, systemHealth: 'Good' }
      });
      setRecentActivities([
        { id: 1, type: 'school_registration', message: 'New school "SafeDrive Academy" registered', time: '2 hours ago', icon: School },
        { id: 2, type: 'payment', message: 'Payment received from DriveRight School ($500)', time: '4 hours ago', icon: DollarSign }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick actions based on user stories
  const quickActions = [
    { 
      title: 'Approve Schools', 
      description: 'Review pending school registrations',
      icon: School, 
      action: () => navigate('/admin/schools'),
      count: dashboardData.schools.pending,
      color: 'bg-blue-500'
    },
    { 
      title: 'Manage Questions', 
      description: 'System-wide exam question bank',
      icon: HelpCircle, 
      action: () => navigate('/admin/questions'),
      count: dashboardData.system.questionsCount,
      color: 'bg-green-500'
    },
    { 
      title: 'User Management', 
      description: 'Manage system users and permissions',
      icon: Users, 
      action: () => navigate('/admin/users'),
      count: dashboardData.users.total,
      color: 'bg-purple-500'
    },
    { 
      title: 'Financial Reports', 
      description: 'Revenue and billing management',
      icon: DollarSign, 
      action: () => navigate('/admin/financial'),
      count: `$${dashboardData.financial.monthlyRevenue.toLocaleString()}`,
      color: 'bg-orange-500'
    }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00712D]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#00712D]">System Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back, {admin?.name || 'Admin'}. Here's what's happening across the platform.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={loadDashboardData}
                className="flex items-center space-x-2"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {alert.show && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            details={alert.details}
            onClose={() => setAlert({ ...alert, show: false })}
            retryable={alert.retryable}
            onRetry={alert.onRetry}
          />
        )}

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {systemAlerts.map((alertItem, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  alertItem.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Bell className={`h-5 w-5 ${alertItem.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} />
                  <span className="font-medium text-gray-900">{alertItem.message}</span>
                </div>
                <Button variant="outline" size="sm" onClick={alertItem.action}>
                  View
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Schools"
            value={dashboardData.schools.total}
            change={12}
            icon={School}
            color="border-blue-500"
            onClick={() => navigate('/admin/schools')}
          />
          <StatCard
            title="Total Users"
            value={dashboardData.users.total.toLocaleString()}
            change={8}
            icon={Users}
            color="border-green-500"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${dashboardData.financial.monthlyRevenue.toLocaleString()}`}
            change={15}
            icon={DollarSign}
            color="border-purple-500"
            onClick={() => navigate('/admin/financial')}
          />
          <StatCard
            title="System Health"
            value={dashboardData.system.systemHealth}
            icon={Activity}
            color="border-green-500"
            onClick={() => navigate('/admin/system')}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={action.action}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{action.count}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center text-[#00712D] font-medium">
                  <span className="text-sm">Go to</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/logs')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">School Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Schools</span>
                <span className="font-semibold text-green-600">{dashboardData.schools.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Approval</span>
                <span className="font-semibold text-yellow-600">{dashboardData.schools.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Suspended</span>
                <span className="font-semibold text-red-600">{dashboardData.schools.suspended}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{dashboardData.schools.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
