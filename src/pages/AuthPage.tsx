import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  School, 
  BookOpen, 
  CheckCircle,
  Eye, 
  EyeOff,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useStore } from "../store/useStore";
import { motion } from "motion/react";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser } = useStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login Fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Register Fields
  const [regFullName, setRegFullName] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regUniversity, setRegUniversity] = useState("Misr University for Science and Technology (MUST)");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all credentials.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginUser(loginEmail, loginPassword, rememberMe);
      if (res.success) {
        navigate("/");
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!regFullName || !regStudentId || !regUniversity || !regMobile || !regEmail || !regPassword || !regConfirmPassword) {
      setError("Please complete all registration fields.");
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Mobil Number validation
    if (!/^\d+$/.test(regMobile)) {
      setError("Please key in a valid Egyptian mobile number.");
      return;
    }

    const newUserObj = {
      fullName: regFullName,
      studentId: regStudentId,
      university: regUniversity,
      mobile: regMobile,
      email: regEmail,
      plan: "FREE PLAN" as const,
      isActivated: true
    };

    setIsLoading(true);
    try {
      const res = await registerUser(newUserObj, regPassword);
      if (res.success) {
        setIsLogin(true);
        setError("Registration successful! Please login with your new credentials.");
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
      } else {
        setError(res.error || "Registration failed. Email might already exist.");
      }
    } catch (err) {
      setError("An unexpected registration error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError("Please contact your administrator (Mahmoud) for password recovery.");
  };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-blue-100">
      {/* Visual Left Banner (MUST Branding & Value prop) */}
      <div className="lg:w-1/2 bg-slate-900 flex flex-col justify-between p-12 lg:p-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-900/30">
            <Stethoscope size={28} />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight block">OSCE Mentor AI</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
              Misr University for Science & Technology (MUST)
            </span>
          </div>
        </div>

        {/* Dynamic Center Banner */}
        <div className="my-16 lg:my-0 z-10 max-w-lg">
          <span className="px-3 py-1 bg-blue-950/80 border border-blue-900/60 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 mb-6">
            <Sparkles size={12} />
            Academic OSCE Simulation Platform
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tighter mb-6">
            Refine Your Clinical <br />
            Maneuvers with AI Patients
          </h1>
          <p className="text-slate-400 font-medium leading-relaxed mb-10 text-sm lg:text-base">
            Practice board-style clinical history dialogues, perform abdominal and chest maneuvers, analyze patient visual findings, and submit differential rationales to automated medical examiners.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/60 p-4 rounded-2xl">
              <CheckCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200">Interactive Oral Viva Simulator</p>
                <p className="text-[11px] text-slate-400">Authentic Egyptian medical licensing exam patterns led by rigorous examiner bots.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-800/60 p-4 rounded-2xl">
              <CheckCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-200">Rich Media & Auscultation Audios</p>
                <p className="text-[11px] text-slate-400">Examine high-contrast abdominal clinical signs, percussion tones, and bronchial wheezes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 font-medium z-10">
          © 2026 OSCE Mentor AI. Calibrated directly for MUST Clinical Rotations.
        </div>
      </div>

      {/* Auth Forms Right Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
              {isLogin ? "Welcome, Student!" : "Create Student Account"}
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              {isLogin 
                ? "Sign in to access your dashboard, clinical stations, and exam logs." 
                : "Register with your university credentials to begin training."
              }
            </p>
          </div>

          {error && (
            <div className={`p-4 rounded-2xl border mb-6 text-xs font-semibold leading-relaxed ${
              error.includes("successful") 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {error}
            </div>
          )}

          {/* Tab buttons */}
          <div className="flex border-b border-slate-100 mb-8 gap-6 justify-center lg:justify-start">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`pb-3 font-bold text-sm border-b-2 relative transition-all ${
                isLogin ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-800"
              }`}
            >
              Sign In / تسجيل دخول
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`pb-3 font-bold text-sm border-b-2 relative transition-all ${
                !isLogin ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-800"
              }`}
            >
              Register / إنشاء حساب طالب
            </button>
          </div>

          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-5">
            {isLogin ? (
              // LOGIN FORM
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      placeholder="student@must.edu.eg" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Password</label>
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-blue-500 font-bold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 border-slate-200 w-4.5 h-4.5"
                    />
                    <span className="text-xs font-semibold text-slate-500">Remember Me</span>
                  </label>
                </div>
              </>
            ) : (
              // REGISTER FORM 
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Mahmoud Ahmed" 
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Student ID (MUST)</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="MUST-2024-819" 
                        value={regStudentId}
                        onChange={(e) => setRegStudentId(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">University Name</label>
                  <div className="relative">
                    <School className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Misr University for Science and Technology (MUST)" 
                      value={regUniversity}
                      onChange={(e) => setRegUniversity(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input 
                        type="tel" 
                        placeholder="01024828652" 
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
                      <input 
                        type="email" 
                        placeholder="name@must.edu.eg" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Password</label>
                    <input 
                      type="password" 
                      placeholder="Minimum 6 characters" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Confirm Password</label>
                    <input 
                      type="password" 
                      placeholder="Repeat password" 
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-slate-900 border border-slate-850 hover:bg-slate-800 disabled:bg-slate-700 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-100 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Please wait...
                </>
              ) : (
                <>
                  {isLogin ? "Authenticate Account" : "Submit Student Application"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
