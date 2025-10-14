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
    <div className="min-h-screen bg-[#FFFBE6]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="flex items-center space-x-6 mb-8">
            {profileData.logoUrl && (
              <img 
                src={profileData.logoUrl} 
                alt="School Logo" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
              />
            )}
            <div>
              <h1 className="text-5xl font-bold mb-3">{profileData.schoolName || 'Driving School'}</h1>
              <p className="text-2xl italic">"Drive with Confidence, Succeed with Excellence"</p>
            </div>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {profileData.successRate && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-2" />
                <div className="text-4xl font-bold">{profileData.successRate}%</div>
                <div className="text-sm">Success Rate</div>
              </div>
            )}
            {profileData.totalGraduates && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-2" />
                <div className="text-4xl font-bold">{profileData.totalGraduates}+</div>
                <div className="text-sm">Graduates</div>
              </div>
            )}
            {profileData.yearsInOperation && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                <Award className="h-10 w-10 mx-auto mb-2" />
                <div className="text-4xl font-bold">{profileData.yearsInOperation}</div>
                <div className="text-sm">Years Experience</div>
              </div>
            )}
            {profileData.fleetSize && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-6 text-center">
                <Car className="h-10 w-10 mx-auto mb-2" />
                <div className="text-4xl font-bold">{profileData.fleetSize}</div>
                <div className="text-sm">Vehicles</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Image Gallery Carousel */}
        {profileData.galleryImages && profileData.galleryImages.length > 0 && (
          <div className="mb-12">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={profileData.galleryImages[currentImageIndex]} 
                alt={`Gallery ${currentImageIndex + 1}`}
                className="w-full h-96 object-cover"
              />
              {profileData.galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-[#00712D]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-[#00712D]" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {profileData.galleryImages.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Why Choose Us Section */}
        {profileData.uniqueSellingPoints && profileData.uniqueSellingPoints.length > 0 && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-[#00712D] mb-6 flex items-center">
              <Star className="h-8 w-8 mr-3" />
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profileData.uniqueSellingPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-[#00712D] flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Courses Offered */}
            {profileData.coursesOffered && profileData.coursesOffered.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#00712D] mb-6 flex items-center">
                  <BookOpen className="h-8 w-8 mr-3" />
                  Courses Offered
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profileData.coursesOffered.map((course, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-[#e6f4ea] to-[#d0e7d8] text-[#00712D] px-5 py-2 rounded-full text-lg font-medium shadow-sm"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* License Types */}
            {profileData.licenseTypes && profileData.licenseTypes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#00712D] mb-6 flex items-center">
                  <Shield className="h-8 w-8 mr-3" />
                  License Types
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.licenseTypes.map((license, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-[#f6fbf8] p-4 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-[#00712D]" />
                      <span className="text-lg text-gray-700">{license}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations */}
            {profileData.specializations && profileData.specializations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#00712D] mb-6 flex items-center">
                  <Award className="h-8 w-8 mr-3" />
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-3">
                  {profileData.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="bg-[#00712D] text-white px-5 py-2 rounded-full text-lg font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {profileData.achievements && (
              <div className="bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <Award className="h-8 w-8 mr-3" />
                  Achievements
                </h2>
                <p className="text-xl leading-relaxed">{profileData.achievements}</p>
              </div>
            )}

            {/* Facilities */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-[#00712D] mb-6 flex items-center">
                <Car className="h-8 w-8 mr-3" />
                Facilities & Equipment
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {profileData.fleetSize && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#00712D]">{profileData.fleetSize}</div>
                    <div className="text-gray-600 mt-1">Vehicles</div>
                  </div>
                )}
                {profileData.simulatorCount && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#00712D]">{profileData.simulatorCount}</div>
                    <div className="text-gray-600 mt-1">Simulators</div>
                  </div>
                )}
                {profileData.theoryRoomsCount && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#00712D]">{profileData.theoryRoomsCount}</div>
                    <div className="text-gray-600 mt-1">Theory Rooms</div>
                  </div>
                )}
                {profileData.parkingSpaces && (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#00712D]">{profileData.parkingSpaces}</div>
                    <div className="text-gray-600 mt-1">Parking Spaces</div>
                  </div>
                )}
              </div>
              
              {profileData.practicalVehicles && profileData.practicalVehicles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-[#00712D] mb-3">Our Fleet</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.practicalVehicles.map((vehicle, index) => (
                      <span
                        key={index}
                        className="bg-[#f6fbf8] text-[#00712D] px-4 py-2 rounded-lg text-sm font-medium border border-[#00712D]"
                      >
                        {vehicle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing & Payment */}
            {profileData.pricingInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-[#00712D] mb-6 flex items-center">
                  <DollarSign className="h-8 w-8 mr-3" />
                  Pricing & Payment
                </h2>
                <p className="text-lg text-gray-700 mb-4">{profileData.pricingInfo}</p>
                
                {profileData.paymentMethods && profileData.paymentMethods.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold text-[#00712D] mb-2">Payment Methods Accepted:</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.paymentMethods.map((method, index) => (
                        <span
                          key={index}
                          className="bg-[#e6f4ea] text-[#00712D] px-4 py-1 rounded-full text-sm"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {profileData.cancellationPolicy && (
                  <div className="mt-4 p-4 bg-[#f6fbf8] rounded-lg">
                    <h3 className="font-bold text-[#00712D] mb-2">Cancellation Policy:</h3>
                    <p className="text-gray-600">{profileData.cancellationPolicy}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            
            {/* Contact Card - Sticky */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-[#00712D] mb-4">Get in Touch</h3>
              
              {profileData.whatsappNumber && (
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 mb-3 hover:shadow-lg transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-bold">WhatsApp Us</span>
                </button>
              )}
              
              <Button
                onClick={handleEnrollClick}
                className="w-full mb-3 bg-gradient-to-r from-[#00712D] to-[#009e3c] hover:shadow-lg"
              >
                Enroll Now
              </Button>
              
              <div className="space-y-3 mt-4">
                {profileData.whatsappNumber && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="h-5 w-5 text-[#00712D]" />
                    <span>{profileData.whatsappNumber}</span>
                  </div>
                )}
                {profileData.secondaryPhone && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="h-5 w-5 text-[#00712D]" />
                    <span>{profileData.secondaryPhone}</span>
                  </div>
                )}
                {profileData.socialMedia?.website && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="h-5 w-5 text-[#00712D]" />
                    <a href={profileData.socialMedia.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#00712D]">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              
              {/* Social Media Links */}
              {profileData.socialMedia && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-[#00712D] mb-3">Follow Us</h4>
                  <div className="flex space-x-3">
                    {profileData.socialMedia.facebook && (
                      <a href={profileData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-[#00712D] hover:text-[#009e3c]">
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                    {profileData.socialMedia.instagram && (
                      <a href={profileData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-[#00712D] hover:text-[#009e3c]">
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {profileData.socialMedia.twitter && (
                      <a href={profileData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-[#00712D] hover:text-[#009e3c]">
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                    {profileData.socialMedia.youtube && (
                      <a href={profileData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-[#00712D] hover:text-[#009e3c]">
                        <Youtube className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Operating Hours */}
            {profileData.operatingHours && Object.keys(profileData.operatingHours).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-[#00712D] mb-4 flex items-center">
                  <Clock className="h-6 w-6 mr-2" />
                  Operating Hours
                </h3>
                <div className="space-y-2">
                  {Object.entries(profileData.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-gray-700">
                      <span className="font-medium">{day}:</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience */}
            {profileData.targetAudience && profileData.targetAudience.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-[#00712D] mb-4 flex items-center">
                  <Users className="h-6 w-6 mr-2" />
                  Who We Serve
                </h3>
                <div className="space-y-2">
                  {profileData.targetAudience.map((audience, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#00712D]" />
                      <span className="text-gray-700">{audience}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Driving Journey?</h2>
          <p className="text-xl mb-8">Join thousands of successful graduates today!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleEnrollClick}
              className="bg-white text-[#00712D] hover:bg-gray-100 px-8 py-4 text-lg font-bold"
            >
              Enroll Now
            </Button>
            {profileData.whatsappNumber && (
              <Button
                onClick={handleWhatsAppContact}
                className="bg-[#25D366] hover:bg-[#128C7E] px-8 py-4 text-lg font-bold flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat on WhatsApp</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdvertisement;
