import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Button from '../components/Button';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBE6] p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg max-w-lg w-full">
        <div className="mx-auto bg-[#D5ED9F] w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <Clock className="h-12 w-12 text-[#00712D]" />
        </div>
        <h1 className="text-3xl font-bold text-[#00712D] mb-4">
          Coming Soon!
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          We're working hard to bring you this feature. Please check back later.
        </p>
        <Button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center mx-auto bg-[#FF9100] hover:bg-[#e6820e]"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ComingSoon;
