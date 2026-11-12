import { useCallback, useEffect, useState } from 'react';
import {
  HiOutlineBars3,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { INVALID_CONFIG_ERROR } from '../constants/errors';
import '../assets/index.css';
import {
  getInitialTheme,
  getSanitizedConfig,
  isDarkishTheme,
  setupHotjar,
} from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import { LOCAL_STORAGE_KEY_NAME } from '../constants';
import ErrorPage from './error-page';
import BlogPostView from './blog-post-view';
import { findLocalPost } from '../utils/local-posts';
import { useArticles } from '../utils/useArticles';
import Intro from './site/intro';
import ResearchOverview from './site/research-overview';
import News from './site/news';
import Publications from './site/publications';
import Projects from './site/projects';
import Writing from './site/writing';
import Talks from './site/talks';
import Cv from './site/cv';
import SocialLinks from './site/social-links';
import LogoMark from './site/logo-mark';
import { FloatingReader } from './site/reader-bar';
import { ReaderProvider } from '../utils/reader';

/** Mirror the open post into ?post=<slug> so it survives redirects that drop the hash (giscus sign-in). */
const syncPostQuery = (slug: string | null) => {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set('post', slug);
  else url.searchParams.delete('post');
  if (url.href !== window.location.href)
    window.history.replaceState(null, '', url.href);
};

const scrollToSection = (id: string, smooth = true) => {
  const el = document.getElementById(id);
  if (el)
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
};

const GitProfile = ({ config }: { config: Config }) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    () => getSanitizedConfig(config),
  );
  const isValid = Object.keys(sanitizedConfig).length > 0;
  const cfg = sanitizedConfig as SanitizedConfig;

  const [theme, setTheme] = useState<string>(() =>
    isValid ? getInitialTheme(cfg.themeConfig) : 'scholar-light',
  );
  const [openPostSlug, setOpenPostSlug] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [topic, setTopic] = useState('All');
  const articles = useArticles(cfg);

  const darkTheme =
    cfg.themeConfig?.themes?.find((t) => isDarkishTheme(t)) || 'dark';
  const lightTheme =
    cfg.themeConfig?.themes?.find((t) => !isDarkishTheme(t)) || 'light';
  const isDark = isDarkishTheme(theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isValid) setupHotjar(cfg.hotjar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const next = isDark ? lightTheme : darkTheme;
    setTheme(next);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, next);
    } catch {
      /* storage unavailable */
    }
  };

  // Hash routing: #<section> scrolls; #blog/<slug> opens a native post.
  useEffect(() => {
    const postParam = new URLSearchParams(window.location.search).get('post');
    if (
      postParam &&
      findLocalPost(postParam) &&
      !window.location.hash.startsWith('#blog/')
    ) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#blog/${postParam}`,
      );
    }

    const route = (initial: boolean) => {
      const [section, slug] = window.location.hash.replace(/^#/, '').split('/');
      const openSlug =
        section === 'blog' && slug && findLocalPost(slug) ? slug : null;
      setOpenPostSlug(openSlug);
      syncPostQuery(openSlug);
      if (openSlug) {
        window.scrollTo({ top: 0 });
      } else if (section) {
        // wait for the sections to render after leaving a post
        requestAnimationFrame(() => scrollToSection(section, !initial));
      }
    };

    route(true);
    const onHash = () => route(false);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Scroll-spy for the nav.
  useEffect(() => {
    if (openPostSlug) return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-section]'),
    );
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = 'about';
      sections.forEach((s) => {
        if (s.offsetTop <= y) current = s.id;
      });
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 4
      ) {
        current = sections[sections.length - 1]?.id || current;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [openPostSlug, articles.length]);

  const goTo = useCallback(
    (id: string) => {
      setMenuOpen(false);
      if (openPostSlug) {
        window.location.hash = id; // route() closes the post and scrolls
        return;
      }
      window.history.pushState(null, '', `#${id}`);
      scrollToSection(id);
    },
    [openPostSlug],
  );

  const selectTopic = (t: string) => {
    setTopic(t);
    goTo('publications');
  };

  if (!isValid) {
    return (
      <ErrorPage
        status={INVALID_CONFIG_ERROR.status}
        title={INVALID_CONFIG_ERROR.title}
        subTitle={INVALID_CONFIG_ERROR.subTitle}
      />
    );
  }

  const nav = [
    { id: 'about', label: 'About' },
    { id: 'research', label: 'Research' },
    { id: 'news', label: 'News', show: cfg.news.length > 0 },
    {
      id: 'publications',
      label: 'Publications',
      show: cfg.publications.length > 0,
    },
    {
      id: 'projects',
      label: 'Projects',
      show: cfg.projects.external.projects.length > 0,
    },
    { id: 'blog', label: 'Writing', show: articles.length > 0 },
    { id: 'talks', label: 'Talks', show: (cfg.talks?.length ?? 0) > 0 },
    { id: 'cv', label: 'CV' },
  ].filter((n) => n.show !== false);

  const openPost = openPostSlug ? findLocalPost(openPostSlug) : undefined;

  return (
    <ReaderProvider>
      <div className="min-h-screen bg-base-100 text-base-content">
        <header className="sticky top-0 z-30 bg-base-100/85 backdrop-blur-md border-b border-base-300">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                if (openPostSlug) {
                  window.location.hash = 'about';
                } else {
                  window.history.pushState(null, '', window.location.pathname);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="group inline-flex items-center"
              aria-label="Home"
              title="Home"
            >
              <LogoMark className="w-9 h-9" />
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(n.id);
                  }}
                  className={`nav-link ${!openPostSlug && activeSection === n.id ? 'nav-link-active' : ''}`}
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              {!cfg.themeConfig.disableSwitch && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="icon-link"
                  aria-label={
                    isDark ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                  title={isDark ? 'Light mode' : 'Dark mode'}
                >
                  {isDark ? (
                    <HiOutlineSun className="text-lg" />
                  ) : (
                    <HiOutlineMoon className="text-lg" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="icon-link md:hidden"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <HiOutlineXMark className="text-xl" />
                ) : (
                  <HiOutlineBars3 className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="md:hidden border-t border-base-300 px-5 py-3 flex flex-col">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(n.id);
                  }}
                  className="py-2 text-base-content/80 hover:text-primary"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        <main className="max-w-4xl mx-auto px-5 sm:px-8">
          {openPost ? (
            <div className="py-10">
              <BlogPostView
                post={openPost}
                onBack={() => {
                  window.location.hash = 'blog';
                }}
                comments={cfg.comments}
                theme={theme}
              />
            </div>
          ) : (
            <>
              <Intro config={cfg} theme={theme} />
              <ResearchOverview
                publications={cfg.publications}
                scholarUrl={cfg.social.scholar}
                onSelectTopic={selectTopic}
                onGoTo={goTo}
              />
              {cfg.news.length > 0 && <News news={cfg.news} />}
              {cfg.publications.length > 0 && (
                <Publications
                  publications={cfg.publications}
                  topic={topic}
                  onTopicChange={setTopic}
                />
              )}
              {cfg.projects.external.projects.length > 0 && (
                <Projects projects={cfg.projects.external.projects} />
              )}
              <Writing articles={articles} />
              {cfg.talks && cfg.talks.length > 0 && <Talks talks={cfg.talks} />}
              <Cv config={cfg} />
            </>
          )}
        </main>

        <footer className="max-w-4xl mx-auto mt-8 px-5 sm:px-8">
          <div className="border-t-2 border-base-content">
            <div className="py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="font-serif italic text-2xl">
                  Let's talk research.
                </p>
                <p className="text-sm text-base-content/60 mt-1">
                  {cfg.social.email ? (
                    <a
                      href={`mailto:${cfg.social.email}`}
                      className="link-underline"
                    >
                      {cfg.social.email}
                    </a>
                  ) : null}
                  <span className="mx-2 opacity-40">·</span>Zurich, Switzerland
                </p>
                <p className="text-xs text-base-content/40 mt-4">
                  © {new Date().getFullYear()} Noah Mamié
                </p>
                <p className="text-xs text-base-content/40 mt-1 max-w-md leading-relaxed">
                  Privacy: no cookies, no analytics. Personalization is opt-in
                  and stays in your browser. Citation counts and blog posts are
                  refreshed from OpenAlex and Medium; comments use GitHub.
                </p>
              </div>
              <SocialLinks config={cfg} className="-ml-2 sm:ml-0" />
            </div>
          </div>
        </footer>
        {!openPost && (
          <FloatingReader
            vocabulary={[
              ...cfg.publications.flatMap((p) => p.topics || []),
              ...cfg.projects.external.projects.flatMap((p) => p.tags || []),
            ]}
          />
        )}
      </div>
    </ReaderProvider>
  );
};

export default GitProfile;
