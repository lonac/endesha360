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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Premium Image Gallery Carousel */}
        {profileData.galleryImages && profileData.galleryImages.length > 0 && (
          <div className="mb-16 -mt-20 relative z-20">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
              <div className="relative h-[500px] overflow-hidden">
                <img 
                  src={profileData.galleryImages[currentImageIndex]} 
                  alt={`Gallery ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Image Counter Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white px-5 py-2 rounded-full font-bold shadow-lg backdrop-blur-sm border-2 border-white">
                  📸 {currentImageIndex + 1} / {profileData.galleryImages.length}
                </div>
              </div>
              
              {profileData.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FF9100] to-[#e6820e] hover:from-[#e6820e] hover:to-[#FF9100] text-white rounded-full p-4 transition-all shadow-2xl hover:shadow-[#FF9100]/50 hover:scale-110 border-4 border-white"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FF9100] to-[#e6820e] hover:from-[#e6820e] hover:to-[#FF9100] text-white rounded-full p-4 transition-all shadow-2xl hover:shadow-[#FF9100]/50 hover:scale-110 border-4 border-white"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                  
                  {/* Thumbnail Navigation */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/30">
                    {profileData.galleryImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'w-12 h-3 bg-gradient-to-r from-[#FF9100] to-[#D5ED9F] rounded-full' 
                            : 'w-3 h-3 bg-white/50 hover:bg-white rounded-full'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Why Choose Us Section - Premium Design */}
        {profileData.uniqueSellingPoints && profileData.uniqueSellingPoints.length > 0 && (
          <div className="mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00712D]/5 to-[#FF9100]/5 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-gradient-to-br from-white via-[#FFFBE6] to-white rounded-3xl shadow-2xl p-10 border-4 border-[#D5ED9F]">
              <div className="text-center mb-10">
                <div className="inline-block bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-4">
                  ⭐ Our Advantages
                </div>
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00712D] to-[#009e3c] mb-3">
                  Why Choose Us?
                </h2>
                <p className="text-xl text-gray-600">Experience excellence in every lesson</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profileData.uniqueSellingPoints.map((point, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF9100]"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] rounded-full p-3 group-hover:scale-110 transition-transform">
                          <CheckCircle className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-semibold text-gray-800 leading-relaxed">{point}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Courses Offered - Enhanced */}
            {profileData.coursesOffered && profileData.coursesOffered.length > 0 && (
              <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF9100]/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-black flex items-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                        <BookOpen className="h-10 w-10" />
                      </div>
                      Courses Offered
                    </h2>
                    <div className="bg-[#FF9100] text-white px-5 py-2 rounded-full font-bold text-sm">
                      {profileData.coursesOffered.length} Courses
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {profileData.coursesOffered.map((course, index) => (
                      <span
                        key={index}
                        className="group bg-white text-[#00712D] px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/50 hover:border-[#FF9100] cursor-pointer"
                      >
                        📚 {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* License Types - Card Grid */}
            {profileData.licenseTypes && profileData.licenseTypes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-[#D5ED9F]">
                <h2 className="text-4xl font-black text-[#00712D] mb-8 flex items-center">
                  <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-2xl p-3 mr-4">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  License Types We Offer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {profileData.licenseTypes.map((license, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-[#e6f4ea] to-[#d0e7d8] p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-[#00712D]/20 hover:border-[#FF9100]"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] rounded-full p-3 group-hover:scale-110 transition-transform">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[#00712D]">{license}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations - Badge Collection */}
            {profileData.specializations && profileData.specializations.length > 0 && (
              <div className="bg-gradient-to-br from-[#00712D] via-[#009e3c] to-[#00712D] rounded-3xl shadow-2xl p-10 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9100]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D5ED9F]/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-black text-white mb-8 flex items-center">
                    <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-2xl p-3 mr-4">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    Our Specializations
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {profileData.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="group bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-8 py-4 rounded-full text-xl font-black shadow-2xl hover:shadow-[#FF9100]/50 transform hover:scale-110 transition-all border-4 border-white cursor-pointer"
                      >
                        ⭐ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Achievements - Highlight Card */}
            {profileData.achievements && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9100] to-[#D5ED9F] rounded-3xl transform rotate-1"></div>
                <div className="relative bg-gradient-to-br from-[#00712D] via-[#009e3c] to-[#00712D] text-white rounded-3xl shadow-2xl p-10 overflow-hidden">
                  {/* Background decorations */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF9100]/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-2xl p-4 mr-4">
                        <Award className="h-12 w-12 text-white" />
                      </div>
                      <div>
                        <div className="bg-[#FF9100] text-white px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider inline-block mb-2">
                          🏆 Hall of Fame
                        </div>
                        <h2 className="text-4xl font-black">Our Achievements</h2>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
                      <p className="text-2xl leading-relaxed font-light">{profileData.achievements}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Facilities - Premium Grid */}
            <div className="bg-gradient-to-br from-white to-[#FFFBE6] rounded-3xl shadow-2xl p-10 border-4 border-[#00712D]/10">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00712D] to-[#009e3c] mb-8 flex items-center">
                <div className="bg-gradient-to-br from-[#D5ED9F] to-[#b8d47f] rounded-2xl p-3 mr-4">
                  <Car className="h-10 w-10 text-[#00712D]" />
                </div>
                World-Class Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {profileData.fleetSize && (
                  <div className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF9100]">
                    <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Car className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-5xl font-black text-[#00712D] mb-2">{profileData.fleetSize}</div>
                    <div className="text-gray-600 font-semibold">Modern Vehicles</div>
                  </div>
                )}
                {profileData.simulatorCount && (
                  <div className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF9100]">
                    <div className="bg-gradient-to-br from-[#D5ED9F] to-[#b8d47f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">🎮</span>
                    </div>
                    <div className="text-5xl font-black text-[#00712D] mb-2">{profileData.simulatorCount}</div>
                    <div className="text-gray-600 font-semibold">Simulators</div>
                  </div>
                )}
                {profileData.theoryRoomsCount && (
                  <div className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF9100]">
                    <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-5xl font-black text-[#00712D] mb-2">{profileData.theoryRoomsCount}</div>
                    <div className="text-gray-600 font-semibold">Theory Rooms</div>
                  </div>
                )}
                {profileData.parkingSpaces && (
                  <div className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF9100]">
                    <div className="bg-gradient-to-br from-[#D5ED9F] to-[#b8d47f] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-3xl">🅿️</span>
                    </div>
                    <div className="text-5xl font-black text-[#00712D] mb-2">{profileData.parkingSpaces}</div>
                    <div className="text-gray-600 font-semibold">Parking Spaces</div>
                  </div>
                )}
              </div>
              
              {profileData.practicalVehicles && profileData.practicalVehicles.length > 0 && (
                <div className="bg-gradient-to-r from-[#00712D] to-[#009e3c] rounded-2xl p-6">
                  <h3 className="text-2xl font-black text-white mb-4 flex items-center">
                    <Car className="h-6 w-6 mr-2" />
                    Our Premium Fleet
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profileData.practicalVehicles.map((vehicle, index) => (
                      <span
                        key={index}
                        className="bg-white text-[#00712D] px-5 py-2 rounded-full text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border-2 border-[#FF9100]"
                      >
                        🚗 {vehicle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing & Payment - Premium Card Design */}
            {profileData.pricingInfo && (
              <div className="relative">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF9100]/10 to-[#D5ED9F]/10 rounded-3xl transform -rotate-1"></div>
                
                <div className="relative bg-gradient-to-br from-white via-[#FFFBE6] to-white rounded-3xl shadow-2xl p-10 border-4 border-[#FF9100]/30">
                  {/* Header with Badge */}
                  <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-5 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-4">
                      💰 Affordable Excellence
                    </div>
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00712D] to-[#009e3c] mb-4 flex items-center justify-center">
                      <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-2xl p-3 mr-4">
                        <DollarSign className="h-10 w-10 text-white" />
                      </div>
                      Pricing & Payment
                    </h2>
                  </div>
                  
                  {/* Pricing Info Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-[#00712D]/10 mb-6">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-xl text-gray-800 leading-relaxed font-medium">{profileData.pricingInfo}</p>
                    </div>
                  </div>
                  
                  {/* Payment Methods */}
                  {profileData.paymentMethods && profileData.paymentMethods.length > 0 && (
                    <div className="bg-gradient-to-r from-[#00712D] to-[#009e3c] rounded-2xl p-8 shadow-xl mb-6">
                      <h3 className="text-2xl font-black text-white mb-5 flex items-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 mr-3">
                          💳
                        </div>
                        Payment Methods We Accept
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {profileData.paymentMethods.map((method, index) => (
                          <span
                            key={index}
                            className="group bg-white text-[#00712D] px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-[#FF9100] cursor-pointer"
                          >
                            ✅ {method}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Cancellation Policy */}
                  {profileData.cancellationPolicy && (
                    <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFE6CC] rounded-2xl p-8 shadow-lg border-2 border-[#FF9100]/30">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-xl p-3">
                            <Shield className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-[#00712D] mb-3">Cancellation Policy</h3>
                          <p className="text-lg text-gray-800 leading-relaxed">{profileData.cancellationPolicy}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Call-to-Action */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4 text-lg">Ready to get started?</p>
                    <Button
                      onClick={handleEnrollClick}
                      className="bg-gradient-to-r from-[#FF9100] to-[#e6820e] hover:from-[#e6820e] hover:to-[#FF9100] text-white px-10 py-4 text-xl font-black rounded-full shadow-2xl hover:shadow-[#FF9100]/50 transform hover:scale-105 transition-all border-4 border-white"
                    >
                      💳 View Full Pricing & Enroll
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Contact Card - Premium Design */}
            <div className="bg-gradient-to-br from-white to-[#FFFBE6] rounded-3xl shadow-2xl p-8 border-4 border-[#D5ED9F]">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-[#FF9100] to-[#e6820e] text-white px-4 py-1 rounded-full font-bold text-xs uppercase tracking-wider inline-block mb-3">
                  🎯 Take Action Now
                </div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00712D] to-[#009e3c]">
                  Get in Touch
                </h3>
              </div>
              
              {profileData.whatsappNumber && (
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 mb-4 hover:shadow-2xl hover:shadow-[#25D366]/50 transition-all transform hover:scale-105 font-bold text-lg border-4 border-white shadow-xl"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>WhatsApp Us Now</span>
                </button>
              )}
              
              <Button
                onClick={handleEnrollClick}
                className="w-full mb-4 bg-gradient-to-r from-[#FF9100] to-[#e6820e] hover:from-[#e6820e] hover:to-[#FF9100] py-4 text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#FF9100]/50 transform hover:scale-105 transition-all border-4 border-white"
              >
                🎓 Enroll Now
              </Button>
              
              <div className="space-y-3 mt-6 bg-white rounded-2xl p-5 shadow-inner">
                {profileData.whatsappNumber && (
                  <div className="flex items-center space-x-3 text-gray-700 p-3 bg-[#e6f4ea] rounded-xl hover:bg-[#d0e7d8] transition-colors">
                    <div className="bg-[#00712D] rounded-full p-2">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">{profileData.whatsappNumber}</span>
                  </div>
                )}
                {profileData.secondaryPhone && (
                  <div className="flex items-center space-x-3 text-gray-700 p-3 bg-[#e6f4ea] rounded-xl hover:bg-[#d0e7d8] transition-colors">
                    <div className="bg-[#00712D] rounded-full p-2">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">{profileData.secondaryPhone}</span>
                  </div>
                )}
                {profileData.socialMedia?.website && (
                  <div className="flex items-center space-x-3 text-gray-700 p-3 bg-[#e6f4ea] rounded-xl hover:bg-[#d0e7d8] transition-colors">
                    <div className="bg-[#00712D] rounded-full p-2">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <a href={profileData.socialMedia.website} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-[#00712D]">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              
              {/* Social Media Links - Enhanced */}
              {profileData.socialMedia && (
                <div className="mt-6 pt-6 border-t-2 border-[#D5ED9F]">
                  <h4 className="font-black text-[#00712D] mb-4 text-center">Follow Our Journey</h4>
                  <div className="flex justify-center space-x-3">
                    {profileData.socialMedia.facebook && (
                      <a 
                        href={profileData.socialMedia.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-br from-[#1877F2] to-[#0c5bca] text-white rounded-xl p-3 hover:shadow-xl transform hover:scale-110 transition-all"
                      >
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                    {profileData.socialMedia.instagram && (
                      <a 
                        href={profileData.socialMedia.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-br from-[#E4405F] via-[#F77737] to-[#F09433] text-white rounded-xl p-3 hover:shadow-xl transform hover:scale-110 transition-all"
                      >
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {profileData.socialMedia.twitter && (
                      <a 
                        href={profileData.socialMedia.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-br from-[#1DA1F2] to-[#0c85d0] text-white rounded-xl p-3 hover:shadow-xl transform hover:scale-110 transition-all"
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                    {profileData.socialMedia.youtube && (
                      <a 
                        href={profileData.socialMedia.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-br from-[#FF0000] to-[#cc0000] text-white rounded-xl p-3 hover:shadow-xl transform hover:scale-110 transition-all"
                      >
                        <Youtube className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Operating Hours - Enhanced Card */}
            {profileData.operatingHours && Object.keys(profileData.operatingHours).length > 0 && (
              <div className="bg-gradient-to-br from-white to-[#FFFBE6] rounded-3xl shadow-2xl p-8 border-4 border-[#D5ED9F]">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-[#00712D] to-[#009e3c] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#00712D]">Operating Hours</h3>
                  <p className="text-sm text-gray-600 mt-1">We're here for you</p>
                </div>
                <div className="space-y-3">
                  {Object.entries(profileData.operatingHours).map(([day, hours]) => (
                    <div 
                      key={day} 
                      className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#FF9100]"
                    >
                      <span className="font-bold text-[#00712D]">{day}</span>
                      <span className="text-gray-700 font-semibold">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience - Icon List */}
            {profileData.targetAudience && profileData.targetAudience.length > 0 && (
              <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF9100]/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-[#FF9100] to-[#e6820e] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black">Who We Serve</h3>
                    <p className="text-sm text-white/80 mt-1">Training for everyone</p>
                  </div>
                  <div className="space-y-3">
                    {profileData.targetAudience.map((audience, index) => (
                      <div 
                        key={index} 
                        className="group bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all border-2 border-white/20 hover:border-[#FF9100]"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] rounded-full p-2 group-hover:scale-110 transition-transform">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-lg font-semibold">{audience}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
