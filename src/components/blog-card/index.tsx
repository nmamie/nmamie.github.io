import { PiNewspaper } from 'react-icons/pi';
import { SiSubstack } from 'react-icons/si';
import { formatDistance } from 'date-fns';
import { SanitizedBlog } from '../../interfaces/sanitized-config';
import { ga, skeleton } from '../../utils';
import { Article } from '../../interfaces/article';
import LazyImage from '../lazy-image';

const BlogCard = ({
  loading,
  articles,
  blog,
  googleAnalyticsId,
}: {
  loading: boolean;
  articles: Article[];
  blog: SanitizedBlog;
  googleAnalyticsId?: string;
}) => {

  const renderSkeleton = () => {
    const array = [];
    const limit = blog.limit || 5;
    for (let index = 0; index < limit; index++) {
      array.push(
        <div className="card shadow-md card-sm bg-base-100" key={index}>
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              <div className="avatar mb-5 md:mb-0">
                <div className="w-24 h-24 mask mask-squircle">
                  {skeleton({
                    widthCls: 'w-full',
                    heightCls: 'h-full',
                    shape: '',
                  })}
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="w-full">
                    <h3>
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-8',
                        className: 'mb-2 mx-auto md:mx-0',
                      })}
                    </h3>
                    {skeleton({
                      widthCls: 'w-24',
                      heightCls: 'h-3',
                      className: 'mx-auto md:mx-0',
                    })}
                    <div className="mt-3">
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mx-auto md:mx-0',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
      );
    }
    return array;
  };

  const renderThumbnail = (article: Article) => {
    if (article.thumbnail && !article.thumbnail.includes('/img/lesswrong.png')) {
      return (
        <LazyImage
          src={article.thumbnail}
          alt={article.title}
          placeholder={skeleton({
            widthCls: 'w-full',
            heightCls: 'h-full',
            shape: '',
          })}
        />
      );
    }

    if (article.categories.includes('LessWrong')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-base-content text-base-100 select-none">
          <span className="font-mono font-bold text-4xl leading-none">λ</span>
        </div>
      );
    }
    if (article.categories.includes('Substack')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-orange-100 dark:bg-orange-950/20">
          <SiSubstack className="text-4xl text-orange-500" />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-base-300/50">
        <PiNewspaper className="text-4xl opacity-40" />
      </div>
    );
  };

  const renderArticles = () => {
    return articles && articles.length ? (
      articles.slice(0, blog.limit).map((article, index) => {
        const elementId = `article-${article.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        return (
          <a
            id={elementId}
            className="card shadow-md card-sm bg-base-100 cursor-pointer hover:shadow-lg transition-shadow duration-300 scroll-mt-24"
            key={index}
            href={article.link}
            onClick={(e) => {
              e.preventDefault();

              try {
                if (googleAnalyticsId) {
                  ga.event('Click Blog Post', {
                    post: article.title,
                  });
                }
              } catch (error) {
                console.error(error);
              }

              window?.open(article.link, '_blank');
            }}
          >
            <div className="p-8 h-full w-full">
              <div className="flex items-center flex-col md:flex-row gap-6">
                <div className="avatar shrink-0 opacity-90">
                  <div className="w-24 h-24 mask mask-squircle border border-base-300 shadow-inner overflow-hidden">
                    {renderThumbnail(article)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-center md:text-left">
                    <h3 className="font-bold text-base sm:text-lg text-base-content hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-base-content opacity-50 text-xs mt-1">
                      {formatDistance(article.publishedAt, new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                    <p className="mt-2.5 text-base-content/80 text-sm leading-relaxed text-justify">
                      {article.description}
                    </p>
                    <div className="mt-4 flex items-center flex-wrap justify-center md:justify-start gap-1">
                      {article.categories.map((category, index2) => {
                        const isLesswrong = category === 'LessWrong';
                        const isSubstack = category === 'Substack';
                        const badgeClass = isLesswrong
                          ? 'badge-warning font-semibold text-warning-content'
                          : isSubstack
                          ? 'badge-primary font-semibold text-primary-content bg-orange-500 border-orange-500'
                          : 'badge-ghost opacity-60';

                        return (
                          <div
                            className={`badge badge-sm uppercase text-[9px] tracking-wider px-2.5 py-0.5 ${badgeClass}`}
                            key={index2}
                          >
                            {category}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        );
      })
    ) : (
      <div className="text-center mb-6 py-8">
        <PiNewspaper className="mx-auto h-12 w-12 opacity-30 animate-pulse" />
        <p className="mt-2 text-sm opacity-50 text-base-content">
          No articles are available.
        </p>
      </div>
    );
  };

  return (
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
                  <PiNewspaper className="text-2xl" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-base-content truncate">
                  {loading
                    ? skeleton({ widthCls: 'w-28', heightCls: 'h-8' })
                    : 'My Articles & Blog Posts'}
                </h2>
                <div className="text-base-content/60 text-xs sm:text-sm mt-1 truncate">
                  {loading
                    ? skeleton({ widthCls: 'w-32', heightCls: 'h-4' })
                    : `Showcasing latest ${articles.length} entries from Medium, LessWrong & Substack`}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {loading ? renderSkeleton() : renderArticles()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
