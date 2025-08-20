import React from 'react';

const feedbacks = [
  { instructor: 'Mr. John', comment: 'Great improvement in your parking skills!', date: '2025-08-18' },
  { instructor: 'Ms. Jane', comment: 'Keep practicing your turns.', date: '2025-08-15' },
];

const StudentFeedback = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Instructor Feedback</h3>
    <ul className="divide-y divide-[#D5ED9F]">
      {feedbacks.map((f, idx) => (
        <li key={idx} className="py-3">
          <div className="font-medium text-[#00712D]">{f.instructor}</div>
          <div className="text-gray-700 mt-1">{f.comment}</div>
          <div className="text-gray-400 text-xs mt-1">{f.date}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentFeedback;
