
import React, { useEffect, useMemo, useState } from "react";
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

  // Start exam once student clicks "Start"
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
    const res = await fetch("/api/exams/start", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ studentId: user.id, count: 5, durationSeconds: 60, categoryId: Number(selectedCategory) })
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
      <div className="p-6 bg-[var(--background)] min-h-screen">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-[var(--primary-dark)] mb-4">Mock Exam</h1>
          <p className="text-gray-700 mb-6">
            40 MCQs • 40 minutes • Exam mode (no feedback) • Randomized questions & options.
          </p>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90">
            Start Exam
          </button>
        </div>
        <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
          <div className="text-center p-2 min-w-[320px]">
            <h2 className="text-2xl font-bold text-[#00712D] mb-2">Select Exam Category</h2>
            <p className="text-base text-gray-700 mb-5">Choose a category to start your exam.</p>
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
                  onClick={() => setSelectedCategory(String(cat.id))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <button
              onClick={startExam}
              className="w-full px-4 py-2 rounded-lg bg-[#00712D] text-white font-bold text-base mt-2 shadow-md hover:bg-[#005a24] disabled:opacity-60 transition-colors"
              disabled={!selectedCategory}
            >
              Start Exam
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 bg-[var(--background)] min-h-screen">
      {/* Main sheet */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--primary-dark)]">Time Left: {mmss}</h2>
          <button onClick={submitExam}
            className="px-4 py-2 rounded-lg bg-[var(--primary-dark)] text-white hover:bg-green-800">
            Submit
          </button>
        </div>

        {attempt.questions.map((q) => (
          <div key={q.questionId} className="border-b border-[var(--primary-light)] py-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => {
                  const next = new Set(flags);
                  next.has(q.questionId) ? next.delete(q.questionId) : next.add(q.questionId);
                  setFlags(next);
                }}
                className={`px-2 py-1 rounded text-xs font-semibold 
                  ${flags.has(q.questionId) ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-800'}`}>
                {flags.has(q.questionId) ? 'Flagged' : 'Flag for review'}
              </button>
              <p className="text-gray-800">{q.index + 1}. {q.questionText}</p>
            </div>

            <div className="mt-3 grid gap-2">
              {q.options.map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${q.questionId}`}
                    checked={answers[q.questionId] === opt}
                    onChange={() => setAnswers(a => ({ ...a, [q.questionId]: opt }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Palette & meta */}
      <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-6">
        <h3 className="text-lg font-semibold text-[var(--primary-dark)] mb-3">Question Palette</h3>
        <div className="grid grid-cols-6 gap-2">
          {attempt.questions.map((q, i) => {
            const answered = !!answers[q.questionId];
            const flagged = flags.has(q.questionId);
            return (
              <div key={q.questionId}
                className={`w-10 h-10 rounded grid place-items-center text-sm font-semibold
                  ${flagged ? 'bg-yellow-300' :
                    answered ? 'bg-[var(--primary-light)] text-[var(--primary-dark)]' :
                    'bg-gray-200 text-gray-700'}`}>
                {i+1}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>Answered: {Object.keys(answers).length} / {attempt.questions.length}</p>
          <p>Flagged: {flags.size}</p>
        </div>
      </div>
    </div>
  );
}
