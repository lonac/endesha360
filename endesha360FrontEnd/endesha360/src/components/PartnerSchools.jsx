import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Users, 
  Award,
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import apiService from '../services/api';

const PartnerSchools = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortBy, setSortBy] = useState('successRate');

  useEffect(() => {
    loadPartnerSchools();
  }, []);

  useEffect(() => {
    filterAndSortSchools();
  }, [schools, searchTerm, selectedCourse, sortBy]);

  const loadPartnerSchools = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPublicSchoolDirectory();
      setSchools(response || []);
    } catch (err) {
      console.error('Failed to load partner schools:', err);
      setError('Failed to load schools. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSchools = () => {
    let filtered = [...schools];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(school => 
        school.schoolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(school => 
        school.coursesOffered?.includes(selectedCourse)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'successRate':
          return (b.successRate || 0) - (a.successRate || 0);
        case 'graduates':
          return (b.totalGraduates || 0) - (a.totalGraduates || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredSchools(filtered);
  };

  const calculateStats = () => {
    const totalSchools = schools.length;
    const totalGraduates = schools.reduce((sum, school) => sum + (school.totalGraduates || 0), 0);
    const avgSuccessRate = schools.length > 0 
      ? (schools.reduce((sum, school) => sum + (school.successRate || 0), 0) / schools.length).toFixed(1)
      : 0;

    return { totalSchools, totalGraduates, avgSuccessRate };
  };

  const getUniqueCourses = () => {
    const courses = new Set();
    schools.forEach(school => {
      school.coursesOffered?.forEach(course => courses.add(course));
    });
    return Array.from(courses);
  };

  const handleViewProfile = (schoolId) => {
    navigate(`/schools/${schoolId}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00712D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading partner schools...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const stats = calculateStats();
  const uniqueCourses = getUniqueCourses();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00712D] mb-4">
            Driving Schools Working With Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated driving schools across the country that trust Endesha360 
            to power their operations and deliver exceptional learning experiences.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#00712D] to-[#009e3c] text-white p-6 rounded-xl shadow-lg text-center">
            <Award className="h-10 w-10 mx-auto mb-2" />
            <div className="text-4xl font-bold mb-1">{stats.totalSchools}+</div>
            <div className="text-sm opacity-90">Partner Schools</div>
          </div>
          <div className="bg-gradient-to-br from-[#FF9100] to-[#e6820e] text-white p-6 rounded-xl shadow-lg text-center">
            <Users className="h-10 w-10 mx-auto mb-2" />
            <div className="text-4xl font-bold mb-1">{stats.totalGraduates.toLocaleString()}+</div>
            <div className="text-sm opacity-90">Students Trained</div>
          </div>
          <div className="bg-gradient-to-br from-[#D5ED9F] to-[#b8d47f] text-[#00712D] p-6 rounded-xl shadow-lg text-center">
            <TrendingUp className="h-10 w-10 mx-auto mb-2" />
            <div className="text-4xl font-bold mb-1">{stats.avgSuccessRate}%</div>
            <div className="text-sm opacity-90">Average Success Rate</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-[#FFFBE6] rounded-xl p-6 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
              />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent appearance-none bg-white"
              >
                <option value="successRate">Highest Success Rate</option>
                <option value="graduates">Most Graduates</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map((school) => (
              <div 
                key={school.id} 
                className="bg-white border-2 border-[#D5ED9F] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
              >
                {/* School Logo/Header */}
                <div className="relative h-40 bg-gradient-to-br from-[#00712D] to-[#009e3c] flex items-center justify-center">
                  {school.logoUrl ? (
                    <img 
                      src={school.logoUrl} 
                      alt={school.schoolName} 
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center">
                      <Award className="h-12 w-12 text-[#00712D]" />
                    </div>
                  )}
                  
                  {/* Success Rate Badge */}
                  {school.successRate && (
                    <div className="absolute top-4 right-4 bg-[#FF9100] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{school.successRate}%</span>
                    </div>
                  )}
                </div>

                {/* School Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#00712D] mb-2 line-clamp-1">
                    {school.schoolName || 'Driving School'}
                  </h3>
                  
                  {school.location && (
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{school.location}</span>
                    </div>
                  )}

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {school.totalGraduates && (
                      <div className="text-center bg-[#f6fbf8] rounded-lg p-3">
                        <div className="text-2xl font-bold text-[#00712D]">
                          {school.totalGraduates}+
                        </div>
                        <div className="text-xs text-gray-600">Graduates</div>
                      </div>
                    )}
                    {school.yearsInOperation && (
                      <div className="text-center bg-[#f6fbf8] rounded-lg p-3">
                        <div className="text-2xl font-bold text-[#00712D]">
                          {school.yearsInOperation}
                        </div>
                        <div className="text-xs text-gray-600">Years</div>
                      </div>
                    )}
                  </div>

                  {/* Courses Offered */}
                  {school.coursesOffered && school.coursesOffered.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {school.coursesOffered.slice(0, 3).map((course, index) => (
                          <span 
                            key={index} 
                            className="bg-[#e6f4ea] text-[#00712D] px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {course}
                          </span>
                        ))}
                        {school.coursesOffered.length > 3 && (
                          <span className="bg-[#D5ED9F] text-[#00712D] px-3 py-1 rounded-full text-xs font-medium">
                            +{school.coursesOffered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <button
                    onClick={() => handleViewProfile(school.schoolId)}
                    className="w-full bg-gradient-to-r from-[#00712D] to-[#009e3c] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105"
                  >
                    <span>View Full Profile</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No schools found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#D5ED9F] to-[#b8d47f] rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[#00712D] mb-3">
            Want Your School Featured Here?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Join our growing network of driving schools and get your own professional profile 
            to attract more students!
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#FF9100] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e6820e] transition-colors shadow-lg hover:shadow-xl"
          >
            Join Endesha360 Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnerSchools;
