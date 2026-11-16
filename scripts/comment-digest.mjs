/**
 * Daily blog-comment check (run by .github/workflows/blog-comments.yml):
 *   1. Reads every post's thread, which also keeps the free Supabase project
 *      from pausing.
 *   2. Prints a Markdown digest of comments newer than SINCE (ISO date) to
 *      stdout; prints nothing when there are none.
 *
 * Uses only the public anon key from gitprofile.config.ts.
 */
import { readFileSync, readdirSync } from 'node:fs';

const config = readFileSync('gitprofile.config.ts', 'utf8');
const pick = (name) =>
  (new RegExp(`^\\s*${name}:\\s*'([^']*)'`, 'm').exec(config) || [])[1] || '';
const url = pick('supabaseUrl').replace(/\/+$/, '');
const key = pick('supabaseAnonKey');

if (!url || !key) {
  console.error('Supabase comments not configured; nothing to do.');
  process.exit(0);
}

const since = new Date(process.env.SINCE || Date.now() - 864e5);
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '');
const slugs = readdirSync('src/posts')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

const getThread = async (slug) => {
  const res = await fetch(`${url}/rest/v1/rpc/get_thread`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_slug: slug,
      p_client: '00000000-0000-0000-0000-000000000000',
    }),
  });
  if (!res.ok) throw new Error(`get_thread(${slug}): HTTP ${res.status}`);
  return res.json();
};

// Comment text is untrusted: stop @mentions / #refs from pinging anyone and
// keep it inside a quote block.
const quote = (text) =>
  text
    .replace(/@/g, '@​')
    .replace(/#(\d)/g, '#​$1')
    .split('\n')
    .map((l) => `> ${l}`)
    .join('\n');

const sections = [];
let total = 0;

for (const slug of slugs) {
  const { comments } = await getThread(slug);
  const fresh = comments.filter((c) => new Date(c.created_at) > since);
  if (!fresh.length) continue;
  total += fresh.length;
  const link = siteUrl ? ` ([open](${siteUrl}/#blog/${slug}))` : '';
  sections.push(
    `## ${slug}${link}\n\n` +
      fresh
        .map(
          (c) =>
            `**${c.author_name.replace(/[@*_`[\]<>]/g, '')}** · ${c.created_at.slice(0, 16).replace('T', ' ')} UTC${c.parent_id ? ' · reply' : ''}\n\n` +
            `${quote(c.body)}\n\n` +
            `<details><summary>Hide or delete</summary>\n\n` +
            '```sql\n' +
            `update public.comments set approved = false where id = '${c.id}';\n` +
            `-- or: delete from public.comments where id = '${c.id}';\n` +
            '```\n</details>',
        )
        .join('\n\n---\n\n'),
  );
}

console.error(`${total} new comment(s) since ${since.toISOString()}`);
if (total) {
  console.log(
    `${total} new comment${total === 1 ? '' : 's'} since ${since.toISOString().slice(0, 16).replace('T', ' ')} UTC. ` +
      'Run the SQL in the Supabase SQL editor to hide a comment.\n\n' +
      sections.join('\n\n'),
  );
}
