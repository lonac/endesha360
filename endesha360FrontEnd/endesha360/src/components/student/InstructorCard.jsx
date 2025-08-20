import React from 'react';

const instructor = {
  name: 'Mr. John Doe',
  photo: '',
  phone: '+254700123456',
  email: 'john.doe@drivingschool.com',
};

const InstructorCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
    <div className="w-20 h-20 bg-[#D5ED9F] rounded-full flex items-center justify-center mb-3">
      {/* Placeholder for photo */}
      <span className="text-3xl text-[#00712D] font-bold">{instructor.name[0]}</span>
    </div>
    <div className="text-center">
      <h4 className="text-lg font-semibold text-[#00712D]">{instructor.name}</h4>
      <p className="text-gray-500 text-sm">{instructor.email}</p>
      <p className="text-gray-500 text-sm">{instructor.phone}</p>
    </div>
  </div>
);

export default InstructorCard;
