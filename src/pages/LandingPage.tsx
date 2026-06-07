import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Brain, ClipboardCheck, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { motion } from "motion/react";

export const LandingPage: React.FC = () => {
  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 selection:bg-blue-100">
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-8 max-w-7xl mx-auto border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
            <Stethoscope size={24} />
          </div>
          <div>
            <span className="text-xl font-black text-slate-800 tracking-tight block leading-none">OSCE Mentor AI</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Egyptian Medical Elite</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <a href="#features" className="hover:text-blue-600 transition-colors">Platform</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Cases</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Curriculum</a>
        </div>
        <Link 
          to="/auth" 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95"
        >
          Student Portal / الدخول للمنصة
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm mb-10">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            MUST University OSCE Portal Active • 2026 Curriculum
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            Master Clinical <br />
            <span className="text-blue-600">Decision Making</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium">
            The first AI-native clinical simulator built for Egyptian medical students. Practice history, examination, and diagnostics in a hyper-realistic station.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/auth" 
              className="group bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-3 shadow-2xl shadow-blue-200 hover:-translate-y-1"
            >
              Enter OSCE Station / دخول الامتحان
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/auth"
              className="bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all shadow-lg shadow-slate-100 flex items-center justify-center"
            >
              Try Demo Case
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-32 w-full pt-16 border-t border-slate-200/60">
           <StatItem value="150+" label="Clinical Cases" />
           <StatItem value="98%" label="Symmetry Accuracy" />
           <StatItem value="12k+" label="Daily Sessions" />
           <StatItem value="24/7" label="Instant Feedback" />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-8 text-center pb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Engineered for Accuracy</h2>
          <p className="text-slate-500 font-medium">Professional tools designed to mimic the intensity of the hospital environment.</p>
        </div>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Brain className="text-blue-600" size={32} />}
            title="Dynamic AI Patient"
            description="Patients simulate real personalities and revealing details only if you ask correctly."
          />
          <FeatureCard 
            icon={<Activity className="text-blue-600" size={32} />}
            title="Clinical Maneuvers"
            description="From percussion to auscultation, perform every step and receive anatomical findings."
          />
          <FeatureCard 
            icon={<ClipboardCheck className="text-blue-600" size={32} />}
            title="Examiner Scoring"
            description="Automated checklists score you exactly like a real clinical examiner would."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-24">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope size={24} className="text-blue-600" />
              <span className="text-xl font-black text-slate-900 tracking-tight">OSCE Mentor AI</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Made with precision for the medical leaders of tomorrow.
            </p>
          </div>
          <div className="flex gap-12 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center">
    <div className="text-4xl font-black text-slate-900 mb-2">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 text-left transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60"
  >
    <div className="mb-8 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-md leading-relaxed font-medium">{description}</p>
  </motion.div>
);
