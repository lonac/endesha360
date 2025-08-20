import React from 'react';
import StudentStats from '../../components/student/StudentStats';
import StudentProgressChart from '../../components/student/StudentProgressChart';
import StudentSchedule from '../../components/student/StudentSchedule';
import StudentPayments from '../../components/student/StudentPayments';
import StudentNotifications from '../../components/student/StudentNotifications';
import StudentFeedback from '../../components/student/StudentFeedback';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-[#FFFBE6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <StudentStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StudentProgressChart />
            <StudentSchedule />
            <StudentFeedback />
          </div>
          <div className="space-y-8">
            <StudentPayments />
            <StudentNotifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
