import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Glow effect in background */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <svg
          className="w-10 h-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-12 relative z-10"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--p, #4a00ff)" />
              <stop offset="100%" stopColor="var(--s, #ff007f)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer network links/lines representing graph neural networks */}
          <line x1="20" y1="75" x2="35" y2="25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" className="text-base-content" />
          <line x1="35" y1="25" x2="50" y2="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" className="text-base-content" />
          <line x1="50" y1="60" x2="65" y2="25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" className="text-base-content" />
          <line x1="65" y1="25" x2="80" y2="75" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" className="text-base-content" />
          <line x1="35" y1="25" x2="65" y2="25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.15" className="text-base-content" />
          
          {/* Main "N" and "M" structure styled like a neural net path */}
          <path
            d="M 20 75 L 35 25 L 50 60 L 65 25 L 80 75"
            stroke="url(#logoGradient)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Swarm Agent Curve */}
          <path
            d="M 15 50 C 30 75, 70 20, 85 45"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
            strokeDasharray="4 4"
          />

          {/* Network Nodes (Circles at key vertices) */}
          <circle cx="20" cy="75" r="4" fill="currentColor" className="text-base-content" opacity="0.7" />
          <circle cx="35" cy="25" r="5" fill="url(#logoGradient)" />
          <circle cx="50" cy="60" r="4.5" fill="url(#logoGradient)" />
          <circle cx="65" cy="25" r="5" fill="url(#logoGradient)" />
          <circle cx="80" cy="75" r="4" fill="currentColor" className="text-base-content" opacity="0.7" />
          
          {/* Small particles represent agents/swarms */}
          <circle cx="28" cy="45" r="1.5" fill="var(--s, #ff007f)" className="animate-pulse" />
          <circle cx="43" cy="38" r="1.2" fill="var(--p, #4a00ff)" />
          <circle cx="58" cy="48" r="1.8" fill="var(--s, #ff007f)" />
          <circle cx="72" cy="55" r="1.2" fill="var(--p, #4a00ff)" className="animate-pulse" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-sm sm:text-base tracking-wider leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-primary transition-all duration-500">
          NOAH MAMIÉ
        </span>
        <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-base-content/65 uppercase leading-none mt-1 group-hover:text-primary transition-colors duration-350">
          GenAI & Swarms
        </span>
      </div>
    </div>
  );
};

export default Logo;
