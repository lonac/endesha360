const API_ENDPOINTS = {
  USER_SERVICE_AUTH: 'http://localhost:8081/api/auth',
  USER_SERVICE: 'http://localhost:8081/api',
  SCHOOL_OWNER_SERVICE: 'http://localhost:8081/api/school-owners',
  SCHOOL_SERVICE: 'http://localhost:8082/api/schools',
  ADMIN_SERVICE: 'http://localhost:8083/api',
  SYSTEM_ADMIN_SERVICE: 'http://localhost:8087/api/admin'
};

// const API_ENDPOINTS = {
//   USER_SERVICE_AUTH: import.meta.env.VITE_API_USER_AUTH,
//   USER_SERVICE: import.meta.env.VITE_API_USER,
//   SCHOOL_SERVICE: import.meta.env.VITE_API_SCHOOL,
//   ADMIN_SERVICE: import.meta.env.VITE_API_ADMIN,
//   SYSTEM_ADMIN_SERVICE: import.meta.env.VITE_API_SYSTEM_ADMIN
// };

class ApiService {
  // Student Registration (User Management Service)
  async registerStudent(userData) {
    // This uses the same endpoint as registerUser, which assigns the STUDENT role by default
    return this.registerUser(userData);
  }
  // Fetch schools by status (for admin dashboard tabs)
  async getSchoolsByStatus(status) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }
      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/schools?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch ${status} schools`);
      }
      return data;
    } catch (error) {
      console.error(`Get ${status} schools error:`, error);
      throw error;
    }
  }
  async updateMySchool(schoolData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${API_ENDPOINTS.SCHOOL_SERVICE}/my-school`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(schoolData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update school information');
      }
      return data;
    } catch (error) {
      console.error('Update school error:', error);
      throw error;
    }
  }
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

  async detectUserTenant(usernameOrEmail) {
    try {
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE_AUTH}/detect-tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to detect user tenant');
      }
      
      return data.tenantCode;
    } catch (error) {
      console.error('Tenant detection error:', error);
      // Return PLATFORM as fallback for backward compatibility
      return 'PLATFORM';
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

  async getMyStudentCount() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found for student count');
        throw new Error('No authentication token found');
      }

      console.log('Calling student count API:', `${API_ENDPOINTS.USER_SERVICE}/school-owners/student-count`);
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE}/school-owners/student-count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Student count API response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Student count API returned 404, returning 0');
          return 0; // No students found
        }
        const data = await response.json();
        console.error('Student count API error response:', data);
        throw new Error(data.message || 'Failed to get student count');
      }
      
      const data = await response.json();
      console.log('Student count API success response:', data);
      return data.count || 0;
    } catch (error) {
      console.error('Get student count error:', error);
      return 0; // Return 0 on error instead of throwing
    }
  }

  async getMyRecentActivities(limit = 10) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found for recent activities');
        throw new Error('No authentication token found');
      }

      console.log('Calling recent activities API:', `${API_ENDPOINTS.USER_SERVICE}/school-owners/recent-activities`);
      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE}/school-owners/recent-activities?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Recent activities API response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Recent activities API returned 404, returning empty array');
          return []; // No activities found
        }
        const data = await response.json();
        console.error('Recent activities API error response:', data);
        throw new Error(data.message || 'Failed to get recent activities');
      }
      
      const data = await response.json();
      console.log('Recent activities API success response:', data);
      return data.activities || [];
    } catch (error) {
      console.error('Get recent activities error:', error);
      return []; // Return empty array on error instead of throwing
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

  // ===== QUESTION MANAGEMENT APIs =====
  
  // Get paginated questions with filtering
  async getQuestions(page = 0, size = 10, sort = 'id', direction = 'ASC', search = '', categoryId = null) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
        direction
      });

      if (search) params.append('search', search);
      if (categoryId) params.append('categoryId', categoryId.toString());

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch questions');
      }
      return data;
    } catch (error) {
      console.error('Get questions error:', error);
      throw error;
    }
  }

  // Create a new question
  async createQuestion(questionData) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create question');
      }
      return data;
    } catch (error) {
      console.error('Create question error:', error);
      throw error;
    }
  }

  // Update a question
  async updateQuestion(questionId, questionData) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update question');
      }
      return data;
    } catch (error) {
      console.error('Update question error:', error);
      throw error;
    }
  }

  // Delete a question
  async deleteQuestion(questionId) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete question');
      }
    } catch (error) {
      console.error('Delete question error:', error);
      throw error;
    }
  }

  // Bulk upload questions
  async bulkUploadQuestions(questions) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions/bulk-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ questions }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to bulk upload questions');
      }
      return data;
    } catch (error) {
      console.error('Bulk upload questions error:', error);
      throw error;
    }
  }

  // Get question categories
  async getQuestionCategories() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }
      return data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  }

  // Get question statistics
  async getQuestionStatistics() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SYSTEM_ADMIN_SERVICE}/questions/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
      return data;
    } catch (error) {
      console.error('Get statistics error:', error);
      throw error;
    }
  }

  // ===== DASHBOARD APIs =====

  // Get school statistics
  async getSchoolStatistics() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.SCHOOL_SERVICE}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch school statistics');
      }
      return data;
    } catch (error) {
      console.error('Get school statistics error:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStatistics() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.USER_SERVICE}/admin/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user statistics');
      }
      return data;
    } catch (error) {
      console.error('Get user statistics error:', error);
      throw error;
    }
  }

  // Get financial statistics
  async getFinancialStatistics() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/financial/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch financial statistics');
      }
      return data;
    } catch (error) {
      console.error('Get financial statistics error:', error);
      throw error;
    }
  }

  // Get recent activities
  async getRecentActivities(limit = 10) {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/activities/recent?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent activities');
      }
      return data;
    } catch (error) {
      console.error('Get recent activities error:', error);
      throw error;
    }
  }

  // Get system health status
  async getSystemHealth() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/system/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch system health');
      }
      return data;
    } catch (error) {
      console.error('Get system health error:', error);
      throw error;
    }
  }


  async getDashboardData() {
    try {
      const token = this.getAdminToken();
      if (!token) {
        throw new Error('No admin authentication token found');
      }

  const response = await fetch(`${API_ENDPOINTS.ADMIN_SERVICE}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
      return data;
    } catch (error) {
      console.error('Get dashboard data error:', error);
      throw error;
    }
  }
}

export default new ApiService();
