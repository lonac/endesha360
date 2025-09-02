import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title, className }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl p-6 relative ${className || 'max-w-md'} w-full m-4 animate-fade-in-up my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 transition-colors z-10"
        >
          <X size={20} />
        </button>
        {title && (
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pr-8">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
