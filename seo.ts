/**
 * Build-time SEO for a client-rendered single page:
 * - JSON-LD (Person, ProfilePage, WebSite, ScholarlyArticle) in <head>
 * - crawlable static HTML inside #root (replaced by React on load), so search engines,
 *   link previews and AI crawlers see the content without running JavaScript
 * - sitemap.xml with the build date
 * Content comes from gitprofile.config.ts; the bio mirrors src/components/site/intro.tsx.
 */
import type { Plugin } from 'vite';
import CONFIG from './gitprofile.config';

export const SITE = 'https://xn--mami-epa.ch';

const NAME = 'Noah Mamié';
const TAGLINE =
  'Generative AI that recommends news: personal, but still diverse, transparent and good for public debate.';
const BIO = [
  'I am a doctoral researcher in the DDIS group at the University of Zurich, a UZH.ai Fellow and a scholar in the DSI Excellence Program. My PhD asks how generative AI can personalize news without narrowing what people see, and I test the answers with real readers in field studies on Informfully.',
  'I came to AI the long way around: business administration in St. Gallen, private equity, applied economics research at ETH Zurich, then an MSc in AI at UZH. That path is why I work where computer science meets communication and social science. Out of personal interest, I also explore collective intelligence: whether swarms of foundation models reason better together than alone.',
];

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
const plain = (s = '') => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\uFE0F?/gu, '').trim();
const authorsOf = (a = '') =>
  a
    .split(/,\s*|\s+and\s+/)
    .map((n) => n.trim())
    .filter(Boolean);

type Pub = (typeof CONFIG.publications)[number] & { doi?: string };
const doiOf = (p: Pub) => p.bibtex?.match(/doi\s*=\s*\{([^}]+)\}/i)?.[1];
const venueOf = (p: Pub) => p.conferenceName || p.journalName || '';

const sameAs = () => {
  const s = CONFIG.social;
  return [
    s.scholar,
    s.linkedin && `https://www.linkedin.com/in/${s.linkedin}`,
    `https://github.com/${CONFIG.github.username}`,
    s.medium && `https://medium.com/@${s.medium}`,
    s.bluesky && `https://bsky.app/profile/${s.bluesky}`,
    s.substack && `https://${s.substack}.substack.com`,
    s.lesswrong && `https://www.lesswrong.com/users/${s.lesswrong}`,
    'https://www.ifi.uzh.ch/en/ddis/people/nmamie.html',
  ].filter(Boolean) as string[];
};

const jsonLd = () => {
  const person = {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: NAME,
    alternateName: ['Noah Mamie'],
    givenName: 'Noah',
    familyName: 'Mamié',
    url: `${SITE}/`,
    image: `${SITE}/img/portrait.jpg`,
    email: `mailto:${CONFIG.social.email}`,
    jobTitle: 'Doctoral Researcher & UZH.ai Fellow',
    description: CONFIG.seo.description,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'University of Zurich',
      url: 'https://www.uzh.ch',
      department: {
        '@type': 'Organization',
        name: 'Dynamic and Distributed Information Systems Group (DDIS), Department of Informatics',
        url: 'https://www.ifi.uzh.ch/en/ddis.html',
      },
    },
    alumniOf: [...new Set(CONFIG.educations.map((e) => e.institution))].map((name) => ({
      '@type': 'CollegeOrUniversity',
      name,
    })),
    knowsAbout: CONFIG.researchInterests,
    sameAs: sameAs(),
  };

  const articles = CONFIG.publications.map((p: Pub) => {
    const doi = doiOf(p);
    return {
      '@type': 'ScholarlyArticle',
      headline: p.title.slice(0, 110),
      name: p.title,
      author: authorsOf(p.authors).map((n) =>
        /Mami[ée]/.test(n) ? { '@id': `${SITE}/#person` } : { '@type': 'Person', name: n },
      ),
      datePublished: p.year,
      url: p.link,
      ...(doi ? { sameAs: `https://doi.org/${doi}` } : {}),
      isPartOf: { '@type': 'CreativeWork', name: venueOf(p) },
      abstract: p.description,
      keywords: (p.topics || []).join(', '),
      ...(p.imageUrl ? { image: `${SITE}${p.imageUrl}` } : {}),
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: NAME,
        inLanguage: 'en',
        publisher: { '@id': `${SITE}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: `${SITE}/`,
        name: CONFIG.seo.title,
        isPartOf: { '@id': `${SITE}/#website` },
        mainEntity: { '@id': `${SITE}/#person` },
        dateModified: new Date().toISOString().slice(0, 10),
      },
      person,
      ...articles,
    ],
  };
};

/** Plain, semantic version of the page; React replaces it as soon as the app mounts. */
const staticHtml = () => {
  const pubs = CONFIG.publications
    .map(
      (p: Pub) => `<li><h3><a href="${esc(p.link)}">${esc(p.title)}</a></h3>
<p>${esc(p.authors)}. <em>${esc(venueOf(p))}</em>${p.year && !venueOf(p).includes(p.year) ? `, ${esc(p.year)}` : ''}${p.journalAward ? ` · ${esc(plain(p.journalAward))}` : ''}</p>
${p.tldr ? `<p>${esc(p.tldr)}</p>` : ''}</li>`,
    )
    .join('\n');
  const projects = CONFIG.projects.external.projects
    .map(
      (p) =>
        `<li><h3><a href="${esc(p.link)}">${esc(p.title)}</a></h3><p>${esc(plain(p.description))}</p></li>`,
    )
    .join('\n');
  const news = CONFIG.news
    .slice(0, 6)
    .map((n) => `<li><time>${esc(n.date)}</time> ${esc(plain(n.title))}</li>`)
    .join('\n');
  const links = sameAs()
    .map((u) => `<a href="${esc(u)}" rel="me">${esc(u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])}</a>`)
    .join(' · ');

  return `<div id="prerender" style="max-width:56rem;margin:0 auto;padding:3rem 1.25rem;font-family:Georgia,serif;line-height:1.6">
<header>
<h1>${NAME}</h1>
<p><em>${esc(TAGLINE)}</em></p>
<p>Doctoral researcher &amp; UZH.ai Fellow, University of Zurich · Research: ${esc(CONFIG.researchInterests.join(', '))}</p>
</header>
<section id="about-static">${BIO.map((b) => `<p>${esc(b)}</p>`).join('')}</section>
<section><h2>Publications</h2><ul>${pubs}</ul></section>
<section><h2>Projects</h2><ul>${projects}</ul></section>
<section><h2>News</h2><ul>${news}</ul></section>
<footer><p>Contact: <a href="mailto:${esc(CONFIG.social.email)}">${esc(CONFIG.social.email)}</a> · ${links} · <a href="/${esc(CONFIG.resume.fileUrl)}">CV (PDF)</a></p></footer>
</div>`;
};

const sitemap = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'weekly' },
    ...(CONFIG.resume.fileUrl
      ? [{ loc: `${SITE}/${CONFIG.resume.fileUrl}`, priority: '0.5', changefreq: 'monthly' }]
      : []),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`;
};

export const seoPlugin = (): Plugin => ({
  name: 'site-seo',
  transformIndexHtml: {
    order: 'post',
    handler: (html) =>
      html
        .replace(
          '</head>',
          `    <script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>\n  </head>`,
        )
        .replace('<div id="root"></div>', `<div id="root">${staticHtml()}</div>`),
  },
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() });
  },
});
