// src/api/levels.js
export async function fetchQuestionLevels() {
  const response = await fetch('/questions-service/api/question-levels');
  if (!response.ok) throw new Error('Failed to fetch levels');
  return response.json();
}
