import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Brain, ClipboardCheck, ArrowRight, ShieldCheck, Activity, Sparkles, CheckCircle, Mic, Users, Database, Play, GraduationCap, School } from "lucide-react";
import { motion } from "motion/react";
import { OSCELogo } from "../components/OSCELogo";

const PARTNER_UNIVERSITIES = [
  { ar: "جامعة مصر للعلوم والتكنولوجيا", en: "Misr University for Science & Technology", code: "MUST" },
  { ar: "جامعة القاهرة", en: "Cairo University", code: "CU" },
  { ar: "جامعة عين شمس", en: "Ain Shams University", code: "ASU" },
  { ar: "جامعة الأزهر", en: "Al-Azhar University", code: "AZHAR" },
  { ar: "جامعة 6 أكتوبر", en: "6th of October University", code: "O6U" },
  { ar: "جامعة الإسكندرية", en: "Alexandria University", code: "ALEX" },
  { ar: "جامعة المنصورة", en: "Mansoura University", code: "MANS" },
  { ar: "الجامعة الحديثة للتكنولوجيا والمعلومات", en: "Modern University for Tech & Info", code: "MTI" },
  { ar: "جامعة الجلالة", en: "Galala University", code: "GU" },
  { ar: "جامعة بنها", en: "Benha University", code: "BU" },
  { ar: "جامعة الفيوم", en: "Fayoum University", code: "FAY" },
  { ar: "جامعة النهضة", en: "Nahda University", code: "NUB" }
];

export const LandingPage: React.FC = () => {
  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-950 selection:bg-cyan-500/25 selection:text-cyan-200 font-sans synoza-grid text-slate-200">
      
      {/* Immersive Glowing Backdrop Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="h-20 flex items-center justify-between px-6 sm:px-10 max-w-7xl mx-auto border-b border-white/5 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
        <OSCELogo size="md" variant="white" />
        <div className="flex items-center gap-6">
          <a href="#features" className="hidden sm:inline-block text-sm text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#about" className="hidden sm:inline-block text-sm text-slate-400 hover:text-white transition-colors">About</a>
          <Link 
            to="/auth" 
            className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-5 py-2 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95"
          >
            Student Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-20 sm:py-28 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          {/* Accent Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono shadow-md mb-8 uppercase tracking-widest synoza-badge">
            <Sparkles size={12} className="animate-pulse" />
            AI-Native Clinical Training OSCE Engine
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-display text-white mb-6 tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Building Clinical <br />
            <span className="synoza-gradient-text">Connections</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Synoza bridges the gap between medicine and technology. Practice natural voice history dialogues, execute virtual physical maneuvers, submit differential clinical rationales, and train with automated medical examiners.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/auth" 
              className="group bg-gradient-to-r from-teal-500 to-cyan-500 text-[#030712] px-8 py-4 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              Enter Training Center
              <ArrowRight size={18} className="text-[#030712] group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#about"
              className="bg-white/5 border border-white/5 hover:border-white/10 text-slate-300 px-8 py-4 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center"
            >
              Explore platform
            </a>
          </div>
        </motion.div>

        {/* Spatial UI Preview Screen */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 w-full max-w-5xl aspect-[16/9] bg-slate-900/60 rounded-[2rem] p-3 shadow-2xl relative overflow-hidden group border border-white/10 synoza-glass"
        >
          {/* Internal Ambient Light */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 rounded-full bg-cyan-500/10 blur-[60px] pointer-events-none"></div>
          
          <div className="h-full w-full rounded-[1.5rem] bg-slate-950/60 border border-white/5 flex flex-col justify-between overflow-hidden p-6 relative">
            
            {/* Mock Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                <span className="ml-2 font-semibold text-slate-400">STATION_SIMULATOR_V2</span>
              </div>
              <div className="flex items-center gap-4">
                <span>TIMER: 07:42</span>
                <span className="text-cyan-400 animate-pulse font-bold">• CONNECTED TO SIMULATED SYSTEM</span>
              </div>
            </div>

            {/* Mock Content */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 py-6 text-left">
              {/* Patient Card */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Simulated Patient</div>
                  <h4 className="font-bold text-white text-base">Ahmed Mansour</h4>
                  <p className="text-xs text-slate-400 mt-1">54yo Male presenting with progressive abdominal distension and jaundice.</p>
                </div>
                <div className="space-y-1.5 pt-4 border-t border-white/5 text-[10px] font-mono text-slate-400">
                  <div className="flex justify-between"><span>Vitals Temp:</span> <span className="text-amber-400">37.2°C</span></div>
                  <div className="flex justify-between"><span>Blood Pressure:</span> <span className="text-emerald-400">125/82</span></div>
                  <div className="flex justify-between"><span>Heart Rate:</span> <span className="text-indigo-400">76 bpm</span></div>
                </div>
              </div>

              {/* Chat Wave */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between md:col-span-2">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Interactive Voice Dialogue</div>
                  <div className="space-y-3 mt-2">
                    <p className="text-xs text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
                      <strong className="text-teal-400 font-bold">You (Intern):</strong> "How long have you noticed the swelling in your abdomen?"
                    </p>
                    <p className="text-xs text-slate-200 bg-cyan-950/20 p-2 rounded-lg border border-cyan-900/10">
                      <strong className="text-cyan-400 font-bold">Ahmed (Patient):</strong> "It started about 3 weeks ago, doctor. It gets tighter every day."
                    </p>
                  </div>
                </div>
                {/* Visualizer Wave */}
                <div className="h-10 flex items-end gap-1 px-4 py-2 bg-slate-950/80 rounded-lg border border-white/5 mt-4">
                  <div className="text-[10px] font-mono text-slate-500 mr-auto">Voice input enabled</div>
                  <div className="flex items-end gap-1.5 h-full">
                    <span className="w-1 bg-cyan-400 waveform-bar" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1 bg-cyan-400 waveform-bar animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 bg-indigo-400 waveform-bar" style={{ animationDelay: '0.5s' }} />
                    <span className="w-1 bg-teal-400 waveform-bar animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 bg-cyan-300 waveform-bar" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-100 group-hover:opacity-0 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-[#030712] flex items-center justify-center shadow-lg shadow-cyan-400/25">
                <Play size={24} className="ml-1 fill-[#030712] text-[#030712]" />
              </div>
            </div>

          </div>
        </motion.div>
      </main>

      {/* About & Branding Section */}
      <section id="about" className="py-24 border-y border-white/5 bg-slate-900/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-6 leading-tight">
                An Immersive Ecosystem <br />
                <span className="text-cyan-400">For Modern Clinical Minds</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                Synoza is designed by doctors, engineers, and clinical coordinators specifically to train medical students for complex OSCE stations. By simulating real-time dialogue and clinical interactions, we bring textbook cases to life.
              </p>
              <div className="space-y-5">
                <AboutItem 
                  title="Egyptian & International Cases" 
                  desc="Targeted scenarios matching top tier medical school curricula, emphasizing physical diagnostics and history rules." 
                />
                <AboutItem 
                  title="Clinical Reasoning Workspace" 
                  desc="Draft and structure diagnostic differentials, state your investigations rationale, and test clinical intuition." 
                />
                <AboutItem 
                  title="Voice & Text Simulation" 
                  desc="Interact naturally using text or live microphone capture. The patient responds with medical context and organic emotions." 
                />
              </div>
            </div>

            {/* Bento Style Visual Showcase */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <VisualCard icon={<Brain className="text-teal-400" />} label="Cognitive Modeling" desc="AI simulates patient personalities" />
                <VisualCard icon={<Mic className="text-indigo-400" />} label="Speech Analysis" desc="Real-time voice parsing" />
              </div>
              <div className="space-y-4">
                <VisualCard icon={<Activity className="text-cyan-400" />} label="Physical Maneuvers" desc="Percuss & auscultate patients" />
                <VisualCard icon={<ClipboardCheck className="text-emerald-400" />} label="Examiner Board" desc="Detailed performance scoring" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Core Platform Pillars / Features */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 text-center pb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">Next-Generation Pillars</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">Engineered to mimic professional hospital rotations with clinical precision.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Brain className="text-teal-400" size={24} />}
            title="Dynamic Patients"
            description="Patients react with realistic emotional responses. They only disclose crucial medical details if you construct logical questions."
          />
          <FeatureCard 
            icon={<Activity className="text-cyan-400" size={24} />}
            title="Digital Maneuvers"
            description="Perform tactile exams—such as superficial palpation, shifting dullness, or heart auscultation. Receive instant accurate anatomical findings."
          />
          <FeatureCard 
            icon={<ClipboardCheck className="text-indigo-400" size={24} />}
            title="Automated Board Grading"
            description="Our advanced medical examiner scores your performance on a rigorous rubric, delivering granular feedback on diagnostics and empathy."
          />
        </div>
      </section>

      {/* Partner Universities Section - Vertically stacked, smooth matching design */}
      <section className="py-24 border-t border-white/5 bg-slate-950/60 relative z-10">
        <div className="max-w-3xl mx-auto px-6 text-center pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-mono shadow-md mb-6 uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GraduationCap size={12} className="animate-pulse" />
            شراكاتنا الأكاديمية • Academic Partners
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Our Partner Universities
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed">
            المنصة والحلول الطبية الذكية المعتمدة والمعتمدة للتدريب العملي وتقييم اختبارات الـ OSCE لطلاب كليات الطب بالجامعات والمنشآت التعليمية الكبرى.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-6 flex flex-col gap-3.5">
          {PARTNER_UNIVERSITIES.map((uni, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.03, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.015, x: 4 }}
              className="bg-slate-900/30 hover:bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group synoza-glass cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* School Icon container resembling the screenshot */}
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/25 group-hover:border-cyan-500/40 transition-all duration-300">
                  <School size={20} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {uni.en}
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">
                    {uni.code} University Member
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-right border-t border-white/5 sm:border-none pt-2 sm:pt-0">
                <p className="text-sm sm:text-base font-bold text-slate-300 group-hover:text-white transition-colors font-sans">
                  {uni.ar}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col items-center text-center">
          <OSCELogo size="lg" variant="white" className="mb-6" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">Ready to master your clinical connection?</h3>
          <p className="text-slate-400 max-w-md text-xs sm:text-sm mb-10 leading-relaxed">
            Upgrade your medical competence with immersive AI-driven simulation. Designed to align with MUST clinical curriculum standards.
          </p>
          <Link 
            to="/auth" 
            className="group bg-white text-[#030712] hover:bg-slate-200 px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
          >
            Enter Clinical Center
            <ArrowRight size={18} className="text-[#030712] group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="mt-16 pt-10 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Synoza Engine • Medical Rotation Simulator</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Safety</a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">Rotations</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AboutItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex items-start gap-3">
    <div className="bg-cyan-500/10 p-1.5 rounded-lg mt-0.5 border border-cyan-500/20 shrink-0">
      <CheckCircle size={14} className="text-cyan-400" />
    </div>
    <div>
      <h4 className="font-bold text-slate-100 text-sm tracking-tight">{title}</h4>
      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const VisualCard = ({ icon, label, desc }: { icon: React.ReactElement, label: string, desc: string }) => (
  <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 flex flex-col text-left gap-3.5 synoza-glass">
    <div className="p-2 w-fit bg-white/5 rounded-xl border border-white/10">
      {React.cloneElement(icon, { size: 20 } as any)}
    </div>
    <div>
      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-0.5">{label}</span>
      <span className="text-xs text-slate-400 leading-relaxed font-semibold block">{desc}</span>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-slate-900/40 p-8 rounded-2xl border border-white/5 text-left transition-all hover:border-cyan-550/20 hover:bg-slate-900/60 synoza-glass"
  >
    <div className="mb-6 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-white">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-slate-400 text-xs leading-relaxed font-normal">{description}</p>
  </motion.div>
);
