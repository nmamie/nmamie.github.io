import { Fragment } from 'react';
import { PiPresentation, PiMicrophoneStage } from 'react-icons/pi';
import { HiOutlineExternalLink, HiOutlineCalendar } from 'react-icons/hi';
import { skeleton } from '../../utils';

interface Talk {
  title: string;
  date: string;
  link?: string;
  description?: string;
}

const TalksCard = ({
  talks,
  loading,
}: {
  talks: Talk[];
  loading: boolean;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 3; index++) {
      array.push(
        <div className="card shadow-md bg-base-100 p-6 space-y-3" key={index}>
          <div className="flex justify-between items-center">
            {skeleton({ widthCls: 'w-1/3', heightCls: 'h-5' })}
            {skeleton({ widthCls: 'w-24', heightCls: 'h-4' })}
          </div>
          {skeleton({ widthCls: 'w-3/4', heightCls: 'h-6' })}
          {skeleton({ widthCls: 'w-full', heightCls: 'h-12' })}
        </div>,
      );
    }
    return array;
  };

  const renderTalks = () => {
    if (talks.length === 0) {
      return (
        <div className="text-center py-12 text-base-content opacity-50">
          No talks or presentations listed yet.
        </div>
      );
    }

    return talks.map((item, index) => {
      const elementId = `talk-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      
      const isLecture = item.title.toLowerCase().includes('lecture') || item.title.toLowerCase().includes('course');
      const isDemo = item.title.toLowerCase().includes('demo') || item.title.toLowerCase().includes('demonstration');
      const isConf = item.title.toLowerCase().includes('icsi') || item.title.toLowerCase().includes('conference') || item.title.toLowerCase().includes('society');
      
      const badgeText = isLecture
        ? 'Invited Guest Lecture'
        : isDemo
        ? 'System Demonstration'
        : isConf
        ? 'Conference Presentation'
        : 'Invited Talk';

      return (
        <div
          id={elementId}
          key={index}
          className="p-6 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md space-y-3 group scroll-mt-28"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <PiMicrophoneStage className="text-xs" />
              {badgeText}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-base-content/60">
              <HiOutlineCalendar className="text-xs opacity-70" />
              {item.date}
            </span>
          </div>

          <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors leading-snug">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <span>{item.title}</span>
                <HiOutlineExternalLink className="text-sm opacity-60 group-hover:opacity-100" />
              </a>
            ) : (
              item.title
            )}
          </h3>

          {item.description && (
            <p className="text-sm text-base-content/80 leading-relaxed text-justify">
              {item.description}
            </p>
          )}

          {item.link && (
            <div className="pt-2">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-xs font-semibold rounded-lg gap-1 border-base-content/20 hover:bg-base-200"
              >
                <span>View Event / Session Info</span>
                <HiOutlineExternalLink className="text-xs" />
              </a>
            </div>
          )}
        </div>
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
                    <PiPresentation className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                    Public Speaking & Outreach
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                    Invited Talks & Presentations
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? renderSkeleton() : renderTalks()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TalksCard;
