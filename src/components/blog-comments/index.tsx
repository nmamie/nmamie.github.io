import { useEffect, useRef } from 'react';
import { SanitizedComments } from '../../interfaces/sanitized-config';
import { isDarkishTheme } from '../../utils';

/**
 * giscus comment thread (backed by GitHub Discussions), one thread per post.
 * Threads are keyed by the post slug, so renaming a post's file starts a new thread.
 */
const BlogComments = ({
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
    const iframe = ref.current?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      'https://giscus.app',
    );
  }, [giscusTheme]);

  return (
    <section className="mt-12 pt-8 border-t border-base-300">
      <h2 className="text-lg font-bold text-base-content mb-1">Discussion</h2>
      <p className="text-sm text-base-content/60 mb-6">
        Sign in with GitHub to comment or react. Comments are stored in GitHub Discussions.
      </p>
      <div ref={ref} className="giscus" />
    </section>
  );
};

export default BlogComments;
