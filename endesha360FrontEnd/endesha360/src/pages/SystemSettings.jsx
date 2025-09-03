import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ComingSoon from './ComingSoon';

const SystemSettings = () => {
  return (
    <AdminLayout>
      <ComingSoon 
        title="System Settings"
        description="Platform configuration and system-wide settings"
        features={[
          'Configure platform settings',
          'Manage subscription plans',
          'Set system-wide defaults',
          'Control feature availability'
        ]}
      />
    </AdminLayout>
  );
};

export default SystemSettings;
