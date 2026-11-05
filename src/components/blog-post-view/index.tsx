import { useEffect } from 'react';
import { format } from 'date-fns';
import { PiArrowLeft, PiClock } from 'react-icons/pi';
import { LocalPost } from '../../utils/local-posts';
import { SanitizedComments } from '../../interfaces/sanitized-config';
import BlogComments from '../blog-comments';

const BlogPostView = ({
  post,
  onBack,
  comments,
  theme,
}: {
  post: LocalPost;
  onBack: () => void;
  comments: SanitizedComments;
  theme: string;
}) => {
  useEffect(() => {
    const previous = document.title;
    document.title = `${post.title} | Noah Mamié`;
    return () => {
      document.title = previous;
    };
  }, [post.title]);

  const tags = post.categories.filter((c) => c !== 'Blog');

  return (
    <div className="col-span-1 lg:col-span-2">
      <article className="card bg-base-200 shadow-xl border border-base-300">
        <div className="card-body p-6 sm:p-10">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-ghost btn-sm self-start gap-2 -ml-2 mb-4 opacity-70 hover:opacity-100"
          >
            <PiArrowLeft /> All posts
          </button>

          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt=""
              className="w-full max-h-80 object-cover rounded-xl mb-6 border border-base-300"
            />
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-base-content leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-base-content/60">
            <time dateTime={post.publishedAt.toISOString()}>
              {format(post.publishedAt, 'MMMM d, yyyy')}
            </time>
            <span className="inline-flex items-center gap-1">
              <PiClock /> {post.readingMinutes} min read
            </span>
            {tags.map((t) => (
              <span key={t} className="badge badge-sm badge-ghost">
                {t}
              </span>
            ))}
          </div>

          <div
            className="blog-prose mt-8"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {comments.display && (
            <BlogComments slug={post.slug} comments={comments} theme={theme} />
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogPostView;
