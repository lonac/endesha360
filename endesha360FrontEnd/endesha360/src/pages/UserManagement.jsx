import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import ComingSoon from './ComingSoon';

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <AdminLayout>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Management">
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
      </Modal>
    </AdminLayout>
  );
};

export default UserManagement;
