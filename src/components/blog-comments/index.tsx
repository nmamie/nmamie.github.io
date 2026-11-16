import { useEffect, useRef } from 'react';
import { SanitizedComments } from '../../interfaces/sanitized-config';
import { isDarkishTheme } from '../../utils';
import { Thread } from '../../utils/comments-api';
import NativeComments from './native';

/**
 * giscus comment thread (backed by GitHub Discussions), one thread per post.
 * Threads are keyed by the post slug, so renaming a post's file starts a new thread.
 * Used only when guest comments (Supabase) are not configured.
 */
const GiscusThread = ({
  slug,
  comments,
  theme,
}: {
  slug: string;
  comments: SanitizedComments;
  theme: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const giscusTheme = isDarkishTheme(theme) ? 'dark' : 'light';

  // (Re)mount the widget when the post changes.
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    Object.entries({
      'data-repo': comments.repo,
      'data-repo-id': comments.repoId,
      'data-category': comments.category,
      'data-category-id': comments.categoryId,
      'data-mapping': 'specific',
      'data-term': `blog/${slug}`,
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': giscusTheme,
      'data-lang': 'en',
      'data-loading': 'lazy',
    }).forEach(([k, v]) => script.setAttribute(k, v));
    container.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, comments.repo, comments.repoId, comments.categoryId]);

  // Follow the site's theme switcher without reloading the thread.
  useEffect(() => {
    const iframe = ref.current?.querySelector<HTMLIFrameElement>(
      'iframe.giscus-frame',
    );
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app',
    );
  }, [giscusTheme]);

  return (
    <>
      <p className="text-sm text-base-content/60 mb-6">
        Sign in with GitHub to comment or react. Comments are stored in GitHub
        Discussions.
      </p>
      <div ref={ref} className="giscus" />
    </>
  );
};

/** "Letters to the editor": the discussion under a post. */
const BlogComments = ({
  slug,
  comments,
  theme,
  thread,
}: {
  slug: string;
  comments: SanitizedComments;
  theme: string;
  thread: Thread;
}) => (
  <section id="discussion" className="discussion">
    <header className="mb-6">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary">
        Letters to the editor
      </p>
      <h2 className="mt-2 font-serif text-[2rem] font-medium tracking-tight leading-tight text-base-content">
        Discussion
      </h2>
    </header>
    {comments.provider === 'native' ? (
      <NativeComments thread={thread} />
    ) : (
      <GiscusThread slug={slug} comments={comments} theme={theme} />
    )}
  </section>
);

export default BlogComments;
