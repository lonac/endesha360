import React from 'react';
import Button from './Button';

const SchoolForm = ({ 
  schoolForm, 
  setSchoolForm, 
  onSubmit, 
  onCancel, 
  submitLabel,
  isSubmitting = false
}) => {
  const handleInputChange = (field, value) => {
    setSchoolForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="space-y-4 pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name
          </label>
          <input
            type="text"
            value={schoolForm.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter school name..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={schoolForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="school@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={schoolForm.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="+1234567890"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={schoolForm.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Street address..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={schoolForm.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={schoolForm.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Country name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={schoolForm.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://www.schoolwebsite.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={schoolForm.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the school..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name
            </label>
            <input
              type="text"
              value={schoolForm.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              placeholder="Owner/Administrator name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Email
            </label>
            <input
              type="email"
              value={schoolForm.ownerEmail}
              onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
              placeholder="owner@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={onSubmit} 
            className="flex-1"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchoolForm;
