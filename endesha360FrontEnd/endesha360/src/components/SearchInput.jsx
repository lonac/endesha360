import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "" 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Search Schools</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent ${className}`}
        />
      </div>
    </div>
  );
};

export default SearchInput;
