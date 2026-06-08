import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Brain, ClipboardCheck, ArrowRight, ShieldCheck, Activity, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export const LandingPage: React.FC = () => {
  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 selection:bg-blue-100 font-sans">
      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-6 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
            <Stethoscope size={24} />
          </div>
          <div>
            <span className="text-xl font-black text-slate-800 tracking-tight block leading-none">OSCE Mentor AI</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MUST - Academic Portal</span>
          </div>
        </div>
        <Link 
          to="/auth" 
          className="bg-slate-900 text-white px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:scale-105 active:scale-95"
        >
          Sign In / تسجيل دخول
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] sm:text-xs font-black text-blue-600 shadow-sm mb-10 uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" />
            Academic OSCE Simulation Platform • MUST 2026
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95] max-w-4xl mx-auto">
            Refine Your Clinical <br />
            <span className="text-blue-600">Maneuvers</span> with AI
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Practice board-style clinical history dialogues, perform abdominal and chest maneuvers, analyze patient visual findings, and submit differential rationales to automated medical examiners.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link 
              to="/auth" 
              className="group bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:-translate-y-1"
            >
              Get Started / ابدأ الآن
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#about"
              className="bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all shadow-lg shadow-slate-100 flex items-center justify-center"
            >
              Learn More / نبذة عن الموقع
            </a>
          </div>
        </motion.div>

        {/* Visual Preview Placeholder or App Screens */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 w-full max-w-5xl aspect-video bg-slate-900 rounded-[2.5rem] p-4 shadow-3xl relative overflow-hidden group border-8 border-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="h-full w-full rounded-[1.5rem] bg-slate-800 flex items-center justify-center border border-slate-700/50">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/50">
                <Activity size={32} className="text-white" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time Clinical Simulation Engine</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* About Section */}
      <section id="about" className="bg-white py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                About OSCE Mentor AI <br />
                <span className="text-blue-600">The MUST Standard</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                OSCE Mentor AI is a specialized clinical training platform developed for students at Misr University for Science and Technology. Our mission is to bridge the gap between theoretical knowledge and clinical practice using state-of-the-art AI simulation.
              </p>
              <div className="space-y-4">
                <AboutItem 
                  title="Egyptian Licensing Pattern" 
                  desc="Cases specifically designed to mirror the structure and intensity of MUST clinical rotations and national exams." 
                />
                <AboutItem 
                  title="Comprehensive Feedback" 
                  desc="Receive instant detailed reports on your history taking, physical examination logic, and diagnostic reasoning." 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                 <VisualCard icon={<Brain className="text-blue-600" />} label="Brain Modeling" />
                 <VisualCard icon={<ShieldCheck className="text-emerald-600" />} label="Verified Cases" />
              </div>
              <div className="space-y-6">
                 <VisualCard icon={<Activity className="text-rose-600" />} label="Live Simulation" />
                 <VisualCard icon={<ClipboardCheck className="text-amber-600" />} label="Auto Scoring" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-8 text-center pb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Platform Core Pillars</h2>
          <p className="text-slate-500 font-medium">Engineered to mimic the hospital environment with clinical precision.</p>
        </div>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Brain className="text-blue-600" size={32} />}
            title="Dynamic AI Patient"
            description="Patients simulate real personalities and revealing details only if you ask correctly. They react to your tone and vocabulary."
          />
          <FeatureCard 
            icon={<Activity className="text-blue-600" size={32} />}
            title="Clinical Maneuvers"
            description="From percussion to auscultation, perform every step and receive anatomical findings mapped to real medical data."
          />
          <FeatureCard 
            icon={<ClipboardCheck className="text-blue-600" size={32} />}
            title="Examiner scoring"
            description="Automated checklists score you exactly like a real clinical examiner would, focusing on safety and efficiency."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
          <div className="bg-blue-600 p-4 rounded-3xl mb-8">
            <Stethoscope size={40} />
          </div>
          <h3 className="text-3xl font-black mb-4">Ready to test your limits?</h3>
          <p className="text-slate-400 max-w-xl mb-12 font-medium">
            Join the medical leaders of tomorrow at Misr University for Science and Technology.
          </p>
          <Link 
            to="/auth" 
            className="bg-white text-slate-900 px-12 py-5 rounded-2xl text-xl font-black hover:bg-slate-100 transition-all shadow-2xl shadow-blue-500/20"
          >
            Enter Portal / دخول الامتحان
          </Link>
          <div className="mt-20 pt-12 border-t border-slate-800 w-full flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <p>© 2026 OSCE Mentor AI • MUST University</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Safety</a>
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AboutItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex items-start gap-4">
    <div className="bg-blue-50 p-2 rounded-lg mt-1">
      <CheckCircle size={18} className="text-blue-600" />
    </div>
    <div>
      <h4 className="font-black text-slate-800 tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm font-medium">{desc}</p>
    </div>
  </div>
);

const VisualCard = ({ icon, label }: { icon: React.ReactElement, label: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3">
    <div className="p-3 bg-slate-50 rounded-2xl">
      {React.cloneElement(icon, { size: 28 } as any)}
    </div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-left transition-all shadow-sm hover:shadow-2xl hover:shadow-slate-200/60"
  >
    <div className="mb-8 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-md leading-relaxed font-medium">{description}</p>
  </motion.div>
);
