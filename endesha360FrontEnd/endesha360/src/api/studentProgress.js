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
