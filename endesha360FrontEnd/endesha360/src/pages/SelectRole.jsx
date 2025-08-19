import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, User } from 'lucide-react';
import Button from '../components/Button';

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Let's Get You Started
      </h2>
      <p className="text-gray-600 mb-6">
        How would you like to use Endesha360?
      </p>
      <div className="space-y-4">
        <Button
          className="w-full flex items-center justify-center"
          size="lg"
          onClick={() => navigate('/register?role=owner')}
        >
          <School className="mr-2 h-5 w-5" />
          Manage a Driving School
        </Button>
        <Button
          className="w-full flex items-center justify-center"
          size="lg"
          variant="outline"
          onClick={() => navigate('/register?role=student')}
        >
          <User className="mr-2 h-5 w-5" />
          Continue as a Student
        </Button>
      </div>
    </div>
  );
};

export default SelectRole;
