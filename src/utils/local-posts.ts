import { marked } from 'marked';
import { Article } from '../interfaces/article';

/**
 * Native blog posts written as Markdown in `src/posts/*.md`.
 *
 * Each file starts with a frontmatter block:
 *
 *   ---
 *   title: My post
 *   date: 2026-11-05
 *   description: One-line teaser (optional, defaults to the first paragraph)
 *   thumbnail: /img/cover.png   (optional, file in /public)
 *   tags: [Swarm Intelligence, LLMs]   (optional)
 *   draft: true                 (optional, hides the post)
 *   ---
 *
 * The filename (without .md) becomes the URL slug: /#blog/<slug>.
 */
export interface LocalPost extends Article {
  slug: string;
  html: string;
  readingMinutes: number;
}

const files = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const parseFrontmatter = (raw: string) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {} as Record<string, string | string[]>, body: raw };
  const meta: Record<string, string | string[]> = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!kv) return;
    const value = kv[2].trim();
    meta[kv[1]] = /^\[.*\]$/.test(value)
      ? value
          .slice(1, -1)
          .split(',')
          .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean)
      : value.replace(/^['"]|['"]$/g, '');
  });
  return { meta, body: match[2] };
};

const toText = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const localPosts: LocalPost[] = Object.entries(files)
  .map(([file, raw]) => {
    const slug = file.split('/').pop()!.replace(/\.md$/, '');
    const { meta, body } = parseFrontmatter(raw);
    const text = toText(body);
    const tags = Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [];
    return {
      slug,
      draft: meta.draft === 'true',
      title: (meta.title as string) || slug,
      publishedAt: new Date((meta.date as string) || 0),
      description:
        (meta.description as string) ||
        (text.length > 180 ? `${text.slice(0, 180).trim()}...` : text),
      thumbnail: (meta.thumbnail as string) || '',
      link: `#blog/${slug}`,
      categories: [...tags, 'Blog'],
      html: marked.parse(body, { async: false }) as string,
      readingMinutes: Math.max(1, Math.round(text.split(' ').length / 220)),
    };
  })
  .filter((p) => !p.draft)
  .map(({ draft: _draft, ...p }) => p)
  .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

export const findLocalPost = (slug: string) =>
  localPosts.find((p) => p.slug === slug);
