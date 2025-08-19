import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const SelectRole = () => {
  const navigate = useNavigate();

  // Technical question and options
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6]">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[#00712D] mb-4">
          Let's Get You Started
        </h2>
        <p className="text-gray-700 mb-8">
          Which of the following best describes what you want to do?
        </p>
        <div className="space-y-4">
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate('/register?role=owner')}
          >
            I want to manage a driving school
          </Button>
          <Button
            className="w-full"
            size="lg"
            variant="outline"
            onClick={() => navigate('/register?role=student')}
          >
            I want to book driving lessons and track my progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
