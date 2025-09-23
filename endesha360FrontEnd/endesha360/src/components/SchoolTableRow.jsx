import React from 'react';
import SchoolActions from './SchoolActions';

const SchoolTableRow = ({ 
  school, 
  onView, 
  onEdit, 
  onApprove, 
  onReject, 
  onDelete 
}) => {
  const getStatusBadge = (status) => {
    const statusClass =
      status === 'APPROVED'
        ? 'bg-green-100 text-green-800'
        : status === 'REJECTED'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800';
    
    return (
      <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
        {status}
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
        {school.id}
      </td>
      <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
        <div className="max-w-xs truncate">
          {school.name}
          {/* Show email on mobile since email column is hidden */}
          <div className="sm:hidden text-xs text-gray-500 mt-1">
            {school.email}
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {school.email}
      </td>
      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {school.city && school.country ? `${school.city}, ${school.country}` : 'N/A'}
      </td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
        {getStatusBadge(school.approvalStatus || 'PENDING')}
      </td>
      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
        <SchoolActions
          school={school}
          onView={onView}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};

export default SchoolTableRow;
