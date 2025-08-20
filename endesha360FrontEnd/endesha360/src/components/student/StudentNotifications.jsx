import React from 'react';

const notifications = [
  { message: 'Your next session is on 2025-08-22 at 10:00 AM.', date: '2025-08-20' },
  { message: 'Payment received: KES 5,000.', date: '2025-08-10' },
];

const StudentNotifications = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Notifications</h3>
    <ul className="divide-y divide-[#D5ED9F]">
      {notifications.map((n, idx) => (
        <li key={idx} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-gray-700">{n.message}</div>
          <div className="text-gray-400 mt-1 md:mt-0 text-xs">{n.date}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentNotifications;
