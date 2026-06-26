import { Fragment, useState } from 'react';
import { PiPresentation } from 'react-icons/pi';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTalks = talks.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      item.date.toLowerCase().includes(term)
    );
  });

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 3; index++) {
      array.push(
        <div className="flex gap-4 mb-4" key={index}>
          <div className="w-24 shrink-0">
            {skeleton({ widthCls: 'w-20', heightCls: 'h-4' })}
          </div>
          <div className="flex-1">
            {skeleton({ widthCls: 'w-full', heightCls: 'h-4', className: 'mb-2' })}
            {skeleton({ widthCls: 'w-3/4', heightCls: 'h-4' })}
          </div>
        </div>,
      );
    }
    return array;
  };

  const renderTalks = () => {
    if (filteredTalks.length === 0) {
      return (
        <div className="text-center py-8 text-base-content opacity-50">
          No talks match your search query.
        </div>
      );
    }

    return filteredTalks.map((item, index) => (
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 last:mb-0" key={index}>
        <div className="w-full sm:w-32 shrink-0 text-sm font-semibold opacity-60">
          {item.date}
        </div>
        <div className="flex-1">
          {item.link ? (
            <h3 className="font-medium hover:text-primary transition-colors text-base-content">
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                {item.title}
              </a>
            </h3>
          ) : (
            <h3 className="font-medium text-base-content">{item.title}</h3>
          )}
          {item.description && (
            <p className="mt-1 text-sm opacity-70 text-justify text-base-content/85">
              {item.description}
            </p>
          )}
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
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {loading ? (
                  skeleton({
                    widthCls: 'w-12',
                    heightCls: 'h-12',
                    className: 'rounded-xl',
                  })
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary">
                    <PiPresentation className="text-2xl" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-bold text-base-content truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
                      : 'Talks & Presentations'}
                  </h2>
                  <div className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                    {loading
                      ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                      : `Showcasing ${filteredTalks.length} speaking engagements`}
                  </div>
                </div>
              </div>
            </div>
            {!loading && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search talks by title, description, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered input-sm w-full bg-base-100/50 focus:bg-base-100"
                />
              </div>
            )}
            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? renderSkeleton() : renderTalks()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TalksCard;
