import React, { useState, useEffect, useRef } from "react";
import { User, Activity, Clock, ChevronRight, Send, Loader2, ClipboardCheck, Shield, MessageCircle, Upload, X, FileText, Check, Plus, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store/useStore";
import { VoiceRecognition, LangMode } from "../../components/VoiceRecognition";
import { Message } from "../../types";

function renderMessageContent(content: string) {
  const regex = /\[SHOW_IMAGE:\s*([^\]]+)\]/i;
  const match = content.match(regex);
  
  if (match) {
    const imageName = match[1].trim();
    const cleanContent = content.replace(regex, "").trim();
    
    return (
      <div className="space-y-3">
        {cleanContent && <p className="text-xs leading-relaxed font-semibold">{cleanContent}</p>}
        <div className="mt-2 rounded-xl overflow-hidden border border-white/5 bg-slate-950/80 p-1 relative group max-w-[280px]">
          <img 
            src={`/${imageName}`} 
            alt="Clinical Specimen" 
            className="w-full h-auto max-h-40 object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as any).style.display = "none";
            }}
          />
          <div className="absolute bottom-2 right-2 px-1 py-0.5 bg-slate-950/90 text-[7px] text-cyan-400 font-mono tracking-widest uppercase rounded border border-white/5">
            MUST SPECIMEN
          </div>
        </div>
      </div>
    );
  }
  
  return <p className="text-xs leading-relaxed font-semibold">{content}</p>;
}

export const HistoryTab: React.FC = () => {
  const { 
    currentCase, 
    messages, 
    addMessage, 
    examinerMessages, 
    addExaminerMessage, 
    studentNotes, 
    updateNotes,
    chatTarget,
    setChatTarget,
    currentQuestionId,
    askedQuestionIds,
    setCurrentQuestionId,
    addAskedQuestionId,
    addVivaAttempt,
    quotaExceeded,
    setQuotaExceeded,
    currentUser
  } = useStore();
  
  const [inputText, setInputText] = useState("");
  const [langMode, setLangMode] = useState<LangMode>("auto");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);
  const [askedCount, setAskedCount] = useState<number>(0);
  const patientScrollRef = useRef<HTMLDivElement>(null);
  const examinerScrollRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<any>(null);

  const isAtPatientTabBottom = useRef(true);
  const isAtExaminerTabBottom = useRef(true);

  const handlePatientScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    isAtPatientTabBottom.current = isBottom;
  };

  const handleExaminerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    isAtExaminerTabBottom.current = isBottom;
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const streamPatientMessage = (completeText: string) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsTyping(true);
    
    addMessage({
      role: "patient",
      content: "",
      timestamp: Date.now()
    });

    const words = completeText.split(" ");
    let index = 0;
    let currentText = "";

    streamIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? "" : " ") + words[index];
        index++;
        
        const currentMessages = [...useStore.getState().messages];
        if (currentMessages.length > 0) {
          currentMessages[currentMessages.length - 1] = {
            ...currentMessages[currentMessages.length - 1],
            content: currentText
          };
          useStore.setState({ messages: currentMessages });
        }
        
        // Smart scroll: only scroll if previously near bottom
        if (patientScrollRef.current && isAtPatientTabBottom.current) {
          patientScrollRef.current.scrollTop = patientScrollRef.current.scrollHeight;
        }
      } else {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setIsTyping(false);
      }
    }, 25);
  };

  const streamExaminerMessage = (completeText: string) => {
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    setIsTyping(true);

    addExaminerMessage({
      role: "examiner",
      content: "",
      timestamp: Date.now()
    });

    const words = completeText.split(" ");
    let index = 0;
    let currentText = "";

    streamIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? "" : " ") + words[index];
        index++;
        
        const currentExMessages = [...useStore.getState().examinerMessages];
        if (currentExMessages.length > 0) {
          currentExMessages[currentExMessages.length - 1] = {
            ...currentExMessages[currentExMessages.length - 1],
            content: currentText
          };
          useStore.setState({ examinerMessages: currentExMessages });
        }
        
        // Smart scroll: only scroll if previously near bottom
        if (examinerScrollRef.current && isAtExaminerTabBottom.current) {
          examinerScrollRef.current.scrollTop = examinerScrollRef.current.scrollHeight;
        }
      } else {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setIsTyping(false);
      }
    }, 25);
  };

  // Custom question imports
  const [showImport, setShowImport] = useState(false);
  const [pastedQAs, setPastedQAs] = useState("");
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleImportText = (text: string) => {
    if (!text.trim()) {
      setImportMessage({ type: "error", text: "الفولدر فارغ أو النص فارغ! الرجاء كتابة أسئلة صحيحة." });
      return;
    }

    try {
      let questionsList: { id: string; question: string; sampleAnswer: string }[] = [];

      // Try parsing as JSON first
      if (text.trim().startsWith("[") || text.trim().startsWith("{")) {
        const parsed = JSON.parse(text.trim());
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        questionsList = arr.map((item: any, idx: number) => {
          const q = item.question || item.q || item.questionText || "";
          const a = item.sampleAnswer || item.answer || item.a || item.modelAnswer || "";
          if (!q || !a) {
            throw new Error(`خطأ في السطر ${idx + 1}: يجب أن يحتوي كل عنصر على سؤال وإجابة نموذجية`);
          }
          return {
            id: `imported-q-${idx}-${Date.now()}`,
            question: q,
            sampleAnswer: a,
          };
        });
      } else {
        // Parse as custom plain text split by --- or double newlines
        const blocks = text.split(/(?:---|(?:\r?\n){2,})/);
        blocks.forEach((block, index) => {
          const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          if (lines.length === 0) return;
          
          let qText = "";
          let aText = "";
          
          lines.forEach(line => {
            const qMatch = line.match(/^(?:Q|Question|س|السؤال|s)\s*[:：.-]?\s*(.*)$/i);
            const aMatch = line.match(/^(?:A|Answer|ج|الإجابة|الاجابة|a)\s*[:：.-]?\s*(.*)$/i);
            
            if (qMatch) {
              qText = qMatch[1];
            } else if (aMatch) {
              aText = aMatch[1];
            } else {
              if (!qText) {
                qText = line;
              } else {
                aText += (aText ? "\n" : "") + line;
              }
            }
          });
          
          if (qText && aText) {
            questionsList.push({
              id: `imported-txt-${index}-${Date.now()}`,
              question: qText.trim(),
              sampleAnswer: aText.trim()
            });
          }
        });
      }

      if (questionsList.length === 0) {
        throw new Error("لم نتمكن من تحديد أي أسئلة وإجابات مطابقة بشكل صحيح. يرجى اتباع الصيغة الموضحة.");
      }

      // Update current case with the imported questions
      if (currentCase) {
        currentCase.examinerQuestions = questionsList;
        // Trigger store update to re-evaluate the state
        useStore.setState({ currentCase: { ...currentCase } });
        resetQuestions();
        setImportMessage({
          type: "success",
          text: `تم استيراد ${questionsList.length} أسئلة بنجاح! يمكنك الآن طرح الأسئلة من الملف.`,
        });
        setPastedQAs("");
        setTimeout(() => setImportMessage(null), 5000);
      } else {
        setImportMessage({ type: "error", text: "لا توجد حالة نشطة لاستيراد الأسئلة إليها!" });
      }
    } catch (err: any) {
      setImportMessage({
        type: "error",
        text: `فشل التحليل: ${err.message || err}`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleImportText(content);
    };
    reader.onerror = () => {
      setImportMessage({ type: "error", text: "يتعذر قراءة الملف المرفوع!" });
    };
    reader.readAsText(file);
  };

  const resetQuestions = () => {
    if (!currentCase) return;

    const allBank = currentCase.examinerQuestions || [];
    if (allBank.length === 0) return;

    const shuffled = [...allBank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    setSessionQuestions(selected);
    setAskedCount(0);

    localStorage.setItem(`osce-questions-5-${currentCase.id}`, JSON.stringify(selected));
    localStorage.setItem(`osce-asked-count-${currentCase.id}`, "0");

    if (selected[0]) {
      setCurrentQuestionId(selected[0].id);
      useStore.setState({ askedQuestionIds: [selected[0].id] });
    } else {
      setCurrentQuestionId(null);
      useStore.setState({ askedQuestionIds: [] });
    }

    if (selected[0]) {
      const firstMsg: Message = {
        role: "examiner",
        content: `🔄 [إعادة تعيين] تم اختيار 5 أسئلة عشوائية جديدة لهذه المحاولة:\n\n[Examiner Question 1/5]: ${selected[0].question}`,
        timestamp: Date.now()
      };
      addExaminerMessage(firstMsg);
    }
  };

  const triggerNextQuestion = () => {
    if (!currentCase || sessionQuestions.length === 0) return;

    if (askedCount < 4) {
      const nextIndex = askedCount + 1;
      setAskedCount(nextIndex);
      localStorage.setItem(`osce-asked-count-${currentCase.id}`, String(nextIndex));

      const nextQ = sessionQuestions[nextIndex];
      if (nextQ) {
        setCurrentQuestionId(nextQ.id);
        addAskedQuestionId(nextQ.id);

        const questionText = `[Examiner Question ${nextIndex + 1}/5]: ${nextQ.question}`;
        const examinerMessageObj: Message = {
          role: "examiner",
          content: questionText,
          timestamp: Date.now(),
        };
        addExaminerMessage(examinerMessageObj);
      }
    } else {
      const finishMsg: Message = {
        role: "examiner",
        content: `🏁 لقد أكملت جميع الأسئلة الخمسة (5/5) المخصصة لهذه المحاولة بنجاح! يمكنك مراجعة لوحة التقييم والنتائج أو الضغط على زر إعادة التعيين (Reset) لخوض محاولة جديدة بأسئلة عشوائية أخرى.`,
        timestamp: Date.now()
      };
      addExaminerMessage(finishMsg);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "student") {
        if (patientScrollRef.current) {
          patientScrollRef.current.scrollTop = patientScrollRef.current.scrollHeight;
          isAtPatientTabBottom.current = true;
        }
      } else {
        if (patientScrollRef.current && isAtPatientTabBottom.current) {
          patientScrollRef.current.scrollTop = patientScrollRef.current.scrollHeight;
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    if (examinerMessages.length > 0) {
      const last = examinerMessages[examinerMessages.length - 1];
      if (last.role === "student" || examinerMessages.length === 1) {
        if (examinerScrollRef.current) {
          examinerScrollRef.current.scrollTop = examinerScrollRef.current.scrollHeight;
          isAtExaminerTabBottom.current = true;
        }
      } else {
        if (examinerScrollRef.current && isAtExaminerTabBottom.current) {
          examinerScrollRef.current.scrollTop = examinerScrollRef.current.scrollHeight;
        }
      }
    }
  }, [examinerMessages]);

  // Load or generate 5 random questions for the active case
  useEffect(() => {
    if (!currentCase) return;

    // 1. Setup/Load the 5 questions
    const cached = localStorage.getItem(`osce-questions-5-${currentCase.id}`);
    const cachedCount = localStorage.getItem(`osce-asked-count-${currentCase.id}`);

    let selected: any[] = [];
    let count = 0;

    if (cached) {
      try {
        selected = JSON.parse(cached);
        count = cachedCount ? parseInt(cachedCount, 10) : 0;
        setSessionQuestions(selected);
        setAskedCount(count);
        if (selected[count]) {
          setCurrentQuestionId(selected[count].id);
        }
      } catch (e) {
        console.error("Error reading cached questions:", e);
      }
    } else {
      // Generate new of 5
      const allQuestions = currentCase.examinerQuestions || [];
      if (allQuestions.length > 0) {
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        selected = shuffled.slice(0, 5);
        setSessionQuestions(selected);
        setAskedCount(0);
        localStorage.setItem(`osce-questions-5-${currentCase.id}`, JSON.stringify(selected));
        localStorage.setItem(`osce-asked-count-${currentCase.id}`, "0");
        if (selected[0]) {
          setCurrentQuestionId(selected[0].id);
          useStore.setState({ askedQuestionIds: [selected[0].id] });
        }
      }
    }

    // 2. Proactive message handling: Intro & first question
    const currentExMessages = useStore.getState().examinerMessages;
    if (currentExMessages.length === 0) {
      const intro: Message = {
        role: "examiner",
        content: `I am the lead examiner for this station. You are presented with a ${currentCase.patient.age}-year-old ${currentCase.patient.gender} with ${currentCase.patient.chiefComplaint}.\n\nLet's start your oral evaluation (viva).` + 
                 ((selected.length > 0) ? "\n\nI will ask you 5 randomized board questions regarding this case. Please provide detailed clinical explanations." : ""),
        timestamp: Date.now() - 100,
      };

      const firstQText = selected[0]?.question;
      const firstMsg: Message = {
        role: "examiner",
        content: firstQText ? `[Examiner Question 1/5]: ${firstQText}` : "No questions in the files.",
        timestamp: Date.now(),
      };

      useStore.setState({
        examinerMessages: [intro, firstMsg]
      });
    }
  }, [currentCase]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const studentMsg: Message = {
      role: "student",
      content: text,
      timestamp: Date.now(),
    };

    setInputText("");
    setIsTyping(true);

    if (chatTarget === "patient") {
      addMessage(studentMsg);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (currentUser?.token || "")
          },
          body: JSON.stringify({
            studentQuestion: text,
            chatHistory: messages.slice(-8).map(m => `${m.role === "student" ? "Student" : "Patient"}: ${m.content}`).join("\n"),
            patientData: {
              ...currentCase?.patient,
              fullHistory: currentCase?.history
            }
          }),
        });

        if (!response.ok) {
          const errRes = await response.json().catch(() => ({}));
          const errMsg = errRes.error || "Communication error with simulation services.";
          streamPatientMessage(`⚠️ عذراً يا دكتور، حدثت مشكلة في الاتصال بالخادم: (${errMsg}). يرجى التحقق من تسجيل دخولك أو المحاولة مرة أخرى.\n\n[Warning: Session error or connection lost. Please verify you are logged in correctly.]`);
          return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        if (!reader) {
          streamPatientMessage("⚠️ خطأ في قراءة رد المريض من الخادم.");
          return;
        }

        // First add an empty patient message to start streaming into
        addMessage({
          role: "patient",
          content: "",
          timestamp: Date.now()
        });

        setIsTyping(true);
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value, { stream: true });
          accumulatedText += chunkStr;

          // Push accumulated text straight into state for real-time typewriter-less rendering
          const currentMessages = [...useStore.getState().messages];
          if (currentMessages.length > 0) {
            currentMessages[currentMessages.length - 1] = {
              ...currentMessages[currentMessages.length - 1],
              content: accumulatedText
            };
            useStore.setState({ messages: currentMessages });
          }

          if (patientScrollRef.current && isAtPatientTabBottom.current) {
            patientScrollRef.current.scrollTop = patientScrollRef.current.scrollHeight;
          }
        }
        setIsTyping(false);
      } catch (error) {
        console.error("Chat Error:", error);
        streamPatientMessage("⚠️ عذراً، يبدو أن هناك خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت وإعادة إرسال السؤال.");
      }
    } else {
      // Add student message to UI immediately
      addExaminerMessage({ ...studentMsg });
      
      try {
        const activeQuestion = currentQuestionId 
          ? currentCase?.examinerQuestions?.find(q => q.id === currentQuestionId) 
          : null;

        const response = await fetch("/api/examiner", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (currentUser?.token || "")
          },
          body: JSON.stringify({
            studentMessage: text,
            examinerHistory: examinerMessages.slice(-6).map(m => `${m.role === "student" ? "Student" : "Examiner"}: ${m.content}`).join("\n"),
            patientHistory: messages.slice(-6).map(m => `${m.role === "student" ? "Student" : "Patient"}: ${m.content}`).join("\n"),
            caseData: currentCase,
            activeQuestion: activeQuestion
          }),
        });

        if (!response.ok) {
          const errRes = await response.json().catch(() => ({}));
          const errMsg = errRes.error || "Communication error with examiner engine.";
          streamExaminerMessage(`⚠️ خطأ في التواصل مع الممتحن: (${errMsg}). يرجى التحقق من جلسة تسجيل الدخول.\n\n[Examiner Service Error: Try checking your admin credentials or session state.]`);
          return;
        }

        const data = await response.json();
        if (data.quotaExceeded) {
          setQuotaExceeded(true);
        }
        if (data.text) {
          streamExaminerMessage(data.text);
          
          if (activeQuestion) {
            // Save the attempt outcome
            const isCorrect = data.isCorrect !== undefined ? data.isCorrect : data.isResolved;
            addVivaAttempt({
              questionId: activeQuestion.id,
              question: activeQuestion.question,
              studentAnswer: text,
              isCorrect: isCorrect,
              sampleAnswer: activeQuestion.sampleAnswer
            });

            if (data.isResolved) {
              setCurrentQuestionId(null);
              // Gently trigger next question after brief delay
              setTimeout(() => {
                triggerNextQuestion();
              }, 1500);
            } else {
              // Stay on current question to keep probing/helping the student
            }
          } else {
            setCurrentQuestionId(null);
          }
        } else {
          streamExaminerMessage("⚠️ (لم يتم تلقي استجابة من الممتحن. يرجى تجربة إعادة المحاولة.)");
        }
      } catch (error) {
        console.error("Examiner Error:", error);
        streamExaminerMessage("⚠️ عذراً، خطأ في التواصل مع خادم الممتحن. يرجى إعادة إرسال رسالتك.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden min-h-0">
      
      {/* Top Tab Bar Switcher (Centered & Slimmer) */}
      <div className="bg-slate-950 border-b border-white/5 p-2 sm:p-2.5 shrink-0 z-10 w-full">
         <div className="max-w-4xl mx-auto flex gap-2">
           <button
             type="button"
             onClick={() => setChatTarget("patient")}
             className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-1.5 px-3 rounded-xl border transition-all duration-200 cursor-pointer ${
               chatTarget === "patient"
                 ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-sm"
                 : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
             }`}
           >
             <div className={`p-1 rounded-lg transition-colors shrink-0 ${
               chatTarget === "patient" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-white/5 text-slate-400"
             }`}>
               <User size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
             </div>
             <div className="text-center sm:text-left min-w-0">
               <div className="text-[10px] font-black tracking-wide uppercase leading-tight truncate">
                 Patient Encounter
               </div>
               <div className="text-[9px] font-bold opacity-70 leading-none mt-0.5 truncate">
                 {currentCase?.patient?.name || "Patient"}
               </div>
             </div>
           </button>

           <button
             type="button"
             onClick={() => setChatTarget("examiner")}
             className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-1.5 px-3 rounded-xl border transition-all duration-200 cursor-pointer ${
               chatTarget === "examiner"
                 ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-sm"
                 : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
             }`}
           >
             <div className={`p-1 rounded-lg transition-colors shrink-0 ${
               chatTarget === "examiner" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-white/5 text-slate-400"
             }`}>
               <Shield size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
             </div>
             <div className="text-center sm:text-left min-w-0">
               <div className="text-[10px] font-black tracking-wide uppercase leading-tight truncate">
                 Examiner Box
               </div>
               <div className="text-[9px] font-bold opacity-75 leading-none mt-0.5 truncate">
                 VIVA Questions
               </div>
             </div>
           </button>
         </div>
      </div>

      {/* Single Shared Chat Box Container */}
      <div className="flex-1 overflow-hidden relative min-h-0 bg-slate-950">
        <div className="max-w-4xl mx-auto h-full flex flex-col overflow-hidden">
          
          {chatTarget === "patient" ? (
            /* Patient Interview Chat */
            <div className="flex flex-col flex-1 h-full overflow-hidden min-h-0">
              <div className="p-3 bg-slate-900/40 border-b border-white/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Interview Log: {currentCase?.patient?.name}</span>
                 </div>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <div 
                ref={patientScrollRef}
                onScroll={handlePatientScroll}
                className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth bg-slate-950 pb-6"
              >
                {messages.length === 0 && (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center text-blue-600 mb-3">
                      <User size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight mb-1">Simulated Interview</h3>
                    <p className="text-slate-500 text-[10px] font-medium max-w-xs leading-relaxed">
                      Start the clinical encounter by introducing yourself to the patient.
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm border transition-all ${
                      msg.role === "student" 
                        ? "bg-white/10 text-white border-white/10 rounded-tr-none" 
                        : "bg-slate-900/60 text-slate-200 border-white/5 rounded-tl-none"
                    }`}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </motion.div>
                ))}

                {isTyping && chatTarget === "patient" && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Examiner Assessment Chat */
            <div className="flex flex-col flex-1 h-full overflow-hidden min-h-0 bg-slate-950">
              <div className="p-3 bg-slate-900 border-b border-white/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/5 rounded-md flex items-center justify-center text-cyan-400 border border-white/10">
                       <Shield size={12} />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Examiner Board</span>
                 </div>
                 
                 <div className="flex items-center gap-1.5">
                    {/* Compact "Ask From File" button */}
                    <button
                      type="button"
                      onClick={() => triggerNextQuestion()}
                      disabled={!currentCase?.examinerQuestions || currentCase.examinerQuestions.length === 0}
                      className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-black text-[9px] py-1 px-2.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-sm active:scale-95 border-none"
                      title="Ask a question from File"
                    >
                      <BookOpen size={10} />
                      <span>{askedCount < 4 ? `Question ${askedCount + 1}/5` : "Completed 5/5"}</span>
                    </button>


                 </div>
              </div>

              {/* Collapsible Upload Panel inside Examiner Chat */}
              {false && (
                <div className="mx-4 my-3 p-4 bg-white border border-slate-200 rounded-2xl flex flex-col gap-3 shrink-0 shadow-lg z-10">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-slate-700 uppercase">رفع ملف الأسئلة (.json أو .txt):</span>
                      <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                    </div>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20 py-4 px-2 rounded-xl cursor-pointer transition-all">
                      <div className="flex flex-col items-center gap-1">
                        <Upload size={16} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 text-center">اضغط هنا أو اسحب الملف لرفعه</span>
                      </div>
                      <input
                        type="file"
                        accept=".json,.txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-700 uppercase">أو الصق الأسئلة مباشرة بالأسفل:</span>
                    <textarea
                      value={pastedQAs}
                      onChange={(e) => setPastedQAs(e.target.value)}
                      placeholder={`س: ما هي أسباب الاستسقاء؟\nج: تليف الكبد والقلب والفشل الكلوي...`}
                      className="w-full h-20 bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                    />
                    <button
                      onClick={() => handleImportText(pastedQAs)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] py-1.5 rounded-lg transition-all uppercase mt-1 tracking-wider cursor-pointer font-sans"
                    >
                      حفظ الأسئلة المستوردة (Save Paste)
                    </button>
                  </div>

                  {importMessage && (
                    <div className={`p-2 rounded-lg text-[9px] font-bold leading-relaxed ${
                      importMessage.type === "success" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}>
                      {importMessage.text}
                    </div>
                  )}
                </div>
              )}

              {/* Modern Bento Control Panel for the 5 random board viva questions */}
              {false && (
                <div className="mx-4 mt-3 mb-1.5 p-3.5 bg-white border border-slate-200/60 shadow-sm rounded-2xl flex flex-col gap-2.5 shrink-0">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-wide">
                    <span className="flex items-center gap-1.5 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Oral Exam Progress (امتحان خمسة أسئلة)
                    </span>
                    <span className="text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full font-mono font-extrabold text-[10px]">
                      {askedCount < 4 ? `Question: ${askedCount + 1} / 5` : "Completed 5 / 5"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 items-center justify-between">
                    {askedCount < 4 ? (
                      <button
                        type="button"
                        onClick={() => triggerNextQuestion()}
                        className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-[11px] py-2 px-4 rounded-xl cursor-pointer transition-all uppercase flex items-center gap-1.5 border-none shadow-sm font-sans"
                      >
                        <BookOpen size={12} />
                        <span>Ask another question ({askedCount + 1}/5)</span>
                      </button>
                    ) : (
                      <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/40 font-bold px-3 py-2 rounded-xl uppercase flex items-center gap-1 leading-none shadow-xs font-sans">
                        <Check size={12} className="text-emerald-600" />
                        تم الانتهاء من الـ 5 أسئلة لهذه المحاولة.
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => resetQuestions()}
                      className="hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-extrabold text-[10px] py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 cursor-pointer bg-white border border-slate-350 shadow-xs font-sans"
                      title="Get 5 new random questions"
                    >
                      🔄 Reset (خمس أسئلة جديدة)
                    </button>
                  </div>
                </div>
              )}

              {/* Active question indicator sticky banner */}
              {false && (() => {
                const activeQ = currentCase?.examinerQuestions?.find(q => q.id === currentQuestionId);
                return (
                  <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 px-4 flex justify-between items-center gap-3 shrink-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">
                        Active Board Question (السؤال النشط):
                      </span>
                      <p className="text-[11px] sm:text-xs text-slate-800 font-bold leading-relaxed font-sans truncate">
                        {activeQ?.question}
                      </p>
                    </div>
                    {/* Ask next file question directly */}
                    <button
                      type="button"
                      onClick={() => triggerNextQuestion()}
                      className="bg-amber-500 hover:bg-amber-600 px-2.5 py-1.5 rounded text-[9px] font-extrabold text-slate-900 transition-all shrink-0 cursor-pointer border-none"
                    >
                      Next Q
                    </button>
                  </div>
                );
              })()}

              <div 
                ref={examinerScrollRef}
                onScroll={handleExaminerScroll}
                className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth bg-slate-950 pb-6"
              >
                {examinerMessages.length === 0 && (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="bg-white/5 p-4 rounded-2xl shadow-md mb-4 border border-white/5 flex items-center justify-center text-cyan-400">
                      <Shield size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-black text-slate-300 tracking-tight mb-1">Examiner Observation</h3>
                    <p className="text-slate-400 text-[10px] font-medium max-w-xs leading-relaxed">
                      The examiner is monitoring your performance. Report your findings or answer questions directed to you by the examiner.
                    </p>
                  </div>
                )}

                 {examinerMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm border transition-all ${
                      msg.role === "student" 
                        ? "bg-white/10 text-white border-white/10 rounded-tr-none" 
                        : "bg-cyan-950/15 text-cyan-400 border-cyan-500/10 rounded-tl-none font-bold"
                    }`}>
                      {renderMessageContent(msg.content)}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && chatTarget === "examiner" && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-3 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Unified Input Control */}
      <div className="relative bg-slate-950 border-t border-white/5 p-4 md:p-5 shrink-0 w-full z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
           <div className="flex items-center justify-between gap-y-2 border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-3 md:gap-4">
                 <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Activity size={12} className="text-cyan-400" /> Options
                 </span>

                 <div className="flex items-center gap-1.5 bg-white/5 p-0.5 rounded-lg border border-white/5">
                    <VoiceRecognition langMode={langMode} onLangModeChange={setLangMode} hideSelector={true} 
                      onTranscript={(text) => setInputText(prev => prev + (prev ? " " : "") + text)} 
                      disabled={isTyping}
                    />
                    <div className="h-4 w-px bg-white/10 mx-0.5"></div>
                    <button 
                      type="button"
                      onClick={() => setLangMode("auto")}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all uppercase cursor-pointer border-none ${
                        langMode === "auto" 
                          ? "bg-cyan-500 text-slate-950 shadow-xs" 
                          : "text-slate-400 hover:text-white bg-transparent"
                      }`}
                    >
                      Auto
                    </button>
                    <button 
                      type="button"
                      onClick={() => setLangMode("ar-EG")}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all uppercase cursor-pointer border-none ${
                        langMode === "ar-EG" 
                          ? "bg-cyan-500 text-slate-950 shadow-xs" 
                          : "text-slate-400 hover:text-white bg-transparent"
                      }`}
                    >
                      Arabic
                    </button>
                    <button 
                      type="button"
                      onClick={() => setLangMode("en-US")}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all uppercase cursor-pointer border-none ${
                        langMode === "en-US" 
                          ? "bg-cyan-500 text-slate-950 shadow-xs" 
                          : "text-slate-400 hover:text-white bg-transparent"
                      }`}
                    >
                      English
                    </button>
                 </div>

                 {/* Compact integrated "Ask From File" inside Examiner tab */}
                 {chatTarget === "examiner" && (
                   <button
                     type="button"
                     onClick={() => triggerNextQuestion()}
                     disabled={!currentCase?.examinerQuestions || currentCase.examinerQuestions.length === 0}
                     className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-2.5 py-1.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 shrink-0 disabled:opacity-50 cursor-pointer border-none font-sans text-[10px] font-bold"
                     title="Ask question from file"
                   >
                     <BookOpen size={12} strokeWidth={2.5} />
                     <span>Ask Prep Question</span>
                   </button>
                 )}
              </div>
              <span className="hidden sm:flex text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 Active
              </span>
           </div>

            <div className="flex items-center gap-2 md:gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                placeholder={chatTarget === "patient" ? "Ask the patient..." : "Ask the examiner..."}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[15px] font-semibold text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
                style={{ fontSize: "16px" }}
                disabled={isTyping}
              />
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-3.5 rounded-2xl disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer border-none"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
           
           {/* Findings Note Removed for Space */}
        </div>
      </div>
    </div>
  );
};


