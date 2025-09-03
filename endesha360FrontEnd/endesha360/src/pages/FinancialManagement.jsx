import React from 'react';
import AdminLayout from '../components/AdminLayout';
import ComingSoon from './ComingSoon';

const FinancialManagement = () => {
  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default FinancialManagement;
