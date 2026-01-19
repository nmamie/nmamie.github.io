import { Fragment } from 'react';
import { AiOutlineBook } from 'react-icons/ai';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-3/4">
              {skeleton({ widthCls: 'w-full', heightCls: 'h-6', className: 'mb-2' })}
              {skeleton({ widthCls: 'w-1/2', heightCls: 'h-4', className: 'mb-2' })}
              {skeleton({ widthCls: 'w-full', heightCls: 'h-16' })}
            </div>
          </div>
        </div>,
      );
    }
    return array;
  };

  const renderPublications = () => {
    // Group publications by year
    const grouped = publications.reduce((acc, pub) => {
      const year = pub.year || 'Other';
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    }, {} as Record<string, SanitizedPublication[]>);

    // Sort years descending
    const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    return years.map((year) => (
      <div key={year} className="mb-10 last:mb-0">
        <h4 className="text-xl font-bold mb-6 border-b border-base-300 pb-2 opacity-70">
          {year}
        </h4>
        <div className="flex flex-col gap-8">
          {grouped[year].map((item, index) => (
            <div key={index} className="group">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>

                {item.authors && (
                  <p className="text-sm opacity-80 leading-relaxed italic">
                    {item.authors.split(',').map((author, i, arr) => {
                      const isUser = author.trim().includes('Noah Mamie') || author.trim().includes('Susie Xi Rao'); // Highlight if needed
                      return (
                        <span key={i} className={isUser ? 'font-bold underline underline-offset-2' : ''}>
                          {author}{i < arr.length - 1 ? ', ' : ''}
                        </span>
                      );
                    })}
                  </p>
                )}

                <p className="text-sm font-medium text-primary/80">
                  {item.conferenceName || item.journalName}
                </p>

                {item.description && (
                  <p className="text-sm opacity-70 text-justify mt-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-xs btn-primary normal-case"
                    >
                      Article
                    </a>
                  )}
                  {/* Future-proofing for more links if added to config */}
                </div>
              </div>
            </div>
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
                  <h3 className="text-base sm:text-lg font-bold text-base-content truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
                      : 'Publications'}
                  </h3>
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
