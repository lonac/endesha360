import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import SelectRole from './SelectRole';
import apiService from '../services/api';

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
      // Step 1: Detect which tenant this user belongs to
      console.log('Detecting tenant for user:', data.email);
      const userTenantCode = await apiService.detectUserTenant(data.email);
      console.log('Detected tenant code:', userTenantCode);

      // Step 2: Login with the detected tenant code
      const response = await login({
        email: data.email,
        password: data.password,
        tenantCode: userTenantCode // Dynamic tenant detection
      });
      
      // Check user role and redirect accordingly
      console.log('User object after login:', response.user);
      if (Array.isArray(response.user.roles)) {
        if (response.user.roles.includes('SCHOOL_OWNER')) {
          navigate('/dashboard');
        } else if (response.user.roles.includes('STUDENT')) {
          navigate('/student-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // fallback: try to handle string or missing roles
        if (response.user.role === 'SCHOOL_OWNER') {
          navigate('/dashboard');
        } else if (response.user.role === 'STUDENT') {
          navigate('/student-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f1] px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(0,113,45,0.14)]">
        <aside className="relative hidden w-[44%] overflow-hidden bg-[#00712D] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[34px] border-[#D5ED9F]/20" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#FF9100]/20" />
          <div className="relative z-10">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#00712D]">
                <LogIn className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">Endesha360</span>
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#D5ED9F]">Your learning journey</p>
            <h1 className="max-w-sm text-4xl font-bold leading-tight">Everything your school community needs, in one place.</h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/75">Manage learning, track progress, and stay connected with a simpler school experience.</p>
          </div>
          <div className="relative z-10 space-y-4 text-sm text-white/90">
            {['Personalized student progress', 'Clear school-wide insights', 'Secure access for every user'].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#D5ED9F]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00712D] text-white">
                <LogIn className="h-6 w-6" />
              </div>
              <p className="text-lg font-bold text-[#00712D]">Endesha360</p>
            </div>
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff8d8] text-[#00712D]">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
              <p className="mt-2 text-slate-500">Sign in to continue to your Endesha360 account.</p>
            </div>

            {error && (
              <div className="mb-5">
                <Alert type="error" message={error} onClose={() => setError('')} />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                required
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 rounded-md p-1 text-gray-400 transition-colors hover:text-[#00712D] focus:outline-none focus:ring-2 focus:ring-[#00712D]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-slate-500">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-[#D5ED9F] text-[#00712D] focus:ring-[#00712D]" {...register('rememberMe')} />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-[#00712D] hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" loading={loading} className="group w-full" size="lg">
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">Don't have an account?{' '}
                <button type="button" className="font-semibold text-[#00712D] hover:underline focus:outline-none" onClick={() => setIsRoleModalOpen(true)}>
                  Create one
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Role Selection */}
      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}>
        <SelectRole />
      </Modal>
    </div>
  );
};

export default Login;