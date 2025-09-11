import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const SchoolView = ({ school }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Helper to derive status
  const getStatus = (school) => {
    if (school.approvalStatus) return school.approvalStatus.toUpperCase();
    if (school.isApproved && school.isActive) return 'APPROVED';
    if (school.isApproved === false) return 'REJECTED';
    return 'PENDING';
  };

  const status = getStatus(school);

  const statusStyles = {
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
  };

  const statusIcons = {
    APPROVED: <CheckCircle className="w-4 h-4 mr-1" />,
    REJECTED: <XCircle className="w-4 h-4 mr-1" />,
    PENDING: <Clock className="w-4 h-4 mr-1" />,
  };

  // Description handling
  const description = school?.description || 'No description available';
  const shortDesc =
    description.length > 150 ? description.slice(0, 150) + '...' : description;

  return (
    <div className="space-y-6">
      {/* Header with name + status */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">{school?.name}</h3>
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}
        >
          {statusIcons[status]} {status}
        </span>
      </div>

      {/* Info sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Basic Information</h4>
          <div className="space-y-2 text-sm">
            {school?.email && (
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${school.email}`} className="text-blue-600">
                  {school.email}
                </a>
              </p>
            )}
            {school?.phoneNumber && (
              <p>
                <span className="font-medium">Phone:</span>{' '}
                <a href={`tel:${school.phoneNumber}`} className="text-blue-600">
                  {school.phoneNumber}
                </a>
              </p>
            )}
            {school?.website && (
              <p>
                <span className="font-medium">Website:</span>{' '}
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  {school.website}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Location</h4>
          <div className="space-y-2 text-sm">
            {school?.address && (
              <p>
                <span className="font-medium">Address:</span> {school.address}
              </p>
            )}
            {school?.city && (
              <p>
                <span className="font-medium">City:</span> {school.city}
              </p>
            )}
            {school?.country && (
              <p>
                <span className="font-medium">Country:</span> {school.country}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Owner */}
      {(school?.ownerName || school?.ownerEmail) && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Owner/Administrator</h4>
          <div className="space-y-2 text-sm">
            {school?.ownerName && (
              <p>
                <span className="font-medium">Name:</span> {school.ownerName}
              </p>
            )}
            {school?.ownerEmail && (
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${school.ownerEmail}`} className="text-blue-600 underline">
                  {school.ownerEmail}
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-gray-700 text-sm leading-relaxed">
          {showFullDesc ? description : shortDesc}
        </p>
        {description.length > 150 && (
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-blue-600 text-sm mt-1"
          >
            {showFullDesc ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SchoolView;
