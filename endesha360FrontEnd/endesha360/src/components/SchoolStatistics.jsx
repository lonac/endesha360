import React from 'react';
import StatisticCard from './StatisticCard';
import { BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';

const SchoolStatistics = ({ statistics, totalSchools }) => {
  if (!statistics) {
    return null;
  }

  const stats = [
    {
      title: 'Total Schools',
      value: statistics.totalSchools || totalSchools,
      icon: BarChart3,
      iconBgColor: 'bg-blue-100',
      iconTextColor: 'text-blue-600'
    },
    {
      title: 'Pending',
      value: statistics.pendingSchools || 0,
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconTextColor: 'text-yellow-600'
    },
    {
      title: 'Approved',
      value: statistics.approvedSchools || 0,
      icon: CheckCircle,
      iconBgColor: 'bg-green-100',
      iconTextColor: 'text-green-600'
    },
    {
      title: 'Rejected',
      value: statistics.rejectedSchools || 0,
      icon: XCircle,
      iconBgColor: 'bg-red-100',
      iconTextColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <StatisticCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
          iconTextColor={stat.iconTextColor}
        />
      ))}
    </div>
  );
};

export default SchoolStatistics;
