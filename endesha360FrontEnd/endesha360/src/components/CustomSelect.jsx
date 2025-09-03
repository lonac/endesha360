import React from 'react';
import Select from 'react-select';

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  isMulti = false,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  className = "",
  label,
  error,
  required = false,
  ...props
}) => {
  // Custom styles for React Select to match project theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: error 
        ? '1px solid #EF4444' 
        : state.isFocused 
          ? '2px solid #00712D' 
          : '1px solid #D1D5DB',
      borderRadius: '8px',
      boxShadow: state.isFocused 
        ? '0 0 0 1px #00712D' 
        : 'none',
      backgroundColor: isDisabled ? '#F9FAFB' : 'white',
      fontSize: '14px',
      '&:hover': {
        borderColor: error ? '#EF4444' : '#9CA3AF'
      }
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '8px 12px'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
      fontSize: '14px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#00712D' 
        : state.isFocused 
          ? '#D5ED9F' 
          : 'white',
      color: state.isSelected 
        ? 'white' 
        : state.isFocused 
          ? '#00712D' 
          : '#374151',
      fontSize: '14px',
      padding: '12px 16px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#00712D' : '#D5ED9F',
        color: state.isSelected ? 'white' : '#00712D'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 50
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#D5ED9F',
      borderRadius: '6px'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#00712D',
      fontSize: '12px'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#00712D',
      '&:hover': {
        backgroundColor: '#00712D',
        color: 'white'
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#D1D5DB'
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#00712D' : '#9CA3AF',
      '&:hover': {
        color: '#00712D'
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#9CA3AF',
      '&:hover': {
        color: '#EF4444'
      }
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#00712D'
    })
  };

  // Find the selected value object from options
  const getSelectedValue = () => {
    if (!value) return null;
    
    if (isMulti) {
      if (Array.isArray(value)) {
        return options.filter(option => value.includes(option.value));
      }
      return value;
    }
    
    if (typeof value === 'object' && value.value !== undefined) {
      return value;
    }
    
    return options.find(option => option.value === value) || null;
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Select
        options={options}
        value={getSelectedValue()}
        onChange={onChange}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        styles={customStyles}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
