import React from 'react';
import Button from '../Button';
import { Eye, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const SchoolActions = ({ 
  school, 
  onView, 
  onEdit, 
  onApprove, 
  onReject, 
  onDelete 
}) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(school)}
        title="View School"
        className="p-1 sm:p-2"
      >
        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(school)}
        title="Edit School"
        className="p-1 sm:p-2"
      >
        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      
      {school.approvalStatus === 'PENDING' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApprove(school.id)}
            className="text-green-600 hover:text-green-800 p-1 sm:p-2"
            title="Approve School"
          >
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReject(school.id)}
            className="text-red-600 hover:text-red-800 p-1 sm:p-2"
            title="Reject School"
          >
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(school.id)}
        className="text-red-600 hover:text-red-800 p-1 sm:p-2"
        title="Delete School"
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

export default SchoolActions;
