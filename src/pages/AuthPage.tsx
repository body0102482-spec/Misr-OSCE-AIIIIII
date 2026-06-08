import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 font-sans selection:bg-blue-100">
      <Link to="/" className="flex items-center gap-3 mb-10 group transition-all">
        <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
          <Stethoscope size={24} />
        </div>
        <div>
          <span className="text-xl font-black text-slate-800 tracking-tight block leading-none">OSCE Mentor AI</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Back to Welcome / العودة للبداية</span>
        </div>
      </Link>

      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">
            {isLogin ? "Student Portal" : "Student Registration"}
          </h2>
          <p className="text-slate-500 text-sm font-semibold">
            {isLogin 
              ? "Sign in to access MUST clinical stations." 
              : "Register with your credentials to begin training."
            }
          </p>
        </div>

        {error && (
          <div className={`p-4 rounded-2xl border mb-8 text-xs font-semibold leading-relaxed animate-in fade-in slide-in-from-top-2 ${
            error.includes("successful") 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-red-50 border-red-100 text-red-700"
          }`}>
            {error}
          </div>
        )}

        {/* Tab buttons */}
        <div className="flex border-b border-slate-100 mb-8 gap-8 justify-center">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`pb-4 font-bold text-sm border-b-2 relative transition-all ${
              isLogin ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-800"
            }`}
          >
            Sign In / تسجيل دخول
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`pb-4 font-bold text-sm border-b-2 relative transition-all ${
              !isLogin ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-800"
            }`}
          >
            Register / إنشاء حساب
          </button>
        </div>

        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="space-y-6">
          {isLogin ? (
            // LOGIN FORM
            <>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    placeholder="student@must.edu.eg" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-5 h-5 transition-all"
                  />
                  <span className="text-sm font-semibold text-slate-600">Remember Me</span>
                </label>
              </div>
            </>
          ) : (
            // REGISTER FORM 
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Mahmoud Ahmed" 
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Student ID</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="MUST-2024-819" 
                      value={regStudentId}
                      onChange={(e) => setRegStudentId(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-wider">University</label>
                <div className="relative">
                  <School className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    readOnly
                    value={regUniversity}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-400 cursor-not-allowed text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      placeholder="01024328652" 
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      placeholder="name@must.edu.eg" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Password</label>
                  <input 
                    type="password" 
                    placeholder="Min. 6 chars" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Confirm</label>
                  <input 
                    type="password" 
                    placeholder="Repeat" 
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-base transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-[1.5rem] text-lg font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:translate-y-0 cursor-pointer mt-4"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                {isLogin ? "Authenticate Account" : "Submit Registration"}
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center max-w-sm">
        Misr University for Science and Technology <br />
        OSCE Simulator Engine • v2.0-Academic
      </p>
    </div>
  );
};
