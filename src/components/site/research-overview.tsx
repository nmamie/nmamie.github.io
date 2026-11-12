import { useState } from 'react';
import citationsData from '../../data/citations.json';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import Section from './section';
import { useReader } from '../../utils/reader';

type ScholarProfile = {
  total: number;
  hIndex: number;
  byYear: Record<string, number>;
};

type Focus = {
  id: string;
  x: number;
  y: number;
  label: string[];
  title: string;
  text: string;
  /** publication topic to filter on, or a section id to jump to */
  topic?: string;
  section?: string;
  core?: boolean;
};

/** Where the work sits: the overlaps of three disciplines, with news recommendation at the center. */
const focuses: Focus[] = [
  {
    id: 'news',
    x: 210,
    y: 168,
    label: ['news', 'recsys'],
    title: 'Generative news recommendation',
    text: 'My PhD: recommenders built on generative AI that personalize news while keeping it diverse, and that we evaluate with real readers rather than only offline metrics.',
    topic: 'Recommender Systems',
    core: true,
  },
  {
    id: 'transparent',
    x: 210,
    y: 80,
    label: ['transparent', 'profiles'],
    title: 'Transparent & scrutable recommenders',
    text: 'Natural-language user profiles that readers can inspect and edit, and an interpretability look at what models actually do with them.',
    topic: 'Interpretability',
  },
  {
    id: 'field',
    x: 136,
    y: 222,
    label: ['field', 'studies'],
    title: 'Field studies with Informfully',
    text: 'Our open research platform (iOS, Android, web) for running news-recommendation experiments with real users, behavioral logging and in-app surveys.',
    section: 'projects',
  },
  {
    id: 'democracy',
    x: 284,
    y: 222,
    label: ['NLP for', 'democracy'],
    title: 'NLP for democracy',
    text: 'Multilingual stance detection to check whether official Swiss voting booklets stay neutral across German, French and Italian.',
    topic: 'Political AI',
  },
];

const circles = [
  {
    cx: 160,
    cy: 135,
    label: 'Computer science & AI',
    lx: -26,
    ly: 20,
    anchor: 'start',
    color: 'var(--color-secondary)',
  },
  {
    cx: 260,
    cy: 135,
    label: 'Communication science',
    lx: 446,
    ly: 20,
    anchor: 'end',
    color: 'var(--color-primary)',
  },
  {
    cx: 210,
    cy: 222,
    label: 'Social science & economics',
    lx: 210,
    ly: 368,
    anchor: 'middle',
    color: 'var(--color-base-content)',
  },
];

const Venn = ({
  active,
  setActive,
  onSelect,
}: {
  active: Focus;
  setActive: (f: Focus) => void;
  onSelect: (f: Focus) => void;
}) => (
  <svg
    viewBox="-30 -6 480 392"
    className="w-full max-w-[460px] mx-auto overflow-visible"
    role="group"
    aria-label="Research at the intersection of three disciplines"
  >
    {circles.map((c) => (
      <g key={c.label}>
        <circle
          cx={c.cx}
          cy={c.cy}
          r={112}
          style={{ fill: c.color, stroke: c.color }}
          fillOpacity={0.05}
          strokeOpacity={0.7}
          strokeWidth={1}
        />
        <text
          x={c.lx}
          y={c.ly}
          textAnchor={c.anchor as 'start' | 'end' | 'middle'}
          className="font-mono uppercase"
          style={{ fill: c.color, fontSize: 10.5, letterSpacing: '0.12em' }}
        >
          {c.label}
        </text>
      </g>
    ))}
    {focuses.map((f) => {
      const on = f.id === active.id;
      return (
        <g
          key={f.id}
          role="button"
          tabIndex={0}
          aria-label={f.title}
          className="cursor-pointer outline-none"
          onMouseEnter={() => setActive(f)}
          onFocus={() => setActive(f)}
          onClick={() => onSelect(f)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(f)}
        >
          <circle
            cx={f.x}
            cy={f.y}
            r={f.core ? 36 : 31}
            style={{
              fill: on ? 'var(--color-base-content)' : 'var(--color-base-100)',
              stroke: 'var(--color-base-content)',
              transition: 'fill 0.2s',
            }}
            strokeWidth={f.core ? 1.5 : 1}
          />
          {f.label.map((line, i) => (
            <text
              key={line}
              x={f.x}
              y={f.y + (i - (f.label.length - 1) / 2) * 11 + 3.5}
              textAnchor="middle"
              className="font-mono pointer-events-none"
              style={{
                fill: on
                  ? 'var(--color-base-100)'
                  : 'var(--color-base-content)',
                fontSize: f.core ? 11 : 8.5,
                fontWeight: f.core ? 500 : 400,
              }}
            >
              {line}
            </text>
          ))}
        </g>
      );
    })}
  </svg>
);

const CitationChart = ({ byYear }: { byYear: Record<string, number> }) => {
  const [hover, setHover] = useState<string | null>(null);
  const years = Object.keys(byYear).sort();
  if (years.length === 0) return null;
  const max = Math.max(...years.map((y) => byYear[y]), 1);

  return (
    <div>
      <div
        className="flex items-end gap-3 h-[84px] border-b border-base-content"
        role="img"
        aria-label="Citations per year"
      >
        {years.map((y) => (
          <div
            key={y}
            className="flex flex-col items-center justify-end h-full flex-1 max-w-12"
            onMouseEnter={() => setHover(y)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="meta mb-1">{byYear[y]}</span>
            <div
              className={`w-full transition-colors ${hover === y ? 'bg-primary' : 'bg-base-content/80'}`}
              style={{ height: Math.max(3, (byYear[y] / max) * 60) }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-1">
        {years.map((y) => (
          <span key={y} className="meta flex-1 max-w-12 text-center">
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
  onGoTo,
}: {
  publications: SanitizedPublication[];
  scholarUrl?: string;
  onSelectTopic: (topic: string) => void;
  onGoTo: (section: string) => void;
}) => {
  const [active, setActive] = useState<Focus>(focuses[0]);
  const { note } = useReader();
  const profile = (citationsData as { _profile?: ScholarProfile })._profile;
  const total =
    profile?.total ??
    publications.reduce((sum, p) => sum + (p.citations ?? 0), 0);
  const select = (f: Focus) => {
    note(`${f.title} ${f.text}`);
    if (f.topic) onSelectTopic(f.topic);
    else if (f.section) onGoTo(f.section);
  };

  const stats = [
    { value: publications.length, label: 'Papers' },
    { value: total, label: 'Citations' },
    ...(profile ? [{ value: profile.hIndex, label: 'h-index' }] : []),
  ];

  return (
    <Section id="research" title="Research">
      <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-center">
        <Venn active={active} setActive={setActive} onSelect={select} />

        <div aria-live="polite">
          <p className="meta uppercase">
            {active.core ? 'Core focus' : 'Related work'}
          </p>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-medium leading-tight">
            {active.title}
          </h3>
          <p className="mt-3 leading-relaxed text-base-content/80">
            {active.text}
          </p>
          <button
            type="button"
            onClick={() => select(active)}
            className="mt-4 font-mono text-xs uppercase tracking-wider text-primary hover:underline underline-offset-4"
          >
            {active.topic ? 'See papers →' : 'See project →'}
          </button>
          <p className="meta mt-6 hidden md:block">
            Hover or tap the circles to explore.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-base-300 pt-6 grid sm:grid-cols-[1fr_auto] gap-4 items-baseline">
        <p className="leading-relaxed text-base-content/80">
          <span className="meta uppercase mr-2">Personal interest</span>
          <strong className="font-medium text-base-content">
            Collective intelligence
          </strong>
          : whether swarms of diverse foundation models reason better together
          than alone, and what that could mean for recommendation.
        </p>
        <button
          type="button"
          onClick={() => {
            note('collective intelligence swarm');
            onSelectTopic('Swarm Intelligence');
          }}
          className="font-mono text-xs uppercase tracking-wider text-primary hover:underline underline-offset-4 whitespace-nowrap"
        >
          HiveMind paper →
        </button>
      </div>

      <div className="mt-10 grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-14 items-end">
        <dl className="flex gap-10">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="meta uppercase">{s.label}</dt>
              <dd className="font-serif text-5xl font-medium tabular-nums leading-none mt-2">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        {profile && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="meta uppercase">Citations per year</span>
              {scholarUrl && (
                <a
                  href={scholarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="meta hover:text-primary"
                >
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
