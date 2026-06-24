import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Stethoscope, 
  User, 
  Award, 
  CreditCard, 
  Navigation,
  Sparkles, 
  CheckCircle, 
  Lock, 
  ShieldAlert,
  Sliders,
  DollarSign, 
  ListFilter, 
  Calendar,
  Info,
  Briefcase, 
  TrendingUp, 
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Trash2,
  Edit3,
  PlusCircle,
  FileSpreadsheet,
  Grid,
  Check,
  ChevronLeft,
  X,
  Send,
  PhoneCall,
  Video,
  FileAudio,
  AlertCircle,
  Shuffle,
  Activity,
  Mic,
  Settings,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Scissors,
  Baby,
  Heart
} from "lucide-react";
import { useStore } from "../store/useStore";
import { Case } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { OSCELogo } from "../components/OSCELogo";
import { QBankDashboard } from "../components/QBankDashboard";
import { 
  ascitesCase, 
  copdCase, 
  mitralCase, 
  mrarThalassemiaCase, 
  vsdCase, 
  asdmCase, 
  phtnTrRshfCase, 
  lungFibrosisCase, 
  fibrosisShoemakerCase 
} from "../data/cases";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    setCurrentUser,
    logoutUser, 
    setCurrentCase, 
    resetSession,
    usersList,
    paymentsList,
    submitPayment,
    verifyPayment,
    addCase,
    editCase,
    fetchAdminStats,
    theme,
    setTheme
  } = useStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    } else if (currentUser.isAdmin) {
      fetchAdminStats();
    }
  }, [currentUser]);

  // UI state
  const [activeMainView, setActiveMainView] = useState<"osce" | "qbank" | "analytics" | "subscription" | "settings">("osce");
  const [activeSpecialty, setActiveSpecialty] = useState<string>("internal_medicine");
  const [activeSubspecialty, setActiveSubspecialty] = useState<string>("gastroenterology");
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<Case | null>(null);
  const [authErrorModal, setAuthErrorModal] = useState<{ title: string; message: string } | null>(null);
  
  // Payment drawer
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  const [paymentPlanRequested, setPaymentPlanRequested] = useState<"BASIC PLAN" | "PREMIUM PLAN" | "PRO PLAN">("BASIC PLAN");
  const [transferMethod, setTransferMethod] = useState<"Vodafone Cash" | "InstaPay">("Vodafone Cash");
  const [senderMobile, setSenderMobile] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshotNote, setScreenshotNote] = useState("");
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Admin section
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminTab, setAdminTab] = useState<"students" | "payments" | "stations">("students");

  useEffect(() => {
    if (currentUser?.isAdmin && isAdminView) {
      fetchAdminStats();
    }
  }, [isAdminView]);

  // Admin dynamic case creator state
  const [editingCaseObj, setEditingCaseObj] = useState<any | null>(null);
  const [isCaseEditorOpen, setIsCaseEditorOpen] = useState(false);

  // Random Case specialties selection state
  const [selectCardio, setSelectCardio] = useState(true);
  const [selectChest, setSelectChest] = useState(true);
  const [selectAbdomen, setSelectAbdomen] = useState(true);

  // Auto fallback to free plan if none exists
  const activePlan = currentUser?.plan || "FREE PLAN";

  if (!currentUser) return null;

  // Subscription statistics and counters
  const startedCount = currentUser?.startedCases?.length || 0;
  const remainingCount = currentUser?.credits ?? 0;
  const totalCasesForPlan = currentUser?.isAdmin
    ? 99999
    : activePlan === "PREMIUM PLAN"
    ? 400
    : activePlan === "PRO PLAN"
    ? 200
    : activePlan === "BASIC PLAN"
    ? 75
    : 0;

  const progressPercent = currentUser?.isAdmin
    ? 100
    : totalCasesForPlan > 0
    ? Math.min(100, Math.round((startedCount / totalCasesForPlan) * 100))
    : 0;

  const formatExpiryDate = (timestamp?: number) => {
    if (currentUser?.isAdmin) return "مفتوح (أدمن)";
    if (!timestamp || activePlan === "FREE PLAN") return "لا توجد باقة";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return "—";
    }
  };

  // Compile active cases available
  const coreCasesList = [
    { 
      ...ascitesCase, 
      id: "ascites-001",
      image: "https://images.unsplash.com/photo-1576091160555-217359f42f8c?auto=format&fit=crop&q=80&w=400",
      category: "internal_medicine",
      subcategory: "gastroenterology",
      planRequired: "BASIC PLAN",
      description: "Classical male patient presenting with progressive abdominal distension, mild jaundice, and history of liver disease."
    },
    {
      id: "hepato-001",
      name: "Hepatomegaly",
      specialty: "Gastroenterology",
      difficulty: "Easy" as const,
      time: "8 mins",
      category: "internal_medicine",
      subcategory: "gastroenterology",
      planRequired: "BASIC PLAN",
      image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400",
      patient: {
        name: "Abdelrahman Said",
        age: 52,
        gender: "Male",
        occupation: "Retired worker",
        chiefComplaint: "Dull ache in the right upper quadrant of my abdomen.",
        vitals: { bp: "120/80", hr: "78", rr: "16", temp: "37.1 C", oxygen: "98%" }
      },
      history: {
        presentIllness: "Patient reports right upper quadrant abdominal fullness growing for 3 months with mild fatigue.",
        pastHistory: "Diagnosed with fatty liver 5 years ago, hypertensive controlled.",
        drugHistory: "Metformin 500mg, Amlodipine 5mg.",
        familyHistory: "Negative for liver malignancies.",
        socialHistory: "No history of alcohol use."
      },
      examination: {
        inspection: "No prominent veins, liver span feels enlarged.",
        palpation: "Firm liver margin felt 4 cm below the costal margin on inspiration.",
        percussion: "Dullness over the right hypochondrium, liver span measured at 15 cm.",
        auscultation: "No hepatic bruits heard.",
        specialTests: [{ name: "Liver Span percussion", finding: "Span represents 15 cm in midclavicular line." }]
      },
      investigations: [
        { name: "Abdominal Ultrasound", result: "Enlarged liver with diffused echogenicity indicating fatty infiltration.", normalRange: "Normal size" }
      ],
      diagnosis: {
        provisional: "Hepatic steatosis / Fatty liver induced Hepatomegaly",
        differentials: ["Early hepatic cirrhosis", "Congestive hepatomegaly"],
        management: "Weight loss strategy, strict blood glucose regulation, and lipid panels checkup."
      },
      checklist: [
        { item: "Ask about duration of abdominal fullness", category: "History" },
        { item: "Measure liver span via percussion in the midclavicular line", category: "Examination" },
        { item: "Palpate liver border during deep inspiration", category: "Examination" }
      ],
      description: "Evaluate a middle-aged male presenting with heavy right hypochondrial dullness and hepatomegaly."
    },
    {
      id: "splenomegaly-001",
      name: "Splenomegaly Examination",
      specialty: "Gastroenterology",
      difficulty: "Medium" as const,
      time: "10 mins",
      category: "internal_medicine",
      subcategory: "gastroenterology",
      planRequired: "BASIC PLAN",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
      patient: {
        name: "Farida Mahmoud",
        age: 39,
        gender: "Female",
        occupation: "Teacher",
        chiefComplaint: "Early satiety and heaviness on the left side of my belly.",
        vitals: { bp: "115/75", hr: "84", rr: "18", temp: "36.8 C", oxygen: "99%" }
      },
      history: {
        presentIllness: "Complain of left hypochondrial discomfort and getting heavy/full very quickly after small meals.",
        pastHistory: "Treated for chronic malaria or parasitic fever years ago.",
        drugHistory: "Multivitamins only.",
        familyHistory: "Negative.",
        socialHistory: "Lives in rural Giza."
      },
      examination: {
        inspection: "Subtle fullness in left hypochondrial region.",
        palpation: "Splenic notch felt crossing the left costal margin.",
        percussion: "Dullness in Traube's space.",
        auscultation: "No bruits.",
        specialTests: [{ name: "Traube's Space Percussion", finding: "Stony dullness instead of expected resonant tympany" }]
      },
      investigations: [
        { name: "Complete Blood Count", result: "Hemoglobin 10.2 g/dL, Mild Thrombocytopenia.", normalRange: "Hb: 12-16" }
      ],
      diagnosis: {
        provisional: "Splenomegaly secondary to portal hypertension",
        differentials: ["IDAnemia with splenic sequestration", "Myeloproliferative disorder"],
        management: "Abdominal duplex scan, portal vein pressures, hematology workup."
      },
      checklist: [
        { item: "Inquire about early satiety during meals", category: "History" },
        { item: "Percuss Traube's space to diagnose splenomegaly", category: "Examination" },
        { item: "Palpate splenic notch starting from right iliac fossa", category: "Examination" }
      ],
      description: "Assess a female patient suffering from fullness on the left side, presenting with palpable splenic edge."
    },
    {
      id: "hepatospleno-001",
      name: "Hepatosplenomegaly (Bilharzial)",
      specialty: "Gastroenterology",
      difficulty: "Hard" as const,
      time: "12 mins",
      category: "internal_medicine",
      subcategory: "gastroenterology",
      planRequired: "BASIC PLAN",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
      patient: {
        name: "Mansour Hegazi",
        age: 61,
        gender: "Male",
        occupation: "Farmer",
        chiefComplaint: "Feeling very weak, with heavy swelling under both rib cages.",
        vitals: { bp: "110/70", hr: "88", rr: "20", temp: "37.3 C", oxygen: "97%" }
      },
      history: {
        presentIllness: "Chronic fatigue, abdominal fullness growing over years, history of Bilharziasis in youth.",
        pastHistory: "Received tartar emetic injections in childhood.",
        drugHistory: "Furosemide 20mg daily.",
        familyHistory: "Negative.",
        socialHistory: "Farmer working in agricultural canals in Menofia."
      },
      examination: {
        inspection: "Splenectomy scar absent, both hypochondrial regions appear slightly distended.",
        palpation: "Firm liver margin palpable 3cm below right costal costal line, splenic edge crosses left costal margin.",
        percussion: "Traube's space is dull, liver span is 16cm.",
        auscultation: "No audible venous hum."
      },
      investigations: [
        { name: "Stool Analysis", result: "Schistosoma mansoni calcified eggs detected.", normalRange: "Negative" }
      ],
      diagnosis: {
        provisional: "Hepatosplenomegaly secondary to Bilharzial periportal fibrosis",
        differentials: ["Liver Cirrhosis", "Lymphoma"],
        management: "Supportive therapy, liver function panels, strict surveillance for esophageal varices."
      },
      checklist: [
        { item: "Ask specifically about childhood exposure to canal water & Bilharziasis", category: "History" },
        { item: "Palpate both right and left upper quadrants", category: "Examination" }
      ],
      description: "An classic Nile Delta scenario of schistosomal periportal liver and spleen enlargement."
    },
    {
      id: "cld-001",
      name: "Chronic Liver Disease (CLD)",
      specialty: "Gastroenterology",
      difficulty: "Hard" as const,
      time: "15 mins",
      category: "internal_medicine",
      subcategory: "gastroenterology",
      planRequired: "PREMIUM PLAN",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
      patient: {
        name: "Mohamed Abdelwahab",
        age: 55,
        gender: "Male",
        occupation: "Accountant",
        chiefComplaint: "Severe hand tremors, yellowing of eyes, muscle wasting.",
        vitals: { bp: "115/65", hr: "92", rr: "21", temp: "37.5 C", oxygen: "96%" }
      },
      history: {
        presentIllness: "Presents with progressive jaundice, asterixis or hand flap, forgetfulness, and dark red palms.",
        pastHistory: "Known Hepatitis C sufferer, diagnosed 15 years ago.",
        drugHistory: "Lactulose syrup, Spironolactone 100mg.",
        familyHistory: "Negative.",
        socialHistory: "Non-smoker, married with children."
      },
      examination: {
        inspection: "Scleral jaundice, spider angiomata on chest, palmar erythema on hands, hepatic flap present.",
        palpation: "Liver is shrunken and non-palpable, spleen is enlarged.",
        percussion: "Resonant upper border, shifted dullness on sides.",
        auscultation: "No hepatic friction rub."
      },
      investigations: [
        { name: "Serum Bilirubin", result: "Total Bilirubin 4.2 mg/dL", normalRange: "0.2 - 1.2" },
        { name: "PT & INR", result: "INR 1.8", normalRange: "1.0 - 1.2" }
      ],
      diagnosis: {
        provisional: "Decompensated liver cirrhosis due to chronic HCV with hepatic encephalopathy",
        differentials: ["Acute on chronic liver failure", "Toxic hepatopathy"],
        management: "Lactulose titration, oral Neomycin, sodium restriction, liver transplant evaluation."
      },
      checklist: [
        { item: "Inquire about changes in sleep pattern or flapping tremors", category: "History" },
        { item: "Check for asterixis (flapping tremors) and palmar erythema", category: "Examination" }
      ],
      description: "Highly rigorous OSCE scenario testing decompensation signs: jaundice, palmar palms, and encephalopathy."
    },
    // Cardiology cases
    { 
      ...mitralCase, 
      id: "cardio-mitral",
      category: "internal_medicine",
      subcategory: "cardiology",
      planRequired: "PREMIUM PLAN"
    },
    { 
      ...mrarThalassemiaCase, 
      id: "cardio-mrar",
      category: "internal_medicine",
      subcategory: "cardiology",
      planRequired: "PREMIUM PLAN"
    },
    { 
      ...vsdCase, 
      id: "cardio-vsd",
      category: "internal_medicine",
      subcategory: "cardiology",
      planRequired: "PREMIUM PLAN"
    },
    { 
      ...asdmCase, 
      id: "cardio-asdm",
      category: "internal_medicine",
      subcategory: "cardiology",
      planRequired: "FREE PLAN"
    },
    { 
      ...phtnTrRshfCase, 
      id: "cardio-phtn",
      category: "internal_medicine",
      subcategory: "cardiology",
      planRequired: "PRO PLAN"
    },
    // Chest cases
    { 
      ...copdCase, 
      id: "chest-copd",
      category: "internal_medicine",
      subcategory: "chest",
      planRequired: "BASIC PLAN",
      description: "Egyptian heavy smoker presenting with dyspnea, barrel chest, and classic tracheal tug examination."
    },
    { 
      ...lungFibrosisCase, 
      id: "chest-lungfib",
      category: "internal_medicine",
      subcategory: "chest",
      planRequired: "BASIC PLAN"
    },
    { 
      ...fibrosisShoemakerCase, 
      id: "chest-shoemaker",
      category: "internal_medicine",
      subcategory: "chest",
      planRequired: "PREMIUM PLAN"
    }
  ];

  // Dynamic custom cases loaded from localStorage
  const getCustomCases = (): Case[] => {
    try {
      const customs = localStorage.getItem("osce-custom-cases");
      if (customs) {
        return JSON.parse(customs);
      }
    } catch (e){}
    return [];
  };

  const allActiveCases = [...coreCasesList, ...getCustomCases()];

  const handleStartOSCE = (c: Case, isBlind: boolean = false) => {
    // 1. Is this the free case?
    const isFreeCase = c.id === "cardio-asdm" || c.id === "AS*MR-001" || c.name.toLowerCase().includes("aortic stenosis") || c.name.toLowerCase().includes("as + mr");
    
    if (isFreeCase) {
      resetSession();
      setCurrentCase(c);
      if (isBlind) {
        useStore.setState({ isRandomBlind: true });
      }
      navigate("/station");
      return;
    }

    // 2. Access checks
    let allowed = false;
    if (currentUser.isAdmin) {
      allowed = true;
    } else {
      const userPlan = currentUser.plan || "FREE PLAN";
      const reqPlan = (c as any).planRequired || "BASIC PLAN";

      if (userPlan === "FREE PLAN") {
        allowed = false;
      } else if (userPlan === "BASIC PLAN") {
        allowed = (reqPlan === "BASIC PLAN" || reqPlan === "FREE PLAN");
      } else if (userPlan === "PRO PLAN") {
        allowed = (reqPlan !== "PREMIUM PLAN");
      } else if (userPlan === "PREMIUM PLAN") {
        allowed = true;
      }
    }

    if (!allowed) {
      setAuthErrorModal({
        title: "Clinical Station Restricted",
        message: `This station requires a ${(c as any).planRequired || "BASIC"} tier. Your current rank is ${currentUser.plan || "FREE PLAN"}. Upgrade instantly under the 'Billing' tab in the left sidebar!`
      });
      return;
    }

    resetSession();
    setCurrentCase(c);
    if (isBlind) {
      useStore.setState({ isRandomBlind: true });
    }
    navigate("/station");
  };

  const handleApplyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderMobile || !transactionId) {
      alert("Please key in your sender mobile and transaction ID.");
      return;
    }

    const res = await submitPayment({
      studentEmail: currentUser.email,
      studentName: currentUser.fullName,
      mobile: senderMobile,
      plan: paymentPlanRequested,
      amount: paymentPlanRequested === "BASIC PLAN" ? 150 : paymentPlanRequested === "PREMIUM PLAN" ? 300 : 500,
      method: transferMethod,
      screenshotText: screenshotNote ? `Screenshot: ${screenshotNote}` : `Simulated transaction screenshot reference: TRANS-${transactionId}`,
      transactionId: transactionId
    });

    if (res.success) {
      setPaymentSuccessMessage(`Your activation request for ${paymentPlanRequested} has been submitted! Our automated bank registrar is validating the Transaction ID: ${transactionId}. You can instantly approve it using the Admin Dashboard at the top header!`);
      // Clear fields
      setSenderMobile("");
      setTransactionId("");
      setScreenshotNote("");
    } else {
      alert(res.error || "Failed to submit payment submission ticket.");
    }
  };

  // Categories helper
  const specialties = [
    { id: "internal_medicine", name: "Internal Medicine", sub: "Medicine cases", icon: Stethoscope },
    { id: "surgery", name: "General Surgery", sub: "Surgical cases", icon: Scissors, isSoon: true },
    { id: "pediatrics", name: "Pediatrics", sub: "Pediatric cases", icon: Baby, isSoon: true },
    { id: "ob_gyn", name: "OBS & GYN", sub: "Maternity cases", icon: Heart, isSoon: true }
  ];

  const subspecialtiesMapping: Record<string, { id: string; name: string; icon: string }[]> = {
    internal_medicine: [
      { id: "gastroenterology", name: "Gastroenterology", icon: "🥯" },
      { id: "cardiology", name: "Cardiology", icon: "❤️" },
      { id: "chest", name: "Pulmonary", icon: "💨" }
    ]
  };

  const filteredCases = allActiveCases.filter((c: any) => 
    c.category === activeSpecialty && 
    (c.subcategory === activeSubspecialty || (activeSubspecialty === "cardiology" && c.subcategory === "cardio") || (activeSubspecialty === "chest" && c.subcategory === "chest"))
  );

  return (
    <div className="h-[100dvh] overflow-hidden bg-slate-950 flex font-sans text-slate-100 selection:bg-cyan-550/25 selection:text-cyan-200">
      
      {/* LEFT-DOCK SPATIAL SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-slate-950 flex flex-col justify-between p-5 shrink-0 z-20">
        <div className="space-y-6">
          <OSCELogo size="md" variant="white" className="px-1" />
          
          {/* Student Status Profile Badge */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-full bg-slate-900/60 border border-white/5 hover:border-white/10 hover:bg-white/5 p-4 rounded-xl space-y-3 relative overflow-hidden synoza-glass transition-all hover:scale-[1.01] active:scale-[0.99] text-left cursor-pointer group flex flex-col"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 text-slate-950 font-black flex items-center justify-center uppercase text-xs">
                    {currentUser.fullName.split(" ").map((w: any) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                    <p className="text-[9px] text-slate-400 truncate">ID: {currentUser.studentId}</p>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 group-hover:text-white transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between w-full">
                <span className="text-[8px] font-mono uppercase text-slate-400 tracking-wider">Active rank:</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                  activePlan === "PREMIUM PLAN" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                  activePlan === "PRO PLAN" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" :
                  activePlan === "BASIC PLAN" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" :
                  "bg-slate-800 text-slate-400 border border-white/5"
                }`}>
                  {activePlan.split(" ")[0]}
                </span>
              </div>
            </button>

            {/* Elegant Floating Profile Menu */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  {/* Click outside backdrop closer */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-24 left-0 w-full bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-50 synoza-glass space-y-4"
                  >
                    <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 text-slate-950 font-black flex items-center justify-center uppercase text-sm shrink-0">
                        {currentUser.fullName.split(" ").map((w: any) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-bold text-white truncate">{currentUser.fullName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                        <p className="text-[9px] text-slate-500 truncate font-mono">ID: {currentUser.studentId}</p>
                      </div>
                    </div>

                    {/* Theme Switcher inside Profile Menu */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-mono uppercase text-slate-500 tracking-wider text-left">Theme Preference</p>
                      <div className="grid grid-cols-3 gap-1 bg-slate-950/50 p-1 border border-white/5 rounded-xl">
                        <button
                          onClick={() => setTheme("light")}
                          className={`py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            theme === "light"
                              ? "bg-white/10 text-white"
                              : "text-slate-500 hover:text-white"
                          }`}
                          title="Light Mode"
                        >
                          <Sun size={12} className="transition-transform duration-500 hover:rotate-45" />
                          <span>Light</span>
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            theme === "dark"
                              ? "bg-white/10 text-white"
                              : "text-slate-500 hover:text-white"
                          }`}
                          title="Dark Mode"
                        >
                          <Moon size={12} className="transition-transform duration-500 hover:-rotate-12" />
                          <span>Dark</span>
                        </button>
                        <button
                          onClick={() => setTheme("system")}
                          className={`py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            theme === "system"
                              ? "bg-white/10 text-white"
                              : "text-slate-500 hover:text-white"
                          }`}
                          title="System Preference"
                        >
                          <Laptop size={12} className="transition-transform duration-300 hover:scale-110" />
                          <span>Sys</span>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 space-y-1 text-left">
                      <button
                        onClick={() => {
                          setActiveMainView("settings");
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg hover:bg-white/5 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Settings size={12} />
                        Calibration & settings
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-[11px] font-medium text-slate-400 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShieldAlert size={12} />
                        Sign out of Terminal
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Subscription Statistics Widget */}
          <div className="bg-slate-900/30 border border-white/5 p-3 rounded-xl space-y-2.5 synoza-glass">
            <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500">
              <span className="flex items-center gap-1">
                <CreditCard size={10} className="text-cyan-400" />
                Plan Status
              </span>
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[9px]">
                {currentUser.isAdmin ? "Admin" : activePlan.split(" ")[0]}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono uppercase text-[9px]">Used Cases</span>
                <span className="font-mono font-bold text-white">
                  {currentUser.isAdmin ? "∞" : `${startedCount} / ${totalCasesForPlan}`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono uppercase text-[9px]">Remaining</span>
                <span className="font-mono font-bold text-cyan-400">
                  {currentUser.isAdmin ? "∞" : remainingCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/[0.03]">
                <span className="text-slate-500 font-mono uppercase text-[9px] flex items-center gap-1">
                  <Calendar size={10} />
                  Expires
                </span>
                <span className="font-mono text-slate-400 font-bold text-[10px]">
                  {currentUser.isAdmin ? "Lifetime" : formatExpiryDate(currentUser.planExpiresAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tab Links */}
          <nav className="space-y-1.5">
            <p className="text-[9px] font-mono uppercase text-slate-500 tracking-widest px-2 mb-2">Simulation Engine</p>
            
            <button
              onClick={() => setActiveMainView("osce")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                activeMainView === "osce"
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Stethoscope size={16} className={activeMainView === "osce" ? "text-cyan-400" : "text-slate-400"} />
              OSCE Rotations
            </button>

            <button
              onClick={() => setActiveMainView("qbank")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                activeMainView === "qbank"
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileSpreadsheet size={16} className={activeMainView === "qbank" ? "text-cyan-400" : "text-slate-400"} />
              MCQ Q-Bank
            </button>

            <button
              onClick={() => setActiveMainView("analytics")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                activeMainView === "analytics"
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity size={16} className={activeMainView === "analytics" ? "text-cyan-400" : "text-slate-400"} />
              Diagnostics Dashboard
            </button>

            <button
              onClick={() => setActiveMainView("subscription")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                activeMainView === "subscription"
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <CreditCard size={16} className={activeMainView === "subscription" ? "text-cyan-400" : "text-slate-400"} />
              Upgrade Tier
            </button>

            <button
              onClick={() => setActiveMainView("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs font-bold transition-all text-left ${
                activeMainView === "settings"
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings size={16} className={activeMainView === "settings" ? "text-cyan-400" : "text-slate-400"} />
              Calibration / Settings
            </button>
          </nav>
        </div>

        {/* Logout container */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={() => logoutUser()}
            className="w-full py-2 px-3 text-slate-500 hover:text-red-400 text-xs font-semibold text-left transition-colors flex items-center gap-2"
          >
            <ShieldAlert size={14} />
            Sign out of Terminal
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 bg-slate-950/40">
        
        {/* TOP STATUS HEADER BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sm:px-8 bg-slate-950/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">SYNAPSE SERVER STATUS: SYSTEM OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Admin toggle console trigger */}
            {currentUser.isAdmin && (
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg border uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isAdminView 
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/10"
                    : "bg-slate-900 border-white/5 text-slate-300 hover:text-white"
                }`}
              >
                <Sliders size={12} />
                {isAdminView ? "Close Terminal" : "Launch Admin Room"}
                {paymentsList.some(p => p.status === "Pending") && (
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            )}

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-500 block">MUST Academic ROTATION 2026</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE VIEWS PORTAL */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          
          {/* Admin Terminal Overlay Panel */}
          <AnimatePresence mode="wait">
            {isAdminView && currentUser.isAdmin && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-slate-900/95 text-slate-100 rounded-2xl p-6 border border-cyan-500/20 shadow-2xl relative overflow-hidden mb-8 synoza-glass"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/5 gap-4">
                  <div>
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-mono uppercase tracking-widest rounded mb-1 inline-block">
                      Supervisor Root Console
                    </span>
                    <h2 className="text-lg font-bold text-white tracking-tight font-display">OSCE Hub Control Room</h2>
                    <p className="text-xs text-slate-400">Review student registrations, active plans, verify incoming payments, and calibrate OSCE clinical cases.</p>
                  </div>

                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-white/5">
                    <button 
                      onClick={() => setAdminTab("students")}
                      className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${adminTab === "students" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Students ({usersList.length})
                    </button>
                    <button 
                      onClick={() => setAdminTab("payments")}
                      className={`px-2.5 py-1 text-xs font-bold rounded relative transition-all ${adminTab === "payments" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Payments
                      {paymentsList.filter(p => p.status === "Pending").length > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                          {paymentsList.filter(p => p.status === "Pending").length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Admin Tab Contents */}
                <div className="pt-4 min-h-[160px]">
                  {adminTab === "students" && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Student Account Database</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead>
                            <tr className="border-b border-white/5 text-slate-500 font-mono text-[10px]">
                              <th className="py-2 font-bold uppercase">Full Name</th>
                              <th className="py-2 font-bold uppercase">Student ID</th>
                              <th className="py-2 font-bold uppercase">Active Plan</th>
                              <th className="py-2 font-bold uppercase text-right">Quick Elevate Rank</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {usersList.map((stu, i) => (
                              <tr key={i} className="hover:bg-white/5">
                                <td className="py-2.5 font-semibold text-white flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${stu.isAdmin ? 'bg-red-400' : 'bg-cyan-400'}`}></span>
                                  {stu.fullName}
                                </td>
                                <td className="py-2.5 font-mono text-slate-400">{stu.studentId}</td>
                                <td className="py-2.5">
                                  <span className="text-[9px] font-bold text-cyan-300">{stu.plan}</span>
                                </td>
                                <td className="py-2.5 text-right">
                                  <div className="inline-flex gap-1">
                                    {["FREE PLAN", "BASIC PLAN", "PRO PLAN", "PREMIUM PLAN"].map((planName) => (
                                      <button
                                        key={planName}
                                        onClick={async () => {
                                          await verifyPayment(`elev-mock-${Date.now()}`, "Approved");
                                          alert(`Student ${stu.fullName} has been instantly set to ${planName}!`);
                                          window.location.reload();
                                        }}
                                        className="px-1.5 py-0.5 bg-white/5 hover:bg-cyan-500 hover:text-slate-950 border border-white/5 text-[8px] font-bold rounded transition-colors"
                                      >
                                        {planName.split(" ")[0]}
                                      </button>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {adminTab === "payments" && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Incoming Payment Activation Tickets</h3>
                      {paymentsList.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4">No active payment tickets submitted yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead>
                              <tr className="border-b border-white/5 text-slate-500 font-mono text-[10px]">
                                <th className="py-2">Student Name</th>
                                <th className="py-2">Requested Plan</th>
                                <th className="py-2">Tx ID</th>
                                <th className="py-2">Status</th>
                                <th className="py-2 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {paymentsList.map((ticket, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                  <td className="py-2.5">
                                    <p className="font-bold text-white">{ticket.studentName}</p>
                                    <p className="text-[9px] text-slate-500">{ticket.studentEmail}</p>
                                  </td>
                                  <td className="py-2.5 text-cyan-400 font-bold">{ticket.plan}</td>
                                  <td className="py-2.5 font-mono text-slate-400">{ticket.transactionId}</td>
                                  <td className="py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                      ticket.status === "Approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                    }`}>{ticket.status}</span>
                                  </td>
                                  <td className="py-2.5 text-right">
                                    {ticket.status === "Pending" && (
                                      <button
                                        onClick={async () => {
                                          await verifyPayment(ticket.id, "Approved");
                                          alert("Ticket approved & student account activated!");
                                          window.location.reload();
                                        }}
                                        className="px-2 py-1 bg-cyan-500 text-slate-950 text-[10px] font-bold rounded hover:opacity-90 transition-all"
                                      >
                                        Verify & Activate
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. OSCE CASES TAB */}
          {activeMainView === "osce" && (
            <div className="space-y-8">
              
              {/* Free Case Block */}
              <section className="bg-gradient-to-r from-teal-500/10 to-cyan-500/5 border border-teal-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden synoza-glass">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex flex-col gap-3.5 items-start">
                  <div className="bg-teal-500/90 p-2.5 rounded-xl text-slate-950 shadow-lg shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="text-left">
                    <span className="px-2 py-0.5 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-[8px] font-mono uppercase tracking-widest rounded mb-2 inline-block">
                      Free Case Available
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-1.5 font-display">
                      AS + MR (Aortic Stenosis & Mitral Regurgitation) OSCE
                    </h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed max-w-lg mb-2">
                      A cardiorespiratory OSCE simulation comprising chest inspection, systolic thrill palpation, custom murmurs auscultation, and oral board evaluation.
                    </p>
                    <span className="text-[11px] text-teal-400/90 font-medium block">
                      Note: You can attempt this free demo case up to 3 times.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const asmrCaseObj = coreCasesList.find(c => c.id === "cardio-asdm") || coreCasesList[0];
                    handleStartOSCE(asmrCaseObj as any);
                  }}
                  className="px-5 py-3 bg-white text-[#030712] hover:bg-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                >
                  Start Free OSCE
                  <ChevronRight size={14} className="text-[#030712]" />
                </button>
              </section>

              {/* Blind Random OSCE Challenge Section */}
              <section className="bg-slate-900/30 border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white synoza-glass">
                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl text-left">
                    <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[9px] font-mono uppercase tracking-widest rounded-full inline-flex items-center gap-1.5">
                      <Shuffle size={12} className="text-cyan-400 animate-pulse" />
                      Randomized Board Challenge
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                        Blind Clinical Mock OSCE
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        Test your clinical and diagnostic skills in a fully randomized blind simulation. Select one or more departments below, and the system will generate a case for you without revealing the diagnosis to ensure ultimate clinical simulation and objective self-assessment.
                      </p>
                    </div>

                    {/* Specialty selection checkboxes */}
                    <div className="flex flex-wrap gap-2.5 pt-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectCardio(!selectCardio)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-bold text-xs select-none ${
                          selectCardio
                            ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                            : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectCardio}
                          onChange={() => {}} 
                          className="w-4 h-4 accent-cyan-500 pointer-events-none rounded"
                        />
                        <div className="text-left font-sans">
                          <span className="block leading-none text-white">Cardiology</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectChest(!selectChest)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-bold text-xs select-none ${
                          selectChest
                            ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                            : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectChest}
                          onChange={() => {}} 
                          className="w-4 h-4 accent-cyan-500 pointer-events-none rounded"
                        />
                        <div className="text-left font-sans">
                          <span className="block leading-none text-white">Pulmonary</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectAbdomen(!selectAbdomen)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-bold text-xs select-none ${
                          selectAbdomen
                            ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                            : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectAbdomen}
                          onChange={() => {}} 
                          className="w-4 h-4 accent-cyan-500 pointer-events-none rounded"
                        />
                        <div className="text-left font-sans">
                          <span className="block leading-none text-white">Gastroenterology</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const pool = [];
                      if (selectCardio) {
                        pool.push(...allActiveCases.filter(c => c.category === "internal_medicine" && c.subcategory === "cardiology"));
                      }
                      if (selectChest) {
                        pool.push(...allActiveCases.filter(c => c.category === "internal_medicine" && c.subcategory === "chest"));
                      }
                      if (selectAbdomen) {
                        pool.push(...allActiveCases.filter(c => c.category === "internal_medicine" && c.subcategory === "gastroenterology"));
                      }
                      
                      if (pool.length === 0) {
                        alert("⚠️ Please select at least one specialty department for the random OSCE!");
                        return;
                      }
                      
                      const randomIndex = Math.floor(Math.random() * pool.length);
                      const selectedCase = pool[randomIndex];
                      handleStartOSCE(selectedCase, true);
                    }}
                    className="px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-cyan-500/10"
                  >
                    <Shuffle size={14} />
                    Surprise me
                  </button>
                </div>
              </section>

              {/* Browse Specialties Horizontal list */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">Active Case Rotations</h3>
                    <p className="text-xs text-slate-400">Select clinical department below to filter available cases.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {specialties.map((spec) => {
                    const IconComponent = spec.icon;
                    return (
                      <button
                        key={spec.id}
                        disabled={spec.isSoon}
                        onClick={() => {
                          setActiveSpecialty(spec.id);
                          const subMapped = subspecialtiesMapping[spec.id] || [];
                          if (subMapped.length > 0) setActiveSubspecialty(subMapped[0].id);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-24 relative ${
                          spec.isSoon 
                            ? "bg-slate-900/20 border-white/5 opacity-40 cursor-not-allowed"
                            : activeSpecialty === spec.id
                              ? "bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/5"
                              : "bg-slate-900/70 border-white/10 text-slate-200 hover:bg-slate-900 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className={`p-1.5 rounded-lg ${
                            spec.isSoon
                              ? "bg-slate-800/40 text-slate-500"
                              : activeSpecialty === spec.id
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-slate-800 text-slate-400"
                          }`}>
                            <IconComponent size={16} />
                          </div>
                          {spec.isSoon && (
                            <span className="px-1 py-0.5 border border-white/15 text-slate-400 text-[6px] tracking-widest uppercase font-bold rounded">SOON</span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-white">{spec.name}</span>
                          <span className={`text-[10px] block leading-none mt-1.5 ${
                            activeSpecialty === spec.id ? "text-cyan-300 font-medium" : "text-slate-400"
                          }`}>{spec.sub}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Subspecialties horizontal list */}
                <div className="flex overflow-x-auto gap-2 pb-1 pt-1 scrollbar-hide">
                  {(subspecialtiesMapping[activeSpecialty] || []).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubspecialty(sub.id)}
                      className={`px-3.5 py-2 rounded-lg border font-bold text-xs shrink-0 transition-all cursor-pointer ${
                        activeSubspecialty === sub.id
                          ? "bg-cyan-500 text-slate-950 border-cyan-400"
                          : "bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <span className="mr-1.5">{sub.icon}</span>
                      {sub.name}
                    </button>
                  ))}
                </div>

                {/* Case Grid mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {filteredCases.map((cs) => {
                    const reqPlan = (cs as any).planRequired || "BASIC PLAN";
                    const isFree = cs.id === "cardio-asdm" || cs.id === "AS*MR-001" || cs.name.toLowerCase().includes("aortic stenosis") || cs.name.toLowerCase().includes("as + mr");
                    
                    let isLocked = false;
                    if (!isFree) {
                      if (activePlan === "FREE PLAN") {
                        isLocked = true;
                      } else if (activePlan === "BASIC PLAN") {
                        if (reqPlan !== "BASIC PLAN" && reqPlan !== "FREE PLAN") {
                          isLocked = true;
                        }
                      } else if (activePlan === "PRO PLAN") {
                        if (reqPlan === "PREMIUM PLAN") {
                          isLocked = true;
                        }
                      } else if (activePlan === "PREMIUM PLAN") {
                        isLocked = false;
                      }
                    }

                    return (
                      <div 
                        key={cs.id}
                        className="bg-slate-900/60 border border-white/5 hover:border-cyan-550/20 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group synoza-glass relative"
                      >
                        {/* Case Image */}
                        <div className="h-40 bg-slate-950 relative overflow-hidden">
                          <img 
                            src={(cs as any).image || "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400"} 
                            alt={cs.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white ${
                              cs.difficulty === "Easy" ? "bg-emerald-600" :
                              cs.difficulty === "Medium" ? "bg-amber-600" :
                              "bg-red-600"
                            }`}>
                              {cs.difficulty}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-950/90 text-slate-300 rounded text-[8px] font-mono font-bold flex items-center gap-1">
                              <Clock size={10} />
                              {cs.time}
                            </span>
                          </div>

                          {isLocked && (
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="bg-slate-900 p-2.5 rounded-full border border-white/5 shadow-xl">
                                <Lock size={16} className="text-amber-400" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider">{cs.specialty}</span>
                              {!isFree && (
                                <span className="px-1.5 py-0.5 bg-white/5 text-slate-400 border border-white/15 rounded text-[8px] font-bold uppercase">
                                  {reqPlan.split(" ")[0]} TIER
                                </span>
                              )}
                            </div>
                            
                            <h4 className="text-sm font-bold text-white tracking-tight mb-1.5 font-display">{cs.name}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {(cs as any).description || "Execute clinical history checks, physical diagnostics maneuvers, and complete real-time diagnostic reporting."}
                            </p>
                          </div>

                          <button
                            onClick={() => handleStartOSCE(cs as any)}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isLocked 
                                ? "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                                : "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:opacity-90 font-bold"
                            }`}
                          >
                            {isLocked ? (
                              <>
                                <Lock size={12} className="text-amber-500" />
                                Upgrade to {reqPlan.split(" ")[0]}
                              </>
                            ) : (
                              "Open Simulator"
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. Q-BANK TAB */}
          {activeMainView === "qbank" && (
            <QBankDashboard currentUser={currentUser} />
          )}

          {/* 3. DIAGNOSTICS & ANALYTICS TAB */}
          {activeMainView === "analytics" && (
            <div className="space-y-8 text-left max-w-4xl">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Diagnostics & Analytics</h2>
                <p className="text-xs text-slate-400">Review your automated history-taking speed, exam checklists performance, and board scores.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 synoza-glass">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Active OSCE Rotations</span>
                  <p className="text-2xl font-bold text-white font-display">
                    {currentUser.completedStations?.length || 0} <span className="text-xs text-slate-400">rotations</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">Completed high-fidelity simulated patient sessions</p>
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 synoza-glass">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">OSCE Average Grade</span>
                  <p className="text-2xl font-bold text-cyan-400 font-display">
                    84.5%
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">Based on diagnostic checklists validation</p>
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 synoza-glass">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">Clinical Reasoning Rate</span>
                  <p className="text-2xl font-bold text-indigo-400 font-display">
                    High <span className="text-xs text-slate-400">Grade</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">Deductions and management alignment</p>
                </div>
              </div>

              {/* History logs card */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-6 synoza-glass">
                <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4">Completed Clinical Rotations History</h3>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-white">AS + MR (Free Case Mockup)</h4>
                      <p className="text-[10px] text-slate-500">History: 90% | Exam: 82% | Diagnosis: 100%</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">Passed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">Abdominal Ascites Station</h4>
                      <p className="text-[10px] text-slate-500">History: 85% | Exam: 74% | Diagnosis: 85%</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">Passed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. BILLING & SUBSCRIPTION TAB */}
          {activeMainView === "subscription" && (
            <div className="space-y-8 text-left max-w-4xl">
              <div>
                <h2 className="text-xl font-bold font-display text-white">Upgrade Clinical Rank</h2>
                <p className="text-xs text-slate-400">Unlock fully loaded cardiology, gastroenterology, and chest stations with complete automated exam scorecards.</p>
              </div>

              {paymentSuccessMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs leading-relaxed">
                  {paymentSuccessMessage}
                </div>
              )}

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Basic Plan */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-72 synoza-glass relative">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">BASIC PLAN</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Perfect for standard clinical rotations</p>
                    <p className="text-xl font-black text-white mt-4 font-display">150 EGP <span className="text-xs font-normal text-slate-400">/ lifetime</span></p>
                    <ul className="text-[10px] text-slate-400 space-y-2 mt-4 font-semibold">
                      <li>• Unlock Abdominal Hepatomegaly & Splenomegaly</li>
                      <li>• Access Basic MCQ Q-Bank questions</li>
                      <li>• Automated history checklists</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentPlanRequested("BASIC PLAN");
                      setIsPaymentDrawerOpen(true);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all mt-4 cursor-pointer"
                  >
                    Upgrade to Basic
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-5 flex flex-col justify-between h-72 synoza-glass relative">
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-cyan-500 text-slate-950 font-black text-[7px] tracking-wider rounded uppercase">MOST POPULAR</span>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400 font-display">PRO PLAN</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Excellent for MUST midterm readiness</p>
                    <p className="text-xl font-black text-white mt-4 font-display">300 EGP <span className="text-xs font-normal text-slate-400">/ lifetime</span></p>
                    <ul className="text-[10px] text-slate-400 space-y-2 mt-4 font-semibold">
                      <li>• Unlock Pulmonary COPD & Thalassemia</li>
                      <li>• Access 150+ MCQ Bank questions</li>
                      <li>• Active audio auscultation maneuvers</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentPlanRequested("PRO PLAN");
                      setIsPaymentDrawerOpen(true);
                    }}
                    className="w-full py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition-all mt-4 cursor-pointer"
                  >
                    Upgrade to Pro
                  </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-72 synoza-glass relative">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">PREMIUM PLAN</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Ultimate comprehensive rotative access</p>
                    <p className="text-xl font-black text-white mt-4 font-display">500 EGP <span className="text-xs font-normal text-slate-400">/ lifetime</span></p>
                    <ul className="text-[10px] text-slate-400 space-y-2 mt-4 font-semibold">
                      <li>• Unlock CLD, Mitral and all advanced cases</li>
                      <li>• Unlimited MCQ Question sets</li>
                      <li>• Supervised OSCE Examiner feedback</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentPlanRequested("PREMIUM PLAN");
                      setIsPaymentDrawerOpen(true);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all mt-4 cursor-pointer"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. SETTINGS TAB */}
          {activeMainView === "settings" && (
            <div className="space-y-8 text-left max-w-2xl">
              <div>
                <h2 className="text-xl font-bold font-display text-white">System Calibration & Preferences</h2>
                <p className="text-xs text-slate-400">Configure your local microphones, system voice parameters, and customize workspace appearance.</p>
              </div>

              {/* Theme Preferences Card */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-6 synoza-glass">
                <div>
                  <h4 className="text-sm font-bold text-white font-display mb-1">Theme Customization</h4>
                  <p className="text-[11px] text-slate-400">Switch between light, dark, or system preferences. Redesigned elements and micro-interactions elevate your medical rotation training experience.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Light Mode Card */}
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${
                      theme === "light"
                        ? "bg-white/10 border-indigo-500 text-white shadow-lg"
                        : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4 transition-transform group-hover:rotate-45 duration-500 shrink-0">
                      <Sun size={18} />
                    </div>
                    <span className="text-xs font-bold block mb-1">Light Mode</span>
                    <span className="text-[10px] text-slate-400 leading-normal">Flagship high-contrast architectural experience.</span>
                    {theme === "light" && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    )}
                  </button>

                  {/* Dark Mode Card */}
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${
                      theme === "dark"
                        ? "bg-white/10 border-cyan-500 text-white shadow-lg"
                        : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 transition-transform group-hover:-rotate-12 duration-500 shrink-0">
                      <Moon size={18} />
                    </div>
                    <span className="text-xs font-bold block mb-1">Dark Mode</span>
                    <span className="text-[10px] text-slate-400 leading-normal">Cosmic dark space styled for night rotation study.</span>
                    {theme === "dark" && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    )}
                  </button>

                  {/* System Mode Card */}
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${
                      theme === "system"
                        ? "bg-white/10 border-purple-500 text-white shadow-lg"
                        : "bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 transition-transform group-hover:scale-110 duration-300 shrink-0">
                      <Laptop size={18} />
                    </div>
                    <span className="text-xs font-bold block mb-1">System Preference</span>
                    <span className="text-[10px] text-slate-400 leading-normal">Automatically follow device setting configurations.</span>
                    {theme === "system" && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Hardware Calibration Card */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4 synoza-glass">
                <div>
                  <h4 className="text-sm font-bold text-white font-display mb-1">Audio & Speech Capture</h4>
                  <p className="text-[11px] text-slate-400">Configure connected microphones and language recognition models.</p>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Mic className="text-cyan-400" size={16} />
                    <div>
                      <h4 className="text-xs font-bold text-white">Microphone Input Calibration</h4>
                      <p className="text-[10px] text-slate-500">Enable speech dialog capturing for active voice consultations</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-widest animate-pulse">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">Language Dialogue Channels</h4>
                    <p className="text-[10px] text-slate-500">Arabic-English bilingual clinical response parsing</p>
                  </div>
                  <span className="text-xs font-bold text-slate-300">Default (Bilingual)</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 6. RESTRICTED POPUP MODAL */}
      {authErrorModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/20 max-w-sm w-full rounded-2xl p-6 space-y-4 text-left synoza-glass">
            <div className="flex items-center gap-2 text-amber-400">
              <Lock size={18} />
              <h3 className="font-bold text-white font-display text-sm">{authErrorModal.title}</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">{authErrorModal.message}</p>
            <div className="flex gap-2.5 justify-end">
              <button 
                onClick={() => setAuthErrorModal(null)} 
                className="px-3 py-1.5 bg-white/5 text-slate-300 text-xs font-bold rounded-lg hover:bg-white/10"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setAuthErrorModal(null);
                  setActiveMainView("subscription");
                }} 
                className="px-3.5 py-1.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg"
              >
                Upgrade now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. EGYPTIAN CHECKOUT BILLING DRAWER */}
      <AnimatePresence>
        {isPaymentDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop click closer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentDrawerOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
            />

            {/* Slideable Checkout panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-slate-900 border-l border-white/5 h-full flex flex-col justify-between p-6 overflow-y-auto text-left synoza-glass"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-cyan-400 block">Synapse Checkout</span>
                    <h3 className="text-base font-bold text-white font-display">Upgrade to {paymentPlanRequested}</h3>
                  </div>
                  <button 
                    onClick={() => setIsPaymentDrawerOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Egyptian payment methods summary card */}
                <div className="bg-slate-950/80 border border-white/5 rounded-xl p-4 space-y-4 font-sans">
                  <div>
                    <h4 className="text-xs font-bold text-white">Egyptian Payment Channels</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Choose your wallet or transfer gateway:</p>
                  </div>

                  <div className="flex bg-slate-900 p-1 rounded-lg border border-white/5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTransferMethod("Vodafone Cash")}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded ${transferMethod === "Vodafone Cash" ? "bg-red-500/25 text-red-300 border border-red-500/30" : "text-slate-400"}`}
                    >
                      Vodafone Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferMethod("InstaPay")}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded ${transferMethod === "InstaPay" ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/30" : "text-slate-400"}`}
                    >
                      InstaPay
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-2">
                    {transferMethod === "Vodafone Cash" ? (
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Vodafone Wallet Number</span>
                        <p className="text-sm font-black text-white font-mono flex items-center justify-between">
                          01024328652
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("01024328652");
                              alert("Number copied! ارسل المبلغ إلى الرقم المنسوخ");
                            }}
                            className="text-[9px] text-cyan-400 hover:underline"
                          >
                            Copy wallet
                          </button>
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                          قم بتحويل مبلغ <strong className="text-cyan-300 font-bold">{paymentPlanRequested === "BASIC PLAN" ? "150" : paymentPlanRequested === "PREMIUM PLAN" ? "500" : "300"} جنيه</strong> إلى الرقم أعلاه عبر محفظة فودافون كاش.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">InstaPay Address</span>
                        <p className="text-sm font-black text-white font-mono flex items-center justify-between">
                          mahmoudnasser@instapay
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("mahmoudnasser@instapay");
                              alert("Instapay Address copied!");
                            }}
                            className="text-[9px] text-cyan-400 hover:underline"
                          >
                            Copy address
                          </button>
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                          قم بإرسال مبلغ <strong className="text-cyan-300 font-bold">{paymentPlanRequested === "BASIC PLAN" ? "150" : paymentPlanRequested === "PREMIUM PLAN" ? "500" : "300"} جنيه</strong> إلى العنوان الموضح أعلاه عبر تطبيق انستاباي.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form to submit ticket */}
                <form onSubmit={handleApplyPayment} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Sender Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="010XXXXXXXX" 
                      value={senderMobile}
                      onChange={(e) => setSenderMobile(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 focus:border-cyan-550/30 rounded-lg text-xs font-semibold text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Transaction ID (Tx ID)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 8192849184" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-white/5 focus:border-cyan-550/30 rounded-lg text-xs font-semibold text-white placeholder-slate-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Notes / Attachment details</label>
                    <textarea 
                      placeholder="Optional notes or screenshot text" 
                      value={screenshotNote}
                      onChange={(e) => setScreenshotNote(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-950 border border-white/5 focus:border-cyan-550/30 rounded-lg text-xs font-medium text-white placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    Submit Activation Ticket
                  </button>
                </form>
              </div>

              {/* Drawer footer */}
              <p className="text-[8px] font-mono uppercase text-slate-500 mt-6 tracking-widest text-center">
                Synoza Payments Gate • MUSTRotations
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
