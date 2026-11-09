import { ReactNode } from 'react';
import { SanitizedConfig } from '../../interfaces/sanitized-config';
import { ExtLink } from './section';
import SocialLinks from './social-links';
import NetworkBackdrop from './network-backdrop';

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <ExtLink href={href} className="link-underline">
    {children}
  </ExtLink>
);

const Intro = ({ config, theme }: { config: SanitizedConfig; theme: string }) => {
  return (
    <section
      id="about"
      data-section
      className="relative scroll-mt-24 pt-10 sm:pt-20 pb-14 -mx-5 sm:-mx-8 px-5 sm:px-8"
    >
      <NetworkBackdrop theme={theme} />
      <div className="relative flex flex-col-reverse sm:flex-row gap-8 sm:gap-12 items-start">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-secondary mb-3 tracking-wide">Hi, I'm</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight gradient-text pb-1">
            Noah Mamié
          </h1>
          <p className="mt-3 text-base-content/65 text-lg">
            PhD Researcher · UZH.ai Fellow · University of Zurich
          </p>

          <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-base-content/85 max-w-2xl">
            <p>
              I am a doctoral researcher in the{' '}
              <A href="https://www.ifi.uzh.ch/en/ddis.html">
                Dynamic and Distributed Information Systems group
              </A>{' '}
              at the University of Zurich, a{' '}
              <A href="https://www.ai.uzh.ch/en/research/UZH.ai-Fellowship-Program-2026.html">
                UZH.ai Fellow
              </A>
              , and a scholar in the{' '}
              <A href="https://www.dsi.uzh.ch/en/education/excellence-program.html">
                DSI Excellence Program
              </A>
              .
            </p>
            <p>
              My research studies <strong className="font-semibold">generative AI for personalized news recommendation</strong>,
              tested in real-world field studies on the{' '}
              <A href="https://informfully.ch">Informfully</A> platform. I am also interested in{' '}
              <strong className="font-semibold">collective intelligence</strong>: how swarms of
              foundation models can reason better together than alone.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(config.researchInterests || []).map((r) => (
              <span key={r} className="chip chip-tinted">
                {r}
              </span>
            ))}
          </div>

          <SocialLinks config={config} className="mt-8 -ml-2" />
        </div>

        <img
          src={`https://github.com/${config.github.username}.png?size=320`}
          alt="Noah Mamié"
          width={160}
          height={160}
          className="avatar-ring w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover shrink-0"
        />
      </div>
    </section>
  );
};

export default Intro;
