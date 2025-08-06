import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-[#D5ED9F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#00712D] p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#00712D]">Endesha360</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-[#00712D] hover:text-[#FF9100] font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/school-registration" 
                  className="text-[#00712D] hover:text-[#FF9100] font-medium transition-colors"
                >
                  Register School
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-[#00712D] hover:text-[#FF9100] font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-[#00712D] hover:text-[#FF9100] font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#00712D]" />
                <span className="text-sm font-medium text-[#00712D]">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
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
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
