import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { School, MapPin, Phone, Mail, Globe, FileText } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getMySchool, updateMySchool } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const schoolData = {
        name: data.name,
        registrationNumber: data.registrationNumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        website: data.website,
        description: data.description
      };
      if (editMode) {
        const response = await updateMySchool(schoolData);
        setSuccess('School details updated successfully!');
        setTimeout(() => {
          navigate('/dashboard', {
            state: {
              message: `School details updated successfully!`,
              type: 'success'
            }
          });
        }, 1000);
      } else {
        const response = await apiService.registerSchool(schoolData);
        navigate('/dashboard', {
          state: {
            message: `School "${response.name}" registered successfully! Your tenant code is: ${response.tenantCode}. Waiting for admin approval.`,
            type: 'success'
          }
        });
      }
    } catch (err) {
      if (err.message && err.message.includes('Access denied')) {
        setError('Your session has expired. Please login again.');
      } else if (err.message && err.message.includes('Validation Failed')) {
        setError('Please check all required fields and try again.');
      } else {
        setError(err.message || 'School registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Detect edit mode and fetch school data if needed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isEdit = params.get('edit') === 'true';
    setEditMode(isEdit);
    if (isEdit) {
      setLoading(true);
      getMySchool()
        .then((school) => {
          if (school) {
            setInitialValues(school);
            // Set form values
            Object.entries(school).forEach(([key, value]) => {
              if (typeof value === 'string' || typeof value === 'number') {
                setValue(key, value);
              }
            });
          }
        })
        .catch((err) => {
          setError('Failed to load school details for editing.');
        })
        .finally(() => setLoading(false));
    }
  }, [location.search, getMySchool, setValue]);

  return (
    <div className="min-h-screen bg-[#FFFBE6] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-[#00712D] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <School className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#00712D] mb-2">
            Register Your Driving School
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete the registration process to start managing your driving school with Endesha360
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
            className="mb-6"
          />
        )}
        
        {success && (
          <Alert 
            type="success" 
            title="Registration Successful!"
            message={success}
            className="mb-6"
          />
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#D5ED9F]">
          <div className="bg-[#00712D] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">School Information</h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00712D] flex items-center">
                <School className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="School Name"
                  required
                  placeholder="Enter your school name"
                  {...register('name', {
                    required: 'School name is required',
                    minLength: {
                      value: 3,
                      message: 'School name must be at least 3 characters'
                    }
                  })}
                  error={errors.name?.message}
                />
                
                <Input
                  label="Registration Number"
                  required
                  placeholder="e.g., REG123456"
                  {...register('registrationNumber', {
                    required: 'Registration number is required',
                    minLength: {
                      value: 5,
                      message: 'Registration number must be at least 5 characters'
                    }
                  })}
                  error={errors.registrationNumber?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="school@example.com"
                    className="pl-10"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={errors.email?.message}
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Phone Number"
                    required
                    placeholder="+254700123456"
                    className="pl-10"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: 'Invalid phone number format'
                      }
                    })}
                    error={errors.phone?.message}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00712D] flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h3>
              
              <Input
                label="Street Address"
                required
                placeholder="123 Main Street"
                {...register('address', {
                  required: 'Address is required'
                })}
                error={errors.address?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="City"
                  required
                  placeholder="City"
                  {...register('city', {
                    required: 'City is required'
                  })}
                  error={errors.city?.message}
                />
                
                <Input
                  label="State/Province"
                  placeholder="State or Province"
                  {...register('state')}
                  error={errors.state?.message}
                />
                
                <Input
                  label="Country"
                  required
                  placeholder="Country"
                  {...register('country', {
                    required: 'Country is required'
                  })}
                  error={errors.country?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Postal Code"
                  placeholder="12345"
                  {...register('postalCode')}
                  error={errors.postalCode?.message}
                />
                
                <div className="relative">
                  <Globe className="absolute left-3 top-9 h-4 w-4 text-gray-400" />
                  <Input
                    label="Website (Optional)"
                    type="url"
                    placeholder="https://www.yourschool.com"
                    className="pl-10"
                    {...register('website', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL starting with http:// or https://'
                      }
                    })}
                    error={errors.website?.message}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#00712D] flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Additional Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-[#00712D] mb-2">
                  School Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your driving school, services offered, and what makes you unique..."
                  className="w-full px-3 py-2 border border-[#D5ED9F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00712D] focus:border-transparent placeholder-gray-400 text-[#00712D] resize-none bg-white"
                  {...register('description', {
                    maxLength: {
                      value: 500,
                      message: 'Description must be less than 500 characters'
                    }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-[#D5ED9F]/20 p-4 rounded-lg border border-[#D5ED9F]">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-[#00712D] focus:ring-[#00712D] border-[#D5ED9F] rounded mt-1"
                  {...register('acceptTerms', {
                    required: 'You must accept the terms and conditions'
                  })}
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#00712D] hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#00712D] hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-500 ml-7">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={loading}
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="px-8"
              >
                {editMode ? 'Update School' : 'Register School'}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-[#D5ED9F]">
          <h3 className="text-lg font-semibold text-[#00712D] mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#00712D] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-gray-600">Your school registration is submitted for review</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FF9100] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-gray-600">Admin reviews and approves your school</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#D5ED9F] text-[#00712D] rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-gray-600">You receive access to your school management dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
