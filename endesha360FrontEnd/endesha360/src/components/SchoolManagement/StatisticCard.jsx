import React from 'react';

const StatisticCard = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor, 
  iconTextColor 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`${iconBgColor} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconTextColor}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
