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
  const { admin, getDashboardData } = useAdmin();
  
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
      
      // Fetch comprehensive dashboard data from backend
      const dashboardResponse = await getDashboardData();
      const dashboardData = dashboardResponse.data;

      // Set the real data from backend
      setDashboardData({
        schools: {
          total: dashboardData.schools?.total || 0,
          pending: dashboardData.schools?.pending || 0,
          active: dashboardData.schools?.active || 0,
          suspended: dashboardData.schools?.suspended || 0
        },
        users: {
          total: dashboardData.users?.total || 0,
          students: dashboardData.users?.students || 0,
          instructors: dashboardData.users?.instructors || 0,
          admins: dashboardData.users?.admins || 0
        },
        financial: {
          monthlyRevenue: dashboardData.financial?.monthlyRevenue || 0,
          totalRevenue: dashboardData.financial?.totalRevenue || 0,
          pendingPayments: dashboardData.financial?.pendingPayments || 0
        },
        system: {
          questionsCount: dashboardData.questions?.totalQuestions || 0,
          activeSchools: dashboardData.schools?.active || 0,
          systemHealth: dashboardData.system?.status || 'Unknown'
        }
      });

      // Set recent activities from backend
      const activities = (dashboardData.recentActivities || []).map(activity => ({
        id: activity.id,
        type: activity.type,
        message: activity.message,
        time: activity.time,
        icon: getIconForActivityType(activity.type)
      }));
      setRecentActivities(activities);

      // Generate system alerts based on real data
      const alerts = [];
      if (dashboardData.schools?.pending > 0) {
        alerts.push({
          type: 'warning',
          message: `${dashboardData.schools.pending} school${dashboardData.schools.pending > 1 ? 's' : ''} pending approval`,
          action: () => navigate('/admin/schools')
        });
      }
      if (dashboardData.financial?.pendingPayments > 1000) {
        alerts.push({
          type: 'info', 
          message: `$${dashboardData.financial.pendingPayments.toLocaleString()} in pending payments`,
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
        schools: { total: 0, pending: 0, active: 0, suspended: 0 },
        users: { total: 0, students: 0, instructors: 0, admins: 0 },
        financial: { monthlyRevenue: 0, totalRevenue: 0, pendingPayments: 0 },
        system: { questionsCount: 0, activeSchools: 0, systemHealth: 'Unknown' }
      });
      setRecentActivities([]);
      setSystemAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get icon for activity type
  const getIconForActivityType = (type) => {
    switch (type) {
      case 'school_registration':
        return School;
      case 'payment':
        return DollarSign;
      case 'system':
        return Shield;
      case 'question_management':
        return HelpCircle;
      default:
        return Activity;
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
          {change !== null && (
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
            change={null} // TODO: Calculate real change percentage
            icon={School}
            color="border-blue-500"
            onClick={() => navigate('/admin/schools')}
          />
          <StatCard
            title="Total Users"
            value={dashboardData.users.total.toLocaleString()}
            change={null} // TODO: Calculate real change percentage
            icon={Users}
            color="border-green-500"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${dashboardData.financial.monthlyRevenue.toLocaleString()}`}
            change={null} // TODO: Calculate real change percentage
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
              {recentActivities.length > 0 ? recentActivities.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activities</p>
                </div>
              )}
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
