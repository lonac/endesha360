const API_ENDPOINTS = {
  USER_SERVICE: 'http://localhost:8081/api/users',
  SCHOOL_SERVICE: 'http://localhost:8082/api/schools'
};

class ApiService {
  // User Management Service APIs
  async registerUser(userData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async loginUser(credentials) {
    try {
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store JWT token
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // School Management Service APIs
  async registerSchool(schoolData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SCHOOL_SERVICE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(schoolData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Please login again.');
        }
        throw new Error(data.message || 'School registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('School registration error:', error);
      throw error;
    }
  }

  // Utility methods
  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new ApiService();
