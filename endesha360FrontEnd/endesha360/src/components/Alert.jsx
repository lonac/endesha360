import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  details,
  retryable = false,
  onClose, 
  onRetry,
  duration = 5000,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    offline: {
      bg: 'bg-gray-50 border-gray-200',
      icon: WifiOff,
      iconColor: 'text-gray-600',
      titleColor: 'text-gray-800',
      messageColor: 'text-gray-700',
      buttonColor: 'bg-gray-600 hover:bg-gray-700'
    }
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  const handleRetry = async () => {
    if (onRetry && !isRetrying) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 transition-all duration-300 ${config.bg} ${
      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
    } ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${title ? 'mt-1' : ''} ${config.messageColor}`}>
              {message}
            </div>
          )}
          {details && (
            <div className={`text-xs mt-2 ${config.messageColor} opacity-75`}>
              {details}
            </div>
          )}
          
          {/* Action buttons */}
          {retryable && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors ${config.buttonColor} disabled:opacity-50`}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleClose}
                className={`inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${config.iconColor}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
