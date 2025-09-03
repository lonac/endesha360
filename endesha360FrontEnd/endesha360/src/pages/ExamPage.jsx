
import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchQuestionLevels } from '../api/levels';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import CategorySelect from './CategorySelect';


export default function ExamPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempt, setAttempt] = useState(null); // {attemptId, endsAt, questions[]}
  const [answers, setAnswers] = useState({});   // {questionId: selectedOption}
  const [flags, setFlags] = useState(new Set());
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Level selection modal state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const questionRefs = useRef([]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (!isCategoryModalOpen) return;
    const token = localStorage.getItem('token');
    console.log('[ExamPage] token for categories:', token);
    fetch("/questions-service/api/categories", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        console.log('[ExamPage] categories fetch status:', res.status);
        if (!res.ok) throw new Error('Failed to fetch categories: ' + res.status);
        return res.json();
      })
      .then(data => {
        console.log('[ExamPage] categories fetch data:', data);
        Array.isArray(data) ? setCategories(data) : setCategories([]);
      })
      .catch(err => {
        console.error('[ExamPage] categories fetch error:', err);
        setCategories([]);
      });
  }, [isCategoryModalOpen]);

  // Start exam after both category and level are selected
  const startExam = async () => {
    const token = localStorage.getItem('token');
    if (!user || !user.id) {
      alert('User not found. Please log in again.');
      return;
    }
    if (!token) {
      alert('Authentication token missing. Please log in again.');
      return;
    }
    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }
    if (!selectedLevel) {
      alert('Please select a level.');
      return;
    }
    const res = await fetch("/api/exams/start", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ studentId: user.id, count: 5, durationSeconds: 60, categoryId: Number(selectedCategory), levelId: Number(selectedLevel) })
    });
    if (!res.ok) {
      throw new Error(`Failed to start exam: ${res.status}`);
    }
    const data = await res.json();
    setAttempt(data);
    const end = dayjs(data.endsAt);
    setSecondsLeft(end.diff(dayjs(), "second"));
    requestFullscreen();
    setIsCategoryModalOpen(false);
    setIsLevelModalOpen(false);
  };

  // Timer + auto-submit
  useEffect(() => {
    if (!attempt) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [attempt]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (!attempt) return;
    if (secondsLeft === 0) {
      submitExam();
    }
  }, [secondsLeft, attempt]);

  const submitExam = async () => {
    if (!attempt) return;
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: Number(questionId),
        selectedOption
      })),
      flaggedQuestionIds: Array.from(flags)
    };
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/exams/${attempt.attemptId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      alert(`Failed to submit exam: ${res.status}`);
      return;
    }
  const data = await res.json();
  document.exitFullscreen?.();
  navigate("/exam-result", { state: data });
  };

  // Proctoring events
  useEffect(() => {
    const onBlur = () => {
      if (attempt && attempt.attemptId) {
        navigator.sendBeacon(`/api/exams/${attempt.attemptId}/event/FOCUS_LOSS`);
      }
    };
    const onVisibility = () => {
      if (document.hidden && attempt && attempt.attemptId) {
        navigator.sendBeacon(`/api/exams/${attempt.attemptId}/event/TAB_SWITCH`);
      }
    };
    const onFullscreen = () => {
      if (!document.fullscreenElement && attempt && attempt.attemptId) {
        navigator.sendBeacon(`/api/exams/${attempt.attemptId}/event/FULLSCREEN_EXIT`);
      }
    };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [attempt]);

  const requestFullscreen = () => {
    const el = document.documentElement;
    el.requestFullscreen?.();
  };

  // helper
  const mmss = useMemo(() => {
    const m = Math.floor(secondsLeft/60).toString().padStart(2,'0');
    const s = (secondsLeft%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  // Disable copy/paste/context menu (light deterrents)
  useEffect(() => {
    const prevent = e => e.preventDefault();
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("contextmenu", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("contextmenu", prevent);
    };
  }, []);

  if (!attempt) {
    return (
      <div className="bg-[var(--background)] min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow p-10 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold text-[#00712D] mb-4">Ready for Your Test?</h1>
          <p className="text-gray-700 mb-8 text-lg">
            Challenge yourself with a real test experience! Answer randomized questions in limited time, test your knowledge, and see how you rank. No feedback until the end. Good luck!
          </p>
          <button
            onClick={async () => {
              setIsCategoryModalOpen(true);
              setSelectedCategory("");
              setSelectedLevel("");
            }}
            className="px-8 py-3 rounded-xl bg-[#FF9100] text-white font-bold text-lg shadow-md hover:bg-[#e6820e] transition-colors mb-2">
            Start Test
          </button>
        </div>
        {/* Category Modal */}
        <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
          <div className="text-center p-2 min-w-[320px]">
            <h2 className="text-2xl font-bold text-[#00712D] mb-2">Select Test Category</h2>
            <p className="text-base text-gray-700 mb-5">Choose a category to start your test.</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {categories.length === 0 && (
                <div className="col-span-2 text-gray-500">No categories available.</div>
              )}
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`flex items-center justify-center px-2 py-2 rounded-lg text-sm font-semibold border-2 transition-colors duration-150
                    ${selectedCategory === String(cat.id)
                      ? 'bg-[#FF9100] border-[#FF9100] text-white shadow'
                      : 'bg-white border-[#D5ED9F] text-[#00712D] hover:bg-[#FF9100]/90 hover:text-white'}
                  `}
                  style={{ boxShadow: selectedCategory === String(cat.id) ? '0 2px 8px 0 #FF910055' : undefined }}
                  onClick={async () => {
                    setSelectedCategory(String(cat.id));
                    // Fetch levels when category is selected
                    try {
                      const data = await fetchQuestionLevels();
                      setLevels(data);
                      setIsLevelModalOpen(true);
                    } catch (err) {
                      setLevels([]);
                      setIsLevelModalOpen(true);
                    }
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </Modal>
        {/* Level Modal */}
        <Modal isOpen={isLevelModalOpen} onClose={() => setIsLevelModalOpen(false)}>
          <div className="text-center p-2 min-w-[320px]">
            <h2 className="text-2xl font-bold text-[#00712D] mb-2">Select Test Level</h2>
            <p className="text-base text-gray-700 mb-5">Choose a level for your test.</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {levels.length === 0 && (
                <div className="col-span-2 text-gray-500">No levels available.</div>
              )}
              {levels.map(level => (
                <button
                  key={level.id}
                  className={`flex items-center justify-center px-2 py-2 rounded-lg text-sm font-semibold border-2 transition-colors duration-150
                    ${selectedLevel === String(level.id)
                      ? 'bg-[#FF9100] border-[#FF9100] text-white shadow'
                      : 'bg-white border-[#D5ED9F] text-[#00712D] hover:bg-[#FF9100]/90 hover:text-white'}
                  `}
                  style={{ boxShadow: selectedLevel === String(level.id) ? '0 2px 8px 0 #FF910055' : undefined }}
                  onClick={() => setSelectedLevel(String(level.id))}
                >
                  {level.name}
                </button>
              ))}
            </div>
            <button
              onClick={startExam}
              className="w-full px-4 py-2 rounded-lg bg-[#00712D] text-white font-bold text-base mt-2 shadow-md hover:bg-[#005a24] disabled:opacity-60 transition-colors"
              disabled={!selectedLevel}
            >
              Start Test
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="relative bg-[var(--background)] min-h-screen pt-20 pb-24">
      {/* Top Progress Indicator */}
      <div className="fixed top-16 left-0 right-0 z-30">
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-gradient-to-r from-[#00712D] to-[#D5ED9F] h-1 transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / (attempt?.questions.length || 1)) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Main content - now full width */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col" style={{minHeight: '70vh'}}>
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#00712D] mb-1">
                {attempt.categoryName ? `${attempt.categoryName} Exam` : 'Mock Exam'}
              </h1>
              <p className="text-gray-600 text-sm">
                {attempt.questions.length} questions • {Math.floor(secondsLeft/60)} minutes remaining
              </p>
            </div>
            <div className="mt-3 lg:mt-0 flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#00712D] to-[#005a24] text-white px-4 py-2 rounded-lg shadow">
                <div className="text-center">
                  <div className="text-xl font-mono font-bold">{mmss}</div>
                  <div className="text-xs text-[#D5ED9F]">Time Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 space-y-6">
          {attempt.questions.map((q, idx) => (
            <div
              key={q.questionId}
              ref={el => questionRefs.current[idx] = el}
              className={`bg-white border-2 rounded-xl p-6 transition-all duration-200 ${
                currentQuestion === idx 
                  ? 'border-[#FF9100] bg-[#FFFBE6]/30 shadow-lg' 
                  : 'border-[#D5ED9F] hover:border-[#00712D] hover:shadow-md'
              }`}
              id={`question-${idx}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-[#00712D] text-white text-sm font-bold px-3 py-1 rounded-full">
                      Question {idx + 1}
                    </span>
                    {answers[q.questionId] && (
                      <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                        ✓ Answered
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg lg:text-xl font-medium text-gray-800 leading-relaxed">
                    {q.questionText}
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {q.options.map((opt, optIdx) => (
                  <label 
                    key={opt} 
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                      answers[q.questionId] === opt
                        ? 'border-[#00712D] bg-[#D5ED9F]/20 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.questionId}`}
                      checked={answers[q.questionId] === opt}
                      onChange={() => setAnswers(a => ({ ...a, [q.questionId]: opt }))}
                      onFocus={() => setCurrentQuestion(idx)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                      answers[q.questionId] === opt
                        ? 'border-[#00712D] bg-[#00712D]'
                        : 'border-gray-300'
                    }`}>
                      {answers[q.questionId] === opt && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-base lg:text-lg font-medium">
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button at Bottom */}
        <div className="mt-8 flex justify-center">
          <button onClick={submitExam}
            className="px-8 py-3 rounded-xl bg-[#00712D] text-white font-bold text-lg shadow-md hover:bg-green-800 transition-colors">
            Submit Test
          </button>
        </div>
        </div>
      </div>

      {/* Bottom Floating Question Palette */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#D5ED9F] shadow-lg z-40">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
          {/* Mobile: Compact progress */}
          <div className="lg:hidden mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-[#00712D]">
                {Object.keys(answers).length}/{attempt.questions.length}
              </span>
              <span className="text-xs text-gray-600 font-mono">{mmss}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-[#00712D] to-[#D5ED9F] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(answers).length / attempt.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop: Full progress */}
          <div className="hidden lg:block mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-[#00712D]">Progress</span>
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length} / {attempt.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#00712D] to-[#D5ED9F] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(answers).length / attempt.questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Question palette - horizontal scrollable */}
          <div className="flex gap-1.5 lg:gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#D5ED9F]">
            {attempt.questions.map((q, i) => {
              const answered = !!answers[q.questionId];
              const flagged = flags.has(q.questionId);
              return (
                <button
                  key={q.questionId}
                  className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-lg text-xs lg:text-sm font-semibold border-2 transition-all duration-200 ${
                    currentQuestion === i 
                      ? 'border-[#FF9100] bg-[#FF9100] text-white shadow-lg scale-105' 
                      : flagged 
                      ? 'border-yellow-400 bg-yellow-300 text-yellow-900 hover:bg-yellow-400' 
                      : answered 
                      ? 'border-[#D5ED9F] bg-[#D5ED9F] text-[#00712D] hover:bg-green-300' 
                      : 'border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    setCurrentQuestion(i);
                    questionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  aria-label={`Go to question ${i+1}`}
                >
                  {answered ? '✓' : i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
