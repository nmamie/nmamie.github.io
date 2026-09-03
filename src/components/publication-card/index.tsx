import { Fragment, useState, useMemo } from 'react';
import { AiOutlineBook, AiOutlineCopy, AiOutlineCheck } from 'react-icons/ai';
import { SiGooglescholar, SiGithub } from 'react-icons/si';
import { FiFileText, FiEye, FiEyeOff, FiCode, FiExternalLink } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import { useLiveCitations } from '../../utils/useLiveCitations';
import LazyImage from '../lazy-image';

const PublicationItem = ({
  item,
  citationCount,
}: {
  item: SanitizedPublication;
  citationCount?: number;
}) => {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const [isBibtexExpanded, setIsBibtexExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const elementId = `pub-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div id={elementId} className="group border-b border-base-300 pb-8 last:border-0 last:pb-0 scroll-mt-28">
      <div className="flex flex-col md:flex-row gap-6">
        {item.imageUrl && (
          <div className="w-full md:w-1/4 shrink-0">
            <div className="rounded-xl overflow-hidden border border-base-300 shadow-xs transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.01] bg-base-100">
              <LazyImage
                src={item.imageUrl}
                alt={item.title}
                placeholder={skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-36 md:h-44',
                  shape: 'rounded-none',
                })}
                className="w-full h-auto object-cover max-h-48 md:max-h-56"
              />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            {/* Topic tags */}
            {item.topics && item.topics.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                {item.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-base-300/80 text-base-content/75 border border-base-content/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-base sm:text-lg font-bold text-base-content group-hover:text-primary transition-colors leading-snug">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>

            {item.authors && (
              <p className="text-xs sm:text-sm text-base-content/70">
                {item.authors.split(/,\s*|\s+and\s+/).map((author, i, arr) => {
                  const cleanAuthor = author.trim();
                  const authorLink = item.authorLinks?.[cleanAuthor];
                  const isNoah = cleanAuthor.toLowerCase().includes('mamie') || cleanAuthor.toLowerCase().includes('mamié');

                  const renderAuthorName = () => {
                    if (isNoah) {
                      return <strong className="text-base-content font-bold">{cleanAuthor}</strong>;
                    }
                    if (authorLink) {
                      return (
                        <a
                          href={authorLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-primary transition-colors"
                        >
                          {cleanAuthor}
                        </a>
                      );
                    }
                    return cleanAuthor;
                  };

                  return (
                    <span
                      key={i}
                      className={isNoah ? 'font-semibold text-base-content underline decoration-primary/40 underline-offset-2' : ''}
                    >
                      {renderAuthorName()}
                      {i < arr.length - 1 ? ', ' : ''}
                    </span>
                  );
                })}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-primary/90">
                {item.conferenceName || item.journalName}
              </p>
              {item.year && (
                <span className="badge badge-sm badge-ghost text-[10px] font-mono">
                  {item.year}
                </span>
              )}
              {item.journalStatus && (
                <div className="badge badge-warning badge-outline text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                  {item.journalStatus}
                </div>
              )}
              {item.journalAward && (
                <div className="badge badge-secondary text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider text-secondary-content shadow-xs border border-secondary/40">
                  {item.journalAward}
                </div>
              )}
            </div>

            {/* TL;DR / 1-Sentence Insight */}
            {item.tldr && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs leading-relaxed text-base-content/90 flex items-start gap-2 shadow-inner mt-1">
                <HiOutlineSparkles className="text-primary text-base shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-primary mr-1.5">Key Insight:</span>
                  <span>{item.tldr}</span>
                </div>
              </div>
            )}

            {/* Layman Summary */}
            {item.laymanSummary && !item.tldr && (
              <div className="bg-primary/5 border-l-2 border-primary px-3 py-2 rounded-r-lg mt-1 text-xs leading-relaxed text-justify">
                <span className="font-semibold text-primary block mb-0.5">Summary:</span>
                <span className="opacity-80">{item.laymanSummary}</span>
              </div>
            )}

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-xs normal-case gap-1.5 shadow-xs font-semibold"
                >
                  <FiFileText className="text-xs" />
                  Read Paper
                </a>
              )}
              {item.codeUrl && (
                <a
                  href={item.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-xs normal-case gap-1.5 font-medium border-base-content/20 hover:bg-base-300"
                >
                  <SiGithub className="text-xs" />
                  Code & Data
                </a>
              )}
              {item.slidesUrl && (
                <a
                  href={item.slidesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-xs normal-case gap-1.5 font-medium border-base-content/20 hover:bg-base-300"
                >
                  <FiExternalLink className="text-xs" />
                  Slides / Poster
                </a>
              )}
              {item.googleScholarLink && (
                <a
                  href={item.googleScholarLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center h-6 rounded-md overflow-hidden border border-base-content/20 hover:border-primary/50 transition-colors shadow-xs text-[10px] font-mono"
                  title="View on Google Scholar (Live Citations)"
                >
                  <span className="bg-[#4285F4] text-white px-2 h-full flex items-center gap-1 font-semibold uppercase tracking-wider text-[9px]">
                    <SiGooglescholar className="text-[11px]" />
                    Scholar
                  </span>
                  <span className="bg-base-300 text-base-content px-2 h-full flex items-center font-bold">
                    {citationCount ?? item.citations ?? 0}
                  </span>
                </a>
              )}
              {item.description && (
                <button
                  onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                  className="btn btn-ghost btn-xs normal-case gap-1 border border-base-content/10 hover:bg-base-300"
                >
                  {isAbstractExpanded ? (
                    <>
                      <FiEyeOff className="text-xs" />
                      Hide Abstract
                    </>
                  ) : (
                    <>
                      <FiEye className="text-xs" />
                      Abstract
                    </>
                  )}
                </button>
              )}
              {item.bibtex && (
                <button
                  onClick={() => setIsBibtexExpanded(!isBibtexExpanded)}
                  className="btn btn-ghost btn-xs normal-case gap-1 border border-base-content/10 hover:bg-base-300"
                >
                  <FiCode className="text-xs" />
                  BibTeX
                </button>
              )}
            </div>

            {/* Expandable Abstract */}
            {isAbstractExpanded && item.description && (
              <div className="mt-3 p-4 bg-base-100/90 rounded-xl border border-base-300 text-xs sm:text-sm text-base-content/85 leading-relaxed text-justify shadow-inner">
                <span className="font-bold text-primary block mb-1 text-xs uppercase tracking-wider font-mono">
                  Abstract
                </span>
                {item.description}
              </div>
            )}

            {/* Expandable BibTeX */}
            {isBibtexExpanded && item.bibtex && (
              <div className="mt-3 relative">
                <pre className="p-4 bg-base-300 rounded-xl text-[11px] font-mono overflow-x-auto text-base-content/90 border border-base-content/10 leading-normal">
                  {item.bibtex}
                </pre>
                <button
                  onClick={() => copyToClipboard(item.bibtex!)}
                  className="btn btn-xs btn-primary absolute top-2.5 right-2.5 gap-1 shadow-sm font-mono"
                  title="Copy BibTeX to clipboard"
                >
                  {copied ? (
                    <>
                      <AiOutlineCheck className="text-xs" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <AiOutlineCopy className="text-xs" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicationCard = ({
  publications,
  loading,
  selectedTopicFilter,
  onTopicFilterChange,
}: {
  publications: SanitizedPublication[];
  loading: boolean;
  selectedTopicFilter?: string;
  onTopicFilterChange?: (topic: string) => void;
}) => {
  const [internalTopic, setInternalTopic] = useState('All');
  const activeTopic = selectedTopicFilter ?? internalTopic;
  const liveCitations = useLiveCitations(publications);

  const handleSelectTopic = (topic: string) => {
    if (onTopicFilterChange) {
      onTopicFilterChange(topic);
    } else {
      setInternalTopic(topic);
    }
  };

  // Collect all unique topics
  const allTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    publications.forEach((p) => {
      if (p.topics) {
        p.topics.forEach((t) => topicsSet.add(t));
      }
    });
    return ['All', ...Array.from(topicsSet)];
  }, [publications]);

  const filteredPublications = useMemo(() => {
    if (activeTopic === 'All') return publications;
    return publications.filter((p) => p.topics && p.topics.includes(activeTopic));
  }, [publications, activeTopic]);

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <div className="card shadow-md bg-base-100 p-6 space-y-4" key={index}>
          <div className="flex gap-4">
            <div className="w-1/4">
              {skeleton({ widthCls: 'w-full', heightCls: 'h-32', shape: 'rounded-xl' })}
            </div>
            <div className="flex-1 space-y-2">
              {skeleton({ widthCls: 'w-3/4', heightCls: 'h-6' })}
              {skeleton({ widthCls: 'w-1/2', heightCls: 'h-4' })}
              {skeleton({ widthCls: 'w-full', heightCls: 'h-16' })}
            </div>
          </div>
        </div>,
      );
    }
    return array;
  };

  const renderPublications = () => {
    if (filteredPublications.length === 0) {
      return (
        <div className="text-center py-12 text-base-content opacity-50 space-y-2">
          <p className="font-semibold text-base">No publications found for "{activeTopic}".</p>
          <button
            onClick={() => handleSelectTopic('All')}
            className="btn btn-outline btn-xs"
          >
            Show all publications
          </button>
        </div>
      );
    }

    const grouped = filteredPublications.reduce((acc, pub) => {
      const year = pub.year || 'Other';
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    }, {} as Record<string, SanitizedPublication[]>);

    const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return years.map((year) => (
      <div key={year} className="mb-10 last:mb-0">
        <h3 className="text-lg font-bold mb-6 border-b border-base-300 pb-2 text-base-content/70 flex items-center gap-2">
          <span>{year}</span>
          <span className="text-xs font-mono opacity-50 font-normal">
            ({grouped[year].length} {grouped[year].length === 1 ? 'publication' : 'publications'})
          </span>
        </h3>
        <div className="flex flex-col gap-10">
          {grouped[year].map((item, index) => (
            <PublicationItem
              key={index}
              item={item}
              citationCount={liveCitations[item.title] ?? item.citations}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Fragment>
      <div className="col-span-1 lg:col-span-2">
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {loading ? (
                  skeleton({
                    widthCls: 'w-12',
                    heightCls: 'h-12',
                    className: 'rounded-xl',
                  })
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary shrink-0">
                    <AiOutlineBook className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 font-mono">
                    Research & Publications
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-base-content tracking-tight">
                    Peer-Reviewed Publications & Preprints
                  </h2>
                </div>
              </div>

              {/* Topic Filter Chips */}
              {allTopics.length > 2 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {allTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => handleSelectTopic(topic)}
                      className={`btn btn-xs rounded-full normal-case font-medium transition-all ${
                        activeTopic === topic
                          ? 'btn-primary shadow-xs'
                          : 'btn-ghost bg-base-100 hover:bg-base-300 border-base-300 text-base-content/70'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? renderSkeleton() : renderPublications()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PublicationCard;
