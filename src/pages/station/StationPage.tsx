import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Clock, 
  Activity, 
  MessageSquare, 
  Search, 
  FlaskConical, 
  ClipboardCheck, 
  Award,
  Circle,
  Stethoscope,
  User,
  CheckCircle2,
  Shield,
  Info,
  X
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { OSCELogo } from "../../components/OSCELogo";

// Tabs
import { HistoryTab } from "./HistoryTab";
import { ExaminationTab } from "./ExaminationTab";
import { InvestigationsTab } from "./InvestigationsTab";
import { DiagnosisTab } from "./DiagnosisTab";
import { FeedbackTab } from "./FeedbackTab";

export const StationPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentCase, 
    activeTab, 
    setActiveTab, 
    timer, 
    isTimerRunning,
    startTimer,
    tickTimer,
    isExaminerMode,
    toggleExaminerMode,
    isRandomBlind,
    quotaExceeded,
    resetSession
  } = useStore();

  const handleToggleExaminerMode = () => {
    if (isRandomBlind && activeTab !== "feedback") {
      alert("⚠️ يتم قفل بنك الأسألة والتقييم النموذجي أثناء الامتحان العشوائي لضمان التقييم العادل ومحاكاة الاختبار الحقيقية، وسيفتح تلقائياً بعد تقديم تشخيصك النهائي وتسليم الحالة!");
      return;
    }
    toggleExaminerMode();
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentCase) {
      navigate("/");
      return;
    }
    startTimer();
  }, [currentCase]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => tickTimer(), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!currentCase) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const tabs = [
    { id: "history", icon: <MessageSquare size={16} />, label: "History" },
    { id: "examination", icon: <Search size={16} />, label: "Examination" },
    { id: "investigations", icon: <FlaskConical size={16} />, label: "Investigations" },
    { id: "diagnosis", icon: <ClipboardCheck size={16} />, label: "Diagnosis" },
    { id: "feedback", icon: <Award size={16} />, label: "Feedback" },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 overflow-hidden font-sans text-slate-100">
      
      {/* Header / Navigation Bar */}
      <nav className="h-16 bg-slate-950 border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 transition-all shrink-0"
            title="Open Patient Record"
          >
            <User size={16} />
          </button>
          
          <div className="min-w-0 text-left">
            <h1 className="text-sm font-bold text-white leading-tight font-display">Synoza Simulator</h1>
            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest truncate">
              {isRandomBlind && activeTab !== "feedback" ? "🎲 Blind Exam Case • تخصص عشوائي مخفي" : currentCase.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={handleToggleExaminerMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border ${
              isExaminerMode 
                ? "bg-cyan-500 border-cyan-400 text-slate-950 font-black shadow-lg" 
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            <Shield size={10} />
            <span>{isExaminerMode ? "Examiner Mode" : "View Model Guide"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-red-500/15 text-red-400 px-3.5 py-1.5 rounded-full border border-red-500/20 shrink-0 font-mono">
            <Clock size={12} className="animate-pulse" />
            <span className="font-bold text-sm leading-none">{formatTime(timer)}</span>
          </div>

          <Link 
            to="/"
            onClick={() => resetSession()}
            className="bg-white/10 hover:bg-red-500 hover:text-white border border-white/5 text-slate-300 px-4 py-1.5 rounded-xl font-bold text-xs transition-all uppercase tracking-wider"
          >
            Quit
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Backdrop for mobile drawer */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-30 lg:hidden cursor-pointer"
          />
        )}

        {/* Left Sidebar: Patient Data */}
        <aside className={`
          fixed inset-y-0 left-0 bg-slate-950 border-r border-white/5 flex flex-col p-6 gap-6 shrink-0 overflow-y-auto z-40 w-[280px] transition-transform duration-300 synoza-glass
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-10 lg:w-[300px] lg:shadow-none lg:flex h-full
        `}>
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden border-b border-white/5 pb-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">Patient File</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400">
              <User size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">{currentCase.patient.name}</h2>
            <p className="text-[10px] text-slate-400 font-medium font-mono">
              {currentCase.patient.age} Y/O {currentCase.patient.gender} • Egyptian
            </p>
          </div>

          {isExaminerMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-white/5 p-4 rounded-xl text-left"
            >
              <div className="flex items-center gap-1.5 mb-3 text-cyan-400">
                <Shield size={14} />
                <h3 className="text-[9px] font-mono uppercase tracking-wider">OSCE Examiner Guide</h3>
              </div>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {currentCase.checklist.map((c, idx) => (
                  <li key={idx} className="flex gap-2 text-[10px] leading-relaxed">
                    <div className="mt-1 w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                    <span className="text-slate-300">
                      <strong className="text-slate-500">[{c.category}]</strong> {c.item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          <div className="space-y-3 text-left">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">Vital Signs</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <VitalCard label="BP" value={currentCase.patient.vitals.bp} color="blue" />
              <VitalCard label="HR" value={currentCase.patient.vitals.hr} color="red" />
              <VitalCard label="TEMP" value={currentCase.patient.vitals.temp} color="emerald" />
              <VitalCard label="SpO2" value={currentCase.patient.vitals.oxygen} color="amber" />
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1">Station Progress</h3>
            <div className="space-y-1.5">
              {tabs.map((tab, i) => {
                const isActive = activeTab === tab.id;
                const isCompleted = tabs.findIndex(t => t.id === activeTab) > i;
                
                return (
                  <div 
                    key={tab.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all ${
                      isCompleted 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : isActive
                          ? "bg-white/10 border-cyan-500/20 text-white font-bold"
                          : "bg-transparent border-transparent text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="shrink-0" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-mono shrink-0 ${
                        isActive ? "border-cyan-400 bg-cyan-500 text-slate-950 font-black" : "border-slate-700 text-slate-500"
                      }`}>
                        {i + 1}
                      </div>
                    )}
                    <span className="text-xs">{tab.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Interaction Area */}
        <main className="flex-1 flex flex-col bg-slate-950/40 overflow-hidden">
          {quotaExceeded && (
            <div className="bg-amber-500 text-slate-950 px-4 py-2 flex items-center justify-between shrink-0 z-10 font-mono text-[10px] font-bold">
              <div className="flex items-center gap-2">
                <Info size={14} />
                <span>Bilingual Dialogue Parser active in zero-delay model offline backup.</span>
              </div>
            </div>
          )}

          {/* Tabs Bar */}
          <div className="flex px-6 pt-3 bg-slate-950 border-b border-white/5 gap-6 shrink-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 border-b-2 font-bold text-xs transition-all relative flex items-center gap-1.5 shrink-0 ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {(tab.id === "history" || tab.id === "examination" || tab.id === "investigations") ? (
                  <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    {tab.icon}
                  </motion.div>
                ) : tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className={`flex-1 min-h-0 ${activeTab === "history" ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className={`h-full ${activeTab === "history" ? "flex flex-col overflow-hidden" : ""}`}
              >
                {activeTab === "history" && <HistoryTab />}
                {activeTab === "examination" && <ExaminationTab />}
                {activeTab === "investigations" && <InvestigationsTab />}
                {activeTab === "diagnosis" && <DiagnosisTab />}
                {activeTab === "feedback" && <FeedbackTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

const VitalCard = ({ label, value, color }: { label: string, value: string, color: 'blue' | 'red' | 'emerald' | 'amber' }) => {
  const styles = {
    blue: "bg-blue-500/5 border-blue-500/15 text-blue-400",
    red: "bg-red-500/5 border-red-500/15 text-red-400",
    emerald: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/5 border-amber-500/15 text-amber-400",
  };

  return (
    <div className={`p-3 ${styles[color]} rounded-xl border transition-transform duration-300 hover:scale-[1.02] text-left`}>
      <p className="text-[9px] uppercase font-mono font-bold opacity-60 mb-0.5">{label}</p>
      <p className="text-sm font-bold font-mono">{value}</p>
    </div>
  );
};
