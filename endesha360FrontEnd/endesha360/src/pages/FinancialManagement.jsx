import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import ComingSoon from './ComingSoon';

const FinancialManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <AdminLayout>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Financial Management">
        <ComingSoon 
          title="Financial Management"
          description="Billing, revenue tracking, and payment management"
          features={[
            'Monitor subscription payments',
            'Track revenue across all schools',
            'Generate financial reports',
            'Manage billing and invoices'
          ]}
        />
      </Modal>
    </AdminLayout>
  );
};

export default FinancialManagement;
