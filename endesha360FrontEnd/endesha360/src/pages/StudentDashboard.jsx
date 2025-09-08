import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaCalendarAlt, FaFileAlt, FaMoneyCheckAlt, FaChartBar, FaComments, FaBell, FaCarCrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ComingSoon from './ComingSoon';

const cards = [
  {
    title: 'My Profile',
    description: 'View and update your details',
    icon: <FaUser className="text-4xl text-[#00712D]" />,
    link: '/student/profile',
  },
  {
    title: 'Courses',
    description: 'Browse and join driving courses',
    icon: <FaBook className="text-4xl text-[#FF9100]" />,
    link: '/coming-soon',
  },
  {
    title: 'Schedule',
    description: 'Check upcoming driving sessions',
    icon: <FaCalendarAlt className="text-4xl text-[#005a24]" />,
    link: '/coming-soon',
  },
  {
    title: 'Tests',
    description: 'Practice for your official exam',
    icon: <FaFileAlt className="text-4xl text-[#00712D]" />, 
    link: '/exam',
  },
  {
    title: 'Payments',
    description: 'Pay fees and download receipts',
    icon: <FaMoneyCheckAlt className="text-4xl text-[#FF9100]" />,
    link: '/coming-soon',
  },
  {
    title: 'Results & Progress',
    description: 'Track test scores and progress',
    icon: <FaChartBar className="text-4xl text-[#005a24]" />,
    link: '/results-progress',
  },
  {
    title: 'Messages',
    description: 'Chat with your instructor',
    icon: <FaComments className="text-4xl text-[#00712D]" />,
    link: '/coming-soon',
  },
  {
    title: 'Notifications',
    description: 'Stay updated on changes',
    icon: <FaBell className="text-4xl text-[#FF9100]" />,
    link: '/coming-soon',
  },
  {
    title: 'Report Issues',
    description: 'Submit training or other issues',
    icon: <FaCarCrash className="text-4xl text-[#005a24]" />,
    link: '/coming-soon',
  },
];


const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Student';
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const handleCardClick = (link) => {
    if (link === '/coming-soon') {
      setIsComingSoonOpen(true);
    } else {
      navigate(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBE6] py-8 px-2 sm:px-6 lg:px-8 pt-18">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#00712D] mb-2">
            Welcome, {studentName} <span className="inline-block">👋</span>
          </h2>
          <p className="text-gray-600">Here's what's happening with your driving school today.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#D5ED9F] rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center mb-4">
                {card.icon}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#00712D]">{card.title}</h3>
                  <p className="text-gray-500 text-sm">{card.description}</p>
                </div>
              </div>
              <button
                className="mt-4 w-20 py-2 bg-[#FF9100] text-white rounded-lg font-semibold hover:bg-[#e6820e] transition-all"
                onClick={() => handleCardClick(card.link)}
              >
                Go
              </button>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)}>
        <ComingSoon />
      </Modal>
    </div>
  );
};

export default StudentDashboard;
