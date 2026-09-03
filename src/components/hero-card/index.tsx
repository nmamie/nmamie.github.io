import React from 'react';
import { HiOutlineLocationMarker, HiOutlineAcademicCap } from 'react-icons/hi';
import { BsArrowRight } from 'react-icons/bs';
import { skeleton } from '../../utils';
import { InformfullyMark, HiveMindMark, StanceDialMark, GNNGraphMark } from '../project-marks';

interface HeroCardProps {
  loading: boolean;
  onNavigateTab: (tab: string, filter?: string) => void;
  onScrollToSwarm?: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({
  loading,
  onNavigateTab,
  onScrollToSwarm: _onScrollToSwarm,
}) => {
  if (loading) {
    return (
      <div className="card shadow-lg bg-base-100 p-6 md:p-8 space-y-4">
        {skeleton({ widthCls: 'w-2/3', heightCls: 'h-8' })}
        {skeleton({ widthCls: 'w-full', heightCls: 'h-20', shape: 'rounded-xl' })}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {skeleton({ widthCls: 'w-full', heightCls: 'h-28', shape: 'rounded-xl' })}
          {skeleton({ widthCls: 'w-full', heightCls: 'h-28', shape: 'rounded-xl' })}
        </div>
      </div>
    );
  }

  const researchPillars = [
    {
      id: 'recommenders',
      mark: <InformfullyMark />,
      title: 'GenAI & Personalized News Recommenders',
      desc: 'Developing generative recommendation architectures and conducting real-world empirical field studies via the Informfully platform.',
      badge: 'Core PhD Focus',
      actionText: 'Explore Informfully',
      onClick: () => onNavigateTab('projects'),
    },
    {
      id: 'swarm',
      mark: <HiveMindMark />,
      title: 'Collective & Swarm Intelligence',
      desc: 'Exploring how multi-agent foundation model swarms and decentralized collective intelligence can be harnessed within recommendation and complex reasoning systems.',
      badge: 'Core Research Interest',
      actionText: 'View HiveMind',
      onClick: () => onNavigateTab('publications', 'Swarm Intelligence'),
    },
    {
      id: 'gnn',
      mark: <GNNGraphMark />,
      title: 'Graph Neural Networks (GNNs)',
      desc: 'Leveraging graph representation learning, knowledge graphs, and relational modeling to capture user-item dynamics and information diffusion.',
      badge: 'Core Technique',
      actionText: 'See Research',
      onClick: () => onNavigateTab('publications'),
    },
    {
      id: 'bias-nlp',
      mark: <StanceDialMark />,
      title: 'NLP & Viewpoint Bias Monitoring',
      desc: 'Building automated stance detection and text analytics to measure viewpoint diversity, neutrality, and discourse bias in media communications.',
      badge: 'Best Poster 🏆',
      actionText: 'View Paper',
      onClick: () => onNavigateTab('publications', 'NLP & Bias Detection'),
    },
  ];

  return (
    <div className="card shadow-xl bg-base-100 border border-base-300 overflow-hidden relative">
      {/* Subtle decorative background gradient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="card-body p-6 md:p-8 relative z-10 space-y-6">
        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/25 text-primary shadow-xs">
            <HiOutlineAcademicCap className="w-4 h-4 shrink-0" />
            UZH.ai Fellow • DSI Excellence Program
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-base-200 border border-base-300 text-base-content/80 shadow-xs">
            <HiOutlineLocationMarker className="text-primary w-3.5 h-3.5 shrink-0" />
            Zurich, Switzerland
          </span>
          <a
            href="https://www.ifi.uzh.ch/en/ddis.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-base-200 hover:bg-base-300 border border-base-300 text-base-content/80 transition-colors shadow-xs"
          >
            🏛️ UZH DDIS Lab
          </a>
        </div>

        {/* Narrative Hero Statement */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-base-content leading-tight">
            Advancing <span className="text-primary underline decoration-primary/30 underline-offset-4">GenAI</span> for{' '}
            <span className="text-secondary underline decoration-secondary/30 underline-offset-4">Personalized News Recommenders</span> &{' '}
            <span className="opacity-90">Collective Intelligence</span>.
          </h1>
          <p className="text-base text-base-content/80 leading-relaxed max-w-3xl">
            I am a Doctoral Researcher and <strong>UZH.ai Fellow</strong> in the{' '}
            <a
              href="https://www.ifi.uzh.ch/en/ddis.html"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Dynamic and Distributed Information Systems (DDIS)
            </a>{' '}
            group at the <strong>University of Zurich</strong>, and a scholar in the{' '}
            <a
              href="https://www.dsi.uzh.ch/en/research/phd/excellence-program.html"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Digital Society Initiative (DSI) Excellence Program
            </a>
            . My core PhD research focuses on <strong>Generative AI in personalized news recommender systems</strong>, combining the latest advancements in <strong>frontier foundation models</strong> and on <strong>recommender systems</strong> with empirical field studies on platforms like <a href="https://informfully.ch" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">Informfully</a>. In this context, I explore <strong>Collective & Swarm Intelligence</strong> to investigate how multi-agent foundation model swarms can enhance recommendation reasoning and information diversity.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-b border-base-300/60 py-3">
          <button
            onClick={() => onNavigateTab('projects')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline group"
          >
            <span>Informfully & Systems</span>
            <span className="group-hover:translate-x-1 transition-transform">›</span>
          </button>
          <span className="text-base-content/30">•</span>
          <button
            onClick={() => onNavigateTab('publications')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-base-content/80 hover:text-primary hover:underline group"
          >
            <span>Publications & Papers</span>
            <span className="group-hover:translate-x-1 transition-transform">›</span>
          </button>
          <span className="text-base-content/30">•</span>
          <button
            onClick={() => onNavigateTab('cv')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-base-content/80 hover:text-primary hover:underline group"
          >
            <span>Curriculum Vitae</span>
            <span className="group-hover:translate-x-1 transition-transform">›</span>
          </button>
          <span className="text-base-content/30">•</span>
          <a
            href="https://scholar.google.com/citations?user=JhXjm_sAAAAJ&hl=de"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-base-content/80 hover:text-primary hover:underline group ml-auto"
          >
            <span>Google Scholar</span>
            <span className="group-hover:translate-x-1 transition-transform">›</span>
          </a>
        </div>

        {/* Research Pillars with Interactive Marks */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 font-mono">
              Research Pillars & Methodologies
            </h3>
            <span className="text-[11px] text-base-content/50 hidden sm:inline">
              Interactive micro-figures • Click card to navigate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {researchPillars.map((pillar) => (
              <div
                key={pillar.id}
                onClick={pillar.onClick}
                className="group p-4 rounded-2xl bg-base-200/60 hover:bg-base-200 border border-base-300 hover:border-primary/40 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-3">
                      {pillar.mark}
                      <h4 className="font-bold text-sm text-base-content group-hover:text-primary transition-colors leading-snug">
                        {pillar.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-base-content/70 leading-relaxed line-clamp-3">
                    {pillar.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-base-300/60">
                  <span className="badge badge-xs text-[9px] font-bold uppercase tracking-wider py-1.5 px-2 bg-base-100 border-base-300 text-base-content/70">
                    {pillar.badge}
                  </span>
                  <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {pillar.actionText} <BsArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
