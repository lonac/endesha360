const API_ENDPOINTS = {
  USER_SERVICE_AUTH: 'http://localhost:8081/api/auth',
  USER_SERVICE: 'http://localhost:8081/api',
  SCHOOL_OWNER_SERVICE: 'http://localhost:8081/api/school-owners',
  SCHOOL_SERVICE: 'http://localhost:8082/api/schools',
  ADMIN_SERVICE: 'http://localhost:8083/api'
};

class ApiService {
  // School Owner Registration (User Management Service)
  async registerSchoolOwner(userData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.SCHOOL_OWNER_SERVICE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username || userData.email.split('@')[0], // Generate username from email if not provided
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('School owner registration error:', error);
      throw error;
    }
  }

  // Regular User Registration (User Management Service)
  async registerUser(userData) {
    try {
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE_AUTH}/register`, {
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
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: credentials.email,
          password: credentials.password,
          tenantCode: credentials.tenantCode || 'PLATFORM' // Default to PLATFORM tenant for school owners
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store JWT token and user data
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tenantCode', data.tenantCode);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Authentication validation
  async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE_AUTH}/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE_AUTH}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async logoutUser() {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_ENDPOINTS.USER_SERVICE_AUTH}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.logout(); // Clear local storage regardless
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

  async getMySchool() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SCHOOL_SERVICE}/my-school`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        return null; // No school registered yet
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get school information');
      }
      
      return data;
    } catch (error) {
      console.error('Get school error:', error);
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

  getTenantCode() {
    return localStorage.getItem('tenantCode');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantCode');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Admin Authentication and Management APIs
  async loginAdmin(credentials) {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: credentials.username,
          password: credentials.password
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }
      
      // Store admin JWT token and user data
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        localStorage.setItem('userType', 'admin');
      }
      
      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  async logoutAdmin() {
    try {
      const token = this.getAdminToken();
      if (token) {
        await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      this.clearAdminSession();
    }
  }

  // Admin School Management APIs
  async getPendingSchools() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/schools/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending schools');
      }
      
      return data;
    } catch (error) {
      console.error('Get pending schools error:', error);
      throw error;
    }
  }

  async getSchoolById(schoolId) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/schools/${schoolId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch school details');
      }
      
      return data;
    } catch (error) {
      console.error('Get school details error:', error);
      throw error;
    }
  }

  async approveSchool(schoolId, comments = '') {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/schools/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolId: schoolId,
          action: 'APPROVE',
          adminComment: comments
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve school');
      }
      
      return data;
    } catch (error) {
      console.error('Approve school error:', error);
      throw error;
    }
  }

  async rejectSchool(schoolId, comments) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/schools/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolId: schoolId,
          action: 'REJECT',
          adminComment: comments
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject school');
      }
      
      return data;
    } catch (error) {
      console.error('Reject school error:', error);
      throw error;
    }
  }

  async getSchoolApprovalHistory(schoolId) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/schools/${schoolId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch approval history');
      }
      
      return data;
    } catch (error) {
      console.error('Get approval history error:', error);
      throw error;
    }
  }

  // Admin utility methods
  getAdminToken() {
    return localStorage.getItem('adminToken');
  }

  getAdminUser() {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  }

  getUserType() {
    return localStorage.getItem('userType');
  }

  isAdminAuthenticated() {
    return !!this.getAdminToken();
  }

  clearAdminSession() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userType');
  }
}

export default new ApiService();
