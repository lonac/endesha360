import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import ComingSoon from './ComingSoon';

const SystemSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <AdminLayout>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="System Settings">
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
      </Modal>
    </AdminLayout>
  );
};

export default SystemSettings;
