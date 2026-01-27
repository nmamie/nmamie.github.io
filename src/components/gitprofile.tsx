import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';

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
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initialize Vanta.js background (BIRDS)
  // Recreate when `theme` changes so colors match the active theme
  useEffect(() => {
    const createVanta = () => {
      if (!vantaDivRef.current) return;

      // Ensure THREE is globally available as some Vanta versions expect it
      (window as any).THREE = THREE;

      // Read theme colors from CSS variables
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue('--color-primary')?.trim();
      const accent = style.getPropertyValue('--color-accent')?.trim();
      const baseContent = style.getPropertyValue('--color-base-content')?.trim();

      // Helper to ensure we have a valid color format for Vanta
      const isValidHex = (c: string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(c);
      const vantaColor = isValidHex(primary) ? primary : (isValidHex(baseContent) ? baseContent : '#fc055b');
      const vantaColor2 = isValidHex(accent) ? accent : (isValidHex(baseContent) ? baseContent : '#e8d03a');

      // Destroy existing instance
      try {
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
        }
      } catch (e) {
        /* ignore */
      }

      try {
        vantaEffectRef.current = BIRDS({
          el: vantaDivRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 0.5,
          birdSize: 0.5,
          speedLimit: 4.0,
          backgroundAlpha: 0,
          color: vantaColor,
          color2: vantaColor2,
        });

      } catch (e) {
        console.warn('Vanta failed to initialize', e);
      }
    };

    // Small delay to ensure styles are applied and element is sized
    const timer = setTimeout(createVanta, 200);

    // ResizeObserver to handle layout shifts (especially important on mobile)
    const resizeObserver = new ResizeObserver(() => {
      try {
        if (vantaEffectRef.current) {
          vantaEffectRef.current.resize();
        }
      } catch (e) {
        /* ignore */
      }
    });

    if (vantaDivRef.current) {
      resizeObserver.observe(vantaDivRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      try {
        if (vantaEffectRef.current) {
          vantaEffectRef.current.destroy();
          vantaEffectRef.current = null;
        }
      } catch (e) {
        /* ignore cleanup errors */
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
                    />
                    <DetailsCard
                      profile={profile}
                      loading={loading}
                      github={sanitizedConfig.github}
                      social={sanitizedConfig.social}
                    />
                    {sanitizedConfig.skills.length !== 0 && (
                      <SkillCard
                        loading={loading}
                        skills={sanitizedConfig.skills}
                      />
                    )}
                    {sanitizedConfig.experiences.length !== 0 && (
                      <ExperienceCard
                        loading={loading}
                        experiences={sanitizedConfig.experiences}
                      />
                    )}
                    {sanitizedConfig.certifications.length !== 0 && (
                      <CertificationCard
                        loading={loading}
                        certifications={sanitizedConfig.certifications}
                      />
                    )}
                    {sanitizedConfig.educations.length !== 0 && (
                      <EducationCard
                        loading={loading}
                        educations={sanitizedConfig.educations}
                      />
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    {sanitizedConfig.news.length !== 0 && (
                      <NewsCard
                        loading={loading}
                        news={sanitizedConfig.news}
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
                    {sanitizedConfig.publications.length !== 0 && (
                      <PublicationCard
                        loading={loading}
                        publications={sanitizedConfig.publications}
                      />
                    )}
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
                    {sanitizedConfig.blog.display && (
                      <BlogCard
                        loading={loading}
                        googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                        blog={sanitizedConfig.blog}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
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
