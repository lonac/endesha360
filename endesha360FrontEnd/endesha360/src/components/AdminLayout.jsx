import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  School, 
  HelpCircle, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/Button';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navigation = [
    {
      name: 'Overview',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'School Management',
      href: '/admin/schools',
      icon: School,
      current: location.pathname === '/admin/schools',
      description: 'Approve and manage schools'
    },
    {
      name: 'Question Management',
      href: '/admin/questions',
      icon: HelpCircle,
      current: location.pathname === '/admin/questions',
      description: 'System-wide exam questions'
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users',
      description: 'Manage system users'
    },
    {
      name: 'Financial Management',
      href: '/admin/financial',
      icon: DollarSign,
      current: location.pathname === '/admin/financial',
      description: 'Billing and revenue tracking'
    },
    {
      name: 'Analytics & Reports',
      href: '/admin/reports',
      icon: BarChart3,
      current: location.pathname === '/admin/reports',
      description: 'Usage statistics and reports'
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings',
      description: 'Platform configuration'
    },
    {
      name: 'Support & Logs',
      href: '/admin/logs',
      icon: FileText,
      current: location.pathname === '/admin/logs',
      description: 'System logs and support'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F6F9]">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          </div>
          <Sidebar navigation={navigation} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar navigation={navigation} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-[#D5ED9F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-[#00712D] p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#00712D]">Admin Portal</h1>
                  <p className="text-sm text-gray-600">System Administration</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {admin?.username}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({ navigation }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="bg-[#00712D] p-2 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-[#00712D]">Endesha360</h2>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`${
                  item.current
                    ? 'bg-[#00712D] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors`}
              >
                <Icon
                  className={`${
                    item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-6 w-6 transition-colors`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
