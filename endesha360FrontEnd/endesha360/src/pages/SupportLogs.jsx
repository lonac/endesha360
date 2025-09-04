import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import ComingSoon from './ComingSoon';

const SupportLogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <AdminLayout>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Support & Logs">
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
      </Modal>
    </AdminLayout>
  );
};

export default SupportLogs;
