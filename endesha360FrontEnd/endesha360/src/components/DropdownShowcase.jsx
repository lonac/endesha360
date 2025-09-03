import React, { useState } from 'react';
import CustomSelect from './CustomSelect';

// Demo component to showcase all dropdown variations
const DropdownShowcase = () => {
  const [basicValue, setBasicValue] = useState('');
  const [multiValue, setMultiValue] = useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [disabledValue, setDisabledValue] = useState('option1');

  const basicOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const categoryOptions = [
    { value: 'theory', label: 'Theory Questions' },
    { value: 'practical', label: 'Practical Questions' },
    { value: 'signs', label: 'Traffic Signs' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Standardized Dropdown Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Dropdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Dropdown</h3>
          <CustomSelect
            label="Basic Selection"
            options={basicOptions}
            value={basicValue}
            onChange={option => setBasicValue(option ? option.value : '')}
            placeholder="Choose an option..."
          />
        </div>

        {/* Multi-select Dropdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Multi-Select</h3>
          <CustomSelect
            label="Multiple Choices"
            options={basicOptions}
            value={multiValue}
            onChange={options => setMultiValue(options || [])}
            placeholder="Select multiple..."
            isMulti={true}
          />
        </div>

        {/* Required Field */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Required Field</h3>
          <CustomSelect
            label="Category"
            options={categoryOptions}
            value={categoryValue}
            onChange={option => setCategoryValue(option ? option.value : '')}
            placeholder="Select category..."
            required={true}
            error={!categoryValue ? "Category is required" : ""}
          />
        </div>

        {/* Disabled Dropdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Disabled State</h3>
          <CustomSelect
            label="Disabled Selection"
            options={basicOptions}
            value={disabledValue}
            onChange={() => {}}
            placeholder="Cannot change..."
            isDisabled={true}
          />
        </div>

        {/* Non-clearable */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Non-clearable</h3>
          <CustomSelect
            label="Fixed Selection"
            options={[
              { value: 'ASC', label: 'Ascending' },
              { value: 'DESC', label: 'Descending' }
            ]}
            value="ASC"
            onChange={() => {}}
            isClearable={false}
            isSearchable={false}
          />
        </div>

        {/* Loading State */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Loading State</h3>
          <CustomSelect
            label="Loading Data"
            options={[]}
            value=""
            onChange={() => {}}
            placeholder="Loading..."
            isLoading={true}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Completed Conversions</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• QuestionManagement: Category filter, Sort by, Direction, Page size, Correct answer, Category/Level form fields</li>
          <li>• CategorySelect: Complete component overhaul with CustomSelect</li>
          <li>• All dropdowns now use consistent React Select styling</li>
          <li>• Enhanced accessibility and keyboard navigation</li>
          <li>• Consistent error handling and validation</li>
          <li>• Multi-select support where needed</li>
          <li>• Loading and disabled states</li>
          <li>• Project color scheme integration (#00712D primary, #D5ED9F accent)</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🎨 Styling Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Consistent border radius (8px) and padding</li>
          <li>• Focus states with project green (#00712D)</li>
          <li>• Hover effects and smooth transitions</li>
          <li>• Error state styling with red borders</li>
          <li>• Proper z-index management for dropdowns</li>
          <li>• Mobile-responsive design</li>
          <li>• Portal rendering for proper layering</li>
        </ul>
      </div>
    </div>
  );
};

export default DropdownShowcase;
