import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Car, 
  Users, 
  Clock, 
  CreditCard, 
  Image, 
  Award, 
  Phone,
  Globe,
  MapPin,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Plus,
  X,
  Check,
  BookOpen
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const SchoolMarketingProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);

  const [formData, setFormData] = useState({
    // Course Offerings
    coursesOffered: [],
    licenseTypes: [],
    specializations: [],
    courseDurationWeeks: '',
    
    // Facilities & Services
    fleetSize: '',
    hasSimulators: false,
    simulatorCount: '',
    theoryRoomsCount: '',
    practicalVehicles: [],
    parkingSpaces: '',
    hasOnlineTheory: false,
    
    // Business Information
    operatingHours: {},
    pricingInfo: '',
    paymentMethods: [],
    cancellationPolicy: '',
    
    // Marketing Content
    logoUrl: '',
    galleryImages: [],
    achievements: '',
    successRate: '',
    totalGraduates: '',
    yearsInOperation: '',
    
    // Contact & Social Media
    socialMedia: {},
    whatsappNumber: '',
    secondaryPhone: '',
    
    // SEO & Marketing
    keywords: [],
    targetAudience: [],
    uniqueSellingPoints: []
  });

  // Predefined options
  const courseOptions = [
    'Manual Transmission',
    'Automatic Transmission',
    'Motorcycle',
    'Commercial Vehicle',
    'Defensive Driving',
    'Night Driving',
    'Highway Driving',
    'Parallel Parking'
  ];

  const licenseOptions = [
    'Class A - Motorcycle',
    'Class B - Light Vehicle',
    'Class C - Heavy Vehicle',
    'Class D - Public Transport',
    'Class E - Articulated Vehicle'
  ];

  const paymentMethodOptions = [
    'Cash',
    'Bank Transfer',
    'Mobile Money (M-Pesa)',
    'Credit Card',
    'Installments',
    'Corporate Billing'
  ];

  const targetAudienceOptions = [
    'Young Adults (18-25)',
    'Working Professionals',
    'Students',
    'Senior Citizens',
    'Corporate Clients',
    'International Students'
  ];

  // Load existing profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMarketingProfile();
      if (response) {
        setProfileData(response);
        setFormData({
          ...formData,
          ...response,
          coursesOffered: response.coursesOffered || [],
          licenseTypes: response.licenseTypes || [],
          specializations: response.specializations || [],
          practicalVehicles: response.practicalVehicles || [],
          galleryImages: response.galleryImages || [],
          paymentMethods: response.paymentMethods || [],
          keywords: response.keywords || [],
          targetAudience: response.targetAudience || [],
          uniqueSellingPoints: response.uniqueSellingPoints || [],
          socialMedia: response.socialMedia || {},
          operatingHours: response.operatingHours || {}
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // If error means profile not found, show empty form for new user
      if (
        (err.message && err.message.includes('Marketing profile not found')) ||
        (err.response && err.response.status === 404)
      ) {
        setProfileData(null);
        // Form data is already initialized with empty values
        console.log('No existing profile found, showing empty form for new user');
      } else if (err.response && err.response.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response && err.response.status >= 500) {
        setError('Server error occurred. Please try again later.');
      } else {
        setError('Failed to load marketing profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSocialMediaChange = (platform, url) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: url
      }
    }));
  };

  const handleOperatingHoursChange = (day, hours) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: hours
      }
    }));
  };

  const calculateCompletionPercentage = () => {
    const fields = [
      formData.coursesOffered.length > 0,
      formData.licenseTypes.length > 0,
      formData.fleetSize,
      formData.pricingInfo,
      formData.achievements,
      formData.successRate,
      formData.yearsInOperation,
      Object.keys(formData.operatingHours).length > 0,
      formData.paymentMethods.length > 0,
      formData.keywords.length > 0
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // Prepare data to match backend expectations
    const sanitizeNumber = (val) => {
      if (val === '' || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    // Flatten socialMedia (remove preferredContactMethods if present)
    const { socialMedia, ...rest } = formData;
    const socialMediaClean = { ...socialMedia };
    delete socialMediaClean.preferredContactMethods;

    // Prepare preferredContactMethods as top-level string
    const preferredContactMethods = Array.isArray(socialMedia.preferredContactMethods)
      ? socialMedia.preferredContactMethods.join(',')
      : '';

    // Build payload
    const payload = {
      ...rest,
      socialMedia: socialMediaClean,
      preferredContactMethods,
      fleetSize: sanitizeNumber(formData.fleetSize),
      simulatorCount: sanitizeNumber(formData.simulatorCount),
      theoryRoomsCount: sanitizeNumber(formData.theoryRoomsCount),
      parkingSpaces: sanitizeNumber(formData.parkingSpaces),
      successRate: sanitizeNumber(formData.successRate),
      totalGraduates: sanitizeNumber(formData.totalGraduates),
      yearsInOperation: sanitizeNumber(formData.yearsInOperation)
    };

    try {
      const response = await apiService.saveMarketingProfile(payload);
      setProfileData(response);
      setSuccess('Marketing profile saved successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save marketing profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async () => {
    if (!profileData) return;
    
    try {
      const newVisibility = !profileData.isPublic;
      const response = await apiService.toggleProfileVisibility(newVisibility);
      setProfileData(response);
      setSuccess(
        newVisibility 
          ? 'Profile is now visible to students!' 
          : 'Profile is now private'
      );
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
      setError(err.response?.data?.message || 'Failed to update visibility');
    }
  };

  const steps = [
    { id: 1, title: 'Courses & Services', icon: BookOpen },
    { id: 2, title: 'Facilities', icon: Building2 },
    { id: 3, title: 'Business Info', icon: Clock },
    { id: 4, title: 'Marketing', icon: Award },
    { id: 5, title: 'Contact & Social', icon: Phone }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBE6] pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00712D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketing profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBE6] pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-[#00712D] hover:text-[#005a24] mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-[#00712D]">School Marketing Profile</h1>
            <p className="text-gray-600 mt-2">
              Showcase your school to attract more students
            </p>
          </div>
          
          {profileData && (
            <div className="text-right">
              <div className="mb-4">
                <div className="text-sm text-gray-600">Profile Completion</div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-[#00712D] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileData.profileCompletionPercentage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-[#00712D]">
                    {profileData.profileCompletionPercentage || 0}%
                  </span>
                </div>
              </div>
              
              <Button
                onClick={toggleVisibility}
                variant={profileData.isPublic ? "outline" : "primary"}
                className="mb-2"
              >
                {profileData.isPublic ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Make Public
                  </>
                )}
              </Button>
              
              <div className="text-xs text-gray-500">
                {profileData.isPublic ? 'Visible to students' : 'Private profile'}
              </div>
            </div>
          )}
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}
        {success && <Alert type="success" message={success} className="mb-6" />}

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-[#00712D] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <step.icon className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Step 1: Courses & Services */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#00712D] mb-6">Courses & Services</h2>
              
              {/* Courses Offered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Courses Offered *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {courseOptions.map(course => (
                    <label key={course} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.coursesOffered.includes(course)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('coursesOffered', course);
                          } else {
                            const index = formData.coursesOffered.indexOf(course);
                            if (index > -1) handleArrayRemove('coursesOffered', index);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{course}</span>
                    </label>
                  ))}
                </div>
                {formData.coursesOffered.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.coursesOffered.map((course, index) => (
                      <span
                        key={index}
                        className="bg-[#00712D] text-white px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {course}
                        <button
                          onClick={() => handleArrayRemove('coursesOffered', index)}
                          className="ml-2 hover:bg-red-600 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* License Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Types Offered *
                </label>
                <div className="space-y-2 mb-3">
                  {licenseOptions.map(license => (
                    <label key={license} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.licenseTypes.includes(license)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('licenseTypes', license);
                          } else {
                            const index = formData.licenseTypes.indexOf(license);
                            if (index > -1) handleArrayRemove('licenseTypes', index);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{license}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Course Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Average Course Duration (weeks)"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.courseDurationWeeks ?? ''}
                  onChange={(e) => handleInputChange('courseDurationWeeks', e.target.value)}
                  placeholder="e.g., 8"
                />
              </div>
            </div>
          )}

          {/* Step 2: Facilities */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#00712D] mb-6">Facilities & Equipment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Fleet Size"
                  type="number"
                  min="0"
                  value={formData.fleetSize ?? ''}
                  onChange={(e) => handleInputChange('fleetSize', e.target.value)}
                  placeholder="Number of vehicles"
                />
                
                <Input
                  label="Theory Rooms"
                  type="number"
                  min="0"
                  value={formData.theoryRoomsCount ?? ''}
                  onChange={(e) => handleInputChange('theoryRoomsCount', e.target.value)}
                  placeholder="Number of classrooms"
                />
                
                <Input
                  label="Parking Spaces"
                  type="number"
                  min="0"
                  value={formData.parkingSpaces ?? ''}
                  onChange={(e) => handleInputChange('parkingSpaces', e.target.value)}
                  placeholder="Available parking spots"
                />
                
                <Input
                  label="Simulator Count"
                  type="number"
                  min="0"
                  value={formData.simulatorCount ?? ''}
                  onChange={(e) => handleInputChange('simulatorCount', e.target.value)}
                  placeholder="Number of driving simulators"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasSimulators}
                    onChange={(e) => handleInputChange('hasSimulators', e.target.checked)}
                    className="mr-2"
                  />
                  <span>We have driving simulators</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasOnlineTheory}
                    onChange={(e) => handleInputChange('hasOnlineTheory', e.target.checked)}
                    className="mr-2"
                  />
                  <span>We offer online theory classes</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Business Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#00712D] mb-6">Business Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Information
                </label>
                <textarea
                  value={formData.pricingInfo ?? ''}
                  onChange={(e) => handleInputChange('pricingInfo', e.target.value)}
                  placeholder="Describe your pricing structure, course fees, packages..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Methods Accepted
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {paymentMethodOptions.map(method => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('paymentMethods', method);
                          } else {
                            const index = formData.paymentMethods.indexOf(method);
                            if (index > -1) handleArrayRemove('paymentMethods', index);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Policy
                </label>
                <textarea
                  value={formData.cancellationPolicy ?? ''}
                  onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                  placeholder="Describe your cancellation and refund policy..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Operating Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operating Hours
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <span className="w-20 text-sm">{day}:</span>
                      <input
                        type="text"
                        value={formData.operatingHours[day] ?? ''}
                        onChange={(e) => handleOperatingHoursChange(day, e.target.value)}
                        placeholder="9:00 AM - 5:00 PM"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#00712D] focus:border-transparent text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Marketing Content */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#00712D] mb-6">Marketing Content</h2>
              
              {/* Logo URL */}
              <Input
                label="School Logo URL"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
              />

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images (URLs)
                </label>
                <div className="space-y-2">
                  {formData.galleryImages.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={image ?? ''}
                        onChange={(e) => {
                          const newImages = [...formData.galleryImages];
                          newImages[index] = e.target.value;
                          handleInputChange('galleryImages', newImages);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                      <button
                        onClick={() => handleArrayRemove('galleryImages', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      galleryImages: [...prev.galleryImages, '']
                    }))}
                    className="flex items-center text-[#00712D] hover:text-[#005a24]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Image URL
                  </button>
                </div>
              </div>

              {/* Achievements & Success Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.successRate}
                    onChange={(e) => handleInputChange('successRate', e.target.value)}
                    placeholder="95"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                  />
                </div>
                
                <Input
                  label="Total Graduates"
                  type="number"
                  min="0"
                  value={formData.totalGraduates}
                  onChange={(e) => handleInputChange('totalGraduates', e.target.value)}
                  placeholder="1500"
                />
                
                <Input
                  label="Years in Operation"
                  type="number"
                  min="0"
                  value={formData.yearsInOperation}
                  onChange={(e) => handleInputChange('yearsInOperation', e.target.value)}
                  placeholder="10"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements & Awards
                </label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => handleInputChange('achievements', e.target.value)}
                  placeholder="List your school's achievements, awards, certifications..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Keywords for SEO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-[#00712D] text-white px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {keyword}
                      <button
                        onClick={() => handleArrayRemove('keywords', index)}
                        className="ml-2 hover:bg-red-600 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add keyword..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('keywords', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleArrayAdd('keywords', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-[#00712D] text-white rounded hover:bg-[#005a24]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {targetAudienceOptions.map(audience => (
                    <label key={audience} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.targetAudience.includes(audience)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('targetAudience', audience);
                          } else {
                            const index = formData.targetAudience.indexOf(audience);
                            if (index > -1) handleArrayRemove('targetAudience', index);
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{audience}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Unique Selling Points */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unique Selling Points
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.uniqueSellingPoints.map((point, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {point}
                      <button
                        onClick={() => handleArrayRemove('uniqueSellingPoints', index)}
                        className="ml-2 hover:bg-red-600 hover:text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add unique selling point..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('uniqueSellingPoints', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleArrayAdd('uniqueSellingPoints', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-[#00712D] text-white rounded hover:bg-[#005a24]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Contact & Social Media */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#00712D] mb-6">Contact & Social Media</h2>
              
              {/* Additional Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="WhatsApp Number"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  placeholder="+254712345678"
                />
                
                <Input
                  label="Secondary Phone"
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                  placeholder="+254712345679"
                />
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Social Media Profiles
                </label>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Facebook</label>
                      <input
                        type="url"
                        value={formData.socialMedia.facebook ?? ''}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/yourschool"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                      <input
                        type="url"
                        value={formData.socialMedia.instagram ?? ''}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/yourschool"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Twitter/X</label>
                      <input
                        type="url"
                        value={formData.socialMedia.twitter ?? ''}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/yourschool"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                      <input
                        type="url"
                        value={formData.socialMedia.linkedin ?? ''}
                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/company/yourschool"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">YouTube</label>
                      <input
                        type="url"
                        value={formData.socialMedia.youtube ?? ''}
                        onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/channel/yourschool"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">TikTok</label>
                      <input
                        type="url"
                        value={formData.socialMedia.tiktok ?? ''}
                        onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                        placeholder="https://tiktok.com/@yourschool"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Website */}
              <Input
                label="School Website"
                type="url"
                value={formData.socialMedia.website ?? ''}
                onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                placeholder="https://yourschool.com"
              />

              {/* Additional Contact Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Contact Information
                </label>
                <textarea
                  value={formData.socialMedia.additionalNotes ?? ''}
                  onChange={(e) => handleSocialMediaChange('additionalNotes', e.target.value)}
                  placeholder="Any additional contact information, office hours notes, or communication preferences..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Contact Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Methods
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Phone Call', 'WhatsApp', 'Email', 'SMS', 'Social Media', 'Walk-in'].map(method => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.socialMedia.preferredContactMethods?.includes(method) || false}
                        onChange={(e) => {
                          const currentMethods = formData.socialMedia.preferredContactMethods || [];
                          if (e.target.checked) {
                            handleSocialMediaChange('preferredContactMethods', [...currentMethods, method]);
                          } else {
                            handleSocialMediaChange('preferredContactMethods', currentMethods.filter(m => m !== method));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="outline"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00712D] mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </>
                )}
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolMarketingProfile;
