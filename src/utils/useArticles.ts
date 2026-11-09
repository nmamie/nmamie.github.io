import { useEffect, useState } from 'react';
import { getDevPost, getMediumPost } from '@arifszn/blog-js';
import { Article } from '../interfaces/article';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import { localPosts } from './local-posts';
import externalPostsData from '../data/external-posts.json';

/**
 * The same post can arrive with different URLs (nmamie.medium.com/... vs
 * medium.com/@nmamie/...?source=rss), so de-duplicate by normalized title.
 * Entries from later lists win, unless they lack a thumbnail the earlier one had.
 */
export const mergeArticles = (...lists: Article[][]): Article[] => {
  const byKey = new Map<string, Article>();
  lists.flat().forEach((a) => {
    if (!a.title || !a.link) return;
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const prev = byKey.get(key);
    byKey.set(key, prev && !a.thumbnail && prev.thumbnail ? { ...a, thumbnail: prev.thumbnail } : a);
  });
  return [...byKey.values()].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};

const cachedExternal = (
  externalPostsData as Array<Omit<Article, 'publishedAt'> & { publishedAt: string }>
).map((p) => ({ ...p, publishedAt: new Date(p.publishedAt) }));

/**
 * Native markdown posts + build-time cache of Medium/Substack/LessWrong posts,
 * shown immediately; a live refresh is merged in on mount.
 */
export const useArticles = (config: SanitizedConfig) => {
  const [articles, setArticles] = useState<Article[]>(() =>
    mergeArticles(localPosts, cachedExternal),
  );

  useEffect(() => {
    const fetchAllPosts = async () => {
      const allPosts: Article[] = [];
      const promises: Promise<void>[] = [];

      // 1. Medium
      if (config.blog.display && config.blog.source === 'medium') {
        promises.push(
          getMediumPost({ user: config.blog.username })
            .then((res) => {
              res.forEach((post: any) => {
                allPosts.push({
                  title: post.title,
                  thumbnail: post.thumbnail,
                  link: post.link,
                  publishedAt: new Date(post.publishedAt),
                  description: post.description,
                  categories: [...(post.categories || []), 'Medium'],
                });
              });
            })
            .catch((err) => console.error('Error fetching Medium posts:', err))
        );
      }

      // 2. Dev.to
      if (config.blog.display && config.blog.source === 'dev') {
        promises.push(
          getDevPost({ user: config.blog.username })
            .then((res) => {
              res.forEach((post: any) => {
                allPosts.push({
                  title: post.title,
                  thumbnail: post.thumbnail,
                  link: post.link,
                  publishedAt: new Date(post.publishedAt),
                  description: post.description,
                  categories: [...(post.categories || []), 'Dev.to'],
                });
              });
            })
            .catch((err) => console.error('Error fetching Dev.to posts:', err))
        );
      }

      // Substack & LessWrong are not fetched live: their APIs reject browser
      // requests (CORS / rss2json limits). scripts/fetch-posts.mjs caches them daily.

      await Promise.all(promises);
      setArticles((prev) => mergeArticles(prev, allPosts));
    };

    fetchAllPosts();
  }, [
    config.blog?.display,
    config.blog?.source,
    config.blog?.username,
    config.social?.lesswrong,
    config.social?.substack
  ]);

  return articles;
};
