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
  AlertCircle
} from "lucide-react";
import { useStore } from "../store/useStore";
import { Case } from "../types";
import { motion, AnimatePresence } from "motion/react";
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
    editCase
  } = useStore();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser]);

  // UI state
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

  // Admin dynamic case creator state
  const [editingCaseObj, setEditingCaseObj] = useState<any | null>(null);
  const [isCaseEditorOpen, setIsCaseEditorOpen] = useState(false);

  // Auto fallback to free plan if none exists
  const activePlan = currentUser?.plan || "FREE PLAN";

  if (!currentUser) return null;

  // Compile active cases available
  const coreCasesList = [
    { 
      ...ascitesCase, 
      id: "ascites-001",
      image: "https://images.unsplash.com/photo-1576091160555-217359f42f8c?auto=format&fit=crop&q=80&w=400",
      category: "internal_medicine",
      subcategory: "gastroenterology",
      planRequired: "FREE PLAN",
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
      planRequired: "PRO PLAN"
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

  const handleStartOSCE = (c: Case) => {
    // 1. Is this the free case?
    const isFreeCase = c.id === "ascites-001" || c.name.toLowerCase().includes("ascites");
    
    if (isFreeCase) {
      resetSession();
      setCurrentCase(c);
      navigate("/station");
      return;
    }

    // 2. Administrator override
    if (currentUser.isAdmin) {
      resetSession();
      setCurrentCase(c);
      navigate("/station");
      return;
    }

    // 3. Plan validity validation (expiration)
    const now = Date.now();
    const isExpired = currentUser.planExpiresAt && now > currentUser.planExpiresAt;
    
    if (isExpired) {
      setAuthErrorModal({
        title: "Subscription Validity Expired",
        message: `Your subscription plan (${currentUser.plan}) has expired. Unused credits expire when the plan validity ends. Please purchase or renew a subscription package to continue preparing.`
      });
      return;
    }

    if (activePlan === "FREE PLAN") {
      setAuthErrorModal({
        title: "Specialty Station Locked",
        message: "You are currently on the FREE PLAN, which grants access only to the Free Abdomen Ascites examination block. To practice this station, please select of one of our affordable EGP subscription packages below."
      });
      return;
    }

    // 4. Plan authorization constraints (Specialty Access)
    const requiredPlan = (c as any).planRequired || "BASIC PLAN";
    let isAuthorized = false;
    
    if (activePlan === "BASIC PLAN") {
      if (requiredPlan === "BASIC PLAN" || requiredPlan === "FREE PLAN") {
        isAuthorized = true;
      }
    } else if (activePlan === "PRO PLAN") {
      if (requiredPlan === "PRO PLAN" || requiredPlan === "BASIC PLAN" || requiredPlan === "FREE PLAN") {
        isAuthorized = true;
      }
    } else if (activePlan === "PREMIUM PLAN") {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      setAuthErrorModal({
        title: "Specialty Access Limited",
        message: `This station is calibrated for the ${requiredPlan}. Your current subscription status (${activePlan}) is insufficient. Please choose an upgrade from the package cards below.`
      });
      return;
    }

    // 5. Case Credit check & Deduction rules
    const isAlreadyStarted = currentUser.startedCases?.includes(c.id);
    
    if (!isAlreadyStarted) {
      const currentCredits = currentUser.credits ?? 0;
      if (currentCredits <= 0) {
        setAuthErrorModal({
          title: "Out of Case Credits",
          message: "You have used up all your active OSCE case credits (1 credit is deducted per newly started case). You can still continue reviewing your previously unlocked stations for free! To practice a new case, please upgrade or renew your plan below."
        });
        return;
      }

      // Deduct exactly 1 credit for new OSCE case
      const nextCredits = currentCredits - 1;
      const nextStartedCases = [...(currentUser.startedCases || []), c.id];
      
      const updatedActiveUser = {
        ...currentUser,
        credits: nextCredits,
        startedCases: nextStartedCases
      };

      // Sync globally
      const updatedUsersList = usersList.map((u) => {
        if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return updatedActiveUser;
        }
        return u;
      });

      useStore.setState({ usersList: updatedUsersList });
      localStorage.setItem("osce-users", JSON.stringify(updatedUsersList));
      setCurrentUser(updatedActiveUser);
    }

    // Enter the station!
    resetSession();
    setCurrentCase(c);
    navigate("/station");
  };

  const handleApplyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderMobile || !transactionId) {
      alert("Please key in your sender mobile and transaction ID.");
      return;
    }

    submitPayment({
      studentEmail: currentUser.email,
      studentName: currentUser.fullName,
      mobile: senderMobile,
      plan: paymentPlanRequested,
      amount: paymentPlanRequested === "BASIC PLAN" ? 150 : paymentPlanRequested === "PREMIUM PLAN" ? 300 : 500,
      method: transferMethod,
      screenshotText: screenshotNote ? `Screenshot: ${screenshotNote}` : `Simulated transaction screenshot reference: TRANS-${transactionId}`,
      transactionId: transactionId
    });

    setPaymentSuccessMessage(`Your activation request for ${paymentPlanRequested} has been submitted! Our automated bank registrar is validating the Transaction ID: ${transactionId}. You can instantly approve it using the Admin Dashboard at the top header!`);
    
    // Clear fields
    setSenderMobile("");
    setTransactionId("");
    setScreenshotNote("");
  };

  // Categories helper
  const specialties = [
    { id: "internal_medicine", name: "Internal Medicine", arabic: "الطب الباطني", color: "border-blue-200 text-blue-700 bg-blue-50" },
    { id: "surgery", name: "General Surgery", arabic: "الجراحة العامة", color: "border-red-200 text-red-700 bg-red-50", isSoon: true },
    { id: "pediatrics", name: "Pediatrics", arabic: "طب الأطفال", color: "border-emerald-200 text-emerald-700 bg-emerald-50", isSoon: true },
    { id: "ob_gyn", name: "OB / GYN", arabic: "النساء والتوليد", color: "border-amber-200 text-amber-700 bg-amber-50", isSoon: true }
  ];

  const subspecialtiesMapping: Record<string, { id: string; name: string; icon: string }[]> = {
    internal_medicine: [
      { id: "gastroenterology", name: "Gastroenterology (مستشفى الباطنة)", icon: "🩺" },
      { id: "cardiology", name: "Cardiology & Chest (أمراض القلب)", icon: "❤️" },
      { id: "chest", name: "Pulmonary & Respiratory (الصدرية)", icon: "💨" },
      { id: "endocrinology", name: "Endocrinology (الغدد الصماء)", icon: "🩸" },
      { id: "nephrology", name: "Nephrology (الكلى)", icon: "💧" }
    ]
  };

  const filteredCases = allActiveCases.filter((c: any) => 
    c.category === activeSpecialty && 
    (c.subcategory === activeSubspecialty || (activeSubspecialty === "cardiology" && c.subcategory === "cardio") || (activeSubspecialty === "chest" && c.subcategory === "chest"))
  );

  return (
    <div className="h-[100dvh] overflow-hidden bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-blue-100">
      
      {/* Dynamic Header Navbar */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">OSCE Mentor AI</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MUST University Rotations Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Admin Toggler button */}
          <button
            onClick={() => setIsAdminView(!isAdminView)}
            className={`px-4 py-2 text-xs font-black rounded-xl border uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isAdminView 
                ? "bg-slate-900 border-slate-900 text-white shadow-md"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sliders size={14} />
            {isAdminView ? "Exit Admin Panel" : "Admin Panel"}
            {paymentsList.some(p => p.status === "Pending") && (
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            )}
          </button>

          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-black text-slate-900 leading-tight block">{currentUser.fullName}</span>
            <span className="text-[9px] text-slate-400 font-bold tracking-tight block">ID: {currentUser.studentId} • {currentUser.email}</span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-black flex items-center justify-center shadow-inner uppercase">
            {currentUser.fullName.split(" ").map(w => w[0]).slice(0, 2).join("")}
          </div>

          <button 
            onClick={() => logoutUser()}
            className="text-xs text-red-600 hover:text-red-800 hover:underline font-bold transition-all p-1"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-10 space-y-10 overflow-y-auto">
        
        {/* Admin Dashboard Active UI Panel overlay */}
        <AnimatePresence mode="wait">
          {isAdminView && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full filter blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div>
                  <span className="px-3 py-1 bg-blue-900/40 border border-blue-800 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full inline-block mb-2">
                    Superuser Console
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight">OSCE Hub Control Room</h2>
                  <p className="text-xs text-slate-400">Review student registrations, active plans, verify incoming payments, and calibrate OSCE clinical cases/checklist metrics.</p>
                </div>

                <div className="flex gap-2 shrink-0 bg-slate-850 p-1.5 rounded-xl border border-slate-800">
                  <button 
                    onClick={() => setAdminTab("students")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${adminTab === "students" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Students ({usersList.length})
                  </button>
                  <button 
                    onClick={() => setAdminTab("payments")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg relative transition-all ${adminTab === "payments" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Payments
                    {paymentsList.filter(p => p.status === "Pending").length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                        {paymentsList.filter(p => p.status === "Pending").length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setAdminTab("stations")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${adminTab === "stations" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Stations & Assets
                  </button>
                </div>
              </div>

              {/* Admin Tab Contents */}
              <div className="pt-6 min-h-[220px]">
                
                {/* 1. Students Tab */}
                {adminTab === "students" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Registered Students Database</h3>
                      <span className="text-[10px] text-slate-550">Double-persistent JSON Collections</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2.5 font-bold uppercase tracking-wider">Full Name</th>
                            <th className="py-2.5 font-bold uppercase tracking-wider">Student ID</th>
                            <th className="py-2.5 font-bold uppercase tracking-wider">Credits</th>
                            <th className="py-2.5 font-bold uppercase tracking-wider">Expiry Date</th>
                            <th className="py-2.5 font-bold uppercase tracking-wider">Active Plan</th>
                            <th className="py-2.5 font-bold uppercase tracking-wider text-right">Instant Re-Plan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {usersList.map((stu, i) => (
                            <tr key={i} className="hover:bg-slate-850/50">
                              <td className="py-3 font-semibold text-white flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${stu.isAdmin ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                                {stu.fullName} {stu.isAdmin && <span className="text-[8px] border border-red-800 text-red-400 px-1 rounded uppercase font-black">Admin</span>}
                              </td>
                              <td className="py-3 font-mono text-slate-400">{stu.studentId}</td>
                              <td className="py-3 font-mono font-bold text-emerald-400">
                                {stu.isAdmin ? "Unlimited" : (stu.plan === "FREE PLAN" ? 0 : (stu.credits ?? 0))}
                              </td>
                              <td className="py-3 text-slate-400">
                                {stu.isAdmin ? "Lifetime" : (stu.plan === "FREE PLAN" ? "—" : (stu.planExpiresAt ? new Date(stu.planExpiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"))}
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  stu.plan === "PRO PLAN" ? "bg-cyan-950 text-cyan-400 border border-cyan-900" :
                                  stu.plan === "PREMIUM PLAN" ? "bg-amber-950 text-amber-400 border border-amber-900" :
                                  stu.plan === "BASIC PLAN" ? "bg-blue-950 text-blue-400 border border-blue-900" :
                                  "bg-slate-800 text-slate-400"
                                }`}>
                                  {stu.plan}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="inline-flex gap-1">
                                  {["FREE PLAN", "BASIC PLAN", "PRO PLAN", "PREMIUM PLAN"].map((planName) => (
                                    <button
                                      key={planName}
                                      onClick={() => {
                                        const cleanEmail = stu.email.toLowerCase();
                                        let planCredits = 0;
                                        let validityMs = 0;
                                        if (planName === "BASIC PLAN") {
                                          planCredits = 75;
                                          validityMs = 2 * 30 * 24 * 3600 * 1000;
                                        } else if (planName === "PRO PLAN") {
                                          planCredits = 200;
                                          validityMs = 4 * 30 * 24 * 3600 * 1000;
                                        } else if (planName === "PREMIUM PLAN") {
                                          planCredits = 400;
                                          validityMs = 6 * 30 * 24 * 3600 * 1000;
                                        }
                                        const now = Date.now();
                                        const planExpiresAt = planName === "FREE PLAN" ? 0 : now + validityMs;

                                        const updatedUsers = usersList.map((u) => {
                                          if (u.email.toLowerCase() === cleanEmail) {
                                            return { 
                                              ...u, 
                                              plan: planName as any,
                                              credits: planCredits,
                                              planActivatedAt: now,
                                              planExpiresAt: planExpiresAt,
                                              startedCases: u.startedCases || []
                                            };
                                          }
                                          return u;
                                        });
                                        useStore.setState({ usersList: updatedUsers });
                                        localStorage.setItem("osce-users", JSON.stringify(updatedUsers));
                                        
                                        // If active user updated
                                        if (currentUser.email.toLowerCase() === cleanEmail) {
                                          useStore.getState().setCurrentUser({ 
                                            ...currentUser, 
                                            plan: planName as any,
                                            credits: planCredits,
                                            planActivatedAt: now,
                                            planExpiresAt: planExpiresAt,
                                            startedCases: currentUser.startedCases || []
                                          });
                                        }
                                      }}
                                      className={`px-1.5 py-0.5 text-[8px] font-bold rounded hover:bg-slate-700 transition-colors uppercase ${
                                        stu.plan === planName ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-450"
                                      }`}
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

                {/* 2. Payments Tab */}
                {adminTab === "payments" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Vodafone & InstaPay Student Transfer Inbox</h3>
                    {paymentsList.length === 0 ? (
                      <p className="text-slate-500 text-xs">No payment notifications submitted yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {paymentsList.map((pay, i) => (
                          <div key={i} className="bg-slate-850 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-white">{pay.studentName}</span>
                                <span className="text-xs text-slate-500">({pay.studentEmail})</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  pay.status === "Approved" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" :
                                  pay.status === "Declined" ? "bg-red-950 text-red-400 border border-red-900" :
                                  "bg-amber-950 text-amber-400 border border-amber-900 animate-pulse"
                                }`}>
                                  {pay.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-normal">
                                Requested Plan: <strong className="text-blue-400">{pay.plan}</strong> • Transferring via <strong className="text-slate-200">{pay.method}</strong> from mobile <strong className="text-slate-200">{pay.mobile}</strong>
                              </p>
                              {pay.screenshotText && (
                                <p className="text-[11px] text-amber-400 font-mono mt-1 pt-1 border-t border-slate-800">
                                  {pay.screenshotText}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                Transaction ID: <span className="text-white bg-slate-800 px-1 py-0.2 rounded font-sans font-bold">{pay.transactionId}</span> • Submitted: {new Date(pay.timestamp).toLocaleString()}
                              </p>
                            </div>

                            {pay.status === "Pending" && (
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => verifyPayment(pay.id, "Approved")}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black uppercase transition-colors cursor-pointer"
                                >
                                  ✔ Approve & Auto-Activate
                                </button>
                                <button
                                  onClick={() => verifyPayment(pay.id, "Declined")}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-black uppercase transition-colors cursor-pointer"
                                >
                                  ✖ Decline Request
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Stations & Case Customizer Tab */}
                {adminTab === "stations" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Live Clinical Case Parameters Editor</h3>
                      <button
                        onClick={() => {
                          setEditingCaseObj({
                            id: `custom-${Date.now()}`,
                            name: "New Gastroenterology Station Variant",
                            specialty: "Gastroenterology",
                            difficulty: "Medium",
                            time: "10 mins",
                            category: "internal_medicine",
                            subcategory: "gastroenterology",
                            patient: {
                              name: "Sayed Aly",
                              age: 50,
                              gender: "Male",
                              occupation: "Civil servant",
                              chiefComplaint: "My belly is increasing in size, doctor.",
                              vitals: { bp: "120/80", hr: "80", rr: "16", temp: "37 C", oxygen: "98%" }
                            },
                            history: {
                              presentIllness: "Gradual belly swelling over 3 months, with mild lower limb edema.",
                              pastHistory: "Known Chronic Hepatitis B sufferer.",
                              drugHistory: "Takes Tenofovir regularly.",
                              familyHistory: "Negative.",
                              socialHistory: "Farmer origin."
                            },
                            examination: {
                              inspection: "No scars, mild distension.",
                              palpation: "Pleasant firm liver border palpable.",
                              percussion: "Traube's Space tympanic resonance preserved.",
                              auscultation: "No rubs audible."
                            },
                            investigations: [],
                            diagnosis: {
                              provisional: "Early Cirrhotic portal progression",
                              differentials: ["Fatty infiltration", "Liver mass"],
                              management: "Regular ultrasound screenings."
                            },
                            checklist: [
                              { item: "Ask about compliance with viral medication", category: "History" }
                            ]
                          } as any);
                          setIsCaseEditorOpen(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle size={14} /> Add Custom Station
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {allActiveCases.map((cs) => (
                        <div key={cs.id} className="bg-slate-850 p-4 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-white">{cs.name}</p>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest">{cs.specialty} • {cs.difficulty}</span>
                            <p className="text-[10px] text-slate-500 mt-1 italic max-w-sm truncate">{(cs as any).description || "Fully simulated clinical checkups"}</p>
                          </div>
                          
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingCaseObj(cs as any);
                                setIsCaseEditorOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-750 transition-colors"
                              title="Edit Case Attributes"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to restore or delete customization for other cases?`)) {
                                  // Find and delete from local custom lists if custom
                                  const customsStr = localStorage.getItem("osce-custom-cases") || "[]";
                                  const customs = JSON.parse(customsStr);
                                  const filtered = customs.filter((c: Case) => c.id !== cs.id);
                                  localStorage.setItem("osce-custom-cases", JSON.stringify(filtered));
                                  alert("Case config updated. Reload to apply!");
                                }
                              }}
                              className="p-1.5 bg-red-950/40 hover:bg-red-955 text-red-500 rounded border border-red-900 transition-colors"
                              title="Reset Custom Data"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Integrated dynamic asset upload mock helper */}
                    <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-900/60 p-4 rounded-2xl">
                      <div className="flex items-center gap-3 text-amber-500 mb-2">
                        <Video size={16} />
                        <h4 className="text-xs font-black uppercase tracking-wider">Multimedia Asset Portals (Mock Server Upload)</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">
                        Upload custom visual ultrasound findings, bronchial percussion audios (.mp3), or clinical video loops below to tie directly to cases.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-center cursor-pointer hover:border-blue-500 transition-all">
                          <PlusCircle size={18} className="mx-auto text-slate-500 mb-1" />
                          <p className="text-[10px] font-bold text-slate-200">Upload Chest Palpation Video</p>
                          <span className="text-[9px] text-slate-500">MPEG4, AVI, WEBM</span>
                        </div>
                        <div className="bg-slate-855 p-3 rounded-xl border border-slate-800 text-center cursor-pointer hover:border-blue-500 transition-all">
                          <FileAudio size={18} className="mx-auto text-slate-500 mb-1" />
                          <p className="text-[10px] font-bold text-slate-200">Upload Mitral Auscultation Audio</p>
                          <span className="text-[9px] text-slate-500">MP3, WAV Audio</span>
                        </div>
                        <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 text-center cursor-pointer hover:border-blue-500 transition-all">
                          <PlusCircle size={18} className="mx-auto text-slate-500 mb-1" />
                          <p className="text-[10px] font-bold text-slate-200">Upload Splenectomy Scar JPEG</p>
                          <span className="text-[9px] text-slate-500">High Resolution Visuals</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top welcome Section */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" />
              OSCE Training Workspace Live
            </span>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Ahlan Wa Sahlan, Dr. {currentUser.fullName.split(" ")[0]}!</h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                Ready for today's practical sessions? Select from 4 board categories, explore abdominal and chest palpations, and face interactive medical exam boards with real-time feedback.
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-slate-850 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-xl min-w-[250px]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
                <Award size={24} />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">CURRENT ACCESS RANK</span>
                <span className="font-mono text-base font-black text-white tracking-tight block uppercase">{activePlan}</span>
              </div>
            </div>

            {/* Credits and Expiry Info if not free/admin */}
            {activePlan !== "FREE PLAN" && !currentUser.isAdmin && (
              <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-semibold">Remaining Credits:</span>
                  {currentUser.planExpiresAt && Date.now() > currentUser.planExpiresAt ? (
                    <span className="font-bold text-red-500">0 (Expired)</span>
                  ) : (
                    <span className="font-mono font-bold text-emerald-400">
                      {currentUser.credits ?? 0} Case{(currentUser.credits ?? 0) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {currentUser.planExpiresAt && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-semibold">Plan Validity:</span>
                    {Date.now() > currentUser.planExpiresAt ? (
                      <span className="font-bold uppercase text-[9px] tracking-wider text-red-400">Expired</span>
                    ) : (
                      <span className="font-semibold text-slate-300 font-mono">
                        {new Date(currentUser.planExpiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-slate-800 pt-2.5">
              <button 
                onClick={() => {
                  setPaymentPlanRequested("BASIC PLAN");
                  setIsPaymentDrawerOpen(true);
                }}
                className="text-[10px] text-blue-400 font-bold hover:underline tracking-tight block transition-all text-left w-full cursor-pointer"
              >
                Change Rank / Upgrade Access →
              </button>
            </div>
          </div>
        </section>

        {/* Free Case Block */}
        <section className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="bg-emerald-500 p-3.5 rounded-2xl text-white shadow-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest rounded mb-1 inline-block">
                Free Case Available
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">Ascites Examination OSCE</h3>
              <p className="text-slate-500 text-xs leading-normal max-w-xl font-semibold">
                An complete mock case comprising history checkout, visual jaundice diagnosis, shifting dullness percussion testing, and a comprehensive oral examiner board response checking. Free to all students.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleStartOSCE(coreCasesList[0] as any)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1"
          >
            Start Free OSCE
            <ChevronRight size={14} />
          </button>
        </section>

        {/* Subscription section */}
        <section className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Upgrade Training Capabilities</h3>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">EGP Subscription Packages (تفعيل الاشتراكات)</h2>
            <p className="text-slate-500 text-xs font-semibold">Unlock highly specialized internal medicine cardiology arrays, general surgery clinical signs, and OB-GYN examination stations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PLAN 1 – BASIC CARD */}
            <div className="bg-white border border-slate-200 hover:border-slate-350 p-6 rounded-3xl flex flex-col justify-between space-y-6 transition-all shadow-sm relative group">
              {activePlan === "BASIC PLAN" && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">ACTIVE PLAN</span>
              )}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">PLAN 1 — ENTRY LEVEL</span>
                <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Basic</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">150</span>
                  <span className="text-xs font-semibold text-slate-400">EGP / 2 Months</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-blue-600 font-black tracking-wide uppercase">"75 Complete OSCE Cases"</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase font-mono">"Valid for 2 Months"</p>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {[
                    "75 Complete OSCE Cases",
                    "AI Simulated Patient",
                    "AI Examiner",
                    "Voice Interaction",
                    "Clinical Reasoning Training",
                    "Automated Feedback & Scoring"
                  ].map((f, i) => (
                    <div key={i} className="flex gap-2 items-start text-[11px] font-semibold text-slate-600">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono italic">
                    Usage Rule: One Case = One Credit. Max cases available: 75. Remaining credits expire when the plan validity ends.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPaymentPlanRequested("BASIC PLAN");
                  setIsPaymentDrawerOpen(true);
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Purchase Basic Plan
              </button>
            </div>

            {/* PLAN 2 – PRO CARD */}
            <div className="bg-white border-2 border-blue-600 p-6 rounded-3xl flex flex-col justify-between space-y-6 transition-all shadow-md relative group">
              <span className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-md animate-pulse">
                Most Popular
              </span>
              {activePlan === "PRO PLAN" && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">ACTIVE PLAN</span>
              )}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">PLAN 2 — CLINICAL STANDARD</span>
                <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">300</span>
                  <span className="text-xs font-semibold text-slate-400">EGP / 4 Months</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-blue-600 font-black tracking-wide uppercase">"200 Complete OSCE Cases"</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase font-mono">"Valid for 4 Months"</p>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {[
                    "200 Complete OSCE Cases",
                    "Everything included in Basic",
                    "Access to all specialties",
                    "Advanced Performance Tracking",
                    "Detailed Examiner Feedback"
                  ].map((f, i) => (
                    <div key={i} className="flex gap-2 items-start text-[11px] font-semibold text-slate-600">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono italic">
                    Usage Rule: One Case = One Credit. Max cases available: 200. Remaining credits expire when the plan validity ends.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPaymentPlanRequested("PRO PLAN");
                  setIsPaymentDrawerOpen(true);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-100"
              >
                Purchase Pro Plan
              </button>
            </div>

            {/* PLAN 3 – PREMIUM CARD */}
            <div className="bg-white border border-purple-200 hover:border-purple-350 p-6 rounded-3xl flex flex-col justify-between space-y-6 transition-all shadow-sm relative group">
              <span className="absolute -top-3 right-6 px-3 py-1 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md">
                Best Value
              </span>
              {activePlan === "PREMIUM PLAN" && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">ACTIVE PLAN</span>
              )}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-purple-650 uppercase tracking-widest block">PLAN 3 — UNLIMITED SPECIALIST</span>
                <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Premium</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">500</span>
                  <span className="text-xs font-semibold text-slate-400">EGP / 6 Months</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-purple-650 font-black tracking-wide uppercase">"400 Complete OSCE Cases"</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase font-mono">"Valid for 6 Months"</p>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  {[
                    "400 Complete OSCE Cases",
                    "Everything included in Pro",
                    "Full Platform Access",
                    "Extended Practice Capability",
                    "Comprehensive Analytics and Progress Monitoring"
                  ].map((f, i) => (
                    <div key={i} className="flex gap-2 items-start text-[11px] font-semibold text-slate-600">
                      <Check size={14} className="text-purple-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 font-mono italic">
                    Usage Rule: One Case = One Credit. Max cases available: 400. Remaining credits expire when the plan validity ends.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPaymentPlanRequested("PREMIUM PLAN");
                  setIsPaymentDrawerOpen(true);
                }}
                className="w-full py-3 bg-purple-900 hover:bg-purple-850 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-100"
              >
                Purchase Premium Plan
              </button>
            </div>

          </div>
        </section>

        {/* Specialties Categories Selector and Cascading Sub-Category Cards */}
        <section className="space-y-6 pt-4">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">OSCE Rotations Library</h3>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">Specialty Core Boards (التخصصات الطبية)</h2>
            <p className="text-slate-500 text-xs font-semibold">Browse clinical stations filtered by primary boards, secondary departments, and specific patient presentations.</p>
          </div>

          {/* Primary Specialty select board */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                onClick={() => {
                  if (spec.isSoon) {
                    alert(`${spec.name} is scheduled to launch shortly for cohort training! All current active simulations are configured in Internal Medicine.`);
                    return;
                  }
                  setActiveSpecialty(spec.id);
                  const subId = subspecialtiesMapping[spec.id]?.[0]?.id || "";
                  setActiveSubspecialty(subId);
                }}
                className={`p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[120px] ${
                  activeSpecialty === spec.id
                    ? "border-blue-600 text-slate-900 bg-white shadow-md shadow-blue-50/50"
                    : "border-slate-200 text-slate-600 bg-white hover:border-slate-350"
                }`}
              >
                <div className="flex md:items-start justify-between flex-row">
                  <div className="space-y-1.5">
                    <span className="text-sm font-black block tracking-tight">{spec.name}</span>
                    <span className="text-[11px] text-slate-400 block font-bold leading-none">{spec.arabic}</span>
                  </div>
                  {spec.isSoon && (
                    <span className="px-1.5 py-0.5 border border-slate-200 text-slate-400 bg-slate-50 text-[8px] tracking-widest uppercase font-black rounded shrink-0">SOON</span>
                  )}
                </div>
                <div className="flex justify-end pt-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs">
                    🩺
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Subspecialties horizontal list */}
          <div className="flex overflow-x-auto gap-3 pb-2 pt-2">
            {(subspecialtiesMapping[activeSpecialty] || []).map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubspecialty(sub.id)}
                className={`px-4 py-2.5 rounded-xl border font-bold text-xs shrink-0 tracking-tight transition-all cursor-pointer ${
                  activeSubspecialty === sub.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-350"
                }`}
              >
                <span className="mr-1.5">{sub.icon}</span>
                {sub.name}
              </button>
            ))}
          </div>

          {/* Render Cases matching filtration queries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((cs) => {
              const reqPlan = (cs as any).planRequired || "BASIC PLAN";
              const isFree = cs.id === "ascites-001" || cs.name.toLowerCase().includes("ascites");
              
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
                  className="bg-white border border-slate-200 hover:border-slate-350 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg relative group"
                >
                  
                  {/* Photo layout */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img 
                      src={(cs as any).image || "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400"} 
                      alt={cs.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white ${
                        cs.difficulty === "Easy" ? "bg-emerald-600" :
                        cs.difficulty === "Medium" ? "bg-amber-600" :
                        "bg-red-600"
                      }`}>
                        {cs.difficulty}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900/80 text-white rounded text-[8px] font-sans font-black flex items-center gap-1">
                        <Clock size={10} />
                        {cs.time}
                      </span>
                    </div>

                    {isLocked && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center">
                        <div className="bg-slate-900 text-white p-3 rounded-full border border-slate-800 shadow-xl">
                          <Lock size={18} className="text-amber-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body textuals */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 justify-between">
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{cs.specialty}</span>
                        {!isFree && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase tracking-tight">
                            {reqPlan.split(" ")[0]} TIER
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-base font-black text-slate-900 tracking-tight mb-1.5">{cs.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                        {(cs as any).description || "Perform standard clinical checking maneuvers, clinical presentations of symptoms, ultrasound reviews and interactive medical board response scoring."}
                      </p>
                    </div>

                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleStartOSCE(cs as any)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          isLocked 
                            ? "bg-slate-100 hover:bg-slate-205 text-slate-705 text-slate-900 border border-slate-200"
                            : "bg-slate-900 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock size={12} className="text-amber-500" />
                            Unlock with {reqPlan.split(" ")[0]} Plan
                          </>
                        ) : (
                          "Start OSCE Session"
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Egyptian Payment Drawer Portal (Simulated but fully responsive) */}
      <AnimatePresence>
        {isPaymentDrawerOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
            
            {/* Click backdrop to exit */}
            <div className="absolute inset-0" onClick={() => setIsPaymentDrawerOpen(false)}></div>
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white h-screen shadow-2xl relative z-10 flex flex-col justify-between overflow-y-auto"
            >
              
              <div className="p-6 border-b border-slate-150 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">EGP Subscription Activation Screen</h3>
                  <p className="text-xs text-slate-400">تفعيل الاشتراكات عبر فودافون كاش أو إنستا باي</p>
                </div>
                <button 
                  onClick={() => {
                    setIsPaymentDrawerOpen(false);
                    setPaymentSuccessMessage(null);
                  }} 
                  className="text-slate-400 hover:text-slate-750 p-1 bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main transfer Instructions and submission */}
              <div className="flex-1 p-6 space-y-6">
                
                {paymentSuccessMessage ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                      <Check size={24} />
                    </div>
                    <h4 className="text-emerald-800 font-bold text-sm">Transfer Request Notified Successfully!</h4>
                    <p className="text-xs text-emerald-700 leading-normal font-semibold">
                      {paymentSuccessMessage}
                    </p>
                    <div className="pt-4 border-t border-emerald-100 flex justify-center">
                      <button
                        onClick={() => {
                          setIsAdminView(true);
                          setAdminTab("payments");
                          setIsPaymentDrawerOpen(false);
                          setPaymentSuccessMessage(null);
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase transition-all"
                      >
                        ✔ Go Verify Now in Admin Console
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-600 text-white p-5 rounded-2xl border border-blue-500 space-y-2 shadow-xl">
                      <span className="text-[9px] font-black uppercase tracking-wider text-blue-200 block">TIER UPCOMING REQUISITION</span>
                      <h4 className="font-mono text-xl font-bold uppercase">{paymentPlanRequested}</h4>
                      <p className="text-xs text-blue-150 leading-relaxed font-semibold">
                        Amount Required: <strong className="text-white text-sm">
                          {paymentPlanRequested === "BASIC PLAN" ? "150 EGP (75 cases, 2 months)" : paymentPlanRequested === "PRO PLAN" ? "300 EGP (200 cases, 4 months)" : "500 EGP (400 cases, 6 months)"}
                        </strong>
                      </p>
                    </div>

                    {/* Transfer instructions */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1.5">
                        Instructions for Transfer (طرق التحويل والاشتراك)
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                          <span className="text-xs bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Transfer Fees via Vodafone Cash (فودافون كاش)</p>
                            <p className="text-[11px] text-slate-500">Beneficiary number: <strong className="text-slate-900 font-mono select-all">01024828652</strong></p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <span className="text-xs bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Transfer Fees via InstaPay (إنستا باي)</p>
                            <p className="text-[11px] text-slate-500">Digital account / phone number: <strong className="text-slate-900 font-mono select-all">01024828652</strong> or digital handle: <strong className="text-slate-900 font-mono select-all">01024828652@instapay</strong></p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submission Verification Form */}
                    <form onSubmit={handleApplyPayment} className="space-y-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Submit Transfer Verification</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Method Used</label>
                          <select 
                            value={transferMethod}
                            onChange={(e) => setTransferMethod(e.target.value as any)}
                            className="w-full bg-slate-5 border border-slate-200 p-2.5 rounded-xl text-base font-semibold focus:outline-none focus:border-blue-500"
                          >
                            <option value="Vodafone Cash">Vodafone Cash</option>
                            <option value="InstaPay">InstaPay</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Transfer Mobile/Wallet ID</label>
                          <input 
                            type="text"
                            placeholder="010XXXXXXXX"
                            value={senderMobile}
                            onChange={(e) => setSenderMobile(e.target.value)}
                            className="w-full bg-slate-5 border border-slate-200 p-2.5 rounded-xl text-base font-semibold focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Transaction Reference ID (رقم المعاملة)</label>
                        <input 
                          type="text"
                          placeholder="e.g. TXN2842194 or IPY294025"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-slate-5 border border-slate-200 p-2.5 rounded-xl text-base font-semibold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Transaction Screenshot details</label>
                          <span className="text-[9px] text-slate-400">Simulation drag-and-drop file path list</span>
                        </div>
                        <input 
                          type="text"
                          placeholder="Drag-and-drop or write (e.g. file_2129.jpg)"
                          value={screenshotNote}
                          onChange={(e) => setScreenshotNote(e.target.value)}
                          className="w-full bg-slate-5 border border-slate-200 p-2.5 rounded-xl text-base font-semibold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        ✔ Submit Activation Request / إرسال طلب تفعيل
                      </button>
                    </form>

                    {/* WhatsApp Fast links block */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                      <a 
                        href={`https://wa.me/201024828652?text=Hello%20OSCE%20Team%20I%20have%20sent%20the%20fees%20of%2520${paymentPlanRequested}%2520can%2520you%2520verify%2520my%2520ID%2520${currentUser.studentId}`} 
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
                      >
                        <Send size={14} /> Send via WhatsApp
                      </a>
                      <a 
                        href="https://t.me/must_osce_support" 
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-850 border border-sky-100 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
                      >
                        <Send size={14} /> Send via Telegram
                      </a>
                    </div>
                  </>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Case parameters customizer Modal popup for Admin */}
      <AnimatePresence>
        {isCaseEditorOpen && editingCaseObj && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-150 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">OSCE Case Configurator</h3>
                  <span className="text-xs text-slate-400">Modifying Station ID: {editingCaseObj.id}</span>
                </div>
                <button onClick={() => setIsCaseEditorOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Station Name</label>
                    <input 
                      type="text" 
                      value={editingCaseObj.name || ""} 
                      onChange={(e) => setEditingCaseObj({ ...editingCaseObj, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Specialty Discipline</label>
                    <input 
                      type="text" 
                      value={editingCaseObj.specialty || ""} 
                      onChange={(e) => setEditingCaseObj({ ...editingCaseObj, specialty: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Difficulty</label>
                    <select
                      value={editingCaseObj.difficulty || "Medium"}
                      onChange={(e) => setEditingCaseObj({ ...editingCaseObj, difficulty: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Timer settings</label>
                    <input 
                      type="text" 
                      value={editingCaseObj.time || ""} 
                      onChange={(e) => setEditingCaseObj({ ...editingCaseObj, time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Access Rank Required</label>
                    <select
                      value={(editingCaseObj as any).planRequired || "BASIC PLAN"}
                      onChange={(e) => setEditingCaseObj({ ...editingCaseObj, planRequired: e.target.value } as any)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    >
                      <option value="FREE PLAN">FREE PLAN</option>
                      <option value="BASIC PLAN">BASIC PLAN</option>
                      <option value="PREMIUM PLAN">PREMIUM PLAN</option>
                      <option value="PRO PLAN">PRO PLAN</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Brief case Description</label>
                  <textarea 
                    value={(editingCaseObj as any).description || ""} 
                    onChange={(e) => setEditingCaseObj({ ...editingCaseObj, description: e.target.value } as any)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold h-16"
                  />
                </div>

                {/* Patient sub-fields */}
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest pt-2 border-t border-slate-100">Patient Profile Details</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase">Name</label>
                    <input 
                      type="text" 
                      value={editingCaseObj.patient?.name || ""} 
                      onChange={(e) => {
                        const pat = editingCaseObj.patient || { name: "", age: 0, gender: "Male", occupation: "Accountant", chiefComplaint: "Tremor and jaundice", vitals: { bp: "120/80", hr: "80", rr: "18", temp: "37", oxygen: "98%" } };
                        setEditingCaseObj({ ...editingCaseObj, patient: { ...pat, name: e.target.value } });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase">Age</label>
                    <input 
                      type="number" 
                      value={editingCaseObj.patient?.age || 0} 
                      onChange={(e) => {
                        const pat = editingCaseObj.patient || { name: "", age: 0, gender: "Male", occupation: "Accountant", chiefComplaint: "Tremor and jaundice", vitals: { bp: "120/80", hr: "80", rr: "18", temp: "37", oxygen: "98%" } };
                        setEditingCaseObj({ ...editingCaseObj, patient: { ...pat, age: parseInt(e.target.value) || 0 } });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase">Chief Complaint</label>
                    <input 
                      type="text" 
                      value={editingCaseObj.patient?.chiefComplaint || ""} 
                      onChange={(e) => {
                        const pat = editingCaseObj.patient || { name: "", age: 0, gender: "Male", occupation: "Accountant", chiefComplaint: "Tremor and jaundice", vitals: { bp: "120/80", hr: "80", rr: "18", temp: "37", oxygen: "98%" } };
                        setEditingCaseObj({ ...editingCaseObj, patient: { ...pat, chiefComplaint: e.target.value } });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button 
                    onClick={() => setIsCaseEditorOpen(false)}
                    className="px-4 py-2 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!editingCaseObj.id || !editingCaseObj.name) return;
                      
                      // Check if it's new or existing
                      const customsStr = localStorage.getItem("osce-custom-cases") || "[]";
                      const customs = JSON.parse(customsStr);
                      const filtered = customs.filter((c: Case) => c.id !== editingCaseObj.id);
                      
                      // Push to local customs state
                      const updated = [...filtered, editingCaseObj as Case];
                      localStorage.setItem("osce-custom-cases", JSON.stringify(updated));
                      
                      setIsCaseEditorOpen(false);
                      alert("OSCE parameters saved successfully! Reload the dashboard list to see customized items.");
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase"
                  >
                    ✔ Save Case Parameters
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authErrorModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-650">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-550 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{authErrorModal.title}</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                {authErrorModal.message}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setAuthErrorModal(null);
                    // scroll to pricing section
                    const elements = document.getElementsByClassName("grid-cols-1 md:grid-cols-3");
                    if (elements.length > 0) {
                      elements[0].scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                >
                  View Plans
                </button>
                <button
                  onClick={() => setAuthErrorModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
