import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import SelectRole from './SelectRole';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await login({
        email: data.email,
        password: data.password,
        tenantCode: 'PLATFORM' // School owners login to PLATFORM tenant
      });
      
      // Check user role and redirect accordingly
      if (response.user.roles?.includes('SCHOOL_OWNER')) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBE6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-[#00712D] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#00712D] mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your Endesha360 account
          </p>
        </div>

        {/* Alert */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        {/* Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required'
                })}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-[#00712D]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#00712D] focus:ring-[#00712D] border-[#D5ED9F] rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-[#00712D] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-medium text-[#00712D] hover:underline focus:outline-none bg-transparent"
                onClick={() => setIsRoleModalOpen(true)}
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#D5ED9F]">
          <h3 className="text-lg font-semibold text-[#00712D] mb-4 text-center">
            Why Choose Endesha360?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00712D] rounded-full"></div>
              <span className="text-sm text-gray-600">Complete school management solution</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00712D] rounded-full"></div>
              <span className="text-sm text-gray-600">Student progress tracking & analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00712D] rounded-full"></div>
              <span className="text-sm text-gray-600">Automated scheduling & notifications</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00712D] rounded-full"></div>
              <span className="text-sm text-gray-600">Multi-tenant architecture for scalability</span>
            </div>
          </div>
        </div>

        {/* Login Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            First time logging in?
          </h4>
          <p className="text-sm text-blue-700">
            Use the email and password you provided during school owner registration. 
            If you haven't registered yet, click "Register as School Owner" above.
          </p>
        </div>
      </div>

      {/* Modal for Role Selection */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}>
        <SelectRole />
      </Modal>
    </div>
  );
};

export default Login;