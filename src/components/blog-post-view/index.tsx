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
    <div>
      <article className="max-w-2xl mx-auto">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary mb-8"
          >
            <PiArrowLeft /> All posts
          </button>

          {post.thumbnail && (
            <img
              src={post.thumbnail}
              alt=""
              className="w-full max-h-80 object-cover mb-6 border border-base-300"
            />
          )}

          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-base-content leading-tight">
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
