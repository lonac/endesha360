import React from 'react';
import CustomSelect from '../components/CustomSelect';

const CategorySelect = ({ categories, value, onChange, placeholder = "Select a category", label, required = false }) => {
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));

  return (
    <CustomSelect
      label={label}
      options={categoryOptions}
      value={value}
      onChange={option => onChange(option ? option.value : '')}
      placeholder={placeholder}
      required={required}
      isClearable={false}
    />
  );
};

export default CategorySelect;
