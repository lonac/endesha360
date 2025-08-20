import React from 'react';

const payments = [
  { label: 'Last Payment', value: 'KES 5,000', date: '2025-08-10', status: 'Paid' },
  { label: 'Next Payment Due', value: 'KES 0', date: '2025-09-01', status: 'None' },
];

const statusColor = (status) => {
  if (status === 'Paid') return 'text-green-600';
  if (status === 'Due') return 'text-red-600';
  return 'text-gray-600';
};

const StudentPayments = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Payments</h3>
    <ul className="divide-y divide-[#D5ED9F]">
      {payments.map((p, idx) => (
        <li key={idx} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-medium text-[#00712D]">{p.label}</span>
            <span className="ml-2 {statusColor(p.status)}">{p.value}</span>
          </div>
          <div className="text-gray-600 mt-1 md:mt-0">
            {p.date} <span className={statusColor(p.status)}>[{p.status}]</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default StudentPayments;
