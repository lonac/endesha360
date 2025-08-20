import React from 'react';

const sessions = [
  { date: '2025-08-22', time: '10:00 AM', type: 'Practical', instructor: 'Mr. John' },
  { date: '2025-08-24', time: '2:00 PM', type: 'Theory', instructor: 'Ms. Jane' },
];

const StudentSchedule = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Upcoming Sessions</h3>
    <ul className="divide-y divide-[#D5ED9F]">
      {sessions.map((session, idx) => (
        <li key={idx} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-medium text-[#00712D]">{session.type}</span> with <span className="text-[#005a24]">{session.instructor}</span>
          </div>
          <div className="text-gray-600 mt-1 md:mt-0">
            {session.date} at {session.time}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentSchedule;
