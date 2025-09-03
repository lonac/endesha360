import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ComingSoon from './ComingSoon';

const AnalyticsReports = () => {
  return (
    <AdminLayout>
      <ComingSoon 
        title="Analytics & Reports"
        description="Platform usage statistics and performance reports"
        features={[
          'Usage statistics per school',
          'User engagement metrics',
          'Performance analytics',
          'Custom report generation'
        ]}
      />
    </AdminLayout>
  );
};

export default AnalyticsReports;
