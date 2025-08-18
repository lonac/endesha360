import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Users, BookOpen, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Track student progress, manage enrollments, and maintain comprehensive records.'
    },
    {
      icon: BookOpen,
      title: 'Course Planning',
      description: 'Create structured courses, schedule lessons, and manage curriculum effectively.'
    },
    {
      icon: Car,
      title: 'Vehicle Tracking',
      description: 'Monitor vehicle usage, maintenance schedules, and availability in real-time.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into school performance with detailed analytics and reporting.'
    }
  ];

  const benefits = [
    'Streamlined student enrollment and management',
    'Automated scheduling and calendar management',
    'Real-time progress tracking and assessments',
    'Financial management and payment processing',
    'Instructor management and assignment',
    'Comprehensive reporting and analytics'
  ];

  return (
    <div className="min-h-screen bg-[#FFFBE6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00712D] via-[#005a24] to-[#00712D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transform Your
              <span className="block text-[#D5ED9F]">Driving School</span>
            </h1>
            <p className="text-xl text-[#FFFBE6] max-w-3xl mx-auto mb-8">
              Endesha360 is the comprehensive SaaS platform designed specifically for driving schools. 
              Manage students, instructors, vehicles, and operations all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#FF9100] text-white hover:bg-[#e6820e] text-lg px-8 py-4"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Link
                    to="/register?role=owner"
                    className="bg-[#FF9100] text-white hover:bg-[#e6820e] text-lg px-8 py-4 rounded font-semibold shadow-md transition-colors flex items-center justify-center"
                  >
                    Manage Your Driving School
                  </Link>
                  <Link
                    to="/register?role=student"
                    className="border-2 border-[#D5ED9F] text-[#D5ED9F] hover:bg-[#D5ED9F] hover:text-[#00712D] text-lg px-8 py-4 rounded font-semibold shadow-md transition-colors flex items-center justify-center"
                  >
                    Book Driving Lessons
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements - now not blocking clicks */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D5ED9F]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF9100]/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#00712D] mb-4">
              Everything You Need to Run Your Driving School
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From student enrollment to instructor management, Endesha360 provides all the tools 
              you need to operate efficiently and grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#D5ED9F]">
                  <div className="bg-[#00712D] w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#00712D] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#00712D] mb-6">
                Why Choose Endesha360?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform is built specifically for driving schools, with features that address 
                the unique challenges and requirements of driver education businesses.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#00712D] flex-shrink-0" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#D5ED9F] to-white p-8 rounded-2xl border border-[#D5ED9F]">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00712D] mb-2">500+</div>
                  <div className="text-gray-600">Driving Schools</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00712D] mb-2">10K+</div>
                  <div className="text-gray-600">Students Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00712D] mb-2">98%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00712D] mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#00712D]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Driving School?
          </h2>
          <p className="text-xl text-[#D5ED9F] mb-8">
            Join hundreds of driving schools already using Endesha360 to streamline 
            their operations and grow their business.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-[#FF9100] text-white hover:bg-[#e6820e] text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/login')}
                className="border-[#D5ED9F] text-[#D5ED9F] hover:bg-[#D5ED9F] hover:text-[#00712D] text-lg px-8 py-4"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
