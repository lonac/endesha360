import React from 'react';

const PaymentsCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
    <h3 className="text-lg font-semibold text-[#00712D] mb-4">Payments</h3>
    <div className="text-2xl font-bold text-[#00712D]">Paid</div>
    <div className="text-gray-500 text-sm mt-2">All fees for this month are settled.</div>
  </div>
);

export default PaymentsCard;
