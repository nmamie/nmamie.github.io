import React, { useState } from 'react';

/**
 * 1. Informfully - Interactive Multi-Modal Study Platform
 * Smartphone viewport with live pulse and interactive modality cycler
 */
export const InformfullyMark: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const modalities = [
    { label: 'News Feed', icon: '📰' },
    { label: 'Audio Brief', icon: '🎙️' },
    { label: 'User Survey', icon: '📊' },
    { label: 'Video Clip', icon: '🎬' },
  ];

  return (
    <div
      onMouseEnter={() => setActiveTab((p) => (p + 1) % modalities.length)}
      onClick={() => setActiveTab((p) => (p + 1) % modalities.length)}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-base-200 to-base-300 border border-base-300 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-primary/50 shrink-0 group overflow-hidden"
      title={`Informfully: ${modalities[activeTab].label} - Click or hover to cycle study modalities`}
    >
      <div className="w-4 h-0.5 bg-base-content/25 rounded-full mb-1" />
      <span className="text-base leading-none transform group-hover:scale-115 transition-transform duration-200">
        {modalities[activeTab].icon}
      </span>
      <span className="text-[7px] font-mono font-bold tracking-tight text-primary mt-0.5 uppercase">
        {modalities[activeTab].label.split(' ')[0]}
      </span>
      <span className="absolute top-1 right-1.5 flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
      </span>
    </div>
  );
};

/**
 * 2. HiveLLM / Society of HiveMind - Swarm Intelligence Constellation
 * Hexagonal multi-agent network with rotating nodes and energy links
 */
export const HiveMindMark: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  return (
    <div
      onMouseEnter={() => setRotation((r) => r + 60)}
      onClick={() => setRotation((r) => r + 60)}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 via-base-200 to-base-300 border border-base-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-amber-400/50 shrink-0 group"
      title="Society of HiveMind - Swarm Intelligence (Click or hover to rotate agents)"
    >
      <svg
        className="w-8 h-8 transition-transform duration-500 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
        viewBox="0 0 32 32"
        fill="none"
      >
        <polygon
          points="16,3 28,10 28,24 16,31 4,24 4,10"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-amber-500/40 group-hover:text-amber-500 transition-colors"
        />
        <circle cx="16" cy="3" r="2" className="fill-amber-500" />
        <circle cx="28" cy="10" r="2" className="fill-primary" />
        <circle cx="28" cy="24" r="2" className="fill-amber-500" />
        <circle cx="16" cy="31" r="2" className="fill-primary" />
        <circle cx="4" cy="24" r="2" className="fill-amber-500" />
        <circle cx="4" cy="10" r="2" className="fill-primary" />
        <circle cx="16" cy="17" r="3.5" className="fill-amber-400 group-hover:scale-125 transition-transform" />
        <line x1="16" y1="17" x2="16" y2="3" stroke="currentColor" strokeWidth="0.8" className="text-base-content/30" />
        <line x1="16" y1="17" x2="28" y2="10" stroke="currentColor" strokeWidth="0.8" className="text-base-content/30" />
        <line x1="16" y1="17" x2="28" y2="24" stroke="currentColor" strokeWidth="0.8" className="text-base-content/30" />
        <line x1="16" y1="17" x2="16" y2="31" stroke="currentColor" strokeWidth="0.8" className="text-base-content/30" />
        <line x1="16" y1="17" x2="4" y2="24" stroke="currentColor" strokeWidth="0.8" className="text-base-content/30" />
        <line x1="16" y1="17" x2="4" y2="10" stroke="currentColor" strokeWidth="0.8" className="text-base-content/30" />
      </svg>
    </div>
  );
};

/**
 * 3. RLAtari - Reinforcement Learning Retro Arcade Screen
 * Cathode-ray arcade screen with interactive bouncing ball and paddle
 */
export const RLAtariMark: React.FC = () => {
  const [state, setState] = useState({ ballX: 14, ballY: 10, paddleX: 10 });

  const handleInteract = () => {
    const nextX = Math.floor(Math.random() * 16) + 6;
    setState({
      ballX: nextX,
      ballY: Math.floor(Math.random() * 10) + 6,
      paddleX: Math.max(4, Math.min(20, nextX - 3)),
    });
  };

  return (
    <div
      onMouseEnter={handleInteract}
      onClick={handleInteract}
      className="relative w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs shrink-0 group overflow-hidden"
      title="RLatari - Deep Reinforcement Learning (Hover to play breakout)"
    >
      <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="4" width="26" height="24" rx="3" stroke="#22c55e" strokeWidth="1" opacity="0.6" />
        <line x1="6" y1="8" x2="12" y2="8" stroke="#ef4444" strokeWidth="2" />
        <line x1="13" y1="8" x2="19" y2="8" stroke="#f59e0b" strokeWidth="2" />
        <line x1="20" y1="8" x2="26" y2="8" stroke="#3b82f6" strokeWidth="2" />
        <circle cx={state.ballX} cy={state.ballY} r="2" fill="#eab308" className="transition-all duration-200" />
        <rect x={state.paddleX} y="24" width="8" height="2" rx="1" fill="#22c55e" className="transition-all duration-200" />
      </svg>
    </div>
  );
};

/**
 * 4. Graph Neural Networks (GNN) / Graphormer - Interactive Bipartite Relational Graph
 * User-Item graph nodes that light up relational edges on hover
 */
export const GNNGraphMark: React.FC = () => {
  const [activeEdge, setActiveEdge] = useState(0);

  return (
    <div
      onMouseEnter={() => setActiveEdge((e) => (e + 1) % 3)}
      onClick={() => setActiveEdge((e) => (e + 1) % 3)}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 via-base-200 to-base-300 border border-base-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-indigo-400/50 shrink-0 group"
      title="Graph Neural Networks - Relational Graph Learning"
    >
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <circle cx="7" cy="8" r="3" className="fill-primary" />
        <circle cx="7" cy="24" r="3" className="fill-primary/80" />
        <circle cx="25" cy="6" r="3" className="fill-indigo-500" />
        <circle cx="25" cy="16" r="3" className="fill-indigo-400" />
        <circle cx="25" cy="26" r="3" className="fill-indigo-500" />
        <line
          x1="7" y1="8" x2="25" y2="6"
          stroke="currentColor"
          strokeWidth={activeEdge === 0 ? '2' : '1'}
          className={activeEdge === 0 ? 'text-primary' : 'text-base-content/20'}
        />
        <line
          x1="7" y1="8" x2="25" y2="16"
          stroke="currentColor"
          strokeWidth={activeEdge === 1 ? '2' : '1'}
          className={activeEdge === 1 ? 'text-primary' : 'text-base-content/20'}
        />
        <line
          x1="7" y1="24" x2="25" y2="16"
          stroke="currentColor"
          strokeWidth={activeEdge === 2 ? '2' : '1'}
          className={activeEdge === 2 ? 'text-indigo-400' : 'text-base-content/20'}
        />
        <line
          x1="7" y1="24" x2="25" y2="26"
          stroke="currentColor"
          strokeWidth="1"
          className="text-base-content/20"
        />
      </svg>
    </div>
  );
};

/**
 * 5. StanceDialMark - Multilingual Stance & Bias Monitor
 * Dial with analog needle switching between DE / FR / IT / CH
 */
export const StanceDialMark: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const langs = ['DE', 'FR', 'IT', 'CH'];
  const rotations = [-30, 0, 30, 15];

  const handleHover = () => {
    setIdx((p) => (p + 1) % langs.length);
  };

  return (
    <div
      onMouseEnter={handleHover}
      onClick={handleHover}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/10 via-base-200 to-base-300 border border-base-300 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-rose-400/50 shrink-0 group overflow-hidden"
      title={`Voting Booklet Bias: Multilingual Stance (${langs[idx]})`}
    >
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M6 22 A11 11 0 0 1 26 22" stroke="currentColor" strokeWidth="1.5" className="text-base-content/30" strokeLinecap="round" />
        <circle cx="16" cy="22" r="2" className="fill-primary" />
        <line
          x1="16" y1="22"
          x2={16 + 8 * Math.sin((rotations[idx] * Math.PI) / 180)}
          y2={22 - 8 * Math.cos((rotations[idx] * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-rose-500 transition-all duration-300 ease-out"
        />
      </svg>
      <span className="text-[8px] font-mono font-extrabold text-primary -mt-1 bg-primary/10 px-1 rounded">
        {langs[idx]}
      </span>
    </div>
  );
};

/**
 * 6. BotAutomationMark - Mechanical Gearbot & Automation
 * Interactive spinning gear with active status indicator for bots (e.g. asvz-bot)
 */
export const BotAutomationMark: React.FC = () => {
  const [angle, setAngle] = useState(0);
  const [active, setActive] = useState(false);

  const handleInteract = () => {
    setAngle((a) => a + 45);
    setActive(true);
    setTimeout(() => setActive(false), 1000);
  };

  return (
    <div
      onMouseEnter={handleInteract}
      onClick={handleInteract}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 via-base-200 to-base-300 border border-base-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-cyan-400/50 shrink-0 group"
      title="Bot Automation - Scheduled Class Booking Bot"
    >
      <svg
        className="w-8 h-8 transition-transform duration-500 ease-out"
        style={{ transform: `rotate(${angle}deg)` }}
        viewBox="0 0 32 32"
        fill="none"
      >
        {/* Outer gear teeth */}
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-cyan-500" />
        {/* Center cog hub */}
        <circle cx="16" cy="16" r="5" className="fill-base-100 stroke-cyan-500" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="2" className={active ? 'fill-emerald-400' : 'fill-cyan-400'} />
      </svg>
      <span className="absolute bottom-1 right-1 flex h-1.5 w-1.5">
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
      </span>
    </div>
  );
};

/**
 * 7. ChatbotMark - Conversational Speech Bubbles with Typing Indicator
 */
export const ChatbotMark: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsTyping(true)}
      onMouseLeave={() => setIsTyping(false)}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 via-base-200 to-base-300 border border-base-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-emerald-400/50 shrink-0 group"
      title="Conversational AI & Chatbot"
    >
      <div className="relative">
        {/* Chat bubble */}
        <div className="w-8 h-6 rounded-lg bg-base-100 border border-emerald-500/40 flex items-center justify-center gap-0.5 px-1 shadow-xs">
          <span className={`w-1 h-1 rounded-full bg-emerald-500 ${isTyping ? 'animate-bounce' : ''}`} style={{ animationDelay: '0ms' }} />
          <span className={`w-1 h-1 rounded-full bg-emerald-500 ${isTyping ? 'animate-bounce' : ''}`} style={{ animationDelay: '150ms' }} />
          <span className={`w-1 h-1 rounded-full bg-emerald-500 ${isTyping ? 'animate-bounce' : ''}`} style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

/**
 * 8. DataVizMark - Dynamic Animated Waveform / Histogram
 */
export const DataVizMark: React.FC = () => {
  const [heights, setHeights] = useState([8, 14, 6, 16, 10]);

  const handleHover = () => {
    setHeights([
      Math.floor(Math.random() * 12) + 4,
      Math.floor(Math.random() * 14) + 4,
      Math.floor(Math.random() * 10) + 4,
      Math.floor(Math.random() * 16) + 4,
      Math.floor(Math.random() * 12) + 4,
    ]);
  };

  return (
    <div
      onMouseEnter={handleHover}
      onClick={handleHover}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 via-base-200 to-base-300 border border-base-300 flex items-end justify-center gap-1 p-2.5 cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-purple-400/50 shrink-0 group"
      title="Data Visualization & Visual Odometry"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-xs bg-purple-500 transition-all duration-300 ease-out"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
};

/**
 * 9. KnowledgeGraphMark - Entity-Relationship Triples
 */
export const KnowledgeGraphMark: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <div
      onMouseEnter={() => setActive((p) => (p + 1) % 3)}
      onClick={() => setActive((p) => (p + 1) % 3)}
      className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/10 via-base-200 to-base-300 border border-base-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-sky-400/50 shrink-0 group"
      title="Knowledge Graph Reasoning & Triples"
    >
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <circle cx="6" cy="16" r="3.5" className="fill-sky-500" />
        <circle cx="26" cy="8" r="3" className="fill-primary" />
        <circle cx="26" cy="24" r="3" className="fill-secondary" />
        <path
          d="M9 16 L23 8"
          stroke="currentColor"
          strokeWidth={active === 0 ? '2' : '1'}
          className={active === 0 ? 'text-sky-400' : 'text-base-content/20'}
        />
        <path
          d="M9 16 L23 24"
          stroke="currentColor"
          strokeWidth={active === 1 ? '2' : '1'}
          className={active === 1 ? 'text-secondary' : 'text-base-content/20'}
        />
      </svg>
    </div>
  );
};

/**
 * 10. DotMatrixMark - Interactive Jumping Dot Grid (Inspired by pandermatt.ch)
 */
export const DotMatrixMark: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(4);

  const handleHover = () => {
    setActiveIdx(Math.floor(Math.random() * 9));
  };

  return (
    <div
      onMouseEnter={handleHover}
      onClick={handleHover}
      className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-base-200 border border-base-300 cursor-pointer select-none transition-transform hover:scale-110 shrink-0 w-12 h-12 place-items-center"
      title="Interactive Mark (Hover to jump active node)"
    >
      {[...Array(9)].map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            i === activeIdx
              ? 'bg-primary scale-150 shadow-xs ring-2 ring-primary/40'
              : 'bg-base-content/20'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * 11. CodeMatrixMark - Algorithmic Binary & Code Matrix
 */
export const CodeMatrixMark: React.FC = () => {
  const [pulse, setPulse] = useState(0);

  return (
    <div
      onMouseEnter={() => setPulse((p) => (p + 1) % 4)}
      onClick={() => setPulse((p) => (p + 1) % 4)}
      className="relative w-12 h-12 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-xs hover:border-primary/50 shrink-0 group"
      title="Code Repository"
    >
      <div className="grid grid-cols-3 gap-1 p-1 font-mono text-[9px] font-bold text-base-content/60 leading-none">
        <span className={pulse === 0 ? 'text-primary font-black' : ''}>{'{ }'}</span>
        <span className={pulse === 1 ? 'text-secondary font-black' : ''}>01</span>
        <span className={pulse === 2 ? 'text-primary font-black' : ''}>&lt;/&gt;</span>
        <span className={pulse === 3 ? 'text-secondary font-black' : ''}>fn</span>
        <span className={pulse === 0 ? 'text-primary font-black' : ''}>AI</span>
        <span className={pulse === 1 ? 'text-secondary font-black' : ''}>git</span>
      </div>
    </div>
  );
};
