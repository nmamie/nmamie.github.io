import { Fragment } from 'react';
import { MdOpenInNew } from 'react-icons/md';
import { HiOutlineTag, HiOutlineCube } from 'react-icons/hi';
import { ga, skeleton } from '../../utils';
import { SanitizedExternalProject } from '../../interfaces/sanitized-config';
import {
  InformfullyMark,
  HiveMindMark,
  StanceDialMark,
  RLAtariMark,
  GNNGraphMark,
  DotMatrixMark,
} from '../project-marks';

const ExternalProjectCard = ({
  externalProjects,
  header: _header,
  loading,
  googleAnalyticId,
}: {
  externalProjects: SanitizedExternalProject[];
  header: string;
  loading: boolean;
  googleAnalyticId?: string;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < externalProjects.length; index++) {
      array.push(
        <div className="card shadow-md bg-base-100 p-6 space-y-4" key={index}>
          <div className="flex gap-4 items-center">
            {skeleton({ widthCls: 'w-14', heightCls: 'h-14', shape: 'rounded-2xl' })}
            <div className="flex-1 space-y-2">
              {skeleton({ widthCls: 'w-1/2', heightCls: 'h-6' })}
              {skeleton({ widthCls: 'w-1/3', heightCls: 'h-4' })}
            </div>
          </div>
          {skeleton({ widthCls: 'w-full', heightCls: 'h-16' })}
        </div>,
      );
    }
    return array;
  };

  const getProjectMark = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('informfully')) return <InformfullyMark />;
    if (lower.includes('hive') || lower.includes('swarm') || lower.includes('sohm')) return <HiveMindMark />;
    if (lower.includes('bias') || lower.includes('stance') || lower.includes('booklet') || lower.includes('vote')) return <StanceDialMark />;
    if (lower.includes('rl') || lower.includes('atari')) return <RLAtariMark />;
    if (lower.includes('graph') || lower.includes('gnn')) return <GNNGraphMark />;
    return <DotMatrixMark />;
  };

  const renderExternalProjects = () => {
    return externalProjects.map((item, index) => {
      return (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            try {
              if (googleAnalyticId) {
                ga.event('Click External Project', {
                  post: item.title,
                });
              }
            } catch (error) {
              console.error(error);
            }
          }}
          className="p-6 md:p-8 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group cursor-pointer"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Unique Interactive Project Mark */}
                {getProjectMark(item.title)}

                <div>
                  <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </h3>
                  {/* Platforms / Tags */}
                  {item.platforms && item.platforms.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {item.platforms.map((plat, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="w-9 h-9 rounded-full bg-base-200 border border-base-300 group-hover:bg-primary group-hover:text-primary-content group-hover:scale-110 flex items-center justify-center transition-all duration-300 shrink-0">
                <svg
                  width="14"
                  height="14"
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

            {/* Description */}
            <p className="text-sm text-base-content/80 leading-relaxed text-justify">
              {item.description}
            </p>

            {/* Project Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-base-200 text-base-content/70 border border-base-300"
                  >
                    <HiOutlineTag className="text-xs opacity-60" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-base-300/60 text-xs font-mono text-base-content/60">
            <span className="flex items-center gap-1 font-semibold text-primary group-hover:underline">
              <span>View System & Code</span>
              <MdOpenInNew className="text-sm" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
              Research Platform
            </span>
          </div>
        </a>
      );
    });
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
                    <HiOutlineCube className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                    Featured Systems & Platforms
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                    Research Platforms & Systems
                  </h2>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {loading ? renderSkeleton() : renderExternalProjects()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ExternalProjectCard;
