import React from 'react';

const stats = [
  { label: 'Course Progress', value: '75%', color: 'bg-[#00712D]' },
  { label: 'Attendance', value: '90%', color: 'bg-[#FF9100]' },
  { label: 'Upcoming Sessions', value: '2', color: 'bg-[#005a24]' },
  { label: 'Payments Due', value: '0', color: 'bg-[#FF9100]' },
];

const StudentStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {stats.map((stat) => (
      <div key={stat.label} className={`bg-white p-6 rounded-xl shadow-lg flex flex-col items-center ${stat.color}`} style={{backgroundColor: stat.color}}>
        <span className="text-2xl font-bold text-white">{stat.value}</span>
        <span className="text-sm text-white mt-2">{stat.label}</span>
      </div>
    ))}
  </div>
);

export default StudentStats;
