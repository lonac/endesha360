import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00712D] mx-auto"></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
