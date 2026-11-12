import { ReactNode } from 'react';
import { format } from 'date-fns';
import { SanitizedConfig } from '../../interfaces/sanitized-config';
import { ExtLink } from './section';
import SocialLinks from './social-links';
import NetworkBackdrop from './network-backdrop';
import { EditionBar } from './reader-bar';
import { useReader } from '../../utils/reader';

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <ExtLink href={href} className="link-underline">
    {children}
  </ExtLink>
);

const Intro = ({
  config,
  theme,
}: {
  config: SanitizedConfig;
  theme: string;
}) => {
  const { depth } = useReader();
  return (
    <section
      id="about"
      data-section
      className="relative scroll-mt-24 pt-8 sm:pt-12 pb-12 -mx-5 sm:-mx-8 px-5 sm:px-8"
    >
      <NetworkBackdrop theme={theme} />

      <div className="relative">
        {/* Masthead dateline */}
        <div className="meta flex flex-wrap justify-between gap-x-6 gap-y-1 border-y border-base-content/80 py-1.5">
          <span>Zurich · {format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          <span className="hidden sm:inline">AI × Communication × Society</span>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col-reverse sm:flex-row gap-8 sm:gap-12 items-start">
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-5xl sm:text-7xl font-medium tracking-tight leading-[0.95] text-base-content">
              Noah Mamié
            </h1>
            <p className="mt-4 font-serif italic text-xl sm:text-2xl leading-snug text-base-content/80 max-w-xl">
              Generative AI that recommends news: personal, but still diverse,
              transparent and good for public debate.
            </p>

            {depth !== 'headline' && (
              <div className="mt-8 space-y-4 leading-relaxed text-base-content/90 max-w-2xl">
                <p className="drop-cap">
                  I am a doctoral researcher in the{' '}
                  <A href="https://www.ifi.uzh.ch/en/ddis.html">DDIS group</A>{' '}
                  at the University of Zurich, a{' '}
                  <A href="https://www.ai.uzh.ch/en/research/UZH.ai-Fellowship-Program-2026.html">
                    UZH.ai Fellow
                  </A>{' '}
                  and a scholar in the{' '}
                  <A href="https://www.dsi.uzh.ch/en/education/excellence-program.html">
                    DSI Excellence Program
                  </A>
                  . My PhD asks how generative AI can personalize news without
                  narrowing what people see, and I test the answers with real
                  readers in field studies on{' '}
                  <A href="https://informfully.ch">Informfully</A>.
                </p>
                <p>
                  I came to AI the long way around: business administration in
                  St. Gallen, private equity, applied economics research at ETH
                  Zurich, then an MSc in AI at UZH. That path is why I work
                  where computer science meets communication and social science.
                  Out of personal interest, I also explore{' '}
                  <em>collective intelligence</em>: whether swarms of foundation
                  models reason better together than alone.
                </p>
              </div>
            )}

            <p className="tag mt-6">
              {(config.researchInterests || []).map((r, i) => (
                <span key={r} className="inline-block whitespace-nowrap">
                  {i > 0 && <span className="mx-2 text-primary">/</span>}
                  {r}
                </span>
              ))}
            </p>

            <SocialLinks config={config} className="mt-6 -ml-2" />
          </div>

          <figure className="shrink-0">
            <img
              src="/img/portrait.jpg"
              alt="Portrait of Noah Mamié"
              width={176}
              height={176}
              className="portrait w-32 h-32 sm:w-44 sm:h-44 object-cover border border-base-content/80"
            />
            <figcaption className="meta mt-1.5">Photo · N. Mamié</figcaption>
          </figure>
        </div>

        <EditionBar />
      </div>
    </section>
  );
};

export default Intro;
