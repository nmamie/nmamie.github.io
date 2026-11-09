import { ReactNode } from 'react';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { SanitizedConfig } from '../../interfaces/sanitized-config';
import Section, { ExtLink } from './section';

const awards = [
  {
    title: 'UZH.ai Fellowship & DSI Excellence Program',
    org: 'University of Zurich',
    year: '2026',
    link: 'https://www.ai.uzh.ch/en/research/UZH.ai-Fellowship-Program-2026.html',
  },
  {
    title: 'Best Poster Award',
    org: 'SwissText 2023',
    year: '2023',
    link: 'https://arxiv.org/pdf/2306.08999',
  },
];

type Row = { when: string; title: ReactNode; sub?: ReactNode };

const Rows = ({ heading, rows }: { heading: string; rows: Row[] }) =>
  rows.length === 0 ? null : (
    <div>
      <h3 className="text-sm font-medium text-base-content/50 mb-4">{heading}</h3>
      <ul className="space-y-4">
        {rows.map((r, i) => (
          <li key={i} className="grid sm:grid-cols-[130px_1fr] gap-0.5 sm:gap-6">
            <span className="text-sm text-base-content/50 tabular-nums">{r.when}</span>
            <div>
              <p className="text-base-content leading-snug">{r.title}</p>
              {r.sub && <p className="text-sm text-base-content/60 mt-0.5">{r.sub}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

const span = (from: string, to: string) => (from === to ? from : `${from} – ${to}`);
const shortYear = (s: string) => s.replace(/^[A-Za-z]+ /, '');

const Cv = ({ config }: { config: SanitizedConfig }) => {
  const linked = (text?: string, href?: string) =>
    href ? (
      <ExtLink href={href} className="hover:text-primary transition-colors">
        {text}
      </ExtLink>
    ) : (
      text
    );

  return (
    <Section
      id="cv"
      title="CV"
      action={
        config.resume.fileUrl && (
          <ExtLink
            href={config.resume.fileUrl}
            className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-primary transition-colors"
          >
            <HiOutlineDocumentText /> Full CV (PDF)
          </ExtLink>
        )
      }
    >
      <div className="space-y-12">
        <Rows
          heading="Experience"
          rows={config.experiences.slice(0, 4).map((e) => ({
            when: span(shortYear(e.from), shortYear(e.to)),
            title: e.position,
            sub: linked(e.company, e.companyLink),
          }))}
        />
        <Rows
          heading="Education"
          rows={config.educations.map((e) => ({
            when: span(e.from, e.to),
            title: e.degree,
            sub: e.institution,
          }))}
        />
        <Rows
          heading="Awards"
          rows={awards.map((a) => ({ when: a.year, title: linked(a.title, a.link), sub: a.org }))}
        />
        <Rows
          heading="Teaching"
          rows={(config.teaching || []).map((t) => ({
            when: t.year,
            title: linked(t.course, t.link),
            sub: `${t.role}, ${t.institution}`,
          }))}
        />
      </div>
    </Section>
  );
};

export default Cv;
