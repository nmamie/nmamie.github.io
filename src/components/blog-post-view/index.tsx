import { MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { PiArrowLeft } from 'react-icons/pi';
import { LocalPost, localPosts } from '../../utils/local-posts';
import { SanitizedComments } from '../../interfaces/sanitized-config';
import { useThread } from '../../utils/comments-api';
import BlogComments from '../blog-comments';
import ReactionBar from '../blog-comments/reactions';

const AUTHOR = 'Noah Mamié';
const MASTHEAD = 'The Mamié Dispatch';

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

/** 0..1 progress through the article body. */
const useReadingProgress = (ref: RefObject<HTMLElement | null>) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const total = height - window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, -top / Math.max(total, 1))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return progress;
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(bodyRef);
  const thread = useThread(post.slug, comments);
  const commentCount = thread.enabled ? thread.comments.length : null;
  const issue =
    [...localPosts].reverse().findIndex((p) => p.slug === post.slug) + 1;
  const activeIndex = post.headings.findIndex((h) => h.id === active);

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
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      {/* ---- Folio line ---- */}
      <div className="max-w-[46rem] mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 pb-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-base-content/55">
        <button
          type="button"
          onClick={onBack}
          className="justify-self-start inline-flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          <PiArrowLeft /> All posts
        </button>
        <span className="hidden sm:inline">
          {MASTHEAD}
          {issue > 0 && <> · No. {String(issue).padStart(2, '0')}</>}
        </span>
        <span className="justify-self-end hidden sm:inline">
          {format(post.publishedAt, 'EEE, MMM d, yyyy')}
        </span>
      </div>

      {/* ---- Masthead ---- */}
      <header className="post-masthead">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-primary">
          {tags.length ? tags.join(' · ') : 'Dispatch'}
        </p>

        <h1 className="mt-5 font-serif text-[2.5rem] sm:text-[3.6rem] font-normal tracking-[-0.015em] leading-[1.04] text-base-content text-balance">
          {post.title}
        </h1>

        {post.description && (
          <p className="mt-5 mx-auto max-w-2xl font-serif italic text-[1.3rem] sm:text-[1.55rem] font-light leading-snug text-base-content/70 text-balance">
            {post.description}
          </p>
        )}

        <div className="post-byline">
          <span>
            By <span className="post-author">{AUTHOR}</span>
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
          {comments.display && (
            <>
              <span aria-hidden>·</span>
              <a
                href="#discussion"
                onClick={jumpTo('discussion')}
                className="hover:text-primary transition-colors"
              >
                {commentCount === null
                  ? 'Discuss'
                  : `${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}`}
              </a>
            </>
          )}
        </div>
      </header>

      {/* ---- Body: centered reading column, contents in the left margin ---- */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,40rem)_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Contents"
          className="hidden lg:block justify-self-end w-full max-w-[13rem]"
        >
          {showToc && (
            <div className="sticky top-24 pt-1">
              <p className="mb-1 font-serif text-[0.95rem] leading-snug text-base-content">
                {post.title}
              </p>
              <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-base-content/45">
                {Math.round(progress * 100)}% read
              </p>
              <ol className="post-toc">
                {post.headings.map((h, i) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={jumpTo(h.id)}
                      aria-current={active === h.id ? 'true' : undefined}
                      data-read={i < activeIndex ? 'true' : undefined}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
                {comments.display && (
                  <li className="post-toc-discussion">
                    <a href="#discussion" onClick={jumpTo('discussion')}>
                      Discussion
                      {commentCount !== null && (
                        <span className="ml-1.5 font-mono text-[0.7rem] text-base-content/45">
                          {commentCount}
                        </span>
                      )}
                    </a>
                  </li>
                )}
              </ol>
            </div>
          )}
        </nav>

        <div className="max-w-[40rem] mx-auto lg:mx-0 w-full">
          <div
            ref={bodyRef}
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* ---- Colophon ---- */}
          <footer className="post-colophon">
            {thread.enabled && (
              <div className="pb-6 mb-5 border-b border-base-content/15">
                <p className="mb-3 font-serif italic text-lg text-base-content/80">
                  How did this land?
                </p>
                <ReactionBar
                  full
                  tally={thread.tallyFor(null)}
                  onReact={(k) => thread.react(null, k)}
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3">
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
            </div>
          </footer>

          {comments.display && (
            <BlogComments
              slug={post.slug}
              comments={comments}
              theme={theme}
              thread={thread}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export default BlogPostView;
