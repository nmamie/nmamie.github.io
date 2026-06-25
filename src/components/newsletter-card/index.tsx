import { skeleton } from '../../utils';
import { SiSubstack } from 'react-icons/si';

const NewsletterCard = ({
  substack,
  loading,
}: {
  substack?: string;
  loading: boolean;
}) => {
  if (!loading && !substack) {
    return null;
  }

  return (
    <div className="card shadow-lg card-sm bg-base-100">
      <div className="card-body p-6 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            {skeleton({ widthCls: 'w-16', heightCls: 'h-16', className: 'rounded-2xl' })}
            {skeleton({ widthCls: 'w-40', heightCls: 'h-6' })}
            {skeleton({ widthCls: 'w-48', heightCls: 'h-4' })}
            {skeleton({ widthCls: 'w-32', heightCls: 'h-8', className: 'mt-2' })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-[#FF6719]/10 rounded-2xl flex items-center justify-center text-[#FF6719] text-3xl">
              <SiSubstack />
            </div>
            <div>
              <h2 className="font-bold text-lg text-base-content">
                Subscribe on Substack
              </h2>
              <p className="text-xs text-base-content/60 mt-1 max-w-[220px] mx-auto leading-relaxed">
                Stay updated with my latest research papers, AI breakthroughs, and articles.
              </p>
            </div>
            <a
              href={`https://${substack}.substack.com/subscribe`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm w-full text-xs font-semibold mt-1"
            >
              Join the newsletter
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterCard;
