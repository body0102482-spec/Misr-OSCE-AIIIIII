import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Clock,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  BookMarked,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Heart,
  Filter,
  LineChart,
  RotateCcw,
  FileText,
  Info,
  User,
  Check,
  Bookmark,
  Activity,
  Shuffle,
  ThumbsUp,
  ThumbsDown,
  HelpCircle
} from "lucide-react";
import { qbankQuestions, QBankQuestion, QBankSession } from "../data/qbank";

interface QBankDashboardProps {
  currentUser: any;
}

export const QBankDashboard: React.FC<QBankDashboardProps> = ({ currentUser }) => {
  // --- Persistent statistics in LocalStorage ---
  const [persistentAnswers, setPersistentAnswers] = useState<Record<string, { choice: string; isCorrect: boolean }>>(() => {
    const cached = localStorage.getItem(`osce-qbank-answers-${currentUser.studentId}`);
    return cached ? JSON.parse(cached) : {};
  });

  const [flaggedIds, setFlaggedIds] = useState<string[]>(() => {
    const cached = localStorage.getItem(`osce-qbank-flagged-${currentUser.studentId}`);
    return cached ? JSON.parse(cached) : [];
  });

  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(() => {
    const cached = localStorage.getItem(`osce-qbank-sessions-count-${currentUser.studentId}`);
    return cached ? Number(cached) : 0;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`osce-qbank-answers-${currentUser.studentId}`, JSON.stringify(persistentAnswers));
  }, [persistentAnswers, currentUser.studentId]);

  useEffect(() => {
    localStorage.setItem(`osce-qbank-flagged-${currentUser.studentId}`, JSON.stringify(flaggedIds));
  }, [flaggedIds, currentUser.studentId]);

  // --- Configuration Wizard State ---
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [selectedMode, setSelectedMode] = useState<"study" | "exam">("study");
  const [selectedNumQuestions, setSelectedNumQuestions] = useState<number>(5);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedSources, setSelectedSources] = useState<string[]>(["lange", "bailey", "zatona", "ain_shams", "kasr_el_ainy"]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);

  // --- Active Session & Evaluation state ---
  const [activeSession, setActiveSession] = useState<QBankSession | null>(null);
  const [timerIntervalId, setTimerIntervalId] = useState<any | null>(null);
  const [activeTabReview, setActiveTabReview] = useState<"all" | "correct" | "incorrect" | "flagged">("all");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // --- Single Question interactive states (for study mode) ---
  const [selectedChoiceForCurrent, setSelectedChoiceForCurrent] = useState<string | null>(null);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [studentNoteText, setStudentNoteText] = useState("");

  // Subspecialties available mapping
  const systemLabels: Record<string, { name: string; arabic: string; discipline: string }> = {
    cardiology: { name: "Cardiology CVS", arabic: "أمراض القلب والأوعية الدموية", discipline: "internal_medicine" },
    gastroenterology: { name: "Gastroenterology GIT", arabic: "أمراض الباطنة والجهاز الهضمي", discipline: "internal_medicine" },
    chest: { name: "Pulmonary & Chest", arabic: "أمراض الجهاز التنفسي والصدرية", discipline: "internal_medicine" },
    general_surgery: { name: "General Surgery", arabic: "الجراحة العامة والعمليات الإكلينيكية", discipline: "surgery" },
    neonatology: { name: "Neonatology & Pediatrics", arabic: "طب الأطفال وحديثي الولادة", discipline: "pediatrics" },
    obstetrics: { name: "Obstetrics (Pregnancy/Labor)", arabic: "التوليد وطب الجنين", discipline: "ob_gyn" },
    gynecology: { name: "Gynecology (Infertility/Tumors)", arabic: "أمراض النساء وعنق الرحم", discipline: "ob_gyn" }
  };

  // Filter systems based on selected discipline
  const availableSystems = useMemo(() => {
    return Object.entries(systemLabels).filter(([_, label]) => {
      if (selectedDiscipline === "all") return true;
      return label.discipline === selectedDiscipline;
    });
  }, [selectedDiscipline]);

  // Auto select all systems on discipline change to prevent empty states
  useEffect(() => {
    const sysKeys = availableSystems.map(([k]) => k);
    setSelectedSystems(sysKeys);
  }, [selectedDiscipline]);

  // Overall Stats Calculator
  const overallStats = useMemo(() => {
    const solved = Object.keys(persistentAnswers).length;
    const correct = Object.values(persistentAnswers).filter(a => a.isCorrect).length;
    const rate = solved > 0 ? Math.round((correct / solved) * 100) : 0;
    
    // Calculate system accuracy
    const systemDistribution: Record<string, { total: number; correct: number }> = {};
    Object.entries(persistentAnswers).forEach(([qId, data]) => {
      const originalQ = qbankQuestions.find(q => q.id === qId);
      if (originalQ) {
        if (!systemDistribution[originalQ.system]) {
          systemDistribution[originalQ.system] = { total: 0, correct: 0 };
        }
        systemDistribution[originalQ.system].total += 1;
        if (data.isCorrect) {
          systemDistribution[originalQ.system].correct += 1;
        }
      }
    });

    return {
      solved,
      correct,
      rate,
      systemDistribution
    };
  }, [persistentAnswers]);

  // --- Start customized MCQ session ---
  const handleStartSession = () => {
    let pool = qbankQuestions;

    // 1. Filter by Discipline
    if (selectedDiscipline !== "all") {
      pool = pool.filter(q => q.discipline === selectedDiscipline);
    }

    // 2. Filter by Systems
    if (selectedSystems.length > 0) {
      pool = pool.filter(q => selectedSystems.includes(q.system));
    }

    // 3. Filter by Difficulty
    if (selectedDifficulty !== "all") {
      pool = pool.filter(q => q.difficulty === selectedDifficulty);
    }

    // 4. Filter by Source
    if (selectedSources.length > 0) {
      pool = pool.filter(q => selectedSources.includes(q.source));
    } else {
      alert("⚠️ يرجى اختيار مصدر واحد على الأقل للأسئلة لبدء التقييم! (Lange, Bailey, etc.)");
      return;
    }

    if (pool.length === 0) {
      alert("⚠️ لا توجد أسئلة تطابق الفلاتر المحددة حالياً. برجاء تفعيل المزيد من التخصصات أو المصادر لبدء الكويز!");
      return;
    }

    // Shuffle pool to create randomized feel
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const finalQuestions = shuffled.slice(0, Math.min(selectedNumQuestions, shuffled.length));

    // Construct session
    const newSession: QBankSession = {
      id: `session-${Date.now()}`,
      discipline: selectedDiscipline,
      systems: selectedSystems,
      totalQuestions: finalQuestions.length,
      mode: selectedMode,
      questions: finalQuestions,
      currentIndex: 0,
      userAnswers: {},
      isCompleted: false,
      score: 0,
      flaggedQuestions: [],
      startTime: Date.now(),
      elapsedTime: 0,
      notes: {},
      timeLimitMinutes: timeLimitMinutes
    };

    setActiveSession(newSession);
    setSelectedChoiceForCurrent(null);
    setHasSubmittedCurrent(false);
    setStudentNoteText("");
  };

  // --- Active Timer ticking for exam mode with countdown check ---
  useEffect(() => {
    if (activeSession && !activeSession.isCompleted) {
      const interval = setInterval(() => {
        setActiveSession(prev => {
          if (!prev) return null;
          const calculatedElapsed = Math.round((Date.now() - prev.startTime) / 1000);
          
          // If time limit reached
          if (prev.timeLimitMinutes > 0 && calculatedElapsed >= prev.timeLimitMinutes * 60) {
            clearInterval(interval);
            setTimeout(() => {
              alert("🚨 انتهى الوقت المحدّد لهذا النموذج! تم تسجيل إجابات الكويز آلياً بنجاح.");
              handleCompleteSession();
            }, 100);
            return {
              ...prev,
              elapsedTime: prev.timeLimitMinutes * 60
            };
          }
          
          return {
            ...prev,
            elapsedTime: calculatedElapsed
          };
        });
      }, 1000);
      setTimerIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [activeSession?.id, activeSession?.isCompleted]);

  // --- Helper to move questions ---
  const handleNavigateQuestion = (index: number) => {
    if (!activeSession) return;
    
    // Save current student note text if any
    const updatedNotes = { ...activeSession.notes };
    if (studentNoteText.trim()) {
      updatedNotes[activeSession.questions[activeSession.currentIndex].id] = studentNoteText;
    }

    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentIndex: index,
        notes: updatedNotes
      };
    });

    const targetQuestionId = activeSession.questions[index].id;
    // Load previously selected choice or note
    const previousChoice = activeSession.userAnswers[targetQuestionId] || null;
    setSelectedChoiceForCurrent(previousChoice);
    setStudentNoteText(updatedNotes[targetQuestionId] || "");
    
    // In study mode, locked if already answered
    if (activeSession.mode === "study") {
      setHasSubmittedCurrent(!!previousChoice);
    } else {
      setHasSubmittedCurrent(false);
    }
  };

  // --- Submitting choice for current question ---
  const handleSelectChoice = (key: string) => {
    if (!activeSession || hasSubmittedCurrent) return;
    setSelectedChoiceForCurrent(key);
  };

  const handleSubmitCurrentAnswer = () => {
    if (!activeSession || !selectedChoiceForCurrent || hasSubmittedCurrent) return;

    const currentQ = activeSession.questions[activeSession.currentIndex];
    const isCorrect = selectedChoiceForCurrent === currentQ.correctOption;

    // Update Session Answers
    const updatedAnswers = { ...activeSession.userAnswers };
    updatedAnswers[currentQ.id] = selectedChoiceForCurrent;

    // In Study Mode, instantly lock and update master database
    if (activeSession.mode === "study") {
      setHasSubmittedCurrent(true);
      setPersistentAnswers(prev => ({
        ...prev,
        [currentQ.id]: { choice: selectedChoiceForCurrent, isCorrect }
      }));
    }

    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        userAnswers: updatedAnswers
      };
    });
  };

  // --- Toggle flagging question ---
  const toggleFlagQuestion = (qId: string) => {
    setFlaggedIds(prev => {
      if (prev.includes(qId)) {
        return prev.filter(id => id !== qId);
      } else {
        return [...prev, qId];
      }
    });

    if (activeSession) {
      setActiveSession(prev => {
        if (!prev) return null;
        const exists = prev.flaggedQuestions.includes(qId);
        return {
          ...prev,
          flaggedQuestions: exists 
            ? prev.flaggedQuestions.filter(id => id !== qId)
            : [...prev.flaggedQuestions, qId]
        };
      });
    }
  };

  // --- Complete entire Test / Session ---
  const handleCompleteSession = () => {
    if (!activeSession) return;
    clearInterval(timerIntervalId);

    // Save final note
    const updatedNotes = { ...activeSession.notes };
    if (studentNoteText.trim()) {
      updatedNotes[activeSession.questions[activeSession.currentIndex].id] = studentNoteText;
    }

    // Evaluate scores
    let correctCount = 0;
    const finalPersistentUpdates = { ...persistentAnswers };

    activeSession.questions.forEach(q => {
      const choice = activeSession.userAnswers[q.id];
      if (choice) {
        const isCorrect = choice === q.correctOption;
        if (isCorrect) correctCount++;
        
        // Save to persistent database
        finalPersistentUpdates[q.id] = { choice, isCorrect };
      }
    });

    const finalScorePercent = activeSession.totalQuestions > 0 
      ? Math.round((correctCount / activeSession.totalQuestions) * 100) 
      : 0;

    setPersistentAnswers(finalPersistentUpdates);
    
    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isCompleted: true,
        score: finalScorePercent,
        notes: updatedNotes
      };
    });

    // Increment completed sessions
    const nextSessionsCount = completedSessionsCount + 1;
    setCompletedSessionsCount(nextSessionsCount);
    localStorage.setItem(`osce-qbank-sessions-count-${currentUser.studentId}`, String(nextSessionsCount));

    // Clear active status
    setHasSubmittedCurrent(true);
  };

  // Formatter for timer minutes:seconds
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header & Dynamic Progress Banner */}
      {!activeSession && (
        <>
          {/* Welcome Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-450/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 font-mono">
                <Sparkles size={12} className="text-indigo-500 animate-pulse" />
                Egyptian Universities Unified syllabus
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                بورد الأسئلة الشامـل (Medical Faculty Q-Bank)
              </h2>
              <p className="text-slate-500 text-xs font-semibold">
                تحضير شامل للامتحانات الدورية والمحاكاة الإكلينيكية لطلاب الكليات الطبية على مستوى الجمهورية (MUST standard).
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl inline-flex items-center gap-1.5 font-mono">
                💡 {qbankQuestions.length} HIGH-YIELD QUESTIONS
              </span>
            </div>
          </div>

          {/* Statistics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Solved Rate • نسبة الإنجاز</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                  <BookOpen size={14} />
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {Math.round((overallStats.solved / qbankQuestions.length) * 100)}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold font-mono">
                    ({overallStats.solved}/{qbankQuestions.length})
                  </span>
                </div>
                <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(overallStats.solved / qbankQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-250 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Average Accuracy • دقة الإجابات</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                  <LineChart size={14} />
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {overallStats.rate}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold font-mono">
                    ({overallStats.correct} correct)
                  </span>
                </div>
                <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${overallStats.rate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Bookmarked • أسئلة محفوظة</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
                  <Bookmark size={14} />
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {flaggedIds.length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block">Questions flagged</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Saved for quick clinical review</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Generated Blocks • الامتحانات</span>
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">
                  <Activity size={14} />
                </span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {completedSessionsCount}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block">Sessions finished</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Full custom sets evaluated</p>
              </div>
            </div>

          </div>

          {/* 2. Custom Test Blueprint Wizard */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 pointer-events-none rounded-full filter blur-3xl"></div>
            
            <div className="pb-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Filter size={18} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">إنشاء كويز مخصص • Practice Exam Builder</h3>
                <p className="text-slate-400 text-xs font-semibold leading-none">Select options below to compile high-yield medical school questions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left configurations column */}
              <div className="space-y-6">
                
                {/* Discipline selection button row */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Clinical Domain • القسم الطبي</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", label: "All Subjects", icon: "📚" },
                      { id: "internal_medicine", label: "Internal Medicine (باطنة)", icon: "🩺" },
                      { id: "surgery", label: "General Surgery (جراحة)", icon: "✂️" },
                      { id: "pediatrics", label: "Pediatrics (أطفال)", icon: "👶" },
                      { id: "ob_gyn", label: "OB/GYN (نساء وتوليد)", icon: "🤰" }
                    ].map((disc) => (
                      <button
                        key={disc.id}
                        onClick={() => setSelectedDiscipline(disc.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedDiscipline === disc.id
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                            : "bg-slate-50 text-slate-650 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>{disc.icon}</span>
                        <span>{disc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question mode toggle */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Exam Engine mode • وضع التدريب</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedMode("study")}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        selectedMode === "study"
                          ? "border-indigo-600 bg-white"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className={selectedMode === "study" ? "text-indigo-600" : "text-slate-400"} />
                        <span className="font-black text-xs text-slate-800 block">Study Mode • تدريب فوري</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        إظهار الإجابة الصحيحة والتعليق والشرح التفصيلي فور الإجابة على كل سؤال.
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedMode("exam")}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        selectedMode === "exam"
                          ? "border-amber-600 bg-white"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={16} className={selectedMode === "exam" ? "text-amber-600" : "text-slate-400"} />
                        <span className="font-black text-xs text-slate-800 block">Exam / Timer Mode • محاكاة الامتحان</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        عداد وقتي نشط، تخزين الإجابات سراً، وعرض النتيجة والتقرير التفصيلي في النهاية.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Size and Difficulty configuration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Question Count • عدد الأسئلة</label>
                    <select
                      value={selectedNumQuestions}
                      onChange={(e) => setSelectedNumQuestions(Number(e.target.value))}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none ring-offset-2 focus:ring-1 focus:ring-indigo-500"
                    >
                      {[3, 5, 10, 15, 20, 25, 30].map(n => (
                        <option key={n} value={n}>{n} Questions / أسئلة</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Difficulty • الصعوبة</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="Easy">Easy (المستوى الأساسي)</option>
                      <option value="Medium">Medium (المستوى المتوسط)</option>
                      <option value="Hard">Hard (مستوى التميز الإكلينيكي)</option>
                    </select>
                  </div>
                </div>

                {/* Custom Time Limit (الوقت المخصص) slider & presets */}
                <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">Exam Timing Limit • وقت الكويز</label>
                    <span className="text-[10px] text-indigo-650 font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full inline-block">
                      {timeLimitMinutes} Minutes / {timeLimitMinutes} دقيقة
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-1">
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                      className="flex-1 accent-indigo-650 bg-slate-200/80 h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest mr-1">Presets:</span>
                    {[3, 5, 10, 15, 20, 30, 45].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTimeLimitMinutes(m)}
                        className={`px-2 py-1 text-[9px] font-black rounded-lg transition-all border cursor-pointer select-none ${
                          timeLimitMinutes === m
                            ? "bg-indigo-600 border-indigo-650 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:bg-slate-50/50"
                        }`}
                      >
                        {m} Min
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold leading-relaxed mt-1">
                    🕒 عند نهاية المؤقت في وضع الكاكاو/الامتحان، سيتم حفظ وعرض نتيجتك فوراً بشكل تلقائي.
                  </p>
                </div>

                {/* Question sources checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Question Sources • مصدر الأسئلة</label>
                    <button 
                      type="button"
                      onClick={() => {
                        const allSources = ["lange", "bailey", "zatona", "ain_shams", "kasr_el_ainy"];
                        setSelectedSources(selectedSources.length === allSources.length ? [] : allSources);
                      }}
                      className="text-[10px] text-indigo-600 font-black uppercase hover:underline cursor-pointer"
                    >
                      Select All / Toggle
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: "lange", name: "Lange Review", arabic: "مرجع لانج المنهجي", bg: "hover:border-sky-300" },
                      { id: "bailey", name: "Bailey & Love", arabic: "مرجع بيلي أند لاف للجراحة", bg: "hover:border-rose-300" },
                      { id: "zatona", name: "El-Zatona Docs", arabic: "ملخصات الزتونة السريعة", bg: "hover:border-emerald-300" },
                      { id: "ain_shams", name: "Ain Shams Univ", arabic: "مستشفيات جامعة عين شمس", bg: "hover:border-amber-300" },
                      { id: "kasr_el_ainy", name: "Kasr El-Ainy", arabic: "طب قصر العيني التعليمي", bg: "hover:border-purple-300" }
                    ].map((src) => {
                      const isSelected = selectedSources.includes(src.id);
                      return (
                        <button
                          key={src.id}
                          type="button"
                          onClick={() => {
                            setSelectedSources(prev => {
                              if (prev.includes(src.id)) {
                                return prev.filter(item => item !== src.id);
                              } else {
                                return [...prev, src.id];
                              }
                            });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all text-xs font-bold flex items-center gap-3 cursor-pointer select-none leading-relaxed ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50/20 text-slate-800"
                              : `border-slate-200 bg-slate-50/40 text-slate-500 ${src.bg}`
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // parent button click handles state
                            className="w-4 h-4 accent-indigo-600 rounded pointer-events-none"
                          />
                          <div className="min-w-0">
                            <span className="block font-sans text-slate-800 leading-tight">{src.name}</span>
                            <span className="block text-[9px] text-slate-450 leading-none font-semibold mt-0.5">{src.arabic}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right organ systems checkboxes column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Organ Systems / Topics • الأنظمة الطبية المشمولة</label>
                  <button 
                    onClick={() => {
                      const sysKeys = availableSystems.map(([k]) => k);
                      setSelectedSystems(selectedSystems.length === sysKeys.length ? [] : sysKeys);
                    }}
                    className="text-[10px] text-indigo-600 font-black uppercase hover:underline"
                  >
                    Select All / Toggle
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {availableSystems.map(([key, label]) => {
                    const isSelected = selectedSystems.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedSystems(prev => {
                            if (prev.includes(key)) {
                              return prev.filter(k => k !== key);
                            } else {
                              return [...prev, key];
                            }
                          });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all text-xs font-bold flex items-center gap-3 cursor-pointer select-none ${
                          isSelected
                            ? "border-indigo-400/80 bg-indigo-50/20 text-slate-900"
                            : "border-slate-200 bg-slate-50/30 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent button click
                          className="w-4 h-4 accent-indigo-600 rounded pointer-events-none"
                        />
                        <div className="min-w-0">
                          <span className="block font-sans text-slate-800 leading-tight truncate">{label.name}</span>
                          <span className="block text-[10px] text-slate-450 leading-none truncate font-medium mt-0.5">{label.arabic}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Launch Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-slate-400 text-[11px] font-semibold flex items-center gap-1.5 leading-tight">
                <Info size={14} className="text-slate-400 shrink-0" />
                <span>
                  نظام التقييم والتعليقات باللغتين العربية والانجليزية لمساعدتك على الحفظ والاحتفاظ بالمعلومة باحترافية.
                </span>
              </div>

              <button
                onClick={handleStartSession}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Shuffle size={16} />
                <span>ابدأ الامتحان المخصص • Launch Workout</span>
              </button>
            </div>

          </div>
        </>
      )}

      {/* 3. Interactive Testing Engine (Active session) */}
      {activeSession && !activeSession.isCompleted && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Question Panel (takes 3 columns on wide screens) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Header / Meta bar of current question */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                  Q{activeSession.currentIndex + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                      {activeSession.questions[activeSession.currentIndex].questionCode}
                    </span>
                    <span className="px-2 py-0.5 border border-slate-150 text-[9px] font-black text-slate-400 uppercase rounded tracking-wider">
                      {activeSession.questions[activeSession.currentIndex].difficulty}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Topic: {activeSession.questions[activeSession.currentIndex].topic}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Timer display */}
                {activeSession.timeLimitMinutes > 0 ? (
                  (() => {
                    const remainingSecs = Math.max(0, (activeSession.timeLimitMinutes * 60) - activeSession.elapsedTime);
                    const isLowTime = remainingSecs < 60;
                    return (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono font-bold rounded-lg leading-none transition-all ${
                        isLowTime 
                          ? "bg-red-50 border-red-200 text-red-600 animate-pulse" 
                          : "bg-amber-50/50 border-amber-200/65 text-amber-700"
                      }`}>
                        <Clock size={14} className={isLowTime ? "text-red-500" : "text-amber-500 animate-pulse"} />
                        <span className="font-bold sm:inline hidden">الوقت المتبقي:</span>
                        <span>{formatTime(remainingSecs)}</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-lg leading-none">
                    <Clock size={14} className={activeSession.mode === "exam" ? "text-amber-500 animate-pulse" : "text-slate-400"} />
                    <span>Time: {formatTime(activeSession.elapsedTime)}</span>
                  </div>
                )}

                {/* Flag/Bookmark button */}
                <button
                  onClick={() => toggleFlagQuestion(activeSession.questions[activeSession.currentIndex].id)}
                  className={`p-2 border rounded-xl cursor-pointer transition-colors ${
                    flaggedIds.includes(activeSession.questions[activeSession.currentIndex].id)
                      ? "border-amber-400 bg-amber-50 text-amber-500"
                      : "border-slate-200 hover:bg-slate-50 text-slate-400"
                  }`}
                >
                  <Bookmark size={16} fill={flaggedIds.includes(activeSession.questions[activeSession.currentIndex].id) ? "currentColor" : "none"} />
                </button>

                {/* Exit button */}
                <button
                  onClick={() => setShowExitConfirm(true)}
                  className="px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg cursor-pointer"
                >
                  إنهاء الامتحان
                </button>
              </div>
            </div>

            {/* Clinical Vignette & Question Display */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Scenario Highlight Box */}
              <div className="bg-slate-50 border-l-4 border-indigo-600 p-5 rounded-2xl relative">
                <span className="absolute top-3 right-3 text-[9px] font-black text-slate-300 uppercase tracking-widest font-mono">Case Description</span>
                <p className="text-slate-800 text-sm sm:text-base font-bold leading-relaxed pr-6 select-text text-justify">
                  {activeSession.questions[activeSession.currentIndex].vignette}
                </p>
              </div>

              {/* The core clinical question */}
              <div className="space-y-2">
                <span className="text-[10px] text-indigo-500 uppercase font-black tracking-wider block font-mono">The Question • السؤال</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {activeSession.questions[activeSession.currentIndex].questionText}
                </h3>
              </div>

              {/* Multiple Choice Options (A to E) */}
              <div className="space-y-3 pt-2">
                {activeSession.questions[activeSession.currentIndex].options.map((opt) => {
                  const currentQ = activeSession.questions[activeSession.currentIndex];
                  const isSelected = selectedChoiceForCurrent === opt.key;
                  const isCorrectAnswer = opt.key === currentQ.correctOption;

                  let optionStyle = "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";
                  
                  if (activeSession.mode === "study" && hasSubmittedCurrent) {
                    // Show correct / incorrect highlights instantly
                    if (isCorrectAnswer) {
                      optionStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-950";
                    } else if (isSelected) {
                      optionStyle = "border-red-500 bg-red-50/50 text-red-950";
                    } else {
                      optionStyle = "border-slate-150 bg-slate-50/20 text-slate-400";
                    }
                  } else {
                    // Normal state before submitting
                    if (isSelected) {
                      optionStyle = "border-indigo-600 bg-indigo-50/10 text-indigo-900 shadow-sm";
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectChoice(opt.key)}
                      disabled={hasSubmittedCurrent}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer text-xs sm:text-sm font-semibold select-none leading-relaxed ${optionStyle}`}
                    >
                      {/* Bubble key label */}
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? (hasSubmittedCurrent ? (isCorrectAnswer ? "bg-emerald-500 border-emerald-500 text-white" : "bg-red-500 border-red-500 text-white") : "bg-indigo-600 border-indigo-600 text-white")
                          : (hasSubmittedCurrent && isCorrectAnswer ? "bg-emerald-500 border-emerald-500 text-white" : "bg-slate-100 border-slate-200 text-slate-550")
                      }`}>
                        {opt.key}
                      </span>

                      <span className="flex-1 text-left pt-0.5">{opt.text}</span>

                      {/* Diagnostic icon overlays in study mode */}
                      {activeSession.mode === "study" && hasSubmittedCurrent && (
                        <div className="shrink-0 pt-0.5">
                          {isCorrectAnswer && <CheckCircle2 size={16} className="text-emerald-500" />}
                          {!isCorrectAnswer && isSelected && <XCircle size={16} className="text-red-500" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Actions row: Submit / Next Question */}
              <div className="pt-4 border-t border-slate-100 flex sm:items-center justify-between flex-row gap-4">
                
                {/* Submit / Confirm button */}
                <div>
                  {!hasSubmittedCurrent && selectedChoiceForCurrent && (
                    <button
                      onClick={handleSubmitCurrentAnswer}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      {activeSession.mode === "study" ? "تأكيد الإجابة والتحقق" : "تخزين الإجابة سراً"}
                    </button>
                  )}

                  {activeSession.mode === "exam" && !selectedChoiceForCurrent && (
                    <span className="text-[11px] text-slate-400 font-bold block pt-2 uppercase">Please select an option to lock</span>
                  )}
                </div>

                {/* Next / Previous horizontal controls */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleNavigateQuestion(activeSession.currentIndex - 1)}
                    disabled={activeSession.currentIndex === 0}
                    className="p-3 border border-slate-250 rounded-xl cursor-pointer hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={() => handleNavigateQuestion(activeSession.currentIndex + 1)}
                    disabled={activeSession.currentIndex === activeSession.totalQuestions - 1}
                    className="px-4 py-2 border border-slate-250 rounded-xl cursor-pointer hover:bg-slate-50 font-bold text-xs flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span>التالي</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>

            </div>

            {/* Rich Study Mode Explanation Box (Only visible if answered in Study mode) */}
            {activeSession.mode === "study" && hasSubmittedCurrent && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-emerald-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6"
              >
                
                {/* Header indicator */}
                <div className="flex items-center gap-3 pb-3 border-b border-emerald-100 text-emerald-800">
                  <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </span>
                  <div>
                    <h3 className="text-base font-black tracking-tight leading-none text-emerald-950">
                      التفسير والشرح الإكلينيكي النموذجي (Case Analysis)
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-black uppercase mt-0.5 tracking-wider">
                      Primary rationale & differential analysis rules
                    </p>
                  </div>
                </div>

                {/* Rationale text wrapper */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase font-black tracking-wider text-slate-400">✔️ Why the correct key is correct:</p>
                    <p className="text-sm text-slate-750 leading-relaxed font-bold">
                      {activeSession.questions[activeSession.currentIndex].explanation.correctMsg}
                    </p>
                  </div>

                  {/* Incorrect details */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] uppercase font-black tracking-wider text-slate-400">❌ why other options were excluded:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(activeSession.questions[activeSession.currentIndex].explanation.incorrectOptions).map(([k, t]) => (
                        <div key={k} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-left leading-relaxed">
                          <span className="font-black text-slate-400 mr-2 uppercase block text-[10px] mb-1">Option {k}:</span>
                          <p className="text-xs text-slate-500 font-semibold">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Yield Arabic Capsule */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl flex items-start gap-3 mt-4">
                    <span className="text-lg shrink-0 pt-0.5">📚</span>
                    <div>
                      <span className="text-amber-850 text-xs font-black uppercase block tracking-wider leading-none">MUST High-Yield Pearl • كبسولة البورد المصري للمعلومات</span>
                      <p className="text-amber-900 text-xs sm:text-sm font-black leading-relaxed mt-1.5 leading-normal text-amber-800">
                        {activeSession.questions[activeSession.currentIndex].explanation.highYieldPearl}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Personal Notes Manager */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Write Personal Study Note • ملاحظتك الطبية الشخصية لهذا السؤال</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="امسك قلمك واكتب هنا مثلاً: ربط جانواي مع مسببات الإندوكارديتيس لمنع الخلط بالشفوي..."
                      value={studentNoteText}
                      onChange={(e) => setStudentNoteText(e.target.value)}
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => {
                        const updatedNotes = { ...activeSession.notes };
                        updatedNotes[activeSession.questions[activeSession.currentIndex].id] = studentNoteText;
                        setActiveSession(prev => prev ? { ...prev, notes: updatedNotes } : null);
                        alert("✅ تم حفظ الملاحظة الخاصة بالسؤال بملفك المؤقت لهذا الامتحان.");
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      حفظ الملاحظة
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Right Sidebar Checklist Panel (takes 1 column) */}
          <div className="space-y-4">
            
            {/* Header info card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest block mb-1">Workout progress</span>
              <div className="text-3xl font-black text-slate-900 leading-none">
                {Object.keys(activeSession.userAnswers).length} / {activeSession.totalQuestions}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 leading-none">Questions Locked</p>
              
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${(Object.keys(activeSession.userAnswers).length / activeSession.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Questions Jump Grid Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Question Navigator</span>
              
              <div className="grid grid-cols-5 gap-2">
                {activeSession.questions.map((q, idx) => {
                  const isCurrent = idx === activeSession.currentIndex;
                  const isAnswered = !!activeSession.userAnswers[q.id];
                  const isFlagged = flaggedIds.includes(q.id);

                  let btnStyle = "bg-slate-50 border border-slate-150 text-slate-500 hover:border-slate-350";

                  if (isCurrent) {
                    btnStyle = "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-150 font-bold";
                  } else if (isAnswered) {
                    btnStyle = "bg-emerald-50 border-emerald-150 text-emerald-800 hover:bg-emerald-100";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleNavigateQuestion(idx)}
                      className={`w-10 h-10 rounded-xl text-center text-xs font-black transition-all cursor-pointer relative flex items-center justify-center leading-none ${btnStyle}`}
                    >
                      <span>{idx + 1}</span>

                      {/* Flag Indicator red dot overlay */}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 bg-amber-500 w-2.5 h-2.5 rounded-full border border-white"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* End of test submission block */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleCompleteSession}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl cursor-pointer shadow-md shadow-emerald-50 flex items-center justify-center gap-1.5"
                >
                  <CheckSquareIcon />
                  إرسال وتسليم الكويز
                </button>
                <div className="text-center text-[9px] text-slate-400 font-mono mt-2 uppercase tracking-wide">
                  finish & generate report card
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. Result/Evaluation Feedback Dashboard Screen */}
      {activeSession && activeSession.isCompleted && (
        <div className="space-y-6">
          
          {/* Top master report wrapper */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-900 text-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5 font-mono">
                  <Award size={12} className="text-indigo-405 animate-bounce" />
                  Official evaluation checklist compiled successfully
                </span>
                
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    تقرير وتوصيات الأداء الإكلينيكي (Evaluation Card)
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm font-semibold max-w-xl leading-relaxed">
                    مستواك الحالي والتقييم التفصيلي لأسئلة البورد ومحددات الأداء لجامعة مصر للعلوم والتكنولوجيا وعيادات الباطنة والجراحة.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-1 justify-center md:justify-start text-xs font-bold text-slate-350">
                  <div className="bg-slate-850/50 border border-slate-800 px-4 py-2.5 rounded-xl">
                    ⏱️ Time Elapsed: <span className="font-mono text-white text-sm font-black">{formatTime(activeSession.elapsedTime)}</span>
                  </div>
                  <div className="bg-slate-850/50 border border-slate-800 px-4 py-2.5 rounded-xl">
                    📚 Solved Questions: <span className="font-mono text-white text-sm font-black">{activeSession.totalQuestions}</span>
                  </div>
                </div>
              </div>

              {/* Massive Score Gauge */}
              <div className="shrink-0 flex flex-col items-center">
                <div className="relative w-36 h-36 rounded-full border-4 border-indigo-505/20 flex flex-col items-center justify-center p-2 bg-slate-850/80 shadow-2xl relative">
                  {/* Decorative circle outline */}
                  <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                    <circle 
                      cx="72" cy="72" r="66" 
                      fill="transparent" 
                      stroke="#4f46e5" 
                      strokeWidth="6" 
                      strokeDasharray={`${2 * Math.PI * 66}`} 
                      strokeDashoffset={`${2 * Math.PI * 66 * (1 - activeSession.score / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">SCORE</span>
                  <span className="text-4xl font-black text-white tracking-tight mt-1 font-mono leading-none">{activeSession.score}%</span>
                  <span className="text-[9px] text-indigo-400 font-extrabold mt-1 uppercase tracking-tight">
                    {activeSession.score >= 80 ? "EXCELLENT" : activeSession.score >= 60 ? "COMPETENT" : "NEEDS REVIEW"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">مراجعة الأسئلة بالتفصيل • Answers Review Log</h3>
                <p className="text-slate-400 text-xs font-semibold leading-none">Review every clinical presentation and explanation to consolidate memory</p>
              </div>

              {/* Review filters tabs */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[
                  { id: "all", label: "All Details" },
                  { id: "correct", label: "Correct Only" },
                  { id: "incorrect", label: "Incorrect" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTabReview(t.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTabReview === t.id 
                        ? "bg-white text-slate-900 shadow-sm font-extrabold" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* The filtered rows of review questions */}
            <div className="space-y-6 divide-y divide-slate-100">
              {activeSession.questions
                .filter(q => {
                  const data = persistentAnswers[q.id];
                  if (activeTabReview === "correct") return data?.isCorrect;
                  if (activeTabReview === "incorrect") return !data?.isCorrect;
                  return true;
                })
                .map((q, idx) => {
                  const data = persistentAnswers[q.id];
                  const userChoice = activeSession.userAnswers[q.id];
                  const isCorrect = data?.isCorrect ?? false;
                  
                  return (
                    <div key={q.id} className={`pt-6 ${idx === 0 ? "pt-0" : ""}`}>
                      <div className="flex items-start gap-4 flex-col md:flex-row">
                        
                        {/* Bullet number & badge indicator */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="w-10 h-10 rounded-xl bg-slate-100 font-black text-slate-650 flex items-center justify-center">
                            Q{idx + 1}
                          </span>
                          <span className={`px-2.5 py-1 border text-[9px] font-black uppercase tracking-wider rounded-lg ${
                            isCorrect 
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                              : "bg-red-50 border-red-100 text-red-700"
                          }`}>
                            {isCorrect ? "Correct • صحيح" : "Incorrect • خاطئ"}
                          </span>
                        </div>

                        {/* Question Text & explanation expansion */}
                        <div className="flex-1 space-y-4 text-left">
                          
                          <div className="space-y-1 text-left">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none font-mono">CODE: {q.questionCode}</span>
                            <h4 className="text-sm sm:text-base font-black text-slate-800 leading-snug">
                              {q.questionText}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium select-text pt-1">
                              {q.vignette}
                            </p>
                          </div>

                          {/* Options highlight block */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold leading-relaxed">
                            {q.options.map(opt => {
                              const isUsersSelection = userChoice === opt.key;
                              const isCorrectOption = q.correctOption === opt.key;

                              let cardStyle = "border-slate-150 bg-slate-50/50 text-slate-550";
                              if (isCorrectOption) {
                                cardStyle = "border-emerald-350 bg-emerald-50/20 text-emerald-900";
                              } else if (isUsersSelection && !isCorrectOption) {
                                cardStyle = "border-red-350 bg-red-50/20 text-red-900";
                              }

                              return (
                                <div key={opt.key} className={`p-3 border rounded-xl flex items-start gap-3 ${cardStyle}`}>
                                  <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 border ${
                                    isCorrectOption 
                                      ? "bg-emerald-500 border-emerald-500 text-white" 
                                      : isUsersSelection ? "bg-red-500 border-red-500 text-white" : "bg-slate-100 border-slate-200 text-slate-600"
                                  }`}>
                                    {opt.key}
                                  </span>
                                  <span className="flex-1 pt-0.5 text-left leading-normal">{opt.text}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation summary block nested */}
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-2">
                            <span className="font-extrabold text-slate-800 block text-xs leading-none uppercase">Analysis & Explanation:</span>
                            <p className="text-slate-600 font-bold leading-relaxed">{q.explanation.correctMsg}</p>
                            
                            <div className="p-3 bg-amber-50/55 border border-amber-200 rounded-xl text-[11px] sm:text-xs text-amber-900 font-black leading-normal mt-2 leading-relaxed">
                              {q.explanation.highYieldPearl}
                            </div>

                            {activeSession.notes[q.id] && (
                              <div className="p-3 bg-indigo-50/50 border border-indigo-150 rounded-xl text-xs text-indigo-950 mt-2">
                                <span className="font-black text-[10px] uppercase text-indigo-400 block leading-none mb-1">Your Personal Saved Note:</span>
                                <p className="font-bold font-sans">"{activeSession.notes[q.id]}"</p>
                              </div>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
            </div>

          </div>

          {/* Action buttons at bottom */}
          <div className="flex items-center justify-center gap-4 py-8">
            <button
              onClick={() => setActiveSession(null)}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white uppercase text-xs font-black tracking-widest rounded-2xl cursor-pointer shadow-md transition-all flex items-center gap-2"
            >
              <RotateCcw size={14} />
              الرجوع لبدء جلسة جديدة • Reset Wizard
            </button>
          </div>

        </div>
      )}

      {/* 5. Exit Confirm Overlay Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 z-[90] flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 p-6 sm:p-10 max-w-md w-full shadow-2xl relative space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
                <AlertTriangle size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">هل تريد مغادرة الامتحان فعلاً؟</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                  بمغادرة الامتحان الآن، ستفقد تقدمك الحالي في هذا الاختبار ولن يتم حفظ الدرجة أو تجميع كبسولات التفسير لتقريرك الإكلينيكي.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
                >
                  إكمال الامتحان
                </button>
                <button
                  onClick={() => {
                    clearInterval(timerIntervalId);
                    setActiveSession(null);
                    setShowExitConfirm(false);
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-red-100"
                >
                  مغادرة وإلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- Custom local sub-icons avoiding external dependency warnings ---
const CheckSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-square">
    <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);
