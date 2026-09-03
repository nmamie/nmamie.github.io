import { Fragment } from 'react';
import { PiMegaphoneLight, PiMicrophoneStage, PiGraduationCap, PiArticle } from 'react-icons/pi';
import { HiOutlineCalendar, HiOutlineExternalLink, HiOutlineSparkles } from 'react-icons/hi';
import { SanitizedNews } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

interface NewsCardProps {
  news: SanitizedNews[];
  loading: boolean;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

const NewsCard = ({
  news,
  loading,
  onViewAll,
  showViewAll,
}: NewsCardProps) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 3; index++) {
      array.push(
        <div className="card shadow-md bg-base-100 p-6 space-y-3" key={index}>
          <div className="flex justify-between items-center">
            {skeleton({ widthCls: 'w-1/4', heightCls: 'h-5', shape: 'rounded-full' })}
            {skeleton({ widthCls: 'w-24', heightCls: 'h-4' })}
          </div>
          {skeleton({ widthCls: 'w-3/4', heightCls: 'h-6' })}
          {skeleton({ widthCls: 'w-full', heightCls: 'h-14' })}
        </div>,
      );
    }
    return array;
  };

  const getNewsBadge = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('fellowship') || lower.includes('dsi') || lower.includes('award') || lower.includes('fellow')) {
      return {
        label: 'Fellowship & Award',
        icon: <PiGraduationCap className="text-xs" />,
        cls: 'bg-primary/10 text-primary border-primary/20',
      };
    }
    if (lower.includes('lecture') || lower.includes('talk') || lower.includes('course')) {
      return {
        label: 'Invited Lecture',
        icon: <PiMicrophoneStage className="text-xs" />,
        cls: 'bg-secondary/10 text-secondary border-secondary/20',
      };
    }
    if (lower.includes('demo') || lower.includes('demonstration') || lower.includes('side event')) {
      return {
        label: 'System Demonstration',
        icon: <HiOutlineSparkles className="text-xs" />,
        cls: 'bg-accent/10 text-accent border-accent/20',
      };
    }
    if (lower.includes('paper') || lower.includes('published') || lower.includes('arxiv')) {
      return {
        label: 'Publication',
        icon: <PiArticle className="text-xs" />,
        cls: 'bg-primary/10 text-primary border-primary/20',
      };
    }
    return {
      label: 'Academic Milestone',
      icon: <PiMegaphoneLight className="text-xs" />,
      cls: 'bg-base-200 text-base-content/80 border-base-300',
    };
  };

  const renderNews = () => {
    if (news.length === 0) {
      return (
        <div className="text-center py-12 text-base-content opacity-50">
          No news or announcements available.
        </div>
      );
    }

    return news.map((item, index) => {
      const elementId = `news-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const badge = getNewsBadge(item.title);

      return (
        <div
          id={elementId}
          key={index}
          className="p-6 rounded-2xl bg-base-100 border border-base-300 hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-md space-y-3 group scroll-mt-28"
        >
          {/* Badge & Date Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.cls}`}
            >
              {badge.icon}
              {badge.label}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-base-content/60">
              <HiOutlineCalendar className="text-xs opacity-70" />
              {item.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors leading-snug">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline"
              >
                <span>{item.title}</span>
                <HiOutlineExternalLink className="text-sm opacity-60 group-hover:opacity-100 shrink-0" />
              </a>
            ) : (
              item.title
            )}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-base-content/80 leading-relaxed text-justify">
              {item.description}
            </p>
          )}

          {/* Action button if link is present */}
          {item.link && (
            <div className="pt-1">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-xs font-semibold rounded-lg gap-1 border-base-content/20 hover:bg-base-200"
              >
                <span>Read More / Announcement</span>
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
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-base-300 pb-4">
              <div className="flex items-center space-x-3">
                {loading ? (
                  skeleton({
                    widthCls: 'w-12',
                    heightCls: 'h-12',
                    className: 'rounded-xl',
                  })
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary shrink-0">
                    <PiMegaphoneLight className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                    Updates & Dispatches
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                    Recent News & Announcements
                  </h2>
                </div>
              </div>

              {showViewAll && onViewAll && (
                <button
                  onClick={onViewAll}
                  className="btn btn-outline btn-xs rounded-lg font-semibold gap-1 self-start sm:self-auto"
                >
                  <span>View All Updates</span>
                  <span>›</span>
                </button>
              )}
            </div>

            {/* News List */}
            <div className="grid grid-cols-1 gap-4">
              {loading ? renderSkeleton() : renderNews()}
            </div>

            {/* Optional Footer Link on About Tab */}
            {showViewAll && onViewAll && (
              <div className="text-center pt-2">
                <button
                  onClick={onViewAll}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Browse full announcement history in the News section</span>
                  <span>›</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewsCard;
