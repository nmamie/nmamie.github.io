import { MouseEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { PiArrowLeft } from 'react-icons/pi';
import { LocalPost } from '../../utils/local-posts';
import { SanitizedComments } from '../../interfaces/sanitized-config';
import BlogComments from '../blog-comments';

const AUTHOR = 'Noah Mamié';

/** Tracks which section heading the reader is currently in. */
const useActiveHeading = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (!ids.length) return;
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const onScroll = () => {
      const offset = 120;
      let current = els[0]?.id ?? null;
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);

  return active;
};

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
    document.title = `${post.title} | ${AUTHOR}`;
    return () => {
      document.title = previous;
    };
  }, [post.title]);

  const tags = post.categories.filter((c) => c !== 'Blog');
  const active = useActiveHeading(post.headings.map((h) => h.id));
  const showToc = post.headings.length >= 2;

  const jumpTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 88,
      behavior: 'smooth',
    });
  };

  return (
    <article className="post">
      {/* ---- Folio line ---- */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-base-content/60 hover:text-primary transition-colors"
        >
          <PiArrowLeft /> All posts
        </button>
        <span className="hidden sm:inline font-mono text-[0.7rem] uppercase tracking-[0.14em] text-base-content/50">
          {format(post.publishedAt, 'EEEE, MMMM d, yyyy')}
        </span>
      </div>

      {/* ---- Masthead ---- */}
      <header className="border-t-[3px] border-double border-base-content pt-8 sm:pt-12 pb-8 text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">
          {tags.length ? tags.join(' · ') : 'Dispatch'}
        </p>

        <h1 className="mt-4 font-serif text-[2.6rem] sm:text-6xl font-medium tracking-tight leading-[1.04] text-base-content text-balance">
          {post.title}
        </h1>

        {post.description && (
          <p className="mt-5 mx-auto max-w-2xl font-serif italic text-xl sm:text-2xl leading-snug text-base-content/70 text-balance">
            {post.description}
          </p>
        )}

        <div className="mt-8 mx-auto max-w-2xl border-y border-base-content/25 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-base-content/60">
          <span>
            By <span className="text-base-content">{AUTHOR}</span>
          </span>
          {post.dateline && (
            <>
              <span aria-hidden>·</span>
              <span>{post.dateline}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {format(post.publishedAt, 'MMM d, yyyy')}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>

      {/* ---- Body with LessWrong-style margin contents ---- */}
      <div
        className={
          showToc
            ? 'lg:grid lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:gap-12'
            : ''
        }
      >
        {showToc && (
          <nav aria-label="Contents" className="hidden lg:block">
            <div className="sticky top-24 pt-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-base-content/45 mb-3">
                Contents
              </p>
              <ol className="post-toc">
                {post.headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={jumpTo(h.id)}
                      aria-current={active === h.id ? 'true' : undefined}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        )}

        <div className="max-w-[40rem] mx-auto lg:mx-0 w-full">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <footer className="mt-14 border-t-[3px] border-double border-base-content pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-base-content/45">
                Filed under
              </span>
              {tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <button type="button" onClick={onBack} className="btn-pill">
              <PiArrowLeft /> All posts
            </button>
          </footer>

          {comments.display && (
            <BlogComments slug={post.slug} comments={comments} theme={theme} />
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPostView;
