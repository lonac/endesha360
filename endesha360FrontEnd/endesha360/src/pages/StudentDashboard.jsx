import React from 'react';
import StudentStats from '../components/student/StudentStats';
import StudentProgressChart from '../components/student/StudentProgressChart';
import UpcomingSessions from '../components/student/UpcomingSessions';
import InstructorCard from '../components/student/InstructorCard';
import Notifications from '../components/student/Notifications';
import PaymentsCard from '../components/student/PaymentsCard';
import FeedbackBox from '../components/student/FeedbackBox';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-[#FFFBE6] py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats */}
        <StudentStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <StudentProgressChart />
            <UpcomingSessions />
            <FeedbackBox />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <InstructorCard />
            <PaymentsCard />
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
