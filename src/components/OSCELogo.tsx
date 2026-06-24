import React from "react";

interface OSCELogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark" | "white";
  brandName?: string;
}

export const OSCELogo: React.FC<OSCELogoProps> = ({
  className = "",
  showText = true,
  size = "md",
  variant = "dark",
  brandName = "Synoza"
}) => {
  const iconSizing = {
    sm: "h-7 w-7",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizing = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const subSizing = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
    xl: "text-[11px]"
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Immersive Neural Synapse & Diagnostic Iris Vector Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizing[size]} group`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md group-hover:scale-125 transition-transform duration-500" />
        
        {/* Vector circular ring */}
        <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden border
          ${variant === "white" 
            ? "bg-white text-slate-950 border-white/20" 
            : "bg-gradient-to-br from-slate-950 to-slate-900 text-teal-400 border-white/10"
          }`}
        >
          {/* Diagnostic Iris and Connecting Synapse circles */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7/12 h-7/12 relative z-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]"
          >
            {/* Synapse network path */}
            <circle cx="12" cy="12" r="5" stroke="currentColor" className="stroke-cyan-400" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" className="fill-teal-400" stroke="none" />
            
            {/* Connection nodes around */}
            <circle cx="12" cy="4" r="1.5" className="fill-indigo-400" stroke="none" />
            <circle cx="19" cy="12" r="1.5" className="fill-cyan-400 animate-pulse" stroke="none" />
            <circle cx="5" cy="12" r="1" className="fill-teal-300" stroke="none" />
            <circle cx="12" cy="20" r="1.5" className="fill-indigo-400" stroke="none" />

            {/* Neural connection arches */}
            <path d="M12 4a8 8 0 0 1 7 8m-7 8a8 8 0 0 1-7-8" strokeWidth="1" className="stroke-slate-400/50" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span 
            className={`font-black tracking-tight leading-none transition-all font-display
              ${textSizing[size]} 
              ${variant === "white" ? "text-white" : "text-white"}
            `}
          >
            syno<span className="text-cyan-400">z</span>a
          </span>
          <span 
            className={`font-bold tracking-wider uppercase mt-1 leading-none font-mono text-[8px]
              ${variant === "white" ? "text-cyan-200" : "text-slate-400"}
            `}
          >
            clinical connections
          </span>
        </div>
      )}
    </div>
  );
};

