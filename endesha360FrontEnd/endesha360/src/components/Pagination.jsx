import React from 'react';
import Button from './Button';
import CustomSelect from './CustomSelect';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const pageSizeOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' }
  ];

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <div className="w-16 sm:w-20">
            <CustomSelect
              options={pageSizeOptions}
              value={pageSize}
              onChange={option => onPageSizeChange(Number(option.value))}
              isClearable={false}
              isSearchable={false}
              className="min-w-0"
            />
          </div>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
