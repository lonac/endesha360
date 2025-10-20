import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Award,
  BookOpen,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Star,
  Users,
  Shield,
  TrendingUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Button from '../components/Button';
import apiService from '../services/api';

const SchoolAdvertisement = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadSchoolProfile();
  }, [schoolId]);

  const loadSchoolProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPublicSchoolProfile(schoolId);
      setProfileData(response);
    } catch (error) {
      console.error('Failed to load school profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (profileData?.galleryImages?.length > 0) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % profileData.galleryImages.length
      );
    }
  };

  const prevImage = () => {
    if (profileData?.galleryImages?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? profileData.galleryImages.length - 1 : prev - 1
      );
    }
  };

  const handleWhatsAppContact = () => {
    if (profileData?.whatsappNumber) {
      window.open(`https://wa.me/${profileData.whatsappNumber.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleEnrollClick = () => {
    // Navigate to enrollment page or open contact form
    navigate(`/enroll/${schoolId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBE6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00712D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading school profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#FFFBE6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">School profile not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBE6] to-white">
      {/* Hero Section with Background Pattern */}
      <div className="relative bg-gradient-to-br from-[#00712D] via-[#009e3c] to-[#00712D] text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF9100] rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#D5ED9F] rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* School Header with Enhanced Logo */}
          <div className="text-center mb-12">
            {profileData.logoUrl && (
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9100] to-[#D5ED9F] rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <img 
                  src={profileData.logoUrl} 
                  alt="School Logo" 
                  className="relative w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover mx-auto transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tight">
              {profileData.schoolName || 'Driving School'}
            </h1>
            {profileData.tagline ? (
              <p className="text-3xl md:text-4xl font-light italic text-[#D5ED9F] mb-2">
                "{profileData.tagline}"
              </p>
            ) : (
              <p className="text-3xl md:text-4xl font-light italic text-[#D5ED9F] mb-2">
                "Drive with Confidence, Succeed with Excellence"
              </p>
            )}
            
            {/* Quick Action Buttons in Hero */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button
                onClick={handleEnrollClick}
                className="bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-10 py-5 text-xl font-bold rounded-full shadow-2xl hover:shadow-[#FF9100]/50 transform hover:scale-105 transition-all duration-300 border-4 border-white"
              >
                🎓 Enroll Now
              </Button>
              {profileData.whatsappNumber && (
                <Button
                  onClick={handleWhatsAppContact}
                  className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-10 py-5 text-xl font-bold rounded-full shadow-2xl hover:shadow-[#25D366]/50 transform hover:scale-105 transition-all duration-300 border-4 border-white flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>WhatsApp Us</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Enhanced Key Stats with Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {profileData.successRate && (
              <div className="group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <div className="text-5xl font-black mb-2">{profileData.successRate}%</div>
                <div className="text-sm font-semibold uppercase tracking-wide">Success Rate</div>
              </div>
            )}
            {profileData.totalGraduates && (
              <div className="group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-gradient-to-br from-[#D5ED9F] to-[#b8d47f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-[#00712D]" />
                </div>
                <div className="text-5xl font-black mb-2">{profileData.totalGraduates.toLocaleString()}+</div>
                <div className="text-sm font-semibold uppercase tracking-wide">Graduates</div>
              </div>
            )}
            {profileData.yearsInOperation && (
              <div className="group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8" />
                </div>
                <div className="text-5xl font-black mb-2">{profileData.yearsInOperation}</div>
                <div className="text-sm font-semibold uppercase tracking-wide">Years of Excellence</div>
              </div>
            )}
            {profileData.fleetSize && (
              <div className="group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-gradient-to-br from-[#D5ED9F] to-[#b8d47f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Car className="h-8 w-8 text-[#00712D]" />
                </div>
                <div className="text-5xl font-black mb-2">{profileData.fleetSize}</div>
                <div className="text-sm font-semibold uppercase tracking-wide">Modern Vehicles</div>
              </div>
            )}
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FFFBE6"/>
          </svg>
        </div>
      </div>

      {/* Main Content - Timeline Journey Layout */}
      <div className="relative">
        
        {/* Hero Section with Journey Introduction */}
        <div className="bg-gradient-to-br from-[#FFFBE6] to-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-6 py-2 rounded-full font-bold text-sm uppercase mb-6">
                🚗 Your Driving Journey Starts Here
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-[#00712D] mb-6 leading-tight">
                From Zero to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9100] to-[#D5ED9F]">
                  License Hero
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of successful graduates who transformed their lives through our comprehensive driving education program
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-black text-[#00712D]">{profileData.successRate || 95}%</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#00712D]">{profileData.totalGraduates?.toLocaleString() || '1000'}+</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">Graduates</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-[#00712D]">{profileData.fleetSize || 25}</div>
                  <div className="text-sm font-semibold text-gray-600 uppercase">Modern Vehicles</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Journey Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Timeline Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[#00712D] mb-4">
                Your Complete Learning Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From enrollment to license - we guide you through every step of your driving education
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-[#00712D] to-[#FF9100] h-full hidden md:block"></div>
              
              {/* Timeline Steps */}
              <div className="space-y-16">
                
                {/* Step 1: Enrollment */}
                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#00712D] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] text-white rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-center md:justify-end mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                          <span className="text-3xl">📍</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#D5ED9F] uppercase tracking-wider">Step 1</div>
                          <h3 className="text-2xl font-black">Enrollment</h3>
                        </div>
                      </div>
                      <p className="text-lg leading-relaxed mb-6">
                        Begin your journey with our easy enrollment process. Choose your preferred course package and get started immediately.
                      </p>
                      
                      {/* Enrollment CTA */}
                      <Button
                        onClick={handleEnrollClick}
                        className="bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        🎓 Start Your Journey
                      </Button>
                    </div>
                  </div>
                  
                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>

                {/* Step 2: Theory */}
                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#FF9100] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 md:order-2 md:pl-12">
                    <div className="bg-gradient-to-br from-[#FFFBE6] to-white border-4 border-[#D5ED9F] rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-start mb-4">
                        <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-2xl p-3 mr-4">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#00712D] uppercase tracking-wider">Step 2</div>
                          <h3 className="text-2xl font-black text-[#00712D]">Theory Training</h3>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Master the rules of the road with our comprehensive theory classes. Learn traffic laws, road signs, and safe driving principles.
                      </p>
                      
                      {/* Theory Details */}
                      <div className="space-y-3">
                        {profileData.theoryRoomsCount && (
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-[#00712D]" />
                            <span className="text-gray-700">{profileData.theoryRoomsCount} Modern Theory Rooms</span>
                          </div>
                        )}
                        {profileData.simulatorCount && (
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-[#00712D]" />
                            <span className="text-gray-700">{profileData.simulatorCount} Driving Simulators</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2 md:order-1"></div>
                </div>

                {/* Step 3: Practical */}
                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#00712D] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] text-white rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-center md:justify-end mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                          <Car className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#D5ED9F] uppercase tracking-wider">Step 3</div>
                          <h3 className="text-2xl font-black">Practical Training</h3>
                        </div>
                      </div>
                      <p className="text-lg leading-relaxed mb-6">
                        Experience hands-on driving with our expert instructors and modern vehicle fleet. Build confidence behind the wheel.
                      </p>
                      
                      {/* Fleet Info */}
                      <div className="space-y-3">
                        {profileData.fleetSize && (
                          <div className="flex items-center justify-end space-x-3">
                            <span className="text-white/90">{profileData.fleetSize} Modern Vehicles</span>
                            <Car className="h-5 w-5 text-[#D5ED9F]" />
                          </div>
                        )}
                        {profileData.practicalVehicles && profileData.practicalVehicles.length > 0 && (
                          <div className="flex flex-wrap justify-end gap-2 mt-4">
                            {profileData.practicalVehicles.slice(0, 3).map((vehicle, index) => (
                              <span key={index} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                {vehicle}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>

                {/* Step 4: Test */}
                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#FF9100] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 md:order-2 md:pl-12">
                    <div className="bg-gradient-to-br from-[#FFFBE6] to-white border-4 border-[#D5ED9F] rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-start mb-4">
                        <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-2xl p-3 mr-4">
                          <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#00712D] uppercase tracking-wider">Step 4</div>
                          <h3 className="text-2xl font-black text-[#00712D]">Final Test</h3>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Take your driving test with confidence. Our comprehensive preparation ensures you're ready for success.
                      </p>
                      
                      {/* Success Stats */}
                      <div className="bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-black">{profileData.successRate || 95}%</div>
                            <div className="text-sm text-white/80">Pass Rate</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">🎯</div>
                            <div className="text-sm text-white/80">First Time</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2 md:order-1"></div>
                </div>

                {/* Step 5: License */}
                <div className="relative flex flex-col md:flex-row items-center">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#00712D] rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] text-white rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-center justify-center md:justify-end mb-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#D5ED9F] uppercase tracking-wider">Step 5</div>
                          <h3 className="text-2xl font-black">Get Your License</h3>
                        </div>
                      </div>
                      <p className="text-lg leading-relaxed mb-6">
                        Celebrate your achievement! Join our community of confident, skilled drivers and continue your safe driving journey.
                      </p>
                      
                      {/* License Types */}
                      {profileData.licenseTypes && profileData.licenseTypes.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-bold text-[#D5ED9F] uppercase">Available Licenses:</div>
                          <div className="flex flex-wrap justify-end gap-2">
                            {profileData.licenseTypes.map((license, index) => (
                              <span key={index} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                {license}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Spacer for desktop */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        {profileData.uniqueSellingPoints && profileData.uniqueSellingPoints.length > 0 && (
          <div className="bg-[#FFFBE6] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white px-6 py-2 rounded-full font-bold text-sm uppercase mb-6">
                  ⭐ Why Choose Our School
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#00712D] mb-6">
                  What Makes Us Different
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Experience excellence in every aspect of your driving education
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {profileData.uniqueSellingPoints.map((point, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border-4 border-[#D5ED9F] hover:shadow-2xl transform hover:-translate-y-2 transition-all">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] rounded-2xl p-3">
                          <CheckCircle className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-800 leading-relaxed">{point}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Contact Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              {/* Pricing Information */}
              <div>
                <div className="inline-block bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-6 py-2 rounded-full font-bold text-sm uppercase mb-6">
                  💰 Transparent Pricing
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#00712D] mb-8">
                  Investment in Your Future
                </h2>
                
                {profileData.pricingInfo && (
                  <div className="bg-gradient-to-br from-[#FFFBE6] to-white border-4 border-[#D5ED9F] rounded-3xl p-8 mb-8">
                    <p className="text-xl text-gray-700 leading-relaxed">{profileData.pricingInfo}</p>
                  </div>
                )}
                
                {/* Payment Methods */}
                {profileData.paymentMethods && profileData.paymentMethods.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-[#00712D] mb-4">💳 Payment Options</h3>
                    <div className="flex flex-wrap gap-3">
                      {profileData.paymentMethods.map((method, index) => (
                        <span key={index} className="bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white px-6 py-3 rounded-full text-lg font-bold">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Cancellation Policy */}
                {profileData.cancellationPolicy && (
                  <div className="bg-gradient-to-br from-[#FFF9E6] to-white border-2 border-[#FF9100]/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-[#00712D] mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-[#FF9100]" />
                      Cancellation Policy
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{profileData.cancellationPolicy}</p>
                  </div>
                )}
              </div>
              
              {/* Contact & Enrollment */}
              <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] text-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-3xl font-black mb-6 text-center">Ready to Start?</h3>
                <p className="text-lg text-white/90 mb-8 text-center">
                  Take the first step towards your driving license today
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-4 mb-8">
                  <Button
                    onClick={handleEnrollClick}
                    className="w-full bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white py-4 px-8 rounded-full font-black text-xl hover:shadow-2xl transform hover:scale-105 transition-all border-4 border-white"
                  >
                    🎓 Enroll Now - Start Your Journey
                  </Button>
                  
                  {profileData.whatsappNumber && (
                    <button
                      onClick={handleWhatsAppContact}
                      className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all border-4 border-white flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span>Chat on WhatsApp</span>
                    </button>
                  )}
                </div>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-bold text-[#D5ED9F] mb-3">Contact Information</h4>
                    {profileData.whatsappNumber && (
                      <div className="flex items-center space-x-3 text-white/90">
                        <Phone className="h-5 w-5" />
                        <span>{profileData.whatsappNumber}</span>
                      </div>
                    )}
                    {profileData.secondaryPhone && (
                      <div className="flex items-center space-x-3 text-white/90">
                        <Phone className="h-5 w-5" />
                        <span>{profileData.secondaryPhone}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Operating Hours */}
                  {profileData.operatingHours && Object.keys(profileData.operatingHours).length > 0 && (
                    <div className="border-t border-white/20 pt-4">
                      <h4 className="font-bold text-[#D5ED9F] mb-3">Operating Hours</h4>
                      <div className="space-y-1">
                        {Object.entries(profileData.operatingHours).slice(0, 3).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-sm">
                            <span className="font-medium">{day}</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        {profileData.galleryImages && profileData.galleryImages.length > 0 && (
          <div className="bg-[#FFFBE6] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-[#00712D] mb-4">
                  Our Facilities
                </h2>
                <p className="text-xl text-gray-600">Modern training environment designed for your success</p>
              </div>
              
              <div className="relative max-w-4xl mx-auto">
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={profileData.galleryImages[currentImageIndex]} 
                    alt={`Facility ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation */}
                  {profileData.galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full p-3 transition-all"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full p-3 transition-all"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold">
                        {currentImageIndex + 1} / {profileData.galleryImages.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {profileData.achievements && (
          <div className="bg-gradient-to-br from-[#FFFBE6] to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-6 py-2 rounded-full font-bold text-sm uppercase mb-6">
                  🏆 Our Achievements
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-[#00712D] mb-6">
                  Excellence in Action
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Celebrating milestones that define our commitment to driving education excellence
                </p>
              </div>

              {/* Achievement Story Section */}
              <div className="bg-gradient-to-r from-[#00712D] via-[#009e3c] to-[#00712D] text-white rounded-3xl p-12 shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-block bg-[#FF9100] text-white px-4 py-2 rounded-full font-bold text-sm uppercase mb-6">
                      🏆 Hall of Fame
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black mb-6">
                      Our Legacy of Excellence
                    </h3>
                    <p className="text-xl leading-relaxed text-white/90 mb-8">
                      {profileData.achievements}
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <CheckCircle className="h-6 w-6 text-[#D5ED9F]" />
                        </div>
                        <span className="text-lg">Licensed & Accredited Training Center</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <CheckCircle className="h-6 w-6 text-[#D5ED9F]" />
                        </div>
                        <span className="text-lg">Certified Professional Instructors</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <CheckCircle className="h-6 w-6 text-[#D5ED9F]" />
                        </div>
                        <span className="text-lg">Modern Training Facilities & Equipment</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Achievement Visual */}
                    <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-3xl p-8 text-center">
                      <div className="text-8xl mb-4">🏆</div>
                      <h4 className="text-2xl font-black mb-4">Trusted by Thousands</h4>
                      <p className="text-lg text-white/90">
                        Building confident drivers and safer roads since day one
                      </p>

                      {/* Achievement Badges */}
                      <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                          🥇 Top Rated
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                          ⭐ 5-Star Reviews
                        </span>
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                          🎯 Excellence Award
                        </span>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-[#D5ED9F] text-[#00712D] rounded-full w-16 h-16 flex items-center justify-center font-black text-xl shadow-lg animate-bounce">
                      ✓
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-[#FF9100] text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg shadow-lg animate-pulse">
                      🎓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Premium Bottom CTA Section */}
      <div className="relative bg-gradient-to-br from-[#00712D] via-[#009e3c] to-[#00712D] text-white py-20 mt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF9100] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D5ED9F] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Attention Badge */}
          <div className="inline-block bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6 animate-bounce">
            ⚡ Limited Slots Available
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Ready to Start Your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9100] to-[#D5ED9F]">
              Driving Journey?
            </span>
          </h2>
          
          <p className="text-2xl md:text-3xl mb-4 font-light">
            Join <span className="font-black text-[#D5ED9F]">{profileData.totalGraduates?.toLocaleString() || 'thousands of'}</span> successful graduates!
          </p>
          
          <p className="text-xl mb-10 text-white/80">
            🎓 Expert Instructors • 🚗 Modern Fleet • ✅ {profileData.successRate || '95'}% Success Rate
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-8">
            <Button
              onClick={handleEnrollClick}
              className="group bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white hover:from-[#e6820e] hover:to-[#FF9100] px-12 py-6 text-2xl font-black rounded-full shadow-2xl hover:shadow-[#FF9100]/50 transform hover:scale-105 transition-all border-6 border-white"
            >
              <span className="flex items-center justify-center">
                🎓 Enroll Now
                <ChevronRight className="h-7 w-7 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            {profileData.whatsappNumber && (
              <Button
                onClick={handleWhatsAppContact}
                className="group bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] px-12 py-6 text-2xl font-black rounded-full shadow-2xl hover:shadow-[#25D366]/50 transform hover:scale-105 transition-all border-6 border-white flex items-center justify-center space-x-3"
              >
                <MessageCircle className="h-7 w-7 group-hover:rotate-12 transition-transform" />
                <span>Chat on WhatsApp</span>
              </Button>
            )}
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full">
              <Shield className="h-5 w-5 text-[#D5ED9F]" />
              <span>Licensed & Certified</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full">
              <Award className="h-5 w-5 text-[#D5ED9F]" />
              <span>{profileData.yearsInOperation || '10'}+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full">
              <Users className="h-5 w-5 text-[#D5ED9F]" />
              <span>Trusted by Thousands</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdvertisement;
