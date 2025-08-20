import React from 'react';

const notifications = [
  { message: 'Your next session is on 22nd Aug at 10:00 AM.', date: '2025-08-20' },
  { message: 'Payment received for August.', date: '2025-08-18' },
];

const Notifications = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Notifications</h3>
    <ul className="space-y-2">
      {notifications.map((n, i) => (
        <li key={i} className="text-gray-700 flex items-center justify-between">
          <span>{n.message}</span>
          <span className="text-xs text-gray-400 ml-2">{n.date}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default Notifications;
