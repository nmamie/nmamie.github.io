import { Fragment } from 'react';
import { AiOutlineFork, AiOutlineStar, AiOutlineGithub } from 'react-icons/ai';
import { ga, getLanguageColor, skeleton } from '../../utils';
import { GithubProject } from '../../interfaces/github-project';
import {
  HiveMindMark,
  RLAtariMark,
  GNNGraphMark,
  StanceDialMark,
  KnowledgeGraphMark,
  BotAutomationMark,
  ChatbotMark,
  DataVizMark,
  DotMatrixMark,
} from '../project-marks';

const GithubProjectCard = ({
  header: _header,
  githubProjects,
  loading,
  limit,
  googleAnalyticsId,
}: {
  header: string;
  githubProjects: GithubProject[];
  loading: boolean;
  limit: number;
  googleAnalyticsId?: string;
}) => {
  if (!loading && githubProjects.length === 0) {
    return null;
  }

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < limit; index++) {
      array.push(
        <div className="card shadow-md bg-base-100 p-6 space-y-4" key={index}>
          <div className="flex gap-4 items-center">
            {skeleton({ widthCls: 'w-12', heightCls: 'h-12', shape: 'rounded-xl' })}
            <div className="flex-1 space-y-2">
              {skeleton({ widthCls: 'w-1/2', heightCls: 'h-6' })}
              {skeleton({ widthCls: 'w-1/3', heightCls: 'h-4' })}
            </div>
          </div>
          {skeleton({ widthCls: 'w-full', heightCls: 'h-12' })}
        </div>,
      );
    }
    return array;
  };

  const getIndividualProjectMark = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('hive') || lower.includes('swarm') || lower.includes('sohm')) {
      return <HiveMindMark />;
    }
    if (lower.includes('rl') || lower.includes('atari') || lower.includes('game') || lower.includes('checker')) {
      return <RLAtariMark />;
    }
    if (lower.includes('graph') || lower.includes('gnn') || lower.includes('network') || lower.includes('transformer')) {
      return <GNNGraphMark />;
    }
    if (lower.includes('kg') || lower.includes('knowledge') || lower.includes('reasoning') || lower.includes('laureate')) {
      return <KnowledgeGraphMark />;
    }
    if (lower.includes('bot') || lower.includes('asvz') || lower.includes('auto')) {
      return <BotAutomationMark />;
    }
    if (lower.includes('chat') || lower.includes('sopra') || lower.includes('comm')) {
      return <ChatbotMark />;
    }
    if (lower.includes('data') || lower.includes('viz') || lower.includes('visual') || lower.includes('odometry') || lower.includes('ml4h')) {
      return <DataVizMark />;
    }
    if (lower.includes('bias') || lower.includes('stance') || lower.includes('vote') || lower.includes('nlp')) {
      return <StanceDialMark />;
    }
    return <DotMatrixMark />;
  };

  const renderProjects = () => {
    return githubProjects.map((item, index) => (
      <a
        className="p-6 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group cursor-pointer"
        href={item.html_url}
        key={index}
        onClick={(e) => {
          e.preventDefault();

          try {
            if (googleAnalyticsId) {
              ga.event('Click project', { project: item.name });
            }
          } catch (error) {
            console.error(error);
          }

          window?.open(item.html_url, '_blank');
        }}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {getIndividualProjectMark(item.name)}

              <div>
                <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors flex items-center gap-1">
                  <span>{item.name}</span>
                </h3>
                {item.language && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getLanguageColor(item.language) }}
                    />
                    <span className="text-xs font-mono opacity-70">
                      {item.language}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action button */}
            <div className="w-8 h-8 rounded-full bg-base-200 border border-base-300 group-hover:bg-primary group-hover:text-primary-content group-hover:scale-110 flex items-center justify-center transition-all duration-300 shrink-0">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed line-clamp-3">
            {item.description || 'Open-source software repository on GitHub.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-base-300/60 text-xs text-base-content/60 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <AiOutlineStar className="text-sm" />
              <span>{item.stargazers_count}</span>
            </span>
            <span className="flex items-center gap-1">
              <AiOutlineFork className="text-sm" />
              <span>{item.forks_count}</span>
            </span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
            GitHub
          </span>
        </div>
      </a>
    ));
  };

  return (
    <Fragment>
      <div className="col-span-1 lg:col-span-2">
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-base-300 pb-4">
              <div className="flex items-center space-x-3">
                {loading ? (
                  skeleton({
                    widthCls: 'w-12',
                    heightCls: 'h-12',
                    className: 'rounded-xl',
                  })
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary shrink-0">
                    <AiOutlineGithub className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                    Open Source Codebases
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                    Software & Repositories
                  </h2>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? renderSkeleton() : renderProjects()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GithubProjectCard;
