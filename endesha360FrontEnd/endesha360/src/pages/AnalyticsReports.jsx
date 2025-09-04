import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import ComingSoon from './ComingSoon';

const AnalyticsReports = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <AdminLayout>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Analytics & Reports">
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
      </Modal>
    </AdminLayout>
  );
};

export default AnalyticsReports;
