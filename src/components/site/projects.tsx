import { useState } from 'react';
import { SanitizedExternalProject } from '../../interfaces/sanitized-config';
import SwarmCard from '../swarm-card';
import Section, { ExtLink } from './section';
import { useRanked, useReader } from '../../utils/reader';
import { FilterNote, RankNote } from './reader-bar';

const projectText = (p: SanitizedExternalProject) =>
  [p.title, p.description, ...(p.tags || [])].join(' ');

const Projects = ({ projects }: { projects: SanitizedExternalProject[] }) => {
  const { depth, note } = useReader();
  const [showAll, setShowAll] = useState(false);
  const ranked = useRanked(projects, projectText, showAll);
  const headline = depth === 'headline';
  return (
    <Section id="projects" title="Projects">
      <FilterNote
        {...ranked}
        showAll={showAll}
        onToggle={() => setShowAll(!showAll)}
      />
      <div className="grid sm:grid-cols-2 gap-5">
        {ranked.list.map(({ item: p, reason, kind }) => (
          <ExtLink
            key={p.title}
            href={p.link}
            onClick={() => note(projectText(p), p.tags)}
            style={{
              viewTransitionName: `proj-${p.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-$/, '')}`,
            }}
            className={`hover-card group block ${headline ? 'p-3' : 'p-3 pb-5'}`}
          >
            {kind && (
              <p className="px-2 pb-2">
                <RankNote kind={kind} reason={reason} />
              </p>
            )}
            {headline ? null : p.videoUrl ? (
              <div className="aspect-[16/9] overflow-hidden bg-black">
                <video
                  src={p.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${p.title} demo`}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              p.imageUrl && (
                <div className="aspect-[16/9] overflow-hidden bg-white">
                  <img
                    src={p.imageUrl}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )
            )}
            <h3
              className={`${headline ? 'mt-0' : 'mt-4'} px-2 font-serif text-lg font-medium leading-snug text-base-content group-hover:text-primary transition-colors`}
            >
              {p.title}{' '}
              <span className="opacity-40 group-hover:opacity-100">↗</span>
            </h3>
            {!headline && (
              <p
                className={`px-2 text-sm text-base-content/65 mt-1.5 leading-relaxed ${
                  depth === 'full' ? '' : 'line-clamp-3'
                }`}
              >
                {p.description}
              </p>
            )}
            {p.platforms && p.platforms.length > 0 && (
              <p className="px-2 tag mt-2">{p.platforms.join(' · ')}</p>
            )}
            {depth === 'full' && p.tags && p.tags.length > 0 && (
              <p className="px-2 meta mt-1">{p.tags.join(' / ')}</p>
            )}
          </ExtLink>
        ))}
      </div>

      {!headline && (
        <div className="mt-14 hover-card p-5 sm:p-6">
          <p className="meta uppercase">Personal interest · interactive</p>
          <h3 className="mt-1 font-serif text-xl font-medium text-base-content">
            Try it: a swarm in your browser
          </h3>
          <p className="text-sm text-base-content/65 mt-1.5 mb-5 max-w-2xl leading-relaxed">
            The flocking rules (separation, alignment, cohesion) that inspired{' '}
            <ExtLink
              href="https://link.springer.com/chapter/10.1007/978-981-95-0982-9_20"
              className="link-underline"
            >
              The Society of HiveMind
            </ExtLink>
            . Click the canvas to drop targets and tune the sliders.
          </p>
          <SwarmCard loading={false} embedded />
        </div>
      )}
    </Section>
  );
};

export default Projects;
