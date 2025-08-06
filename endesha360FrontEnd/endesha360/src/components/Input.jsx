import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#00712D] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border border-[#D5ED9F] rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-[#00712D] focus:border-transparent
          placeholder-gray-400 text-[#00712D] bg-white
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
