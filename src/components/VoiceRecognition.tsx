import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type LangMode = "auto" | "ar-EG" | "en-US";

interface VoiceRecognitionProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  langMode?: LangMode;
  onLangModeChange?: (mode: LangMode) => void;
  hideSelector?: boolean;
}

export const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ 
  onTranscript, 
  disabled,
  langMode: parentLangMode,
  onLangModeChange,
  hideSelector = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [internalLangMode, setInternalLangMode] = useState<LangMode>("auto");
  
  const langMode = parentLangMode !== undefined ? parentLangMode : internalLangMode;
  const setLangMode = onLangModeChange !== undefined ? onLangModeChange : setInternalLangMode;
  
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const errorTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsRecording(false);
      
      let msg = event.error;
      if (event.error === "not-allowed") {
        msg = "Microphone access not allowed. If you're in the iframe preview, please open the app in a new tab (top-right icon) and grant microphone permissions.";
      } else if (event.error === "no-speech") {
        msg = "No speech detected. Please speak clearly into your microphone.";
      } else if (event.error === "network") {
        msg = "Network error. Speech recognition requires an active connection.";
      }
      
      setError(msg);

      // Auto clear error after 9 seconds
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 9000);
    };

    recognitionRef.current = recognition;

    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [onTranscript]);

  const toggleRecording = () => {
    if (disabled || !supported) return;

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      // Wait a tiny bit then start to avoid potential race
      setTimeout(() => {
        try {
          recognitionRef.current.lang = langMode === "auto" ? "ar-EG" : langMode;
          recognitionRef.current?.start();
        } catch (e: any) {
          console.error("Start speech error", e);
          setError(e.message || "Could not start microphone.");
        }
      }, 50);
    }
  };

  const clearError = () => {
    setError(null);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
  };

  return (
    <div className="flex items-center gap-2 relative">
      {!hideSelector && (
        <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl text-[10px] shrink-0">
          {(["auto", "ar-EG", "en-US"] as LangMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLangMode(mode)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                langMode === mode ? "bg-white text-blue-600 shadow-xs" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {mode === "auto" ? "Auto" : mode === "ar-EG" ? "عربي" : "EN"}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={toggleRecording}
        disabled={disabled}
        type="button"
        className={`relative p-2.5 rounded-full transition-all shrink-0 ${
          isRecording ? "bg-red-500 scale-110 shadow-lg shadow-red-250 animate-pulse" : "bg-blue-600 hover:bg-blue-700 shadow-sm"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
        title={isRecording ? "Stop Recording" : "Start Voice Input"}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              key="mic-off"
            >
              <MicOff size={16} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              key="mic-on"
            >
              <Mic size={16} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {isRecording && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-650"></span>
          </span>
        )}
      </button>

      {/* Floating error tooltip */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-12 right-0 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 z-50 text-[11px] leading-relaxed w-[260px] sm:w-[320px] flex gap-2.5 items-start"
          >
            <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-slate-200">{error}</p>
            </div>
            <button
              onClick={clearError}
              type="button"
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
