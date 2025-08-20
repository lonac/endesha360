import React from 'react';

const sessions = [
  { date: '2025-08-22', time: '10:00 AM', topic: 'Practical Driving', instructor: 'Mr. John' },
  { date: '2025-08-24', time: '2:00 PM', topic: 'Theory Class', instructor: 'Ms. Jane' },
];

const UpcomingSessions = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Upcoming Sessions</h3>
    <ul className="divide-y divide-[#D5ED9F]">
      {sessions.map((s, i) => (
        <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-medium text-[#00712D]">{s.topic}</span>
            <span className="block text-gray-500 text-sm">{s.instructor}</span>
          </div>
          <div className="text-gray-700 mt-2 md:mt-0">
            {s.date} &bull; {s.time}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default UpcomingSessions;
