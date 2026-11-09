// Fetches posts from Medium, Substack and LessWrong at build time and caches
// them in src/data/external-posts.json. The site renders this cache instantly and
// then tries a live refresh in the browser, so a flaky third-party proxy (e.g.
// rss2json rate limits on Medium) never leaves the blog section empty.
//
// Usage: node scripts/fetch-posts.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, '../src/data/external-posts.json');
const CONFIG_FILE = path.join(__dirname, '../gitprofile.config.ts');

const config = fs.readFileSync(CONFIG_FILE, 'utf8');
const pick = (re) => (re.exec(config) || [])[1] || '';
const blogBlock = pick(/blog:\s*\{([\s\S]*?)\}/);
const mediumUser = /source:\s*'medium'/.test(blogBlock)
  ? (/username:\s*'([^']*)'/.exec(blogBlock) || [])[1] || ''
  : '';
const substack = pick(/substack:\s*'([^']*)'/);
const lesswrong = pick(/lesswrong:\s*'([^']*)'/);

const UA = 'Mozilla/5.0 (compatible; portfolio-feed-fetcher/1.0)';

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();

const stripHtml = (html = '', len = 180) => {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > len ? `${text.slice(0, len).trim()}...` : text;
};

const tag = (xml, name) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`).exec(xml);
  return m ? decode(m[1]) : '';
};

async function fetchRss(url, platform) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.map((item) => {
    const content = tag(item, 'content:encoded') || tag(item, 'description');
    const enclosure = /<enclosure[^>]+url="([^"]+)"/.exec(item);
    const img = /<img[^>]+src="([^"]+)"/.exec(content);
    const categories = [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)]
      .map((m) => decode(m[1]))
      .slice(0, 3);
    return {
      title: tag(item, 'title'),
      link: tag(item, 'link').split('?')[0],
      publishedAt: new Date(tag(item, 'pubDate')).toISOString(),
      thumbnail: enclosure?.[1] || img?.[1] || '',
      description: stripHtml(tag(item, 'description') || content),
      categories: [...categories, platform],
    };
  });
}

async function fetchLessWrong(slug) {
  const gql = async (query) => {
    const res = await fetch('https://www.lesswrong.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  };
  const user = await gql(
    `{ users(selector: { usersProfile: { slug: "${slug}" } }) { results { _id } } }`,
  );
  const id = user?.data?.users?.results?.[0]?._id;
  if (!id) return [];
  const posts = await gql(
    `{ posts(input: { terms: { limit: 10, userId: "${id}" } }) { results { title pageUrl postedAt htmlBody } } }`,
  );
  return (posts?.data?.posts?.results || []).map((p) => ({
    title: p.title,
    link: p.pageUrl,
    publishedAt: new Date(p.postedAt).toISOString(),
    thumbnail: '',
    description: stripHtml(p.htmlBody, 150),
    categories: ['LessWrong'],
  }));
}

const sources = [
  mediumUser && ['Medium', () => fetchRss(`https://medium.com/feed/@${mediumUser}`, 'Medium')],
  substack && ['Substack', () => fetchRss(`https://${substack}.substack.com/feed`, 'Substack')],
  lesswrong && ['LessWrong', () => fetchLessWrong(lesswrong)],
].filter(Boolean);

let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
} catch {
  /* first run */
}

// Same post can come with different URLs (nmamie.medium.com vs medium.com/@nmamie),
// so de-duplicate by normalized title.
const keyOf = (p) => p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
const byLink = new Map(existing.map((p) => [keyOf(p), p]));
for (const [name, run] of sources) {
  try {
    const posts = await run();
    posts.forEach((p) => p.title && p.link && byLink.set(keyOf(p), p));
    console.log(`✔ ${name}: ${posts.length} posts`);
  } catch (err) {
    console.warn(`✘ ${name}: ${err.message} (keeping cached posts)`);
  }
}

const merged = [...byLink.values()].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
);
fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Wrote ${merged.length} posts to ${path.relative(process.cwd(), OUTPUT_FILE)}`);
