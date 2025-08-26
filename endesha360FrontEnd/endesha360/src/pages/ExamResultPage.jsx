import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ExamResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    // If no result data, redirect to home or exam page
    navigate("/exam", { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[var(--primary-dark)] mb-4">Exam Result</h1>
        <div className="text-lg mb-2">
          <span className="font-semibold">Score:</span> {result.score} / {result.totalQuestions}
        </div>
        <div className="text-lg mb-2">
          <span className="font-semibold">Percentage:</span> {result.percentage.toFixed(1)}%
        </div>
        <div className="text-lg mb-2">
          <span className="font-semibold">Status:</span> {result.status}
        </div>
        <button
          className="mt-6 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
