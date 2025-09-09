import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Download,
  BarChart3,
  Camera,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import AdminLayout from '../components/AdminLayout';
import Select from 'react-select';
import CustomSelect from '../components/CustomSelect';
import { ErrorHandler, createAlertProps } from '../utils/errorHandler';

const QuestionManagement = () => {
  // State for questions list
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]); // Store all questions for client-side filtering
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [sortBy, setSortBy] = useState('id');
  
  // State for categories and statistics
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [statistics, setStatistics] = useState(null);
  
  // State for modals and forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // State for form data
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    categoryId: '',
    levelId: '',
    imageUrl: '',
    imageFile: null
  });
  
  // State for bulk upload
  const [bulkQuestions, setBulkQuestions] = useState([]);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  
  // State for alerts
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  
  const { admin } = useAdmin();

  // Client-side filtering function
  const applyClientSideFilters = (questionsData) => {
    let filtered = [...questionsData];
    
    // Search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(question => 
        question.questionText?.toLowerCase().includes(searchLower) ||
        question.options?.some(option => option?.toLowerCase().includes(searchLower))
      );
    }
    
    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(question => 
        question.categoryId?.toString() === selectedCategory.toString()
      );
    }
    
    // Level filter
    if (selectedLevel) {
      filtered = filtered.filter(question => 
        question.levelId?.toString() === selectedLevel.toString()
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
    
    return filtered;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLevel('');
    setCurrentPage(0);
  };

  // Load data on component mount and when sort changes
  useEffect(() => {
    loadQuestions();
    loadCategories();
    loadLevels();
    loadStatistics();
    // eslint-disable-next-line
  }, [sortBy]); // Only reload from server when sorting changes

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Apply client-side filtering when filters change
  useEffect(() => {
    if (allQuestions.length > 0) {
      const filteredQuestions = applyClientSideFilters(allQuestions);
      
      // Apply pagination
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);
      
      setQuestions(paginatedQuestions);
      setTotalQuestions(filteredQuestions.length);
    }
  }, [allQuestions, debouncedSearchTerm, selectedCategory, selectedLevel, sortBy, currentPage, pageSize]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      
      // Load all questions for client-side filtering
      const basicParams = new URLSearchParams({
        page: '0',
        size: '1000', // Large size to get all questions
        sort: sortBy,
        direction: 'ASC'
      });
      
      const url = `/api/admin/questions?${basicParams.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Handle wrapped response format from SystemAdminServices
        const data = result.data || result;
        let allQuestionsData = data.content || data || [];
        
        // Store all questions - the useEffect will handle filtering
        setAllQuestions(allQuestionsData);
      } else {
        console.error('API Error:', response.status, response.statusText);
        throw new Error('Failed to load questions');
      }
    } catch (error) {
      const alertProps = createAlertProps(error, 'questions');
      showAlert(alertProps);
      setQuestions([]); // Ensure questions is always an array
      setAllQuestions([]);
      setTotalQuestions(0);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/questions/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        // Handle wrapped response format from SystemAdminServices
        const categories = result.data || result || [];
        setCategories(Array.isArray(categories) ? categories : []);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]); // Ensure categories is always an array
    }
  };

  const loadLevels = async () => {
    try {
      const response = await fetch('/api/admin/questions/levels', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        // Handle wrapped response format from SystemAdminServices
        const levels = result.data || result || [];
        setLevels(Array.isArray(levels) ? levels : []);
      }
    } catch (error) {
      console.error('Failed to load levels:', error);
      setLevels([]); // Ensure levels is always an array
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch('/api/admin/questions/statistics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        // Handle wrapped response format from SystemAdminServices
        const stats = result.data || result;
        setStatistics(stats || {});
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setStatistics({}); // Ensure statistics is always an object
    }
  };

  const showAlert = (type, message, details = null, retryable = false, onRetry = null) => {
    if (typeof type === 'object') {
      // Enhanced alert props from ErrorHandler
      setAlert({ ...type, show: true });
    } else {
      // Legacy string alert
      setAlert({ type, message, details, retryable, onRetry, show: true });
    }
    setTimeout(() => setAlert({ type: '', message: '', show: false }), 5000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showAlert('error', 'Invalid File Type', 'Please select an image file (JPG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File Too Large', 'Please select an image smaller than 5MB');
        return;
      }

      setQuestionForm({ 
        ...questionForm, 
        imageFile: file,
        imageUrl: '' // Clear URL when file is selected
      });
    }
  };

  const handleRemoveImage = () => {
    setQuestionForm({ 
      ...questionForm, 
      imageFile: null,
      imageUrl: ''
    });
  };

  const handleCreateQuestion = async () => {
    try {
      let questionData = { ...questionForm };
      
      // Handle image upload if file is selected
      if (questionForm.imageFile) {
        const formData = new FormData();
        formData.append('image', questionForm.imageFile);
        
        const uploadResponse = await fetch('/api/admin/questions/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          questionData.imageUrl = uploadResult.imageUrl || uploadResult.data?.imageUrl;
        } else {
          throw new Error('Failed to upload image');
        }
      }
      
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(questionData),
      });
      
      if (response.ok) {
        showAlert('success', 'Question created successfully!');
        setShowCreateModal(false);
        resetForm();
        loadQuestions();
        loadStatistics();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create question');
      }
    } catch (error) {
      const alertProps = createAlertProps(error, 'questions');
      showAlert(alertProps);
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await fetch(`/api/admin/questions/${selectedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(questionForm),
      });
      
      if (response.ok) {
        showAlert('success', 'Question updated successfully!');
        setShowEditModal(false);
        resetForm();
        loadQuestions();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update question');
      }
    } catch (error) {
      showAlert('error', 'Failed to update question: ' + error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.ok) {
        showAlert('success', 'Question deleted successfully!');
        loadQuestions();
        loadStatistics();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete question');
      }
    } catch (error) {
      showAlert('error', 'Failed to delete question: ' + error.message);
    }
  };

  const handleBulkUpload = async () => {
    try {
      const response = await fetch('/api/admin/questions/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ questions: bulkQuestions }),
      });

      if (response.ok) {
        const result = await response.json();
        setBulkUploadResult(result);
        showAlert('success', `Bulk upload completed!`);
        setShowBulkUploadModal(false); // Close modal
        loadQuestions(); // Refresh questions
        loadStatistics(); // Refresh statistics
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload questions');
      }
    } catch (error) {
      showAlert('error', 'Failed to upload questions: ' + error.message);
    }
  };

  const resetForm = () => {
    setQuestionForm({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      categoryId: '',
      levelId: '',
      imageUrl: '',
      imageFile: null
    });
  };

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setQuestionForm({
      questionText: question.questionText,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer,
      categoryId: question.categoryId?.toString() || '',
      levelId: question.levelId?.toString() || '',
      imageUrl: question.imageUrl || '',
      imageFile: null
    });
    setShowEditModal(true);
  };

  const openViewModal = (question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
  };

  const totalPages = Math.ceil(totalQuestions / pageSize);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#00712D]">Question Management</h2>
              <p className="text-gray-600 mt-1">Manage driving test questions and categories</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowBulkUploadModal(true)}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </Button>
            </div>
          </div>
        </div>
        {/* Alert */}
        {alert.show && (
          <Alert 
            {...alert}
            onClose={() => setAlert({ ...alert, show: false })}
            onRetry={alert.retryable ? () => loadQuestions() : undefined}
            className="mb-6"
          />
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalQuestions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Filter className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalCategories}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Plus className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.questionsThisMonth}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg per Category</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.averageQuestionsPerCategory.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by question text..."
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <CustomSelect
                label="Category"
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map(category => ({ value: category.id, label: category.name }))
                ]}
                value={selectedCategory}
                onChange={option => setSelectedCategory(option ? option.value : '')}
                placeholder="All Categories"
                isClearable={false}
              />
            </div>
            <div>
              <CustomSelect
                label="Level"
                options={[
                  { value: '', label: 'All Levels' },
                  ...levels.map((level, idx) => 
                    typeof level === 'string'
                      ? { value: idx + 1, label: level }
                      : { value: level.id, label: level.name }
                  )
                ]}
                value={selectedLevel}
                onChange={option => setSelectedLevel(option ? option.value : '')}
                placeholder="All Levels"
                isClearable={false}
              />
            </div>
            <div>
              <CustomSelect
                label="Sort By"
                options={[
                  { value: 'id', label: 'ID' },
                  { value: 'questionText', label: 'Question Text' },
                  { value: 'categoryId', label: 'Category' },
                  { value: 'createdAt', label: 'Created Date' }
                ]}
                value={sortBy}
                onChange={option => setSortBy(option ? option.value : 'id')}
                placeholder="Sort by..."
                isClearable={false}
                isSearchable={false}
              />
            </div>
          </div>
          
          {/* Filter actions */}
          {(searchTerm || selectedCategory || selectedLevel) && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00712D] mr-2"></div>
                      Searching...
                    </span>
                  ) : (
                    <>
                      {totalQuestions} question{totalQuestions !== 1 ? 's' : ''} found
                      {searchTerm && ` matching "${searchTerm}"`}
                      {selectedCategory && ` in selected category`}
                      {selectedLevel && ` at selected level`}
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLevel('');
                  setCurrentPage(0);
                }}
                className="text-sm"
                disabled={isLoading}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Questions ({totalQuestions})</h2>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00712D] mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No questions found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct Answer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">{question.questionText}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {categories.find(c => c.id === question.categoryId)?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{question.correctAnswer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewModal(question)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <div className="w-20">
                    <CustomSelect
                      options={[
                        { value: 10, label: '10' },
                        { value: 25, label: '25' },
                        { value: 50, label: '50' }
                      ]}
                      value={pageSize}
                      onChange={option => setPageSize(Number(option.value))}
                      isClearable={false}
                      isSearchable={false}
                      className="min-w-0"
                    />
                  </div>
                  <span className="text-sm text-gray-700">entries</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Create Question Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Question"
          className="max-w-2xl overflow-visible"
        >
          <QuestionForm
            questionForm={questionForm}
            setQuestionForm={setQuestionForm}
            categories={categories}
            levels={levels}
            onSubmit={handleCreateQuestion}
            onCancel={() => setShowCreateModal(false)}
            submitLabel="Create Question"
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
          />
        </Modal>
      )}

      {/* Edit Question Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Question"
          className="max-w-2xl overflow-visible"
        >
          <QuestionForm
            questionForm={questionForm}
            setQuestionForm={setQuestionForm}
            categories={categories}
            levels={levels}
            onSubmit={handleUpdateQuestion}
            onCancel={() => setShowEditModal(false)}
            submitLabel="Update Question"
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
          />
        </Modal>
      )}

      {/* View Question Modal */}
      {showViewModal && selectedQuestion && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="View Question"
        >
          <QuestionView question={selectedQuestion} categories={categories} />
        </Modal>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <Modal
          isOpen={showBulkUploadModal}
          onClose={() => setShowBulkUploadModal(false)}
          title="Bulk Upload Questions"
        >
          <BulkUploadForm
            bulkQuestions={bulkQuestions}
            setBulkQuestions={setBulkQuestions}
            categories={categories}
            onSubmit={handleBulkUpload}
            onCancel={() => setShowBulkUploadModal(false)}
            result={bulkUploadResult}
          />
        </Modal>
      )}
    </div>
    </AdminLayout>
  );
};

// Question Form Component
const QuestionForm = ({ questionForm, setQuestionForm, categories, levels, onSubmit, onCancel, submitLabel, handleImageUpload, handleRemoveImage }) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const categoryOptions = (categories || []).map(c => ({ value: c.id, label: c.name }));
  const levelOptions = (levels || []).map((l, idx) =>
    typeof l === 'string'
      ? { value: idx + 1, label: l }
      : { value: l.id, label: l.name }
  );

  return (
    <div className="max-h-[70vh] overflow-y-auto overflow-x-visible">
      <div className="space-y-4 pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <textarea
            value={questionForm.questionText}
            onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
            placeholder="Enter the question text..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
            rows={3}
            required
          />
        </div>

        {/* Two column layout for category and level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative z-10">
            <CustomSelect
              label="Category"
              options={categoryOptions}
              value={questionForm.categoryId}
              onChange={option => setQuestionForm({ ...questionForm, categoryId: option ? option.value : '' })}
              placeholder="Select a category"
              required
            />
          </div>

          <div className="relative z-10">
            <CustomSelect
              label="Level"
              options={levelOptions}
              value={questionForm.levelId}
              onChange={option => setQuestionForm({ ...questionForm, levelId: option ? option.value : '' })}
              placeholder="Select a level"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {questionForm.options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <CustomSelect
            label="Correct Answer"
            options={[
              { value: '', label: 'Select correct answer' },
              ...questionForm.options
                .filter(option => option && option.trim() !== '')
                .map((option, index) => ({ value: option, label: option }))
            ]}
            value={questionForm.correctAnswer}
            onChange={option => setQuestionForm({ ...questionForm, correctAnswer: option ? option.value : '' })}
            placeholder="Select correct answer"
            required
            isClearable={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <div className="space-y-4">
            {/* Image Upload Option */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Upload Image File</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Image
                </label>
                {questionForm.imageFile && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{questionForm.imageFile.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* OR Divider */}
            {!questionForm.imageFile && (
              <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
            )}

            {/* Image URL Option */}
            {!questionForm.imageFile && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">Image URL</label>
                <input
                  type="url"
                  value={questionForm.imageUrl}
                  onChange={(e) => setQuestionForm({ ...questionForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
                />
              </div>
            )}

            {/* Image Preview */}
            {(questionForm.imageFile || questionForm.imageUrl) && (
              <div className="mt-3">
                <label className="block text-sm text-gray-600 mb-2">Preview</label>
                <div className="relative inline-block">
                  <img
                    src={questionForm.imageFile ? URL.createObjectURL(questionForm.imageFile) : questionForm.imageUrl}
                    alt="Question preview"
                    className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} className="flex-1">
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Question View Component
const QuestionView = ({ question, categories }) => {
  const category = categories.find(c => c.id === question.categoryId);
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Question</h3>
        <p className="text-gray-700">{question.questionText}</p>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Category</h4>
        <p className="text-gray-700">{category?.name || 'Unknown'}</p>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Options</h4>
        <ul className="space-y-2">
          {question.options && question.options.map((option, index) => (
            <li 
              key={index} 
              className={`p-2 rounded ${option === question.correctAnswer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}`}
            >
              <span className="font-medium">Option {index + 1}: </span>
              {option}
              {option === question.correctAnswer && (
                <span className="ml-2 text-green-600 font-medium">(Correct)</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {question.imageUrl && (
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Image</h4>
          <img 
            src={question.imageUrl} 
            alt="Question" 
            className="max-w-full h-auto rounded-lg border"
          />
        </div>
      )}
    </div>
  );
};

// Bulk Upload Form Component
const BulkUploadForm = ({ bulkQuestions, setBulkQuestions, categories, onSubmit, onCancel, result }) => {
  const [jsonInput, setJsonInput] = useState('');

  const handleJsonUpload = () => {
    try {
      const parsedQuestions = JSON.parse(jsonInput);
      if (Array.isArray(parsedQuestions)) {
        setBulkQuestions(parsedQuestions);
      } else {
        alert('JSON must be an array of questions');
      }
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const sampleFormat = [
    {
      questionText: "What is the speed limit in residential areas?",
      options: ["30 km/h", "50 km/h", "60 km/h", "80 km/h"],
      correctAnswer: "50 km/h",
      categoryId: 1,
      imageUrl: ""
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">JSON Questions</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`Paste your questions in JSON format:\n\n${JSON.stringify(sampleFormat, null, 2)}`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00712D] focus:border-transparent"
          rows={10}
        />
      </div>

      <Button
        variant="outline"
        onClick={handleJsonUpload}
        className="w-full"
        disabled={!jsonInput.trim()}
      >
        Parse JSON ({bulkQuestions.length} questions loaded)
      </Button>

      {result && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Upload Result</h4>
          <p className="text-sm text-gray-700">
            Total Processed: {result.totalProcessed}<br/>
            Successfully Created: {result.successfullyCreated}<br/>
            Errors: {result.errors?.length || 0}
          </p>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2">
              <h5 className="text-sm font-medium text-red-600">Errors:</h5>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onSubmit} 
          className="flex-1"
          disabled={bulkQuestions.length === 0}
        >
          Upload {bulkQuestions.length} Questions
        </Button>
      </div>
    </div>
  );
};

export default QuestionManagement;
