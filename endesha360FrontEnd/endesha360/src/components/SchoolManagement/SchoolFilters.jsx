import React from 'react';
import SearchInput from '../SearchInput';
import CustomSelect from '../CustomSelect';
import Button from '../Button';

const SchoolFilters = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedLocation,
  setSelectedLocation,
  sortBy,
  setSortBy,
  isLoading,
  totalSchools,
  onClearFilters
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'createdAt', label: 'Created Date' }
  ];

  const hasActiveFilters = searchTerm || selectedStatus || selectedLocation;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, email..."
        />
        
        <CustomSelect
          label="Status"
          options={statusOptions}
          value={selectedStatus}
          onChange={option => setSelectedStatus(option ? option.value : '')}
          placeholder="All Statuses"
          isClearable={false}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            placeholder="Filter by city/country"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
          />
        </div>
        
        <CustomSelect
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={option => setSortBy(option ? option.value : 'id')}
          placeholder="Sort by..."
          isClearable={false}
          isSearchable={false}
        />
      </div>

      {/* Filter results and clear button */}
      {hasActiveFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 gap-3">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00712D] mr-2"></div>
                  Searching...
                </span>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span>
                    {totalSchools} school{totalSchools !== 1 ? 's' : ''} found
                  </span>
                  {(searchTerm || selectedStatus || selectedLocation) && (
                    <div className="text-xs sm:text-sm text-gray-500">
                      {searchTerm && `matching "${searchTerm}"`}
                      {selectedStatus && ` with status ${selectedStatus}`}
                      {selectedLocation && ` in "${selectedLocation}"`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-sm w-full sm:w-auto"
            disabled={isLoading}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchoolFilters;
