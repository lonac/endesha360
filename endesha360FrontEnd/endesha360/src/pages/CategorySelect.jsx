import React from 'react';

const CategorySelect = ({ categories, value, onChange }) => {
  return (
    <select
      className="w-full p-2 border rounded-lg text-gray-700"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>Select a category</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
};

export default CategorySelect;
