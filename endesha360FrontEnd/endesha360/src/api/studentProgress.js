// src/api/studentProgress.js
export async function fetchStudentProgress(studentId, token) {
  const response = await fetch(`/student-management-service/api/student-progress/student/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch student progress');
  return response.json();
}

export async function fetchComprehensiveProgress(studentId, token) {
  const response = await fetch(`/student-management-service/api/student-progress/comprehensive/student/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch comprehensive progress');
  return response.json();
}

export async function fetchTestResults(studentId, token) {
  const response = await fetch(`/api/exams/results/student/${studentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch test results');
  return response.json();
}
