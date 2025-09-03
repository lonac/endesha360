// Enhanced Error Handler for Better User Experience
export class ErrorHandler {
  static formatError(error, context = '') {
    // Handle different types of errors
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      return `Connection failed. Please check if the ${context} service is running.`;
    }
    
    if (error?.message?.includes('Connection refused')) {
      return `Unable to connect to ${context} service. Please try again later.`;
    }
    
    if (error?.message?.includes('404')) {
      return `${context} service not found. Please contact support.`;
    }
    
    if (error?.message?.includes('500')) {
      return `Server error in ${context} service. Please try again.`;
    }
    
    if (error?.message?.includes('401')) {
      return `Authentication failed. Please login again.`;
    }
    
    if (error?.message?.includes('403')) {
      return `Access denied. You don't have permission for this action.`;
    }
    
    // Handle specific application errors
    if (error?.message?.includes('Failed to fetch schools')) {
      return 'Unable to load school data. The school management service may be offline.';
    }
    
    if (error?.message?.includes('Failed to fetch questions')) {
      return 'Unable to load questions. The question service may be offline.';
    }
    
    if (error?.message?.includes('Failed to create question')) {
      return 'Question creation failed. Please check your input and try again.';
    }
    
    if (error?.message?.includes('imageUrl')) {
      return 'Image URL is invalid or the image cannot be loaded. Please check the URL format.';
    }
    
    // Default fallback
    return error?.message || 'An unexpected error occurred. Please try again.';
  }
  
  static getServiceStatus(error) {
    if (error?.message?.includes('Connection refused') || 
        error?.message?.includes('fetch')) {
      return {
        status: 'offline',
        message: 'Service appears to be offline',
        action: 'Please contact your system administrator'
      };
    }
    
    return {
      status: 'error',
      message: 'Service error occurred',
      action: 'Please try again in a few moments'
    };
  }
  
  static createUserFriendlyMessage(error, operation = 'operation') {
    const baseMessage = this.formatError(error);
    const serviceStatus = this.getServiceStatus(error);
    
    if (serviceStatus.status === 'offline') {
      return {
        type: 'error',
        title: 'Service Unavailable',
        message: baseMessage,
        details: serviceStatus.action,
        retryable: true
      };
    }
    
    return {
      type: 'error',
      title: `${operation} Failed`,
      message: baseMessage,
      details: 'If this continues, please contact support.',
      retryable: !error?.message?.includes('403')
    };
  }
}

// Service-specific error messages
export const ServiceErrors = {
  SCHOOL_MANAGEMENT: {
    CONNECTION_FAILED: 'School Management service is currently unavailable. Please ensure the service is running on port 8082.',
    FETCH_FAILED: 'Unable to retrieve school information. The database connection may be down.',
    UPDATE_FAILED: 'School information could not be updated. Please verify your changes and try again.'
  },
  
  QUESTION_SERVICE: {
    CONNECTION_FAILED: 'Question Service is currently unavailable. Please ensure the service is running on port 8086.',
    CREATE_FAILED: 'Question could not be created. Please check all required fields are filled.',
    IMAGE_FAILED: 'Image upload failed. Please ensure the image URL is valid and accessible.'
  },
  
  SYSTEM_ADMIN: {
    CONNECTION_FAILED: 'System Admin service is currently unavailable. Please ensure the service is running on port 8083.',
    AUTH_FAILED: 'Authentication failed. Please login again with valid credentials.'
  }
};

// Enhanced Alert component props generator
export const createAlertProps = (error, context = '') => {
  const friendlyError = ErrorHandler.createUserFriendlyMessage(error, context);
  
  return {
    type: friendlyError.type,
    title: friendlyError.title,
    message: friendlyError.message,
    details: friendlyError.details,
    retryable: friendlyError.retryable,
    duration: friendlyError.retryable ? 8000 : 5000 // Longer duration for retryable errors
  };
};
