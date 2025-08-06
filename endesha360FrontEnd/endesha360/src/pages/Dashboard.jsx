import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Users, BookOpen, BarChart3, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Total Students',
      value: '0',
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
    {
      title: 'Register Your School',
      description: 'Complete your school registration to get started',
      icon: School,
      action: () => navigate('/school-registration'),
      variant: 'primary'
    },
    {
      title: 'Add Students',
      description: 'Enroll new students to your driving school',
      icon: Users,
      action: () => {},
      variant: 'secondary',
      disabled: true
    },
    {
      title: 'Create Courses',
      description: 'Set up driving courses and programs',
      icon: BookOpen,
      action: () => {},
      variant: 'secondary',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFBE6]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#D5ED9F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#00712D]">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your driving school today
              </p>
            </div>
            <Button 
              onClick={() => navigate('/school-registration')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Register School</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <p className="text-xs text-gray-400">Pending approval</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-[#14274E] mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <BarChart3 className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-[#394867]">No activity yet</p>
                <p className="text-sm text-[#9BA4B4]">
                  Register your school to start tracking activity
                </p>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-br from-[#14274E] to-[#394867] rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <span className="text-sm">Register your school</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <span className="text-sm">Wait for admin approval</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <span className="text-sm">Start managing your school</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 text-white border-white hover:bg-white hover:text-[#14274E]"
                onClick={() => navigate('/school-registration')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
