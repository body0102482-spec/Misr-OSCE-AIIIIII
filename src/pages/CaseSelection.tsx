import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  BarChart, 
  ChevronRight, 
  Stethoscope, 
  Scissors, 
  Baby, 
  Dna, 
  Droplets, 
  HeartPulse, 
  Wind, 
  User, 
  Flame, 
  Brain, 
  Zap, 
  Filter,
  Lock,
  Sparkles,
  Layers
} from "lucide-react";
import { motion } from "motion/react";
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
import { useStore } from "../store/useStore";

// Enrichment metadata mapping cases to categories and subcategories
const rawCases = [
  { 
    ...ascitesCase, 
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400",
    category: "internal_medicine",
    subcategory: "abdomen",
    locked: false
  },
  { 
    ...copdCase, 
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400", 
    category: "internal_medicine",
    subcategory: "chest",
    locked: false 
  },
  { 
    ...mitralCase, 
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400", 
    category: "internal_medicine",
    subcategory: "cardio",
    locked: false 
  },
  { 
    ...mrarThalassemiaCase, 
    image: "/Splenectomy Scar WITH HEPATOMEGLY.jpg",
    category: "internal_medicine",
    subcategory: "cardio",
    locked: false 
  },
  { 
    ...vsdCase, 
    image: "/CARDIAC INSPECTION.jpg",
    category: "internal_medicine",
    subcategory: "cardio",
    locked: false 
  },
  { 
    ...asdmCase, 
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400", 
    category: "internal_medicine",
    subcategory: "cardio",
    locked: false 
  },
  { 
    ...phtnTrRshfCase, 
    image: "/congested neck vein (1).jpg",
    category: "internal_medicine",
    subcategory: "cardio",
    locked: false 
  },
  { 
    ...lungFibrosisCase, 
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400", 
    category: "internal_medicine",
    subcategory: "chest",
    locked: false 
  },
  { 
    ...fibrosisShoemakerCase, 
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400", 
    category: "internal_medicine",
    subcategory: "chest",
    locked: false 
  }
];

// Aesthetic academic locked/soon educational cases for a complete clinical curriculum representation
const curriculumCases = [
  ...rawCases,
  // Internal -> Abdomen (Locked)
  {
    id: "hepato-001",
    name: "Hepatomegaly",
    specialty: "Gastroenterology",
    difficulty: "Easy" as const,
    time: "8 mins",
    category: "internal_medicine",
    subcategory: "abdomen",
    locked: true,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    description: "In-depth workup on hepatosplenomegaly, passive hepatic congestion, and portal hypertension signs."
  },
  // Internal -> Chest (Locked)
  {
    id: "pleural-001",
    name: "Pleural Effusion",
    specialty: "Respiratory",
    difficulty: "Hard" as const,
    time: "15 mins",
    category: "internal_medicine",
    subcategory: "chest",
    locked: true,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
    description: "Assessment of stony dull percussion, diminished tactile vocal fremitus, and diminished respiratory sound intensity."
  },
  // Internal -> General (Locked)
  {
    id: "general-001",
    name: "Severe Iron Deficiency Anemia",
    specialty: "General Medicine",
    difficulty: "Easy" as const,
    time: "10 mins",
    category: "internal_medicine",
    subcategory: "general",
    locked: true,
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400",
    description: "Clinical diagnostic exercises on severe pallor, koilonychia fingernails, angular stomatitis, and hemic murmurs."
  },
  // Internal -> Endocrine (Locked)
  {
    id: "endo-001",
    name: "Thyrotoxicosis (Graves' Disease)",
    specialty: "Endocrinology",
    difficulty: "Medium" as const,
    time: "12 mins",
    category: "internal_medicine",
    subcategory: "endocrine",
    locked: true,
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400",
    description: "Goiter inspection, palpation for continuous thrill or audible bruit, proptosis, and hyperthyroid dynamic tremor triggers."
  },
  // Internal -> Neuro (Locked)
  {
    id: "neuro-001",
    name: "Acute Stroke (UMN Hemiplegia)",
    specialty: "Neurology",
    difficulty: "Hard" as const,
    time: "15 mins",
    category: "internal_medicine",
    subcategory: "neuro",
    locked: true,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
    description: "Refining localized clinical reflexes, Babinski sign scoring, muscle tone spasticity grading, and cranial nerve maps."
  },
  // Internal -> Rheumatology (Locked)
  {
    id: "rheum-001",
    name: "Active Systemic Lupus (SLE)",
    specialty: "Rheumatology",
    difficulty: "Medium" as const,
    time: "12 mins",
    category: "internal_medicine",
    subcategory: "rheumatology",
    locked: true,
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400",
    description: "Inspecting classic malar butterfly rash, assessing subacute joint deformities, and exploring systemic markers."
  },
  // Internal -> Nephro (Locked)
  {
    id: "nephro-001",
    name: "Nephrotic Syndrome Assessment",
    specialty: "Nephrology",
    difficulty: "Medium" as const,
    time: "15 mins",
    category: "internal_medicine",
    subcategory: "nephro",
    locked: true,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    description: "Analysis of generalized anasarca, progressive periorbital edema, heavy proteinuria, and hypoalbuminemia."
  },
  // Surgery Category (All Locked)
  {
    id: "surg-001",
    name: "Acute Appendicitis Workup",
    specialty: "General Surgery",
    difficulty: "Easy" as const,
    time: "10 mins",
    category: "surgery",
    subcategory: "",
    locked: true,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    description: "Migratory abdominal pain, McBurney's point localized tenderness, rebound guarding, and psoas sign triggers."
  },
  {
    id: "surg-002",
    name: "Obstructive Jaundice Secondary to Cholelithiasis",
    specialty: "Hepatobiliary Surgery",
    difficulty: "Medium" as const,
    time: "12 mins",
    category: "surgery",
    subcategory: "",
    locked: true,
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400",
    description: "Charcot's high-fever triad, Courvoisier's law for palpable gallbladder, and icterus clinical scoring."
  },
  {
    id: "surg-003",
    name: "Obstructed Inguinal Hernia",
    specialty: "General Surgery",
    difficulty: "Hard" as const,
    time: "15 mins",
    category: "surgery",
    subcategory: "",
    locked: true,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400",
    description: "Differential diagnosis on irreducible tender scrotal or groin swellings and mechanical intestinal obstruction."
  },
  // Pediatric Category (All Locked)
  {
    id: "ped-001",
    name: "Dehydration Severity in Gastroenteritis",
    specialty: "Pediatrics",
    difficulty: "Easy" as const,
    time: "10 mins",
    category: "pediatric",
    subcategory: "",
    locked: true,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
    description: "Evaluating clinical signs: sunken anterior fontanelle, dry oral mucosa, skin pinch elasticity, and mental state."
  },
  {
    id: "ped-002",
    name: "Tetralogy of Fallot (Cyanotic CHD)",
    specialty: "Pediatric Cardiology",
    difficulty: "Hard" as const,
    time: "15 mins",
    category: "pediatric",
    subcategory: "",
    locked: true,
    image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=400",
    description: "Assessing central cyanosis during crying, finger clubbing, and ejection murmur at mid-sternal borders."
  },
  // Obs & Gynae Category (All Locked)
  {
    id: "obsgy-001",
    name: "Preeclampsia with Severe Features",
    specialty: "Obstetrics",
    difficulty: "Medium" as const,
    time: "12 mins",
    category: "obs_gynae",
    subcategory: "",
    locked: true,
    image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=400",
    description: "Hypertension at 35 weeks gestation, checking hyperreflexia clonus, fronto-temporal headaches, and vision sparks."
  }
];

// Major Specialties with rich icons and translations
const MAJOR_CATEGORIES = [
  {
    id: "internal_medicine",
    nameEn: "INTERNAL MEDICINE",
    nameAr: "الباطنة والقلب",
    icon: Stethoscope,
    color: "blue", // theme color mapping
    bgActive: "bg-blue-50/70 text-blue-700 border-blue-500 shadow-blue-100",
    bgHover: "hover:bg-blue-50/30 text-slate-800 hover:text-blue-600 border-slate-200"
  },
  {
    id: "surgery",
    nameEn: "SURGERY",
    nameAr: "الجراحة العامة",
    icon: Scissors,
    color: "red",
    bgActive: "bg-red-50/70 text-red-700 border-red-500 shadow-red-100",
    bgHover: "hover:bg-red-50/30 text-slate-800 hover:text-red-600 border-slate-200"
  },
  {
    id: "pediatric",
    nameEn: "PEDIATRICS",
    nameAr: "طب الأطفال",
    icon: Baby,
    color: "emerald",
    bgActive: "bg-emerald-50/70 text-emerald-700 border-emerald-500 shadow-emerald-100",
    bgHover: "hover:bg-emerald-50/30 text-slate-800 hover:text-emerald-600 border-slate-200"
  },
  {
    id: "obs_gynae",
    nameEn: "OBS & GYNAE",
    nameAr: "النساء والتوليد",
    icon: Dna,
    color: "purple",
    bgActive: "bg-purple-50/70 text-purple-700 border-purple-500 shadow-purple-100",
    bgHover: "hover:bg-purple-50/30 text-slate-800 hover:text-purple-600 border-slate-200"
  }
];

// Internal Medicine Divisions with rich icons and translations
const SUB_CATEGORIES = [
  { id: "all", nameEn: "ALL", nameAr: "الكل", icon: Layers, color: "slate" },
  { id: "abdomen", nameEn: "ABDOMEN", nameAr: "البطن والهضمي", icon: Droplets, color: "sky" },
  { id: "cardio", nameEn: "CARDIO", nameAr: "أمراض القلب", icon: HeartPulse, color: "rose" },
  { id: "chest", nameEn: "CHEST", nameAr: "الأمراض الصدرية", icon: Wind, color: "teal" },
  { id: "general", nameEn: "GENERAL", nameAr: "الباطنة العامة", icon: User, color: "indigo" },
  { id: "endocrine", nameEn: "ENDOCRINE", nameAr: "الغدد والسكر", icon: Flame, color: "amber" },
  { id: "neuro", nameEn: "NEURO", nameAr: "المخ والأعصاب", icon: Brain, color: "violet" },
  { id: "rheumatology", nameEn: "RHEUMATOLOGY", nameAr: "الروماتيزم والمناعة", icon: Zap, color: "fuchsia" },
  { id: "nephro", nameEn: "NEPHRO", nameAr: "أمراض الكلى", icon: Filter, color: "emerald" }
];

export const CaseSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCase, resetSession } = useStore();
  
  // States to keep track of active selections
  const [selectedCategory, setSelectedCategory] = useState<string>("internal_medicine");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");

  const handleStartCase = (c: any) => {
    if (c.locked) return;
    resetSession();
    setCurrentCase(c);
    navigate("/station");
  };

  // Helper to count active (unlocked) cases in a specific subcategory
  const getSubcategoryActiveCount = (subId: string) => {
    if (subId === "all") {
      return curriculumCases.filter(c => c.category === "internal_medicine" && !c.locked).length;
    }
    return curriculumCases.filter(
      c => c.category === "internal_medicine" && c.subcategory === subId && !c.locked
    ).length;
  };

  // Helper to check if a subcategory has any items overall
  const getSubcategoryTotalCount = (subId: string) => {
    if (subId === "all") return curriculumCases.filter(c => c.category === "internal_medicine").length;
    return curriculumCases.filter(
      c => c.category === "internal_medicine" && c.subcategory === subId
    ).length;
  };

  // Filtering logic
  const filteredCases = curriculumCases.filter(c => {
    // Check main category
    if (c.category !== selectedCategory) return false;
    
    // Check subcategory if internal medicine is active and not 'all'
    if (selectedCategory === "internal_medicine" && selectedSubcategory !== "all") {
      return c.subcategory === selectedSubcategory;
    }
    
    return true;
  });

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 p-4 md:p-12 overflow-x-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-10 text-xs font-black uppercase tracking-wider group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>

        {/* Brand Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3">
              <Sparkles size={12} />
              Interactive OSCE Simulation
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
              Clinical Curriculum
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-semibold max-w-xl">
              Navigate structured clinical stations to master diagnostic logic, physical examination steps, and history taking.
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm">
              {curriculumCases.filter(c => !c.locked).length}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Available</p>
              <p className="text-sm font-black text-slate-800 leading-tight">Active Stations</p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Major Specialty Categories */}
        <div className="mb-8">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
            Select Medical Specialty / التخصص الطبي الرئيسي
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {MAJOR_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = selectedCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  id={`major-specialty-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    // Reset subcategory when switching major category
                    setSelectedSubcategory("all");
                  }}
                  className={`flex flex-col items-center md:items-start text-center md:text-left p-5 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                    isActive ? `${cat.bgActive} border-current scale-[1.02] shadow-xl` : `${cat.bgHover} bg-white`
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-3.5 rounded-2xl transition-all ${
                      isActive ? 'bg-white shadow-md shadow-slate-100' : 'bg-slate-50 group-hover:scale-115'
                    }`}>
                      <IconComp size={24} className="stroke-[2.2]" />
                    </div>
                    {isActive && (
                      <span className="hidden md:inline-block w-2.5 h-2.5 rounded-full bg-current animate-pulse md:mr-1" />
                    )}
                  </div>
                  
                  <span className="text-xs font-black uppercase tracking-wider mb-0.5">
                    {cat.nameEn}
                  </span>
                  <span className="text-[10px] font-bold opacity-75">
                    {cat.nameAr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Internal Medicine Divisions (Visible only when Internal Medicine is chosen) */}
        {selectedCategory === "internal_medicine" && (
          <div className="mb-12 p-6 md:p-8 bg-white border border-slate-200/80 rounded-[2.5rem] shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Stethoscope size={18} className="text-blue-500" />
                  Divisions of Internal Medicine / تقسيمات الباطنة
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Filter by subspecialty to focus your board review
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 self-start text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                9 active cases in cardio, chest & abdomen
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {SUB_CATEGORIES.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = selectedSubcategory === sub.id;
                const activeCount = getSubcategoryActiveCount(sub.id);
                const totalCount = getSubcategoryTotalCount(sub.id);
                
                // Color presets based on subcategory
                const activeColors: Record<string, string> = {
                  slate: "bg-slate-900 text-white border-slate-900 shadow-slate-200",
                  sky: "bg-sky-50 text-sky-700 border-sky-500 shadow-sky-100",
                  rose: "bg-rose-50 text-rose-700 border-rose-500 shadow-rose-100",
                  teal: "bg-teal-50 text-teal-700 border-teal-500 shadow-teal-100",
                  indigo: "bg-indigo-50 text-indigo-700 border-indigo-500 shadow-indigo-100",
                  amber: "bg-amber-50 text-amber-700 border-amber-500 shadow-amber-100",
                  violet: "bg-violet-50 text-violet-700 border-violet-500 shadow-violet-100",
                  fuchsia: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-500 shadow-fuchsia-100",
                  emerald: "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-emerald-100",
                };

                return (
                  <button
                    key={sub.id}
                    id={`sub-specialty-${sub.id}`}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all text-center relative group cursor-pointer ${
                      isSubActive 
                        ? `${activeColors[sub.color]} border-2 scale-[1.03] shadow-md` 
                        : "bg-slate-50/50 hover:bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <SubIcon size={16} className={`mb-2 stroke-[2.2] ${isSubActive ? '' : 'text-slate-400 group-hover:text-slate-700'}`} />
                    
                    <span className="text-[10px] font-black tracking-tight uppercase leading-none mb-1">
                      {sub.nameEn}
                    </span>
                    <span className="text-[8px] font-bold opacity-80 leading-none mb-2">
                      {sub.nameAr}
                    </span>

                    {/* Active dynamic count bubble */}
                    <div className="mt-auto">
                      {activeCount > 0 ? (
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold ${
                          isSubActive 
                            ? 'bg-current text-white bg-opacity-15' 
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {activeCount} {activeCount === 1 ? 'Case' : 'Cases'}
                        </span>
                      ) : totalCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center gap-0.5">
                          <Lock size={8} /> Soon
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full text-[7px] font-extrabold bg-slate-100 text-slate-400">
                          Soon
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Clinical Cases Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-850 uppercase tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-slate-500" />
              Available OSCE Cases ({filteredCases.length})
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Click any unlocked card to initiate critical feedback sequence
            </span>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200/85 rounded-[2.5rem] p-8 max-w-md mx-auto">
              <Lock size={40} className="mx-auto text-slate-300 mb-4" />
              <h4 className="text-lg font-black text-slate-700 mb-1">Station Division Coming Soon</h4>
              <p className="text-xs text-slate-400 font-medium">
                Our board-certified authors are actively preparing interactive clinical scenarios for this specific division.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCases.map((c: any, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  onClick={() => handleStartCase(c)}
                  className={`group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/80 transition-all cursor-pointer relative flex flex-col h-full ${
                    c.locked ? "grayscale opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {c.locked && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1.5px] flex items-center justify-center z-10">
                      <div className="bg-slate-900 border border-slate-850 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                        <Lock size={12} className="stroke-[3]" />
                        Coming Soon to OSCE App
                      </div>
                    </div>
                  )}

                  {/* Case Top Visual Cover */}
                  <div className="h-56 bg-slate-100 overflow-hidden relative">
                    <img 
                      src={c.image || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"} 
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700"
                    />
                    
                    {/* Specialty Indicator Badge */}
                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-sm shadow-md text-slate-800 rounded-full text-[9px] font-black uppercase tracking-wider border border-slate-100">
                        {c.specialty}
                      </span>
                      {c.subcategory && (
                        <span className="px-3 py-1 bg-slate-900 text-white shadow-md rounded-full text-[9px] font-black uppercase tracking-wider">
                          {c.subcategory}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Case Text Information Section */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {c.name}
                      </h4>
                    </div>
                    
                    <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed mb-6">
                      {c.description || `Clinical mock board OSCE assessment station for evaluating ${c.name.toLowerCase()} pathophysiology, physical checks, and differential reasoning.`}
                    </p>

                    {/* Bottom Metadata Indicators */}
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock size={14} className="stroke-[2.5]" />
                          <span className="text-[10px] font-black uppercase">{c.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <BarChart size={14} className="stroke-[2.5]" />
                          <span className="text-[10px] font-black uppercase">{c.difficulty}</span>
                        </div>
                      </div>
                      
                      {!c.locked && (
                        <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
