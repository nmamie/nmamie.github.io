import { ReactNode, useState } from 'react';
import citationsData from '../../data/citations.json';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import {
  HiveMindMark,
  InformfullyMark,
  KnowledgeGraphMark,
  StanceDialMark,
} from '../project-marks';
import Section from './section';

type ScholarProfile = {
  total: number;
  hIndex: number;
  byYear: Record<string, number>;
};

const areas: { mark: ReactNode; title: string; text: string; topic: string; tone: string }[] = [
  {
    mark: <InformfullyMark />,
    title: 'Generative news recommendation',
    text: 'GenAI recommenders evaluated in field studies with real readers on Informfully.',
    topic: 'Recommender Systems',
    tone: 'from-primary/12 group-hover:text-primary',
  },
  {
    mark: <KnowledgeGraphMark />,
    title: 'Transparent & scrutable recommenders',
    text: 'Natural-language user profiles and what models actually do with them.',
    topic: 'Interpretability',
    tone: 'from-accent/12 group-hover:text-accent',
  },
  {
    mark: <HiveMindMark />,
    title: 'Collective intelligence',
    text: 'Swarms of foundation models that reason better together than alone.',
    topic: 'Swarm Intelligence',
    tone: 'from-secondary/12 group-hover:text-secondary',
  },
  {
    mark: <StanceDialMark />,
    title: 'NLP for democracy',
    text: 'Stance detection to monitor neutrality in Swiss voting booklets.',
    topic: 'Political AI',
    tone: 'from-primary/12 group-hover:text-primary',
  },
];

const CitationChart = ({ byYear }: { byYear: Record<string, number> }) => {
  const [hover, setHover] = useState<string | null>(null);
  const years = Object.keys(byYear).sort();
  if (years.length === 0) return null;
  const max = Math.max(...years.map((y) => byYear[y]), 1);
  const H = 72;

  return (
    <div>
      <div className="flex items-end gap-3 h-[96px]" role="img" aria-label="Citations per year">
        {years.map((y) => {
          const h = Math.max(4, (byYear[y] / max) * H);
          const active = hover === y;
          return (
            <div
              key={y}
              className="flex flex-col items-center justify-end h-full flex-1 max-w-14 cursor-default"
              onMouseEnter={() => setHover(y)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                className={`text-xs tabular-nums mb-1 transition-opacity ${
                  active ? 'opacity-100' : 'opacity-60'
                }`}
              >
                {byYear[y]}
              </span>
              <div
                className={`w-full rounded-t-md bg-gradient-to-t from-primary to-accent transition-opacity ${
                  active ? 'opacity-100' : 'opacity-70'
                }`}
                style={{ height: h }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2 border-t border-base-300 pt-1.5">
        {years.map((y) => (
          <span key={y} className="flex-1 max-w-14 text-center text-xs text-base-content/50 tabular-nums">
            {y}
          </span>
        ))}
      </div>
    </div>
  );
};

const ResearchOverview = ({
  publications,
  scholarUrl,
  onSelectTopic,
}: {
  publications: SanitizedPublication[];
  scholarUrl?: string;
  onSelectTopic: (topic: string) => void;
}) => {
  const profile = (citationsData as { _profile?: ScholarProfile })._profile;
  const total =
    profile?.total ?? publications.reduce((sum, p) => sum + (p.citations ?? 0), 0);

  const stats = [
    { value: publications.length, label: 'Papers' },
    { value: total, label: 'Citations' },
    ...(profile ? [{ value: profile.hIndex, label: 'h-index' }] : []),
  ];

  return (
    <Section id="research" title="Research">
      <div className="grid sm:grid-cols-2 gap-4">
        {areas.map((a) => (
          <button
            key={a.title}
            type="button"
            onClick={() => onSelectTopic(a.topic)}
            className={`hover-card group flex gap-4 text-left items-start p-5 bg-gradient-to-br ${a.tone.split(' ')[0]} to-transparent`}
          >
            <div className="shrink-0">{a.mark}</div>
            <div>
              <h3 className={`font-medium text-base-content transition-colors ${a.tone.split(' ')[1]}`}>
                {a.title}
              </h3>
              <p className="text-sm text-base-content/65 leading-relaxed mt-0.5">{a.text}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-14 items-end">
        <dl className="flex gap-10">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs uppercase tracking-wider text-base-content/50">{s.label}</dt>
              <dd className="text-4xl font-semibold tabular-nums gradient-text mt-1">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        {profile && (
          <div>
            <div className="flex justify-between text-xs text-base-content/50 mb-2">
              <span>Citations per year</span>
              {scholarUrl && (
                <a href={scholarUrl} target="_blank" rel="noreferrer" className="hover:text-primary">
                  Google Scholar ↗
                </a>
              )}
            </div>
            <CitationChart byYear={profile.byYear} />
          </div>
        )}
      </div>
    </Section>
  );
};

export default ResearchOverview;
