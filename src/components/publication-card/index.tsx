import { Fragment, useState } from 'react';
import { AiOutlineBook, AiOutlineCopy, AiOutlineCheck } from 'react-icons/ai';
import { FiFileText, FiEye, FiEyeOff, FiCode } from 'react-icons/fi';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import LazyImage from '../lazy-image';

const PublicationItem = ({ item }: { item: SanitizedPublication }) => {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const [isBibtexExpanded, setIsBibtexExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group border-b border-base-300 pb-8 last:border-0 last:pb-0">
      <div className="flex flex-col md:flex-row gap-6">
        {item.imageUrl && (
          <div className="w-full md:w-1/4 shrink-0">
            <div className="rounded-lg overflow-hidden border border-base-300 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
              <LazyImage
                src={item.imageUrl}
                alt={item.title}
                placeholder={skeleton({
                  widthCls: 'w-full',
                  heightCls: 'h-32 md:h-40',
                  shape: 'rounded-none',
                })}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h4>

            {item.authors && (
              <p className="text-sm opacity-80 leading-relaxed italic">
                {item.authors.split(/,| and/).map((author, i, arr) => {
                  const nameCleaned = author.trim();
                  const isUser = nameCleaned.includes('Noah Mamié');
                  const link = item.authorLinks?.[nameCleaned];

                  const renderAuthorName = () => {
                    if (link) {
                      return (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-primary transition-colors font-medium"
                        >
                          {author}
                        </a>
                      );
                    }
                    return author;
                  };

                  return (
                    <span
                      key={i}
                      className={
                        isUser
                          ? 'font-bold underline underline-offset-2'
                          : ''
                      }
                    >
                      {renderAuthorName()}
                      {i < arr.length - 1 ? ', ' : ''}
                    </span>
                  );
                })}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-primary/80">
                {item.conferenceName || item.journalName}
              </p>
              {item.journalStatus && (
                <div className="badge badge-warning badge-outline text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                  {item.journalStatus}
                </div>
              )}
              {item.journalAward && (
                <div className="badge badge-secondary text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider text-secondary-content">
                  {item.journalAward}
                </div>
              )}
            </div>

            {item.laymanSummary && (
              <div className="bg-primary/5 border-l-2 border-primary px-3 py-2 rounded-r-lg mt-1 text-xs leading-relaxed text-justify">
                <span className="font-semibold text-primary block mb-0.5">Simple terms / TL;DR:</span>
                <span className="opacity-80">{item.laymanSummary}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-xs btn-primary normal-case gap-1"
                >
                  <FiFileText className="text-xs" />
                  Article
                </a>
              )}
              {item.description && (
                <button
                  onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                  className="btn btn-outline btn-xs normal-case gap-1"
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
                  className="btn btn-outline btn-xs normal-case gap-1"
                >
                  {isBibtexExpanded ? (
                    <>
                      <FiCode className="text-xs text-primary" />
                      Hide BibTeX
                    </>
                  ) : (
                    <>
                      <FiCode className="text-xs" />
                      BibTeX
                    </>
                  )}
                </button>
              )}
            </div>

            {isAbstractExpanded && item.description && (
              <div className="mt-4 p-4 bg-base-300/30 rounded-lg text-sm opacity-90 text-justify leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                {item.description}
              </div>
            )}

            {isBibtexExpanded && item.bibtex && (
              <div className="mt-4 relative animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-base-300 p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
                  {item.bibtex}
                </div>
                <button
                  onClick={() => copyToClipboard(item.bibtex!)}
                  className="absolute top-2 right-2 btn btn-ghost btn-xs btn-square"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <AiOutlineCheck className="text-success" />
                  ) : (
                    <AiOutlineCopy />
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
}: {
  publications: SanitizedPublication[];
  loading: boolean;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 3; index++) {
      array.push(
        <div className="mb-8" key={index}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              {skeleton({ widthCls: 'w-full', heightCls: 'h-32 md:h-40' })}
            </div>
            <div className="flex-1">
              {skeleton({
                widthCls: 'w-full',
                heightCls: 'h-6',
                className: 'mb-2',
              })}
              {skeleton({
                widthCls: 'w-1/2',
                heightCls: 'h-4',
                className: 'mb-2',
              })}
              {skeleton({ widthCls: 'w-full', heightCls: 'h-16' })}
            </div>
          </div>
        </div>,
      );
    }
    return array;
  };

  const renderPublications = () => {
    const grouped = publications.reduce((acc, pub) => {
      const year = pub.year || 'Other';
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    }, {} as Record<string, SanitizedPublication[]>);

    const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return years.map((year) => (
      <div key={year} className="mb-12 last:mb-0">
        <h3 className="text-xl font-bold mb-8 border-b border-base-300 pb-2 opacity-70">
          {year}
        </h3>
        <div className="flex flex-col gap-10">
          {grouped[year].map((item, index) => (
            <PublicationItem key={index} item={item} />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Fragment>
      <div className="col-span-1 lg:col-span-2">
        <div className="card bg-base-200 shadow-xl border border-base-300">
          <div className="card-body p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center space-x-3">
                {loading ? (
                  skeleton({
                    widthCls: 'w-12',
                    heightCls: 'h-12',
                    className: 'rounded-xl',
                  })
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary">
                    <AiOutlineBook className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-base-content truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
                      : 'Publications'}
                  </h2>
                  <div className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                      : `Showcasing ${publications.length} research works`}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {loading ? renderSkeleton() : renderPublications()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PublicationCard;
