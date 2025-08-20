import React from 'react';

const feedbacks = [
  { instructor: 'Mr. John', message: 'Great improvement in your parking skills!', date: '2025-08-18' },
  { instructor: 'Ms. Jane', message: 'Keep practicing your gear shifts.', date: '2025-08-15' },
];

const FeedbackBox = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Instructor Feedback</h3>
    <ul className="space-y-3">
      {feedbacks.map((f, i) => (
        <li key={i} className="border-l-4 border-[#FF9100] pl-4">
          <div className="text-gray-700">{f.message}</div>
          <div className="text-xs text-gray-400 mt-1">{f.instructor} &bull; {f.date}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default FeedbackBox;
