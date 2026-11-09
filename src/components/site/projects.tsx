import { SanitizedExternalProject } from '../../interfaces/sanitized-config';
import SwarmCard from '../swarm-card';
import Section, { ExtLink } from './section';

const Projects = ({ projects }: { projects: SanitizedExternalProject[] }) => (
  <Section id="projects" title="Projects">
    <div className="grid sm:grid-cols-2 gap-5">
      {projects.map((p) => (
        <ExtLink key={p.title} href={p.link} className="hover-card group block p-3 pb-5">
          {p.videoUrl ? (
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-black">
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
          ) : p.imageUrl && (
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-white">
              <img
                src={p.imageUrl}
                alt=""
                loading="lazy"
                className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
          )}
          <h3 className="mt-4 px-2 font-medium text-base-content group-hover:text-primary transition-colors">
            {p.title} <span className="opacity-40 group-hover:opacity-100">↗</span>
          </h3>
          <p className="px-2 text-sm text-base-content/65 mt-1.5 leading-relaxed line-clamp-3">
            {p.description}
          </p>
          {p.platforms && p.platforms.length > 0 && (
            <p className="px-2 text-xs text-primary/80 mt-2">{p.platforms.join(' · ')}</p>
          )}
        </ExtLink>
      ))}
    </div>

    <div className="mt-14 hover-card p-5 sm:p-6 bg-gradient-to-br from-accent/8 to-transparent">
      <h3 className="font-medium text-base-content">Try it: a swarm in your browser</h3>
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
  </Section>
);

export default Projects;
