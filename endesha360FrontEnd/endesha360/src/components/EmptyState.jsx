import React from 'react';

const EmptyState = ({ message = "No data found" }) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;
