import { useState } from 'react';
import { SanitizedNews } from '../../interfaces/sanitized-config';
import Section, { ExtLink, TextButton } from './section';
import { useFiltered, useReader } from '../../utils/reader';
import { FilterNote } from './reader-bar';

const newsText = (n: SanitizedNews) => `${n.title} ${n.description || ''}`;

const News = ({
  news,
  initial = 4,
}: {
  news: SanitizedNews[];
  initial?: number;
}) => {
  const [all, setAll] = useState(false);
  const { depth, note } = useReader();
  const [showAll, setShowAll] = useState(false);
  const filtered = useFiltered(news, newsText, showAll);
  const pool = filtered.list.map((r) => r.item);
  const expanded = all || depth === 'full';
  const shown = expanded ? pool : pool.slice(0, initial);

  return (
    <Section
      id="news"
      title="News"
      action={
        pool.length > initial &&
        depth !== 'full' && (
          <TextButton onClick={() => setAll(!all)}>
            {all ? 'Show less' : `All ${pool.length} updates`}
          </TextButton>
        )
      }
    >
      <FilterNote
        {...filtered}
        showAll={showAll}
        onToggle={() => setShowAll(!showAll)}
      />
      <ul>
        {shown.map((n, i) => (
          <li
            key={n.title}
            onClickCapture={() => note(newsText(n))}
            className="group grid sm:grid-cols-[120px_28px_1fr] gap-x-3 gap-y-1"
          >
            <span className="meta pt-1.5">{n.date}</span>

            {/* timeline: segment + dot share one column, so they always line up */}
            <div aria-hidden="true" className="relative hidden sm:block">
              <span
                className={`absolute left-1/2 -translate-x-1/2 w-px bg-base-300 ${
                  i === 0 ? 'top-3' : 'top-0'
                } ${i === shown.length - 1 ? 'h-3' : 'bottom-0'}`}
              />
              <span className="absolute left-1/2 top-3 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-base-100 border-[1.5px] border-primary group-hover:bg-primary transition-colors" />
            </div>

            <div
              className={
                i === shown.length - 1
                  ? ''
                  : depth === 'headline'
                    ? 'pb-4'
                    : 'pb-7'
              }
            >
              <p className="font-serif text-lg text-base-content leading-snug">
                {n.link ? (
                  <ExtLink
                    href={n.link}
                    className="hover:text-primary transition-colors"
                  >
                    {n.title}
                  </ExtLink>
                ) : (
                  n.title
                )}
              </p>
              {n.description && depth !== 'headline' && (
                <p
                  className={`text-[0.95rem] text-base-content/65 mt-1 leading-relaxed ${
                    depth === 'full' ? '' : 'line-clamp-2'
                  }`}
                >
                  {n.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default News;
