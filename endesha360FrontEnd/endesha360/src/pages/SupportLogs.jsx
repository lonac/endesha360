import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ComingSoon from './ComingSoon';

const SupportLogs = () => {
  return (
    <AdminLayout>
      <ComingSoon 
        title="Support & Logs"
        description="System logs, audit trails, and support management"
        features={[
          'View system activity logs',
          'Monitor error logs',
          'Track user actions',
          'Bug report management'
        ]}
      />
    </AdminLayout>
  );
};

export default SupportLogs;
