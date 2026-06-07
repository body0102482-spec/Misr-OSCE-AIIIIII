import React, { useState } from "react";
import { Beaker, FileText, CheckCircle2, FlaskConical, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store/useStore";

export const InvestigationsTab: React.FC = () => {
  const { currentCase, updateNotes, studentNotes } = useStore();
  const [selectedInvs, setSelectedInvs] = useState<string[]>(() => studentNotes.investigations || []);

  if (!currentCase) return null;

  const handleOrder = (invName: string) => {
    if (!selectedInvs.includes(invName)) {
      setSelectedInvs([...selectedInvs, invName]);
      updateNotes("investigations", [...studentNotes.investigations, invName]);
    }
  };

  const findings = currentCase.investigations.filter(i => selectedInvs.includes(i.name));

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Availability List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-100">
                <FlaskConical size={20} />
              </div>
              Diagnostics
            </h3>
            <p className="text-slate-500 font-medium text-sm mt-2">Request supporting evidence to confirm your clinical suspected diagnosis.</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              "CBC", "ALT/AST", "Albumin", "PT/INR", "Abdominal US", 
              "Chest X-ray", "ECG", "RFT", "Blood Glucose", "Viral Markers"
            ].map((inv) => (
              <button
                key={inv}
                onClick={() => handleOrder(inv)}
                className={`w-full group text-left p-4 rounded-[1.25rem] border transition-all flex justify-between items-center ${
                  selectedInvs.includes(inv)
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 translate-x-2"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:shadow-md"
                }`}
              >
                <span className={`text-sm font-bold tracking-tight ${selectedInvs.includes(inv) ? "text-white" : "text-slate-700"}`}>{inv}</span>
                {selectedInvs.includes(inv) ? (
                  <CheckCircle2 size={18} className="text-blue-100" />
                ) : (
                  <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            Lab & Imaging Results Console
          </h3>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {findings.length > 0 ? (
                findings.map((finding) => (
                  <motion.div
                    key={finding.name}
                    initial={{ opacity: 0, x: 20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-blue-200 transition-colors"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform">
                       <FileText size={80} />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{finding.name}</h4>
                        <div className="flex gap-4">
                           <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm border border-emerald-100">Verified Result</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative z-10">
                      <p className="text-blue-600 text-lg font-bold leading-relaxed italic">
                        "{finding.result}"
                      </p>
                      {finding.normalRange && (
                        <div className="mt-4 pt-4 border-t border-slate-200/60 flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                             Normal: {finding.normalRange} {finding.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center bg-slate-100 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 mb-8 border border-slate-50 text-slate-300">
                    <Beaker size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Diagnostics Offline</h4>
                  <p className="text-slate-400 font-medium max-w-[280px]">Please order clinical investigations from the specialist catalog on the left.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
