#!/bin/bash

echo "🧪 Testing Endesha360 APIs"
echo "=========================="

# Test 1: Health Check
echo "1. Testing health endpoint..."
curl -s http://localhost:8081/actuator/health | jq .

echo -e "\n2. Testing school owner registration..."
# Test 2: School Owner Registration
REGISTRATION_RESPONSE=$(curl -s -X POST http://localhost:8081/api/school-owners/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testowner",
    "email": "test.owner@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "Owner",
    "phoneNumber": "+254712345678"
  }')

echo $REGISTRATION_RESPONSE | jq .

echo -e "\n3. Testing login..."
# Test 3: Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "test.owner@example.com",
    "password": "TestPassword123",
    "tenantCode": "PLATFORM"
  }')

echo $LOGIN_RESPONSE | jq .

# Extract token for further testing
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo -e "\n4. Testing token validation..."
  # Test 4: Token Validation
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8081/api/auth/validate
  
  echo -e "\n5. Testing current user info..."
  # Test 5: Get Current User
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8081/api/auth/me | jq .
else
  echo "Login failed - no token received"
fi
