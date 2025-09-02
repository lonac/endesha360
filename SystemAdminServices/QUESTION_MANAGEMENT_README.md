# Question Management Feature - SystemAdminServices

## Overview
This feature enables system administrators to manage test questions through the SystemAdminServices. It provides a centralized interface for question CRUD operations, bulk uploads, and statistics, while maintaining security and proper authorization.

## Architecture
- **SystemAdminServices** (Port 8083) - Main admin service
- **questions-service** (Port 8086) - Question storage and management
- Communication via RestTemplate HTTP calls

## New Components Added

### 1. DTOs (Data Transfer Objects)
- `QuestionDTO.java` - Main question data structure
- `BulkQuestionUploadRequest.java` - Bulk upload request format
- `BulkQuestionUploadResponse.java` - Bulk upload response with error details
- `QuestionStatisticsDTO.java` - Question analytics data

### 2. Service Layer
- `QuestionManagementService.java` - Business logic for question operations
- Handles communication with questions-service
- Provides error handling and logging

### 3. Controller Layer
- `QuestionManagementController.java` - REST API endpoints
- Secured with JWT authentication and role-based authorization
- Comprehensive Swagger documentation

### 4. Configuration
- `HttpClientConfig.java` - RestTemplate bean configuration
- Updated `application.properties` with questions service URL
- Enhanced permissions in SystemAdmin entity

## API Endpoints

### Question CRUD Operations
```
GET    /api/admin/questions              - Get all questions (paginated)
GET    /api/admin/questions/{id}         - Get question by ID
POST   /api/admin/questions              - Create new question
PUT    /api/admin/questions/{id}         - Update question
DELETE /api/admin/questions/{id}         - Delete question
```

### Bulk Operations
```
POST   /api/admin/questions/bulk-upload  - Upload multiple questions
```

### Reference Data
```
GET    /api/admin/questions/categories   - Get question categories
GET    /api/admin/questions/levels       - Get question difficulty levels
GET    /api/admin/questions/statistics   - Get question analytics
```

## Security and Permissions

### New Permissions Added
- `MANAGE_QUESTIONS` - Full CRUD operations
- `APPROVE_QUESTIONS` - Question approval workflow (future)
- `VIEW_QUESTIONS` - Read-only access
- `BULK_UPLOAD_QUESTIONS` - Bulk upload capability

### Authorization Rules
- **VIEW_QUESTIONS** or **MANAGE_QUESTIONS** - Required for read operations
- **MANAGE_QUESTIONS** - Required for create, update, delete
- **BULK_UPLOAD_QUESTIONS** or **MANAGE_QUESTIONS** - Required for bulk upload

## Usage Examples

### 1. Create a Single Question
```bash
POST /api/admin/questions
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "questionText": "What is the speed limit in residential areas?",
  "options": ["30 km/h", "50 km/h", "60 km/h", "80 km/h"],
  "correctAnswer": 1,
  "explanation": "The speed limit in residential areas is typically 50 km/h",
  "categoryId": 1,
  "levelId": 2
}
```

### 2. Bulk Upload Questions
```bash
POST /api/admin/questions/bulk-upload
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "questions": [
    {
      "questionText": "Question 1 text",
      "options": ["Option A", "Option B", "Option C"],
      "correctAnswer": 0,
      "categoryId": 1,
      "levelId": 1
    },
    {
      "questionText": "Question 2 text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "categoryId": 2,
      "levelId": 2
    }
  ],
  "validateBeforeUpload": true,
  "replaceExisting": false
}
```

### 3. Get Questions with Pagination
```bash
GET /api/admin/questions?page=0&size=20&sortBy=createdAt&sortDir=desc
Authorization: Bearer {jwt_token}
```

## Error Handling

### Bulk Upload Response Format
```json
{
  "success": true,
  "message": "Partial success: 8 uploaded, 2 failed",
  "uploadDetails": {
    "totalQuestions": 10,
    "successfulUploads": 8,
    "failedUploads": 2,
    "errors": [
      {
        "questionIndex": 3,
        "questionText": "Invalid question text",
        "errorMessage": "Question text cannot be empty",
        "fieldName": "questionText"
      }
    ],
    "uploadTimestamp": "2025-09-01T09:30:00",
    "uploadedBy": "admin"
  }
}
```

## Configuration

### Application Properties
```properties
# External Services Configuration
questions.service.url=http://localhost:8086
```

### Default Admin Permissions
The DataInitializer automatically assigns all question management permissions to SUPER_ADMIN users.

## Testing

### Prerequisites
1. SystemAdminServices running on port 8083
2. questions-service running on port 8086
3. Valid admin JWT token

### Test Sequence
1. Login as admin to get JWT token
2. Test single question creation
3. Test question retrieval and pagination
4. Test question updates
5. Test bulk upload with mixed valid/invalid data
6. Test statistics endpoint
7. Test categories and levels endpoints

## Future Enhancements

### Planned Features
1. **Question Approval Workflow** - Questions need admin approval before going live
2. **Question Import from Files** - CSV/Excel file upload support
3. **Advanced Analytics** - Usage statistics, difficulty analysis
4. **Question Templates** - Predefined question formats
5. **Version Control** - Track question changes and history
6. **Question Pool Management** - Organize questions into pools for different tests

### Possible Improvements
1. **Caching** - Redis cache for frequently accessed questions
2. **Async Processing** - Queue-based bulk uploads for large datasets
3. **Validation Rules** - Configurable validation rules for questions
4. **Audit Logging** - Detailed logs of all question operations
5. **Search and Filtering** - Advanced search capabilities

## Troubleshooting

### Common Issues
1. **401 Unauthorized** - Check JWT token and permissions
2. **404 Not Found** - Verify questions-service is running
3. **Validation Errors** - Check question format and required fields
4. **Bulk Upload Failures** - Review error details in response

### Logs
- SystemAdminServices logs: `logging.level.com.endesha360.SystemAdminServices=DEBUG`
- Check question management service logs for detailed error information

## Support
For issues or questions about the question management feature, check:
1. Application logs for detailed error messages
2. questions-service health endpoint: `http://localhost:8086/actuator/health`
3. SystemAdminServices health endpoint: `http://localhost:8083/actuator/health`
