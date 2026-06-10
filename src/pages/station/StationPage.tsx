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
    quotaExceeded,
    resetSession
  } = useStore();

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
    { id: "history", icon: <MessageSquare size={18} />, label: "History" },
    { id: "examination", icon: <Search size={18} />, label: "Examination" },
    { id: "investigations", icon: <FlaskConical size={18} />, label: "Investigations" },
    { id: "diagnosis", icon: <ClipboardCheck size={18} />, label: "Diagnosis" },
    { id: "feedback", icon: <Award size={18} />, label: "Feedback" },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden font-sans">
      {/* Header / Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-8 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shrink-0"
            title="Open Patient Record & Vitals"
          >
            <User size={18} />
          </button>
          <div className="hidden xs:flex w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg items-center justify-center text-white shadow-sm shrink-0">
            <Stethoscope size={18} className="md:hidden" />
            <Stethoscope size={22} className="hidden md:block" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-lg font-black tracking-tight text-slate-800 leading-tight truncate">OSCE Mentor AI</h1>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{currentCase.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-6">
          <button 
            onClick={toggleExaminerMode}
            className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all border ${
              isExaminerMode 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
            }`}
          >
            <Shield size={10} />
            <span className="hidden sm:inline">{isExaminerMode ? "Examiner" : "View Examiner"}</span>
            <span className="sm:hidden">{isExaminerMode ? "Active" : "Examiner"}</span>
          </button>
          <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-red-100 shadow-sm shrink-0">
            <Clock size={12} className="animate-pulse md:w-4 md:h-4" />
            <span className="font-mono font-bold text-xs md:text-lg leading-none">{formatTime(timer)}</span>
          </div>
          <Link 
            to="/"
            onClick={() => resetSession()}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-xl font-bold text-[10px] md:text-sm transition-all uppercase tracking-wider shadow-sm active:scale-95"
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
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-30 lg:hidden cursor-pointer"
          />
        )}

        {/* Left Sidebar: Patient Data */}
        <aside className={`
          fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col p-6 gap-8 shrink-0 overflow-y-auto z-40 w-[280px] xs:w-[320px] shadow-2xl transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-10 lg:w-[320px] lg:shadow-none lg:flex h-full
        `}>
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patient File</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-3 border-4 border-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
              <User size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{currentCase.patient.name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {currentCase.patient.age} Year Old {currentCase.patient.gender} • Egyptian
            </p>
          </div>

          {isExaminerMode && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800"
            >
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Shield size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Model Answer Checklist</h3>
              </div>
              <ul className="space-y-3">
                {currentCase.checklist.map((c, idx) => (
                  <li key={idx} className="flex gap-3 text-[11px] leading-relaxed">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-medium text-slate-300">
                      <span className="text-slate-500 font-bold">[{c.category}]</span> {c.item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-amber-400">
                 <Info size={14} />
                 <span className="text-[10px] font-bold uppercase">Secret Case Guide</span>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Vital Signs</h3>
            <div className="grid grid-cols-2 gap-3">
              <VitalCard label="BP" value={currentCase.patient.vitals.bp} color="blue" />
              <VitalCard label="HR" value={currentCase.patient.vitals.hr} color="red" />
              <VitalCard label="TEMP" value={currentCase.patient.vitals.temp} color="emerald" />
              <VitalCard label="SpO2" value={currentCase.patient.vitals.oxygen} color="amber" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Station Progress</h3>
            <div className="space-y-2">
              {tabs.map((tab, i) => {
                const isActive = activeTab === tab.id;
                const isCompleted = tabs.findIndex(t => t.id === activeTab) > i;
                
                return (
                  <div 
                    key={tab.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isCompleted 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                        : isActive
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 opacity-60"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="shrink-0" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 ${
                        isActive ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"
                      }`}>
                        {i + 1}
                      </div>
                    )}
                    <span className="text-sm">{tab.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Interaction Area */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {quotaExceeded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-amber-500 text-white px-6 py-3 flex items-center justify-between border-b border-amber-600 shadow-inner shrink-0 z-10"
            >
              <div className="flex items-center gap-3">
                <Info size={18} className="shrink-0" />
                <p className="text-xs font-semibold leading-normal text-right" dir="rtl">
                  <strong>تنبيه تقني (تجاوز الحد المؤقت للـ API):</strong> لقد قمت بإرسال عدة طلبات سريعة وتجاوزت حد خوادم Google المؤقت في الدقيقة (Rate Limit). 
                  <span className="block mt-0.5 text-[11px] text-amber-100 font-normal">
                    💡 رصيدك الشخصي من رسائل واشتراك الحالات سليم ومحفوظ بالكامل (لم يُستهلك منه شيء). يرجى الانتظار دقيقة واحدة فقط ثم المحاولة مجدداً وسيعود النموذج للعمل فوراً!
                  </span>
                </p>
              </div>
              <button 
                onClick={() => useStore.getState().setQuotaExceeded(false)}
                className="text-white hover:text-amber-200 transition-colors p-2 shrink-0 mr-2"
                title="Dismiss"
              >
                <X size={16} className="stroke-[3]" />
              </button>
            </motion.div>
          )}

          {/* Tabs Bar */}
          <div className="flex px-6 pt-4 bg-white border-b border-slate-200 gap-8 shrink-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 border-b-2 font-bold text-sm transition-all relative flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-800"
                }`}
              >
                {(tab.id === "history" || tab.id === "examination" || tab.id === "investigations") ? (
                  <motion.div
                    animate={{ x: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    {tab.icon}
                  </motion.div>
                ) : tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
    blue: "bg-blue-50 border-blue-100 text-blue-600 text-blue-900",
    red: "bg-red-50 border-red-100 text-red-600 text-red-900",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600 text-emerald-900",
    amber: "bg-amber-50 border-amber-100 text-amber-600 text-amber-900",
  };

  const [bg, border, textMuted, textDark] = styles[color].split(' ');

  return (
    <div className={`p-3 ${bg} rounded-xl border ${border} shadow-sm transition-transform hover:scale-[1.02]`}>
      <p className={`text-[10px] ${textMuted} uppercase font-bold tracking-wider mb-1`}>{label}</p>
      <p className={`text-lg font-black ${textDark} leading-tight`}>{value}</p>
    </div>
  );
};

const VitalItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">{label}</span>
    <span className="text-xs font-black text-slate-800">{value}</span>
  </div>
);
