import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ComingSoon from './ComingSoon';

const UserManagement = () => {
  return (
    <AdminLayout>
      <ComingSoon 
        title="User Management"
        description="Manage system users, permissions, and access control"
        features={[
          'View all platform users',
          'Manage user roles and permissions',
          'Monitor user activity logs',
          'Control user access levels'
        ]}
      />
    </AdminLayout>
  );
};

export default UserManagement;
