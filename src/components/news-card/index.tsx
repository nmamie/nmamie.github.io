import { Fragment } from 'react';
import { AiOutlineNotification } from 'react-icons/ai';
import { SanitizedNews } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const NewsCard = ({
    news,
    loading,
}: {
    news: SanitizedNews[];
    loading: boolean;
}) => {
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

    const renderNews = () => {
        return news.map((item, index) => (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 last:mb-0" key={index}>
                <div className="w-full sm:w-32 shrink-0 text-sm font-semibold opacity-60">
                    {item.date}
                </div>
                <div className="flex-1">
                    {item.link ? (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium hover:text-primary transition-colors"
                        >
                            {item.title}
                        </a>
                    ) : (
                        <span className="font-medium text-base-content">{item.title}</span>
                    )}
                    {item.description && (
                        <p className="mt-1 text-sm opacity-70 text-justify">
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
                            <div className="flex items-center space-x-3">
                                {loading ? (
                                    skeleton({
                                        widthCls: 'w-12',
                                        heightCls: 'h-12',
                                        className: 'rounded-xl',
                                    })
                                ) : (
                                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary">
                                        <AiOutlineNotification className="text-2xl" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-base-content truncate">
                                        {loading
                                            ? skeleton({ widthCls: 'w-40', heightCls: 'h-8' })
                                            : 'News'}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? renderSkeleton() : renderNews()}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NewsCard;
