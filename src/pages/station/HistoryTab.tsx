import React, { useState, useEffect, useRef } from "react";
import { User, Activity, Clock, ChevronRight, Send, Loader2, ClipboardCheck, Shield, MessageCircle, Upload, X, FileText, Check, Plus, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useStore } from "../../store/useStore";
import { VoiceRecognition } from "../../components/VoiceRecognition";
import { Message } from "../../types";

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
    setQuotaExceeded
  } = useStore();
  
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
    setCurrentQuestionId(null);
    useStore.setState({ askedQuestionIds: [], currentQuestionId: null });
  };

  const triggerNextQuestion = () => {
    if (!currentCase || !currentCase.examinerQuestions) return;

    const unasked = currentCase.examinerQuestions.filter(
      (q) => !askedQuestionIds.includes(q.id)
    );

    let nextQ;
    if (unasked.length === 0) {
      const startOver = window.confirm(
        "لقد أجبت على كافة أسئلة الملف المتاحة!\nهل ترغب في إعادة تصفير أسئلة الملف للبدء مرة أخرى بتحديد عشوائي؟\n\n(All case-file questions have been answered! Reset to start again?)"
      );
      if (startOver) {
        resetQuestions();
        const firstRandom = currentCase.examinerQuestions[Math.floor(Math.random() * currentCase.examinerQuestions.length)];
        nextQ = firstRandom;
      } else {
        return;
      }
    } else {
      const randomIndex = Math.floor(Math.random() * unasked.length);
      nextQ = unasked[randomIndex];
    }

    if (nextQ) {
      setCurrentQuestionId(nextQ.id);
      addAskedQuestionId(nextQ.id);

      const isFirst = askedQuestionIds.length <= 1;
      const questionText = isFirst 
        ? nextQ.question 
        : `Alright, now: ${nextQ.question}`;

      const examinerMessageObj: Message = {
        role: "examiner",
        content: questionText,
        timestamp: Date.now(),
      };
      addExaminerMessage(examinerMessageObj);
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

  // Proactive Examiner: If messages are empty, give an intro
  useEffect(() => {
    if (examinerMessages.length === 0 && currentCase) {
      const intro: Message = {
        role: "examiner",
        content: `I am the lead examiner for this station. You are presented with a ${currentCase.patient.age}-year-old ${currentCase.patient.gender} with ${currentCase.patient.chiefComplaint}. Please proceed with history taking and be prepared to explain your logic at any moment.`,
        timestamp: Date.now(),
      };
      addExaminerMessage(intro);
    }
  }, [currentCase, examinerMessages.length]);

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentQuestion: text,
            chatHistory: messages.slice(-8).map(m => `${m.role === "student" ? "Student" : "Patient"}: ${m.content}`).join("\n"),
            patientData: {
              ...currentCase?.patient,
              fullHistory: currentCase?.history
            }
          }),
        });

        const data = await response.json();
        if (data.quotaExceeded) {
          setQuotaExceeded(true);
        }
        if (data.text) {
          streamPatientMessage(data.text);
        } else {
          setIsTyping(false);
        }
      } catch (error) {
        console.error("Chat Error:", error);
        setIsTyping(false);
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentMessage: text,
            examinerHistory: examinerMessages.slice(-6).map(m => `${m.role === "student" ? "Student" : "Examiner"}: ${m.content}`).join("\n"),
            patientHistory: messages.slice(-6).map(m => `${m.role === "student" ? "Student" : "Patient"}: ${m.content}`).join("\n"),
            caseData: currentCase,
            activeQuestion: activeQuestion
          }),
        });

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
          setIsTyping(false);
        }
      } catch (error) {
        console.error("Examiner Error:", error);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden min-h-0">
      {/* Dual Chat Area */}
      <div className="flex-1 overflow-hidden relative min-h-0">
        <div className="flex h-full w-full overflow-hidden min-h-0">
          {/* Patient Chat */}
          <div className={`${chatTarget === "patient" ? "flex" : "hidden lg:flex"} flex-col flex-1 border-r border-slate-200/60 h-full overflow-hidden bg-white min-h-0`}>
            <div className="p-4 bg-white/60 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                     <User size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">Patient Interview</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{currentCase?.patient.name}</span>
                  </div>
               </div>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <div 
              ref={patientScrollRef}
              onScroll={handlePatientScroll}
              className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth bg-slate-50/30 pb-[120px] lg:pb-6"
            >
              {messages.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-2xl shadow-lg shadow-slate-200/50 mb-4 border border-slate-100 flex items-center justify-center text-blue-600">
                    <User size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">Simulated Interview</h3>
                  <p className="text-slate-500 text-[11px] font-medium max-w-xs leading-relaxed">
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
                  <div className={`max-w-[85%] rounded-[1.5rem] p-4 shadow-sm border transition-all ${
                    msg.role === "student" 
                      ? "bg-blue-600 text-white border-blue-500 rounded-tr-none shadow-blue-200/50 shadow-lg" 
                      : "bg-white text-slate-700 border-slate-200 rounded-tl-none shadow-slate-100"
                  }`}>
                    <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && chatTarget === "patient" && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1.5 px-4">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Examiner Chat */}
          <div className={`${chatTarget === "examiner" ? "flex" : "hidden lg:flex"} flex-col flex-1 bg-slate-100/30 h-full overflow-hidden min-h-0`}>
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400 shadow-sm border border-slate-700">
                     <Shield size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Examiner Observation</span>
                    <span className="text-[8px] font-bold text-blue-400 uppercase mt-0.5">Live Assessment</span>
                  </div>
               </div>
               <span className="text-[8px] font-black text-blue-400 uppercase border border-blue-400/30 px-1.5 py-0.5 rounded">MUST University</span>
            </div>

            {/* Examiner control panel for file-based questions */}
            <div className="mx-4 my-3 p-4 bg-slate-950/5 backdrop-blur border border-slate-200/60 rounded-2xl flex flex-col gap-3 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-800 tracking-tight flex items-center gap-1.5 uppercase font-mono">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                  File Questions (أسئلة بنك الملف)
                </span>
                <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {askedQuestionIds?.length || 0} / {currentCase?.examinerQuestions?.length || 0} Asked
                </span>
              </div>

              {currentQuestionId ? (() => {
                const activeQ = currentCase?.examinerQuestions?.find(q => q.id === currentQuestionId);
                return (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none">
                      Active Board Question (السؤال النشط):
                    </span>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed font-sans">
                      {activeQ?.question}
                    </p>
                  </div>
                );
              })() : (
                <div className="bg-white border border-slate-100 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    No active question. Ask the Examiner to pose a question!
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => triggerNextQuestion()}
                  disabled={!currentCase?.examinerQuestions || currentCase.examinerQuestions.length === 0}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-[11px] py-2.5 px-4 rounded-xl cursor-pointer transition-all uppercase flex justify-center items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  {currentQuestionId ? "سؤال آخر (Another Question)" : "اطرح سؤال من الملف (Ask From File)"}
                </button>
                {askedQuestionIds && askedQuestionIds.length > 0 && (
                  <button
                    onClick={() => resetQuestions()}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-[10px] py-2.5 px-3 rounded-xl transition-all uppercase"
                    title="Reset all questions progress"
                  >
                    تصفير (Reset)
                  </button>
                )}
              </div>

              {/* Upload panel trigger */}
              <div className="border-t border-slate-200/60 pt-2.5 mt-1 flex flex-col gap-2">
                <button
                  onClick={() => setShowImport(!showImport)}
                  className="w-full flex items-center justify-between py-1.5 px-3 hover:bg-slate-200/50 rounded-lg text-[10px] font-bold text-slate-600 uppercase transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Upload size={12} />
                    رفع/تعديل ملف الأسئلة (Upload/Paste Custom Bank)
                  </span>
                  <span>{showImport ? "إغلاق ✕" : "فتح ＋"}</span>
                </button>

                {showImport && (
                  <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col gap-3 mt-1 shadow-inner">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-700 uppercase">1. رفع ملف (.json أو .txt):</span>
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
                      <span className="text-[9px] font-black text-slate-700 uppercase">2. أو الصق الأسئلة مباشرة بالأسفل:</span>
                      <textarea
                        value={pastedQAs}
                        onChange={(e) => setPastedQAs(e.target.value)}
                        placeholder={`س: ما هي أسباب الاستسقاء؟\nج: تليف الكبد والقلب والفشل الكلوي.\n\nس: سؤال آخر؟\nج: إجابتك النموذجية.`}
                        className="w-full h-24 bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-medium placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 transition-all resize-none"
                      />
                      <button
                        onClick={() => handleImportText(pastedQAs)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] py-1.5 rounded-lg transition-all uppercase mt-1 tracking-wider"
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

                    <div className="text-[8px] text-slate-400 leading-normal font-medium bg-slate-50 p-2 rounded-lg">
                      💡 <strong>الصيغة المدعومة (Format):</strong><br/>
                      - ملف JSON يحتوي على مصفوفة أسئلة.<br/>
                      - أو نص عادي يفصل بين كل سؤال بالشكل:<br/>
                      <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-mono">س: السؤال هنا ...</code><br/>
                      <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded font-mono">ج: الإجابة هناك ...</code>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div 
              ref={examinerScrollRef}
              onScroll={handleExaminerScroll}
              className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth pb-[120px] lg:pb-6"
            >
              {examinerMessages.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="bg-slate-900 p-4 rounded-2xl shadow-xl mb-4 border border-slate-800 flex items-center justify-center text-blue-400">
                    <Shield size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-black text-slate-300 tracking-tight mb-1">Examiner Observation</h3>
                  <p className="text-slate-500 text-[11px] font-medium max-w-xs leading-relaxed">
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
                  <div className={`max-w-[85%] rounded-[1.5rem] p-4 shadow-sm border transition-all ${
                    msg.role === "student" 
                      ? "bg-slate-800 text-white border-slate-700 rounded-tr-none" 
                      : "bg-blue-900/10 text-blue-900 border-blue-200/50 rounded-tl-none italic font-bold"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && chatTarget === "examiner" && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-sm flex items-center gap-1.5 px-4">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unified Input Control */}
      <div className="fixed lg:relative bottom-0 left-0 right-0 z-30 lg:z-10 bg-white border-t border-slate-200 p-4 md:p-5 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] w-full">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
           <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-3">
                 {/* Chat Target Toggle */}
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setChatTarget("patient")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 ${
                        chatTarget === "patient" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      <MessageCircle size={12} />
                      Patient
                    </button>
                    <button 
                      onClick={() => setChatTarget("examiner")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 ${
                        chatTarget === "examiner" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400"
                      }`}
                    >
                      <Shield size={12} />
                      Examiner
                    </button>
                 </div>
                 <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
                 <VoiceRecognition 
                   onTranscript={(text) => setInputText(prev => prev + (prev ? " " : "") + text)} 
                   disabled={isTyping}
                 />
              </div>
              <span className="hidden sm:flex text-[10px] font-black text-slate-400 uppercase tracking-widest items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 Interactions Engine Active
              </span>
           </div>

           <div className="flex items-center gap-3">
             <input
               type="text"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
               placeholder={chatTarget === "patient" ? "Ask the patient..." : "Ask the examiner..."}
               className={`flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[16px] font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 transition-all outline-none ${
                 chatTarget === "examiner" ? "focus:ring-slate-900/10 focus:border-slate-800" : "focus:ring-blue-500/10 focus:border-blue-500"
               }`}
               style={{ fontSize: "16px" }}
               disabled={isTyping}
             />
             <button
               onClick={() => handleSendMessage(inputText)}
               disabled={!inputText.trim() || isTyping}
               className={`text-white p-3.5 rounded-2xl disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 ${
                 chatTarget === "examiner" ? "bg-slate-900 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-700"
               }`}
             >
               <Send size={18} strokeWidth={2.5} />
             </button>
           </div>
           
           {/* Quick Review Tracker */}
           <div className="mt-1.5 flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-xl p-3 shadow-inner">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white shadow-sm">
                    <ClipboardCheck size={12} />
                  </div>
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Findings Summary Note</span>
              </div>
              <input 
                 value={studentNotes.history}
                 onChange={(e) => updateNotes("history", e.target.value)}
                 placeholder="Record findings here..."
                 className="bg-transparent border-none focus:ring-0 text-[16px] font-semibold text-slate-600 w-1/2 text-right italic p-0"
                 style={{ fontSize: "16px" }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};

