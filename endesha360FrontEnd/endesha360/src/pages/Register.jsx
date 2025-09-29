import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registerSchoolOwner, registerStudent, user, getMySchool } = useAuth();
  const [school, setSchool] = useState(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get('role') || 'owner'; // default to owner if not specified
  const mode = params.get('mode');
  // If school owner is adding a student, fetch their school info for tenantCode
  useEffect(() => {
    const fetchSchool = async () => {
      if (user && user.roles && user.roles.includes('SCHOOL_OWNER') && mode === 'add') {
        try {
          const schoolData = await getMySchool();
          setSchool(schoolData);
        } catch (err) {
          setSchool(null);
        }
      }
    };
    fetchSchool();
  }, [user, mode, getMySchool]);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Generate username from email if not provided
      const username = data.email.split('@')[0];

      let userData = {
        username: username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password
      };

      if (role === 'student') {
        // If school owner is adding a student, use their tenantCode
        if (mode === 'add' && user && user.roles && user.roles.includes('SCHOOL_OWNER')) {
          
          console.log('=== SCHOOL OWNER ADDING STUDENT DEBUG ===');
          console.log('User:', user);
          console.log('School:', school);
          console.log('Mode:', mode);
          
          if (!school) {
            setError('Unable to fetch school information. Please refresh and try again.');
            setLoading(false);
            return;
          }
          
          if (!school.tenantCode) {
            setError('School tenant code not found. Please contact support.');
            setLoading(false);
            return;
          }
          
          if (!school.isApproved) {
            setError('Your school is not yet approved by the admin. Student registration is not available until approval.');
            setLoading(false);
            return;
          }
          
          userData.tenantCode = school.tenantCode;
          console.log('Registering student with tenantCode:', school.tenantCode);
          console.log('Full userData:', userData);
          
          await registerStudent(userData);
          setSuccess('Student added successfully!');
          
          // Redirect school owner back to dashboard after successful student registration
          setTimeout(() => {
            navigate('/dashboard', {
              state: {
                message: `Student ${userData.firstName} ${userData.lastName} has been registered successfully!`,
                type: 'success'
              }
            });
          }, 2000);
        } else {
          userData.tenantCode = 'PLATFORM';
          await registerStudent(userData);
          setSuccess('Student registration successful! You can now login and book your driving lessons.');
          
          // Redirect to student dashboard for individual registrations
          setTimeout(() => {
            navigate('/student-dashboard');
          }, 3000);
        }
      } else {
        await registerSchoolOwner(userData);
        setSuccess('School owner registration successful! You can now login to manage your driving school.');
        
        // Redirect to login for school owner registrations
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#00712D] mb-2">
            {role === 'student' ? 'Student Registration' : 'Register as School Owner'}
          </h2>
          <p className="text-gray-600">
            {role === 'student'
              ? 'Create your account to book driving lessons and track your progress.'
              : 'Create your account to start managing your driving school with Endesha360'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}
        
        {success && (
          <Alert 
            type="success" 
            message={success}
          />
        )}

        {/* Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                placeholder="Enter your first name"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 50,
                    message: 'First name must not exceed 50 characters'
                  }
                })}
                error={errors.firstName?.message}
              />
              
              <Input
                label="Last Name"
                required
                placeholder="Enter your last name"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Last name must not exceed 50 characters'
                  }
                })}
                error={errors.lastName?.message}
              />
            </div>

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                maxLength: {
                  value: 100,
                  message: 'Email must not exceed 100 characters'
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              error={errors.email?.message}
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+254700123456 (optional)"
              {...register('phoneNumber', {
                maxLength: {
                  value: 20,
                  message: 'Phone number must not exceed 20 characters'
                },
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$/,
                  message: 'Invalid phone number format'
                }
              })}
              error={errors.phoneNumber?.message}
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create a strong password (min 8 characters)"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  maxLength: {
                    value: 255,
                    message: 'Password must not exceed 255 characters'
                  }
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

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => 
                    value === password || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-[#00712D]"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Terms and conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-[#00712D] focus:ring-[#00712D] border-[#D5ED9F] rounded mt-1"
                {...register('terms', {
                  required: 'You must agree to the terms and conditions'
                })}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-[#00712D] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#00712D] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {loading
                ? 'Creating Account...'
                : role === 'student'
                  ? 'Create Student Account'
                  : 'Create School Owner Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-[#00712D] hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            What happens next?
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            {role === 'student' ? (
              <>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">1.</span>
                  <span>Create your student account</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">2.</span>
                  <span>Login to book driving lessons</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">3.</span>
                  <span>Track your lesson progress and achievements</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">1.</span>
                  <span>Create your school owner account</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">2.</span>
                  <span>Login to access your dashboard</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">3.</span>
                  <span>Register your driving school business</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold">4.</span>
                  <span>Start managing students, instructors, and operations</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
