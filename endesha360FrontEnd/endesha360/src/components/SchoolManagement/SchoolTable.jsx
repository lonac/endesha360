import React from 'react';
import SchoolTableHeader from './SchoolTableHeader';
import SchoolTableRow from './SchoolTableRow';
import LoadingSpinner from '../LoadingSpinner';
import EmptyState from '../EmptyState';

const SchoolTable = ({ 
  schools = [],
  totalSchools,
  isLoading,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Schools ({totalSchools})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner message="Loading schools..." />
        ) : schools.length === 0 ? (
          <EmptyState message="No schools found" />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <SchoolTableHeader />
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school) => (
                <SchoolTableRow
                  key={school.id}
                  school={school}
                  onView={onView}
                  onEdit={onEdit}
                  onApprove={onApprove}
                  onReject={onReject}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SchoolTable;
