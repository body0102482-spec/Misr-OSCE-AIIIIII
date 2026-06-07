import React, { useState } from "react";
import { Send, AlertCircle, Stethoscope, Search, ClipboardCheck, ChevronRight } from "lucide-react";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "motion/react";

export const DiagnosisTab: React.FC = () => {
  const { studentNotes, updateNotes, setActiveTab, currentCase, setScore, messages, setQuotaExceeded } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentCase) return null;

  const handleSubmit = async () => {
    if (!studentNotes.diagnosis.trim()) {
      setError("Please provide a suspected diagnosis before submitting.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          performance: studentNotes,
          chatHistory: messages.map(m => `${m.role === "student" ? "Student" : "Patient"}: ${m.content}`).join("\n"),
          caseData: currentCase
        }),
      });

      const data = await response.json();
      if (data.quotaExceeded) {
        setQuotaExceeded(true);
      }
      setScore(data);
      setActiveTab("feedback");
    } catch (e) {
      console.error("Evaluation Error:", e);
      setError("Failed to generate feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-3 bg-white px-6 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
           <Stethoscope size={18} className="text-blue-600" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Diagnostic Finalization Station</span>
        </div>
        <h3 className="text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">Clinical Formulation</h3>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Review your collected findings and provide a comprehensive differential diagnosis and management plan.
        </p>
      </div>

      <div className="space-y-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Search size={14} className="text-blue-600" />
                 Diagnostic Impression
              </h4>
              <textarea
                value={studentNotes.diagnosis}
                onChange={(e) => updateNotes("diagnosis", e.target.value)}
                placeholder="What is your primary clinical diagnosis?"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-[16px] font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
                style={{ fontSize: "16px" }}
                rows={6}
              />
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <ClipboardCheck size={14} className="text-emerald-500" />
                 Initial Management
              </h4>
              <textarea
                value={studentNotes.management}
                onChange={(e) => updateNotes("management", e.target.value)}
                placeholder="List immediate management steps..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-[16px] font-medium text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
                style={{ fontSize: "16px" }}
                rows={6}
              />
           </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 drop-shadow-sm"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        <div className="pt-8 flex justify-center pb-20">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group relative bg-slate-900 text-white px-16 py-6 rounded-[2rem] text-xl font-black transition-all hover:bg-slate-800 disabled:opacity-50 overflow-hidden shadow-2xl shadow-slate-300 active:scale-95"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Evaluating Session...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                Complete Exam Station
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
