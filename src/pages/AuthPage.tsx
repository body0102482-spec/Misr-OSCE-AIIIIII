import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  School, 
  BookOpen, 
  Eye, 
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { useStore } from "../store/useStore";
import { motion } from "motion/react";
import { OSCELogo } from "../components/OSCELogo";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser, currentUser } = useStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
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

  // Load remembered credentials
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("remembered-email");
    const savedPass = localStorage.getItem("remembered-password");
    const savedRemember = localStorage.getItem("remember-me") === "true";
    
    if (savedRemember) {
      if (savedEmail) setLoginEmail(savedEmail);
      if (savedPass) setLoginPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all credentials.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("remembered-email", loginEmail);
      localStorage.setItem("remembered-password", loginPassword);
      localStorage.setItem("remember-me", "true");
    } else {
      localStorage.removeItem("remembered-email");
      localStorage.removeItem("remembered-password");
      localStorage.setItem("remember-me", "false");
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

    // Mobile Number validation
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
    <div className="h-[100dvh] w-full overflow-y-auto bg-slate-950 flex flex-col items-center justify-between py-8 px-6 sm:px-12 font-sans selection:bg-cyan-550/25 selection:text-cyan-200 text-slate-200 relative synoza-grid">
      
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none z-0" />

      {/* Header link */}
      <div className="w-full max-w-xl flex justify-between items-center relative z-10 shrink-0">
        <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-semibold transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Home page
        </Link>
        <Link to="/" className="hover:scale-[1.02] transition-transform">
          <OSCELogo size="md" variant="white" />
        </Link>
      </div>

      {/* Main glass box */}
      <div className="w-full max-w-xl bg-slate-900/60 border border-white/5 rounded-3xl p-6 sm:p-10 relative z-10 my-8 synoza-glass">
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-2 font-display">
            {isLogin ? "Medical Student Portal" : "Simulation Enlistment"}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            {isLogin 
              ? "Access MUST Clinical OSCE Stations & Q-Bank" 
              : "Register with credentials to launch clinical training."
            }
          </p>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className={`p-4 rounded-xl border border-white/5 mb-6 text-xs font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 flex items-center gap-2 ${
            error.includes("successful") 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Custom Tab triggers */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-white/5 mb-8 gap-1.5">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              isLogin ? "bg-white/10 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In / تسجيل دخول
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              !isLogin ? "bg-white/10 text-white shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account / حساب جديد
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-5">
          {isLogin ? (
            // LOGIN FORM
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-500" size={16} />
                  <input 
                    type="email" 
                    placeholder="student@must.edu.eg" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] text-cyan-400 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-slate-500" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-slate-950 text-cyan-500 focus:ring-0 w-4 h-4 transition-all"
                  />
                  <span className="text-xs font-semibold text-slate-400">Remember session credentials</span>
                </label>
              </div>
            </>
          ) : (
            // REGISTER FORM 
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Mahmoud Ahmed" 
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student ID</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-3.5 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="MUST-2026-819" 
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Affiliated University</label>
                <div className="relative">
                  <School className="absolute left-4 top-3.5 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    readOnly
                    value={regUniversity}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/20 border border-white/5 rounded-xl font-bold text-slate-500 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-500" size={16} />
                    <input 
                      type="tel" 
                      placeholder="01024328652" 
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-500" size={16} />
                    <input 
                      type="email" 
                      placeholder="name@must.edu.eg" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                  <input 
                    type="password" 
                    placeholder="Min. 6 chars" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Repeat password" 
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-cyan-550/30 rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:bg-slate-950 text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 disabled:bg-slate-800 text-slate-950 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer mt-6"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                Verifying account...
              </>
            ) : (
              <>
                {isLogin ? "Sign In to Terminal" : "Submit Clinical Enlistment"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <p className="mt-8 text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] text-center max-w-sm shrink-0">
        Synoza Medical Simulation Portal <br />
        OSCE Diagnostic Engine • MUST ROTATIONS
      </p>
    </div>
  );
};
