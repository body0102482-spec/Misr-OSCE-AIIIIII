import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Clipboard, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store/useStore";
import { VoiceRecognition } from "../../components/VoiceRecognition";

interface ExamMessage {
  role: "student" | "examiner";
  content: string;
  timestamp: number;
}

export const ExaminationTab: React.FC = () => {
  const { currentCase, updateNotes, studentNotes, setQuotaExceeded } = useStore();

  if (!currentCase) return null;

  // Build list of all examination maneuvers
  const exams = [
    { id: "inspection", name: "Inspection", finding: currentCase.examination.inspection, image: currentCase.examination.inspectionImage, audio: currentCase.examination.inspectionAudio, video: currentCase.examination.inspectionVideo },
    { id: "palpation", name: "Palpation", finding: currentCase.examination.palpation, image: currentCase.examination.palpationImage, audio: currentCase.examination.palpationAudio, video: currentCase.examination.palpationVideo },
    { id: "percussion", name: "Percussion", finding: currentCase.examination.percussion, image: currentCase.examination.percussionImage, audio: currentCase.examination.percussionAudio, video: currentCase.examination.percussionVideo },
    { id: "auscultation", name: "Auscultation", finding: currentCase.examination.auscultation, image: currentCase.examination.auscultationImage, audio: currentCase.examination.auscultationAudio, video: currentCase.examination.auscultationVideo },
    ...(currentCase.examination.specialTests || []).map(t => {
      const sId = t.name.toLowerCase().replace(/\s/g, "-");
      return {
        id: sId,
        name: t.name,
        finding: t.finding,
        image: t.image,
        audio: t.audio,
        video: t.video
      };
    })
  ];

  // Active step in focus
  const [activeStepId, setActiveStepId] = useState<string>("inspection");
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Storage keys keyed by current case id
  const storageKeyChats = `osce-exam-chats-${currentCase.id}`;
  const storageKeyResolved = `osce-exam-resolved-${currentCase.id}`;

  // Initialize Chats state from localStorage or defaults
  const [stepChats, setStepChats] = useState<Record<string, ExamMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(storageKeyChats);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to parsed exam chats", e);
    }

    const initial: Record<string, ExamMessage[]> = {};
    exams.forEach(exam => {
      initial[exam.id] = [
        {
          role: "examiner",
          content: `I am evaluating your clinical ${exam.name}. Take a close look at the clinical presentation/images and tell me: what clinical signs do you note? (اكتب أو لاحظ ما تراه/تسمعه هنا بالإنجليزية أو العربية)`,
          timestamp: Date.now()
        }
      ];
    });
    return initial;
  });

  // Initialize resolved state from localStorage or defaults
  const [stepResolved, setStepResolved] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKeyResolved);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to parse exam resolution status", e);
    }

    const initial: Record<string, boolean> = {};
    exams.forEach(exam => {
      initial[exam.id] = false;
    });
    return initial;
  });

  // Keep state synchronized with localStorage
  useEffect(() => {
    localStorage.setItem(storageKeyChats, JSON.stringify(stepChats));
  }, [stepChats, storageKeyChats]);

  useEffect(() => {
    localStorage.setItem(storageKeyResolved, JSON.stringify(stepResolved));
  }, [stepResolved, storageKeyResolved]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stepChats, activeStepId]);

  const activeExam = exams.find(e => e.id === activeStepId) || exams[0];

  // Helper inside loop to append findings to student's OSCE log
  const appendFindingsToLog = (stepName: string, text: string) => {
    const lines = studentNotes.examination ? studentNotes.examination.split("\n") : [];
    const prefix = `- [${stepName}]: `;
    const existingLineIndex = lines.findIndex(l => l.startsWith(prefix));
    
    if (existingLineIndex !== -1) {
      lines[existingLineIndex] = `${prefix}${text}`;
    } else {
      lines.push(`${prefix}${text}`);
    }

    const updatedValue = lines.filter(l => l.trim() !== "").join("\n");
    updateNotes("examination", updatedValue);
  };

  const handleStepSelect = (stepId: string) => {
    setActiveStepId(stepId);
    setActiveImgIndex(0);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const studentText = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    // 1. Append Student Message
    const updatedChats = { ...stepChats };
    const newStudentMsg: ExamMessage = {
      role: "student",
      content: studentText,
      timestamp: Date.now()
    };
    updatedChats[activeStepId] = [...(updatedChats[activeStepId] || []), newStudentMsg];
    setStepChats(updatedChats);

    try {
      // 2. Query Examiner Node API
      const response = await fetch("/api/examine-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepName: activeExam.name,
          idealFinding: activeExam.finding,
          studentMessage: studentText,
          chatHistory: updatedChats[activeStepId].slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error("API error status: " + response.status);
      }

      const data = await response.json();
      if (data.quotaExceeded) {
        setQuotaExceeded(true);
      }

      // 3. Append Examiner Reply
      const finalChats = { ...updatedChats };
      finalChats[activeStepId] = [
        ...(finalChats[activeStepId] || []),
        {
          role: "examiner",
          content: data.text,
          timestamp: Date.now()
        }
      ];
      setStepChats(finalChats);

      if (data.isResolved) {
        setStepResolved(prev => ({ ...prev, [activeStepId]: true }));
        appendFindingsToLog(activeExam.name, activeExam.finding);
      }
    } catch (error) {
      console.warn("Examine API error, executing client fallback", error);
      
      const msg = studentText.toLowerCase();
      const sample = activeExam.finding.toLowerCase();

      const giveUpPhrases = [
        "don't know", "dont know", "no idea", "مش عارف", "منعرفش", "أنا مش عارف", "انقل", "skip", "next", 
        "that's all", "that is all", "أنا مش عارف", "انقل على", "that's it", "معرفش", "انقل على الخطوة التالية", "انقل للخطوة التالية", "مش عارفها"
      ];

      const isGiveUp = giveUpPhrases.some(phrase => msg.includes(phrase)) || msg.length < 2;

      let replyText = "";
      let resolveStep = false;

      if (isGiveUp) {
        replyText = `Alright, the findings for this step are: "${activeExam.finding}". Let us move to the next physical examination step.`;
        resolveStep = true;
      } else {
        const stopWords = new Set(["with", "then", "that", "this", "they", "them", "their", "your", "have", "some", "more", "less", "such", "were", "what", "when", "where", "which", "who", "whom", "will", "would", "shall", "should", "could", "might", "must", "been", "being", "have", "has", "had", "does", "done", "doing", "very", "much", "many", "most", "some", "such", "only", "same", "so", "than", "too", "very", "can", "cannot", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "before", "between", "both", "but", "by", "for", "from", "further", "here", "how", "if", "in", "into", "is", "it", "its", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"]);
        const sampleWords = sample
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .split(/\s+/)
          .filter(w => w.length > 4 && !stopWords.has(w));

        let matchCount = 0;
        for (const word of sampleWords) {
          if (msg.includes(word)) {
            matchCount++;
          }
        }

        const matchRatio = sampleWords.length > 0 ? matchCount / sampleWords.length : 0;

        if (matchCount >= 2 || matchRatio >= 0.25) {
          replyText = `Excellent. You identified key findings correctly: "${activeExam.finding}".`;
          resolveStep = true;
        } else if (matchCount >= 1 || msg.length > 15) {
          replyText = `Good, what else do you observe? Can you expand on that? There is more you can note.`;
          resolveStep = false;
        } else {
          replyText = `Not quite correct. Try again, or say "I don't know" to reveal the expected findings.`;
          resolveStep = false;
        }
      }

      const finalChats = { ...updatedChats };
      finalChats[activeStepId] = [
        ...(finalChats[activeStepId] || []),
        {
          role: "examiner",
          content: replyText,
          timestamp: Date.now()
        }
      ];
      setStepChats(finalChats);

      if (resolveStep) {
        setStepResolved(prev => ({ ...prev, [activeStepId]: true }));
        appendFindingsToLog(activeExam.name, activeExam.finding);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipOrUnknown = () => {
    setInputValue("I don't know");
    setTimeout(() => {
      // Programmatically trigger a submit using a pseudo-form element style
      const btn = document.getElementById("send-step-btn");
      if (btn) btn.click();
    }, 100);
  };

  const handleNextStep = () => {
    const currentIndex = exams.findIndex(ex => ex.id === activeStepId);
    if (currentIndex !== -1 && currentIndex < exams.length - 1) {
      const nextStep = exams[currentIndex + 1];
      setActiveStepId(nextStep.id);
      setActiveImgIndex(0);
    }
  };

  const handleResetDialogues = () => {
    if (confirm("Are you sure you want to reset physical examination chats? This will wipe your dialog state for this case.")) {
      localStorage.removeItem(storageKeyChats);
      localStorage.removeItem(storageKeyResolved);
      
      const resetChats: Record<string, ExamMessage[]> = {};
      exams.forEach(exam => {
        resetChats[exam.id] = [
          {
            role: "examiner",
            content: `I am evaluating your clinical ${exam.name}. Take a close look at the presentation, images, or findings below and tell me: what clinical signs do you note? (اكتب أو لاحظ ما تراه/تسمعه هنا بالإنجليزية أو العربية)`,
            timestamp: Date.now()
          }
        ];
      });
      setStepChats(resetChats);

      const resetResolved: Record<string, boolean> = {};
      exams.forEach(exam => {
        resetResolved[exam.id] = false;
      });
      setStepResolved(resetResolved);
    }
  };

  const activeStepMessages = stepChats[activeStepId] || [];
  const isActiveStepResolved = stepResolved[activeStepId] || false;

  // Render Image and Video of Active Exam Step
  const renderImageCarousel = () => {
    const hasImage = !!activeExam.image;
    const hasVideo = !!activeExam.video;

    if (!hasImage && !hasVideo) {
      return (
        <div className="rounded-2xl border border-slate-200/50 p-6 bg-slate-50 text-center flex flex-col items-center">
          <p className="text-slate-600 font-bold text-sm mb-1 leading-relaxed">
            Clinical Diagnostic Maneuver
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold max-w-sm">
            This is a tactile, acoustic or manual maneuver technique (Palpation, Percussion, Auscultation, or Special Tests). Query the examiner in the dialogue box below for specific tactile sensations, percussion sounds, tenderness margins, or acoustic findings.
          </p>
        </div>
      );
    }

    const videoUrls = hasVideo ? activeExam.video!.split(",").map(url => url.trim()).filter(Boolean) : [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoUrls.map((videoUrl, index) => {
          let label = `${activeExam.name} Video Demonstration`;
          if (videoUrl.toLowerCase().includes("liver")) {
            label = "Liver Palpation (فحص الكبد)";
          } else if (videoUrl.toLowerCase().includes("spleen")) {
            label = "Spleen Palpation (فحص الطحال)";
          } else if (videoUrl.toLowerCase().includes("fluid")) {
            label = "Fluid Thrill (فحص الارتشاح المائي)";
          } else if (videoUrl.toLowerCase().includes("kidney")) {
            label = "Bimanual Kidney Palpation (فحص الكلى)";
          } else if (videoUrl.toLowerCase().includes("shifting") || videoUrl.toLowerCase().includes("shiftting")) {
            label = "Shifting Dullness (فحص الاستسقاء)";
          } else if (videoUrl.toLowerCase().includes("trach") || videoUrl.toLowerCase().includes("treach") || videoUrl.toLowerCase().includes("trachea")) {
            label = "Tracheal Examination (فحص القصبة الهوائية)";
          } else if (videoUrl.toLowerCase().includes("chest palpation")) {
            label = "Chest Palpation (فحص الصدر باللمس)";
          } else if (videoUrl.toLowerCase().includes("chest percussion")) {
            label = "Chest Percussion (فحص الصدر بالنقر)";
          } else if (videoUrl.toLowerCase().includes("palpation")) {
            label = "Palpation Demonstration (فحص اللمس)";
          }

          return (
            <div 
              key={videoUrl} 
              className={`rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col items-center w-full p-4 shadow-md shadow-slate-100 ${
                !hasImage && videoUrls.length === 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className="w-full flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                <span>{label}</span>
                <span className="text-blue-600 font-mono">Video {index + 1} of {videoUrls.length}</span>
              </div>
              <div className="relative w-full aspect-video flex items-center justify-center bg-black rounded-xl overflow-hidden animate-fade-in">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                  preload="metadata"
                />
              </div>
            </div>
          );
        })}

        {hasImage && (
          <div className={`rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col items-center w-full p-4 shadow-md shadow-slate-100 ${!hasVideo ? "md:col-span-2" : ""}`}>
            <div className="w-full flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              <span>Patient Slide Gallery Clue</span>
              <span className="text-blue-600 font-mono">Image {activeImgIndex + 1} of {activeExam.image!.split(",").map(url => url.trim()).filter(Boolean).length}</span>
            </div>

            <div className="relative w-full aspect-[4/3] max-h-[300px] flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden mb-3 border border-slate-100">
              <img 
                src={activeExam.image!.split(",").map(url => url.trim()).filter(Boolean)[activeImgIndex]} 
                alt={`${activeExam.name} slide`} 
                className="max-h-full max-w-full object-contain hover:scale-[1.02] transition-all duration-300" 
                referrerPolicy="no-referrer"
              />
            </div>

            {activeExam.image!.split(",").map(url => url.trim()).filter(Boolean).length > 1 && (
              <div className="flex items-center justify-between w-full pt-1">
                <button 
                  type="button"
                  onClick={() => setActiveImgIndex(prev => prev > 0 ? prev - 1 : activeExam.image!.split(",").map(url => url.trim()).filter(Boolean).length - 1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-bold text-[10px] tracking-wider uppercase flex items-center gap-1"
                >
                  <ChevronLeft size={12} /> Prev
                </button>
                <div className="flex gap-1.5 justify-center">
                  {activeExam.image!.split(",").map(url => url.trim()).filter(Boolean).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === activeImgIndex ? "bg-blue-600 w-3" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveImgIndex(prev => prev < activeExam.image!.split(",").map(url => url.trim()).filter(Boolean).length - 1 ? prev + 1 : 0)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-bold text-[10px] tracking-wider uppercase flex items-center gap-1"
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 container mx-auto bg-slate-50/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        
        {/* Left Column: OSCE Steps Catalog (Takes 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">OSCE Physical Exam</h3>
              <p className="text-slate-400 font-bold text-xs">Examine step-by-step with interactive viva evaluation.</p>
            </div>
            <button
              onClick={handleResetDialogues}
              title="Reset all step dialogues"
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {exams.map((exam) => {
              const isResolved = stepResolved[exam.id] || false;
              const isActive = exam.id === activeStepId;
              return (
                <button
                  key={exam.id}
                  onClick={() => handleStepSelect(exam.id)}
                  className={`w-full text-left group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "bg-white border-blue-500 text-blue-700 shadow-lg shadow-blue-100/40"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isResolved
                        ? "bg-green-100 text-green-600 font-bold"
                        : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {isResolved ? <CheckCircle2 size={16} /> : <Search size={15} />}
                    </div>
                    <div>
                      <span className={`text-sm font-black tracking-tight ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                        {exam.name}
                      </span>
                      <div className="text-[10px] text-slate-400 font-bold leading-none mt-0.5">
                        {isResolved ? "Findings Discovered" : isActive ? "Active Viva Session" : "Click to Start"}
                      </div>
                    </div>
                  </div>
                  {isResolved && (
                    <span className="px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded bg-green-50 text-green-700 border border-green-100">
                      Resolved
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Step-by-Step Viva Board (Takes 8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStepId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md shadow-slate-200/40 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">{activeExam.name} Observation Station</h4>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">MUST University Senior Examiner Panel</span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isActiveStepResolved ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-green-500/10 text-green-700 border border-green-200/50">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-700 border border-amber-200/50">
                      <Sparkles size={13} className="animate-pulse" /> Oral Check In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Render Image slideshow clue above chat */}
              <div className="mb-5 space-y-4">
                {renderImageCarousel()}
                
                {activeExam.audio && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex flex-col gap-4 shadow-sm">
                    {activeExam.audio.split(",").map((audioUrl, audIdx, arr) => {
                      const trimmedUrl = audioUrl.trim();
                      if (!trimmedUrl) return null;
                      const filename = trimmedUrl.split("/").pop() || "";
                      const label = filename.replace(/\.(mp3|wav|ogg|m4a)$/i, "") || activeExam.name;
                      let displayLabel = arr.length > 1 ? decodeURIComponent(label) : "Listen to Auscultation Sound (صوت السماعة)";
                      if (trimmedUrl.includes("AS + PULMONARY STENOSIS")) {
                        displayLabel = "Auscultate at A1 (Aortic Area)";
                      } else if (trimmedUrl.includes("MR+TR+VSD")) {
                        if (currentCase.id === "phtn-tr-001") {
                          displayLabel = "Listen over left lower sternal border during inspiration";
                        } else if (currentCase.id === "vsd-001") {
                          displayLabel = "Auscultate at Left Lower Sternal Border";
                        } else {
                          displayLabel = "Auscultate at M (Mitral Area)";
                        }
                      } else if (trimmedUrl.includes("Aortic Regurgitation")) {
                        displayLabel = "Auscultate at Erb's Point (Left Sternal Border)";
                      }
                      return (
                        <div key={audIdx} className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                              {/* Audio track icon */}
                              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                {displayLabel}
                              </p>
                              <p className="text-[10px] text-slate-500 font-bold leading-normal">Interactive acoustic finding for {activeExam.name}</p>
                            </div>
                          </div>
                          <div className="w-full md:w-auto">
                            <audio 
                              src={trimmedUrl} 
                              controls 
                              className="w-full md:w-64 accent-blue-600 h-9"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interactive OSCE Chat Feed */}
              <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-4 h-[240px] overflow-y-auto mb-4 flex flex-col space-y-3">
                {activeStepMessages.map((msg, i) => {
                  const isExaminer = msg.role === "examiner";
                  return (
                    <div
                      key={i}
                      className={`flex w-full ${isExaminer ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-medium leading-relaxed ${
                        isExaminer
                          ? "bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-none"
                          : "bg-blue-600 text-white shadow-md shadow-blue-100 rounded-tr-none"
                      }`}>
                        <div className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isExaminer ? "text-slate-400" : "text-blue-200"}`}>
                          {isExaminer ? "Clinical Examiner" : "Student Dr."}
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm text-xs font-medium text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      <span>Examiner is evaluating your clinical deduction...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input & skip actions */}
              {!isActiveStepResolved ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                       <Sparkles size={11} className="text-blue-500" /> Clinical Observation Input
                    </span>
                    <span className="hidden sm:flex text-[10px] font-black text-slate-400 uppercase tracking-widest items-center gap-1.5">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                       Viva Engine Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type or speak your clinical observation e.g. 'I note bilateral pitting edema'..."
                      disabled={isLoading}
                      style={{ fontSize: "16px" }}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-[16px] text-slate-800 font-semibold placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    />
                    <div className="shrink-0 flex items-center">
                      <VoiceRecognition 
                        onTranscript={(text) => setInputValue(prev => prev + (prev ? " " : "") + text)} 
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      id="send-step-btn"
                      disabled={!inputValue.trim() || isLoading}
                      className="text-white p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 cursor-pointer rounded-2xl border-none"
                    >
                      <Send size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
                    <span className="text-[10px] text-slate-400 font-black flex items-center gap-1">
                      <HelpCircle size={12} className="text-amber-500" /> STUCK UNDER OBSERVATION?
                    </span>
                    <button
                      type="button"
                      onClick={handleSkipOrUnknown}
                      disabled={isLoading}
                      className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-black uppercase rounded-lg border border-amber-500/20 transition-all cursor-pointer"
                    >
                      I don't know (مش عارف)
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h5 className="font-sans font-black text-green-800 text-xs uppercase tracking-wide">Maneuver Solved & Appended To Record Log</h5>
                      <p className="text-[11px] text-slate-500 leading-snug mt-1">
                        Your physical examination clinical findings have been logged correctly. Below is the official OSCE standard findings checklist for this case:
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-green-500/10 rounded-xl">
                    <p className="font-serif italic text-slate-800 text-xs leading-relaxed">
                      {activeExam.finding}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-1">
                    {exams.findIndex(ex => ex.id === activeStepId) < exams.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-100 transition-all"
                      >
                        Proceed to Next Step <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        🎉 All physical examinations completed! Proceed to Investigations now.
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Consolidated Global Log Display */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Consolidated OSCE Physical Exam Log
            </h4>
            <span className="text-[10px] text-slate-400 leading-none block mb-4">
              Your logged deductions are automatically aggregated here as you successfully complete each dynamic maneuver.
            </span>
            <textarea
              value={studentNotes.examination}
              onChange={(e) => updateNotes("examination", e.target.value)}
              placeholder="Your aggregated clinical physical findings will appear here..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-[16px] font-serif leading-relaxed text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              style={{ fontSize: "16px" }}
              rows={6}
            />
          </div>

        </div>

      </div>
    </div>
  );
};
