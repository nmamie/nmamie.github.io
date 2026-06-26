import { useCallback, useEffect, useRef, useState } from 'react';

import axios, { AxiosError } from 'axios';
import { formatDistance } from 'date-fns';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import '../assets/index.css';
import { getInitialTheme, getSanitizedConfig, setupHotjar } from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import ErrorPage from './error-page';
import { DEFAULT_THEMES } from '../constants/default-themes';
import ThemeChanger from './theme-changer';
import { BG_COLOR } from '../constants';
import { getDevPost, getMediumPost } from '@arifszn/blog-js';
import { Article } from '../interfaces/article';
import AvatarCard from './avatar-card';
import { Profile } from '../interfaces/profile';
import DetailsCard from './details-card';
import SkillCard from './skill-card';
import ExperienceCard from './experience-card';
import EducationCard from './education-card';
import CertificationCard from './certification-card';
import { GithubProject } from '../interfaces/github-project';
import GithubProjectCard from './github-project-card';
import ExternalProjectCard from './external-project-card';
import BlogCard from './blog-card';
import Footer from './footer';
import PublicationCard from './publication-card';
import NewsCard from './news-card';
import SwarmCard from './swarm-card';
import TeachingCard from './teaching-card';
import NewsletterCard from './newsletter-card';
import TalksCard from './talks-card';

const CACHE_TTL = 3600000; // 1 hour

const getCachedData = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

/**
 * Renders the GitProfile component.
 *
 * @param {Object} config - the configuration object
 * @return {JSX.Element} the rendered GitProfile component
 */
const GitProfile = ({ config }: { config: Config }) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );
  const [theme, setTheme] = useState<string>(DEFAULT_THEMES[0]);
  const [error, setError] = useState<CustomError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [githubProjects, setGithubProjects] = useState<GithubProject[]>([]);
  const [activeTab, setActiveTab] = useState<string>('about');

  // Global search and article states
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);

  const vantaDivRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  const getGithubProjects = useCallback(
    async (publicRepoCount: number): Promise<GithubProject[]> => {
      if (sanitizedConfig.projects.github.mode === 'automatic') {
        if (publicRepoCount === 0) {
          return [];
        }

        const excludeRepo =
          sanitizedConfig.projects.github.automatic.exclude.projects
            .map((project) => `+-repo:${project}`)
            .join('');

        const query = `user:${sanitizedConfig.github.username}+fork:${!sanitizedConfig.projects.github.automatic.exclude.forks}${excludeRepo}`;
        const url = `https://api.github.com/search/repositories?q=${query}&sort=${sanitizedConfig.projects.github.automatic.sortBy}&per_page=${sanitizedConfig.projects.github.automatic.limit}&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      } else {
        if (sanitizedConfig.projects.github.manual.projects.length === 0) {
          return [];
        }
        const repos = sanitizedConfig.projects.github.manual.projects
          .map((project) => `+repo:${project}`)
          .join('');

        const url = `https://api.github.com/search/repositories?q=${repos}+fork:true&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      }
    },
    [
      sanitizedConfig.github.username,
      sanitizedConfig.projects.github.mode,
      sanitizedConfig.projects.github.manual.projects,
      sanitizedConfig.projects.github.automatic.sortBy,
      sanitizedConfig.projects.github.automatic.limit,
      sanitizedConfig.projects.github.automatic.exclude.forks,
      sanitizedConfig.projects.github.automatic.exclude.projects,
    ],
  );

  const loadData = useCallback(async () => {
    const cacheKey = `gitprofile_cache_${sanitizedConfig.github.username}`;
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      setProfile(cachedData.profile);
      setGithubProjects(cachedData.projects);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `https://api.github.com/users/${sanitizedConfig.github.username}`,
      );
      const data = response.data;

      const profileData = {
        avatar: data.avatar_url,
        name: data.name || ' ',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
      };

      setProfile(profileData);

      if (!sanitizedConfig.projects.github.display) {
        setCachedData(cacheKey, { profile: profileData, projects: [] });
        return;
      }

      const projectsData = await getGithubProjects(data.public_repos);
      setGithubProjects(projectsData);

      setCachedData(cacheKey, { profile: profileData, projects: projectsData });
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, [
    sanitizedConfig.github.username,
    sanitizedConfig.projects.github.display,
    getGithubProjects,
  ]);

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setTheme(getInitialTheme(sanitizedConfig.themeConfig));
      setupHotjar(sanitizedConfig.hotjar);
      loadData();
    }
  }, [sanitizedConfig, loadData]);

  useEffect(() => {
    if (profile) {
      const existingScript = document.getElementById('jsonLdSchema');
      if (existingScript) {
        existingScript.remove();
      }

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: profile.name || sanitizedConfig.seo.title,
          description: profile.bio || sanitizedConfig.seo.description,
          image: profile.avatar || sanitizedConfig.seo.imageURL,
          url: 'https://mamié.ch/',
          sameAs: [
            sanitizedConfig.social.linkedin
              ? `https://www.linkedin.com/in/${sanitizedConfig.social.linkedin}`
              : null,
            sanitizedConfig.social.bluesky
              ? `https://bsky.app/profile/${sanitizedConfig.social.bluesky}`
              : null,
            sanitizedConfig.social.scholar ? sanitizedConfig.social.scholar : null,
            sanitizedConfig.social.medium
              ? `https://medium.com/@${sanitizedConfig.social.medium}`
              : null,
            `https://github.com/${sanitizedConfig.github.username}`,
          ].filter(Boolean),
          jobTitle: sanitizedConfig.experiences?.[0]?.position || undefined,
          worksFor: sanitizedConfig.experiences?.[0]
            ? {
                '@type': 'Organization',
                name: sanitizedConfig.experiences[0].company,
                url: sanitizedConfig.experiences[0].companyLink || undefined,
              }
            : undefined,
          alumniOf: sanitizedConfig.educations?.map((edu) => ({
            '@type': 'EducationalOrganization',
            name: edu.institution,
          })) || [],
        },
      };

      const script = document.createElement('script');
      script.id = 'jsonLdSchema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.getElementById('jsonLdSchema');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [profile, sanitizedConfig]);

  const isAboutTab = activeTab === 'about';
  const isNewsTab = activeTab === 'news';
  const isPublicationsTab = activeTab === 'publications';
  const isProjectsTab = activeTab === 'projects';
  const isCvTab = activeTab === 'cv';
  const isBlogTab = activeTab === 'blog';
  const isTalksTab = activeTab === 'talks';

  const navTabs = [
    { id: 'about', label: 'About' },
    { id: 'news', label: 'News', count: sanitizedConfig.news?.length || 0 },
    { id: 'publications', label: 'Publications', count: sanitizedConfig.publications?.length || 0 },
    { id: 'projects', label: 'Projects' },
    { id: 'cv', label: 'CV' },
    { id: 'blog', label: 'Blog & Articles' },
    { id: 'talks', label: 'Talks', count: sanitizedConfig.talks?.length || 0 },
  ];

  // Fetch articles on mount
  useEffect(() => {
    if (!sanitizedConfig.blog?.display) return;
    
    const fetchAllPosts = async () => {
      setLoadingArticles(true);
      const allPosts: Article[] = [];
      const promises: Promise<void>[] = [];

      // 1. Medium
      if (sanitizedConfig.blog.source === 'medium' && sanitizedConfig.blog.username) {
        promises.push(
          getMediumPost({ user: sanitizedConfig.blog.username })
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
      if (sanitizedConfig.blog.source === 'dev' && sanitizedConfig.blog.username) {
        promises.push(
          getDevPost({ user: sanitizedConfig.blog.username })
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

      // 3. LessWrong GraphQL
      if (sanitizedConfig.social?.lesswrong) {
        promises.push(
          (async () => {
            try {
              const userRes = await axios.post('https://www.lesswrong.com/graphql', {
                query: `
                  query GetUser {
                    users(selector: { usersProfile: { slug: "${sanitizedConfig.social.lesswrong}" } }) {
                      results {
                        _id
                      }
                    }
                  }
                `
              });
              const results = userRes.data?.data?.users?.results;
              if (results && results.length > 0) {
                const userId = results[0]._id;
                const postsRes = await axios.post('https://www.lesswrong.com/graphql', {
                  query: `
                    query GetPosts {
                      posts(input: { terms: { limit: 10, userId: "${userId}" } }) {
                        results {
                          title
                          pageUrl
                          postedAt
                          htmlBody
                        }
                      }
                    }
                  `
                });
                const posts = postsRes.data?.data?.posts?.results || [];
                posts.forEach((post: any) => {
                  const cleanDesc = post.htmlBody
                    ? post.htmlBody.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150) + '...'
                    : '';
                  allPosts.push({
                    title: post.title,
                    thumbnail: '/img/lesswrong.png',
                    link: post.pageUrl,
                    publishedAt: new Date(post.postedAt),
                    description: cleanDesc,
                    categories: ['LessWrong'],
                  });
                });
              }
            } catch (err) {
              console.error('Error fetching LessWrong posts:', err);
            }
          })()
        );
      }

      // 4. Substack Feed via RSS-to-JSON
      if (sanitizedConfig.social?.substack) {
        promises.push(
          (async () => {
            try {
              const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://${sanitizedConfig.social.substack}.substack.com/feed`)}`;
              const res = await axios.get(feedUrl);
              const items = res.data?.items || [];
              items.forEach((item: any) => {
                let thumbnail = item.thumbnail || '';
                if (!thumbnail && item.description) {
                  const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
                  if (imgMatch) {
                    thumbnail = imgMatch[1];
                  }
                }
                const cleanDesc = item.description
                  ? item.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150) + '...'
                  : '';
                allPosts.push({
                  title: item.title,
                  thumbnail: thumbnail,
                  link: item.link,
                  publishedAt: new Date(item.pubDate),
                  description: cleanDesc,
                  categories: ['Substack'],
                });
              });
            } catch (err) {
              console.error('Error fetching Substack posts:', err);
            }
          })()
        );
      }

      await Promise.all(promises);
      allPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
      setArticles(allPosts);
      setLoadingArticles(false);
    };

    fetchAllPosts();
  }, [
    sanitizedConfig.blog?.display,
    sanitizedConfig.blog?.source,
    sanitizedConfig.blog?.username,
    sanitizedConfig.social?.lesswrong,
    sanitizedConfig.social?.substack
  ]);

  // Command palette listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getSearchResults = () => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase().trim();
    const results: Array<{
      type: 'news' | 'publication' | 'project' | 'cv' | 'article' | 'talk';
      title: string;
      subtitle?: string;
      targetId?: string;
      targetTab: string;
      externalUrl?: string;
    }> = [];

    // Search Publications
    if (sanitizedConfig.publications) {
      sanitizedConfig.publications.forEach((pub) => {
        if (
          pub.title.toLowerCase().includes(query) ||
          (pub.authors && pub.authors.toLowerCase().includes(query)) ||
          (pub.conferenceName && pub.conferenceName.toLowerCase().includes(query)) ||
          (pub.journalName && pub.journalName.toLowerCase().includes(query)) ||
          (pub.description && pub.description.toLowerCase().includes(query)) ||
          (pub.laymanSummary && pub.laymanSummary.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'publication',
            title: pub.title,
            subtitle: `${pub.year} • ${pub.conferenceName || pub.journalName || 'Paper'}`,
            targetTab: 'publications',
            targetId: `pub-${pub.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          });
        }
      });
    }

    // Search News
    if (sanitizedConfig.news) {
      sanitizedConfig.news.forEach((n) => {
        if (
          n.title.toLowerCase().includes(query) ||
          (n.description && n.description.toLowerCase().includes(query)) ||
          n.date.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'news',
            title: n.title,
            subtitle: n.date,
            targetTab: 'news',
            targetId: `news-${n.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          });
        }
      });
    }

    // Search Projects
    if (sanitizedConfig.projects?.external?.projects) {
      sanitizedConfig.projects.external.projects.forEach((proj) => {
        if (
          proj.title.toLowerCase().includes(query) ||
          (proj.description && proj.description.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'project',
            title: proj.title,
            subtitle: 'External Project',
            targetTab: 'projects',
            externalUrl: proj.link,
          });
        }
      });
    }
    if (githubProjects) {
      githubProjects.forEach((proj) => {
        if (
          proj.name.toLowerCase().includes(query) ||
          (proj.description && proj.description.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'project',
            title: proj.name,
            subtitle: 'GitHub Repository',
            targetTab: 'projects',
            externalUrl: proj.html_url,
          });
        }
      });
    }

    // Search CV
    if (sanitizedConfig.experiences) {
      sanitizedConfig.experiences.forEach((exp) => {
        if (
          (exp.company && exp.company.toLowerCase().includes(query)) ||
          (exp.position && exp.position.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'cv',
            title: `${exp.position} @ ${exp.company}`,
            subtitle: `Experience (${exp.from} - ${exp.to})`,
            targetTab: 'cv',
          });
        }
      });
    }
    if (sanitizedConfig.educations) {
      sanitizedConfig.educations.forEach((edu) => {
        if (
          (edu.institution && edu.institution.toLowerCase().includes(query)) ||
          (edu.degree && edu.degree.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'cv',
            title: `${edu.degree} @ ${edu.institution}`,
            subtitle: `Education (${edu.from} - ${edu.to})`,
            targetTab: 'cv',
          });
        }
      });
    }
    if (sanitizedConfig.teaching) {
      sanitizedConfig.teaching.forEach((teach) => {
        if (
          teach.course.toLowerCase().includes(query) ||
          teach.role.toLowerCase().includes(query) ||
          teach.institution.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'cv',
            title: `${teach.role}: ${teach.course}`,
            subtitle: `Teaching • ${teach.institution} (${teach.year})`,
            targetTab: 'cv',
          });
        }
      });
    }
    if (sanitizedConfig.certifications) {
      sanitizedConfig.certifications.forEach((cert) => {
        if (
          (cert.name && cert.name.toLowerCase().includes(query)) ||
          (cert.body && cert.body.toLowerCase().includes(query))
        ) {
          results.push({
            type: 'cv',
            title: cert.name || '',
            subtitle: `Certification • ${cert.body} (${cert.year})`,
            targetTab: 'cv',
          });
        }
      });
    }

    // Search Articles
    articles.forEach((art) => {
      if (
        art.title.toLowerCase().includes(query) ||
        art.description.toLowerCase().includes(query) ||
        art.categories.some((c) => c.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'article',
          title: art.title,
          subtitle: `Article • ${art.categories.join(', ')}`,
          targetTab: 'blog',
          targetId: `article-${art.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          externalUrl: art.link,
        });
      }
    });

    // Search Talks
    if (sanitizedConfig.talks) {
      sanitizedConfig.talks.forEach((talk) => {
        if (
          talk.title.toLowerCase().includes(query) ||
          (talk.description && talk.description.toLowerCase().includes(query)) ||
          talk.date.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'talk',
            title: talk.title,
            subtitle: `Talk • ${talk.date}`,
            targetTab: 'talks',
            targetId: `talk-${talk.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          });
        }
      });
    }

    return results.slice(0, 15);
  };

  const handleSelectResult = (result: any) => {
    setIsSearchOpen(false);
    setGlobalSearchQuery('');
    setActiveTab(result.targetTab);

    if (result.targetId) {
      setTimeout(() => {
        const el = document.getElementById(result.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    } else if (result.externalUrl) {
      window.open(result.externalUrl, '_blank');
    }
  };

  useEffect(() => {
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initialize Vanta.js background (BIRDS)
  // Recreate when `theme` changes so colors match the active theme
  // Revert to CDN loading as requested to restore original behavior
  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (id: string, src: string) => {
        return new Promise((resolve) => {
          if (document.getElementById(id)) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.id = id;
          script.src = src;
          script.onload = () => resolve(true);
          document.body.appendChild(script);
        });
      };

      await loadScript(
        'three-js',
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
      );
      await loadScript(
        'vanta-birds',
        'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js',
      );

      const createVanta = () => {
        if (!vantaDivRef.current) return;

        // Skip Vanta initialization on mobile/small screens for stability.
        // Mobile devices often struggle with Three.js/Vanta, causing memory crashes.
        if (window.innerWidth < 768) {
          console.log('Mobile/Small screen detected, skipping Vanta Birds for stability.');
          return;
        }

        try {
          if (vantaEffectRef.current) {
            vantaEffectRef.current.destroy();
          }
        } catch (e) {
          /* ignore */
        }

        try {
          // @ts-ignore
          vantaEffectRef.current = window.VANTA.BIRDS({
            el: vantaDivRef.current,
            // @ts-ignore
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            birdSize: 1.0,
            speedLimit: 4.0,
            backgroundAlpha: 0.0,
            // Setting color1 to black and color2 to white in 'variance' mode 
            // creates a full spectrum of random colors (Rainbow effect)
            color1: 0x000000,
            color2: 0xffffff,
            colorMode: 'variance',
            quantity: 4.0, // Maximum flock size
          });
        } catch (e) {
          console.warn('Vanta failed to initialize', e);
        }
      };

      setTimeout(createVanta, 500);
    };

    loadScripts();

    return () => {
      try {
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }
      } catch (e) {
        /* ignore cleanup */
      }
    };
  }, [theme]);





  const handleError = (error: AxiosError | Error): void => {
    console.error('Error:', error);

    if (error instanceof AxiosError) {
      try {
        const reset = formatDistance(
          new Date(error.response?.headers?.['x-ratelimit-reset'] * 1000),
          new Date(),
          { addSuffix: true },
        );

        if (typeof error.response?.status === 'number') {
          switch (error.response.status) {
            case 403:
              setError(setTooManyRequestError(reset));
              break;
            case 404:
              setError(INVALID_GITHUB_USERNAME_ERROR);
              break;
            default:
              setError(GENERIC_ERROR);
              break;
          }
        } else {
          setError(GENERIC_ERROR);
        }
      } catch (innerError) {
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  };

  return (
    <div className="fade-in h-screen">
      {error ? (
        <ErrorPage
          status={error.status}
          title={error.title}
          subTitle={error.subTitle}
        />
      ) : (
        <>
          <div
            className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Vanta background container - scoped to the BG area so birds integrate with the theme background */}
            <div
              ref={vantaDivRef}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Sticky glassmorphism navigation header */}
              <div className="sticky top-0 z-30 w-full mb-6 card bg-base-100/75 backdrop-blur-md shadow-md border border-base-300">
                <div className="card-body p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 font-bold text-lg px-2 opacity-90 text-base-content">
                    <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('about')}>
                      {profile?.name || sanitizedConfig.seo.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap justify-center">
                    <div className="tabs tabs-boxed bg-transparent gap-1 flex-wrap justify-center">
                      {navTabs.map((tab) => {
                        if (tab.id === 'talks' && (!sanitizedConfig.talks || sanitizedConfig.talks.length === 0)) return null;
                        if (tab.id === 'news' && sanitizedConfig.news.length === 0) return null;
                        if (tab.id === 'publications' && sanitizedConfig.publications.length === 0) return null;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab tab-sm sm:tab-md font-semibold transition-all rounded-md px-3 py-1 ${
                              activeTab === tab.id
                                ? 'tab-active bg-primary text-primary-content shadow-sm'
                                : 'hover:bg-base-300 text-base-content/75'
                            }`}
                          >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                              <span className={`ml-1.5 px-1.5 py-0.25 text-[9px] rounded-full font-bold ${
                                activeTab === tab.id
                                  ? 'bg-primary-content/20 text-primary-content'
                                  : 'bg-base-300 text-base-content/60'
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="btn btn-ghost btn-sm normal-case flex items-center gap-2 border border-base-content/10 hover:bg-base-300/80 rounded-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-75 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-xs opacity-60 text-base-content">Search</span>
                      <kbd className="kbd kbd-xs bg-base-300 text-base-content/60 border-base-content/10">⌘K</kbd>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-box">
                <div className="col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    {!sanitizedConfig.themeConfig.disableSwitch && (
                      <ThemeChanger
                        theme={theme}
                        setTheme={setTheme}
                        loading={loading}
                        themeConfig={sanitizedConfig.themeConfig}
                      />
                    )}
                    <AvatarCard
                      profile={profile}
                      loading={loading}
                      avatarRing={sanitizedConfig.themeConfig.displayAvatarRing}
                      resumeFileUrl={sanitizedConfig.resume.fileUrl}
                      researchInterests={sanitizedConfig.researchInterests}
                    />
                    <DetailsCard
                      profile={profile}
                      loading={loading}
                      github={sanitizedConfig.github}
                      social={sanitizedConfig.social}
                    />
                    <NewsletterCard
                      substack={sanitizedConfig.social.substack}
                      loading={loading}
                    />
                    {sanitizedConfig.skills.length !== 0 && (
                      <SkillCard
                        loading={loading}
                        skills={sanitizedConfig.skills}
                      />
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    {/* conditional views rendering depending on activeTab */}
                    {isAboutTab && (
                      <>
                        {sanitizedConfig.news.length !== 0 && (
                          <NewsCard
                            loading={loading}
                            news={sanitizedConfig.news.slice(0, 2)}
                          />
                        )}
                        {sanitizedConfig.publications.length !== 0 && (
                          <PublicationCard
                            loading={loading}
                            publications={
                              sanitizedConfig.publications.filter((p) => p.selected).length > 0
                                ? sanitizedConfig.publications.filter((p) => p.selected)
                                : sanitizedConfig.publications.slice(0, 2)
                            }
                          />
                        )}
                        {sanitizedConfig.blog.display && (
                          <BlogCard
                            loading={loadingArticles}
                            googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                            blog={{ ...sanitizedConfig.blog, limit: 2 }}
                            articles={articles}
                          />
                        )}
                        {sanitizedConfig.enableSwarmDemo && (
                          <SwarmCard loading={loading} />
                        )}
                      </>
                    )}

                    {isNewsTab && sanitizedConfig.news.length !== 0 && (
                      <NewsCard
                        loading={loading}
                        news={sanitizedConfig.news}
                      />
                    )}

                    {isPublicationsTab && sanitizedConfig.publications.length !== 0 && (
                      <PublicationCard
                        loading={loading}
                        publications={sanitizedConfig.publications}
                      />
                    )}

                    {isProjectsTab && (
                      <>
                        {sanitizedConfig.projects.external.projects.length !== 0 && (
                          <ExternalProjectCard
                            loading={loading}
                            header={sanitizedConfig.projects.external.header}
                            externalProjects={
                              sanitizedConfig.projects.external.projects
                            }
                            googleAnalyticId={sanitizedConfig.googleAnalytics.id}
                          />
                        )}
                        {sanitizedConfig.projects.github.display && (
                          <GithubProjectCard
                            header={sanitizedConfig.projects.github.header}
                            limit={sanitizedConfig.projects.github.automatic.limit}
                            githubProjects={githubProjects}
                            loading={loading}
                            googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                          />
                        )}
                      </>
                    )}

                    {isCvTab && (
                      <>
                        {sanitizedConfig.experiences.length !== 0 && (
                          <ExperienceCard
                            loading={loading}
                            experiences={sanitizedConfig.experiences}
                          />
                        )}
                        {sanitizedConfig.educations.length !== 0 && (
                          <EducationCard
                            loading={loading}
                            educations={sanitizedConfig.educations}
                          />
                        )}
                        {sanitizedConfig.teaching && sanitizedConfig.teaching.length !== 0 && (
                          <TeachingCard
                            teaching={sanitizedConfig.teaching}
                            loading={loading}
                          />
                        )}
                        {sanitizedConfig.certifications.length !== 0 && (
                          <CertificationCard
                            loading={loading}
                            certifications={sanitizedConfig.certifications}
                          />
                        )}
                      </>
                    )}

                    {isBlogTab && sanitizedConfig.blog.display && (
                      <BlogCard
                        loading={loadingArticles}
                        googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                        blog={sanitizedConfig.blog}
                        articles={articles}
                      />
                    )}

                    {isTalksTab && sanitizedConfig.talks && sanitizedConfig.talks.length !== 0 && (
                      <TalksCard
                        talks={sanitizedConfig.talks}
                        loading={loading}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Global search overlay modal (Cmd+K) */}
            {isSearchOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
                {/* Clicking backdrop closes search */}
                <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />
                
                <div className="relative card bg-base-200 border border-base-300 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[70vh] z-10 animate-in slide-in-from-top-4 duration-200">
                  <div className="p-4 border-b border-base-300 flex items-center gap-3 bg-base-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search news, publications, blog, cv, talks..."
                      value={globalSearchQuery}
                      onChange={(e) => setGlobalSearchQuery(e.target.value)}
                      className="bg-transparent text-base-content placeholder-base-content/40 outline-none w-full text-base sm:text-lg"
                    />
                    <button 
                      onClick={() => setIsSearchOpen(false)} 
                      className="kbd kbd-sm bg-base-300 text-base-content/60 border-base-content/10 cursor-pointer hover:bg-base-300/80"
                    >
                      ESC
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto p-4 flex flex-col gap-2 flex-1 max-h-[50vh] custom-scrollbar">
                    {globalSearchQuery.trim() === '' ? (
                      <div className="text-center py-12 text-base-content opacity-40 text-sm">
                        <p className="font-medium">Search for anything on Noah's profile</p>
                        <p className="text-xs mt-1">Start typing to see matching publications, articles, news, and cv experiences.</p>
                      </div>
                    ) : getSearchResults().length === 0 ? (
                      <div className="text-center py-12 text-base-content opacity-40 text-sm">
                        No results found for "{globalSearchQuery}"
                      </div>
                    ) : (
                      getSearchResults().map((res, index) => {
                        const typeBadgeColor = 
                          res.type === 'publication' ? 'badge-primary text-primary-content' :
                          res.type === 'article' ? 'badge-warning text-warning-content bg-amber-500 border-amber-500' :
                          res.type === 'news' ? 'badge-secondary text-secondary-content' :
                          res.type === 'talk' ? 'badge-accent text-accent-content' :
                          'badge-ghost opacity-70';

                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectResult(res)}
                            className="w-full text-left p-3 rounded-lg bg-base-100 hover:bg-primary/10 border border-base-300 hover:border-primary/20 transition-all flex items-center justify-between gap-4 group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors truncate">
                                {res.title}
                              </div>
                              {res.subtitle && (
                                <div className="text-xs text-base-content/60 mt-0.5 truncate">
                                  {res.subtitle}
                                </div>
                              )}
                            </div>
                            <span className={`badge badge-sm uppercase text-[8px] font-bold tracking-wider shrink-0 ${typeBadgeColor}`}>
                              {res.type}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {sanitizedConfig.footer && (
            <footer
              className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
            >
              <div className="card card-sm bg-base-100 shadow-sm">
                <Footer content={sanitizedConfig.footer} loading={loading} />
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  );
};

export default GitProfile;
