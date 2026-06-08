import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Brain, 
  BookOpen, 
  Clipboard, 
  RefreshCw, 
  Home, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  Lightbulb,
  Info
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import Markdown from "react-markdown";

export const FeedbackTab: React.FC = () => {
  const { score, resetSession, currentCase, vivaAttempts, timer } = useStore();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<"briefing" | "skills" | "viva">("briefing");

  if (!score) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
       <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-8 border-2 border-dashed border-slate-200">
          <Clipboard size={32} />
       </div>
       <h3 className="text-2xl font-black text-slate-800 tracking-tight">Evaluating Performance...</h3>
       <p className="text-slate-500 font-medium max-w-xs mt-2">Generating your clinical performance metrics and scorecard feedback.</p>
    </div>
  );

  // Helper to determine the pass/fail or performance grade phrase
  const scorePercent = (score.total / 20) * 100;
  let gradePhrase = "Needs Focus";
  let gradeColor = "text-rose-600 bg-rose-50 border-rose-200";
  if (scorePercent >= 85) {
    gradePhrase = "Excellent Pass";
    gradeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  } else if (scorePercent >= 70) {
    gradePhrase = "Solid Pass";
    gradeColor = "text-blue-700 bg-blue-50 border-blue-200";
  } else if (scorePercent >= 50) {
    gradePhrase = "Borderline Pass";
    gradeColor = "text-amber-700 bg-amber-50 border-amber-200";
  }

  // Format time elapsed
  const formatTimeSpent = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Group checklist items by category
  const getCategoryDetails = (itemText: string) => {
    const match = currentCase?.checklist.find(c => c.item === itemText);
    return match ? match.category : "Reasoning";
  };

  const coveredItems = score.coveredItems || [];
  const missedItems = score.missedItems || [];

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      {/* 1. Header Card - Visual Score and Case Meta */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Radial/Circular Score dial */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="64" 
                  className="stroke-slate-100" 
                  strokeWidth="12" 
                  fill="transparent" 
                />
                <motion.circle 
                  cx="72" 
                  cy="72" 
                  r="64" 
                  className="stroke-blue-600" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={402}
                  initial={{ strokeDashoffset: 402 }}
                  animate={{ strokeDashoffset: 402 - (402 * (score.total / 20)) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900">{score.total}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">/ 20 Total</span>
              </div>
            </div>
            
            <div className={`mt-4 px-4 py-1.5 rounded-full border text-xs font-extrabold uppercase tracking-wider ${gradeColor}`}>
              {gradePhrase}
            </div>
          </div>
          
          {/* Case specifics and summary */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {currentCase?.specialty} Station
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2 mb-1">
                {currentCase?.name} Feedback Report
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Post-Evaluation briefing for clinical encounter with <strong>{currentCase?.patient.name}</strong> ({currentCase?.patient.age}Y/O {currentCase?.patient.gender})
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Time Spent</p>
                  <p className="text-xs font-bold text-slate-700">{formatTimeSpent(timer)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Skills Covered</p>
                  <p className="text-xs font-bold text-slate-700">
                    {coveredItems.length} / {currentCase?.checklist.length || 0} ({Math.round((coveredItems.length / (currentCase?.checklist.length || 1)) * 100)}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Vivas Attempted</p>
                  <p className="text-xs font-bold text-slate-700">
                    {vivaAttempts.length ? `${vivaAttempts.filter(v => v.isCorrect).length} Correct (${vivaAttempts.length} total)` : "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Score Category Breakdown Slider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        
        {/* Communication Skills */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Domain 01</span>
              <h4 className="text-sm font-extrabold text-slate-700">Communication Skills</h4>
            </div>
            <span className="text-sm font-extrabold bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {score.communication} / 4
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(score.communication / 4) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2">Professionalism, empathy & structural interview flow.</p>
        </div>

        {/* Clinical Examination */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Domain 02</span>
              <h4 className="text-sm font-extrabold text-slate-700">Clinical Examination</h4>
            </div>
            <span className="text-sm font-extrabold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
              {score.examination} / 6
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(score.examination / 6) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2">Observation accuracy, technique & finding interpretation.</p>
        </div>

        {/* Clinical Reasoning & Diagnosis */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Domain 03</span>
              <h4 className="text-sm font-extrabold text-slate-700">Reasoning & Planning</h4>
            </div>
            <span className="text-sm font-extrabold bg-purple-50 text-purple-700 px-2 py-1 rounded">
              {score.reasoning} / 10
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(score.reasoning / 10) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-2">Suspected diagnosis, differential analysis & immediate plans.</p>
        </div>
      </div>

      {/* 3. Section Selectors - Interactive Tabs with sub-states */}
      <div className="flex border-b border-slate-200 mb-8 bg-white p-2 rounded-2xl border gap-2">
        <button
          onClick={() => setActiveSubTab("briefing")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSubTab === "briefing" 
              ? "bg-slate-900 text-white shadow-md shadow-slate-100" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Brain size={14} />
          Qualitative Briefing
        </button>
        <button
          onClick={() => setActiveSubTab("skills")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSubTab === "skills" 
              ? "bg-slate-900 text-white shadow-md shadow-slate-100" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Award size={14} />
          Checklist Skills & Missed Sections
        </button>
        <button
          onClick={() => setActiveSubTab("viva")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSubTab === "viva" 
              ? "bg-slate-900 text-white shadow-md shadow-slate-100" 
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <HelpCircle size={14} />
          Oral Board Questions ({vivaAttempts.length})
        </button>
      </div>

      {/* 4. Tab Contents - Animation Framed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.15 }}
        >
          {/* TAB 1: QUALITATIVE BRIEFING (Markdown Summary) */}
          {activeSubTab === "briefing" && (
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-slate-800 pointer-events-none opacity-20">
                <BookOpen size={200} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Brain size={14} />
                  Clinical Examiner's Feedback & Comments
                </h3>
                <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed font-sans text-sm md:text-base">
                  <Markdown>{score.feedback}</Markdown>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS CHECKLIST (Missed Sections vs Covered Skills) */}
          {activeSubTab === "skills" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: MISSED SKILLS & TARGETED COACHING */}
              <div className="space-y-6">
                <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4 text-rose-700">
                    <XCircle size={22} />
                    <div>
                      <h3 className="font-extrabold text-base tracking-tight leading-none">Sections Missed & Omissions</h3>
                      <p className="text-[11px] text-rose-500 font-medium mt-1">Review missed criteria and clinical actions required next time</p>
                    </div>
                  </div>
                  
                  {missedItems.length === 0 ? (
                    <div className="bg-white border border-rose-100 rounded-2xl p-6 text-center">
                      <p className="text-sm font-bold text-slate-600">Spectacular Work doctor!</p>
                      <p className="text-xs text-slate-400 mt-1">You covered all parts of the clinical guidelines successfully without omission.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-4">
                      {missedItems.map((item, idx) => {
                        const category = getCategoryDetails(item);
                        return (
                          <div key={idx} className="bg-white border border-rose-100 rounded-xl p-4 flex gap-3 shadow-inner">
                            <div className="mt-0.5 w-5 h-5 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                              !
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md font-bold uppercase">
                                  {category}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-slate-700 leading-snug">{item}</p>
                              
                              {/* Clinical coaching guidance */}
                              <div className="flex gap-1 py-1.5 px-3 bg-rose-50/30 rounded-lg text-slate-500 text-[10px] font-semibold items-start mt-2 border border-slate-100">
                                <Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                  {category === "History" && "Ask the patient proactively about this sign during the interview loop. Do not overlook its exclusion."}
                                  {category === "Examination" && "Perform this examination step in active interactions. Look closely at images and interpret signs systematically."}
                                  {category === "Reasoning" && "Incorporate this clinical criteria clearly in your suspection report or treatment planner."}
                                  {category === "Communication" && "Demonstrate professional bedside manner, use active listening, and establish empathy loops."}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: MASTERED SKILLS & HIGHLIGHTS */}
              <div className="space-y-6">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4 text-emerald-800">
                    <CheckCircle2 size={22} />
                    <div>
                      <h3 className="font-extrabold text-base tracking-tight leading-none">Skills Mastered & Addressed</h3>
                      <p className="text-[11px] text-emerald-600 font-medium mt-1">Excellent job addressing the following points of clinical guidelines</p>
                    </div>
                  </div>

                  {coveredItems.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                      <p className="text-sm font-bold text-slate-500">No Checklist Points Processed</p>
                      <p className="text-xs text-slate-400 mt-1">Make sure you actively ask clinical questions and perform examinations before evaluation.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-4">
                      {coveredItems.map((item, idx) => {
                        const category = getCategoryDetails(item);
                        return (
                          <div key={idx} className="bg-white border border-emerald-100 rounded-xl p-4 flex gap-3 shadow-sm">
                            <div className="mt-0.5 w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                              <Check size={12} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-bold uppercase">
                                  {category}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-slate-700 leading-snug">{item}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORAL VIVA BOARD QUESTIONS PERFORMANCE */}
          {activeSubTab === "viva" && (
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">Oral Board Viva Results</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Student answers compared to model key answers evaluated live by senior medical board examiners.
                  </p>
                </div>
              </div>

              {vivaAttempts.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                    <HelpCircle size={28} />
                  </div>
                  <h4 className="text-sm font-black text-slate-700">No Viva Board Questions Answered</h4>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mt-1 mb-6 leading-relaxed">
                    You did not complete oral viva queries during this station. To take vivas next time, toggle details to 'Examiner', click 'Ask From File', and explain your reasoning!
                  </p>
                  <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl max-w-sm text-left align-middle text-[10px] font-semibold">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>How it works: Board Vivas test theoretical knowledge on the case (e.g. significance of signs, therapeutic guidelines, contraindications).</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {vivaAttempts.map((attempt, idx) => (
                    <div 
                      key={attempt.questionId || idx} 
                      className={`border rounded-2xl overflow-hidden shadow-sm transition-transform hover:scale-[1.005] ${
                        attempt.isCorrect 
                          ? "border-emerald-100 bg-emerald-50/10" 
                          : "border-slate-200 bg-slate-50/20"
                      }`}
                    >
                      {/* Accordion/Summary bar */}
                      <div className="p-4 flex items-center justify-between border-b border-inherit bg-white/40">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            attempt.isCorrect 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {attempt.isCorrect ? "✓" : "!"}
                          </span>
                          <div>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Questions Bench Point {idx + 1}</span>
                            <p className="text-sm font-extrabold text-slate-700 font-sans mt-0.5">{attempt.question}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          attempt.isCorrect 
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50" 
                            : "border-amber-200 text-amber-700 bg-amber-50"
                        }`}>
                          {attempt.isCorrect ? "Mastered" : "Missed Key Points"}
                        </span>
                      </div>

                      {/* Details comparison pane */}
                      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white shrink-0">
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            Your Clinical Answer:
                          </p>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold italic text-slate-600 leading-relaxed">
                            "{attempt.studentAnswer || "[No speech response captured or skipped]"}"
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Model Standard Answer Key:
                          </p>
                          <div className="p-4 bg-emerald-50/30 border border-emerald-50/60 rounded-xl text-xs font-bold text-emerald-800 leading-relaxed shadow-inner">
                            {attempt.sampleAnswer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 5. Navigation Control buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 bg-slate-50 rounded-2xl p-4 border border-slate-100 max-w-md mx-auto">
        <button
          onClick={() => {
            resetSession();
            navigate("/");
          }}
          className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={16} />
          Try Another Station
        </button>
        <Link
          to="/"
          onClick={() => resetSession()}
          className="flex-1 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Home size={16} />
          Return to Portal
        </Link>
      </div>
    </div>
  );
};
