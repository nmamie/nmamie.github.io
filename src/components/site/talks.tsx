import { SanitizedTalk } from '../../interfaces/sanitized-config';
import Section, { ExtLink } from './section';
import { useState } from 'react';
import { useFiltered, useReader } from '../../utils/reader';
import { FilterNote } from './reader-bar';

const talkText = (t: SanitizedTalk) => `${t.title} ${t.description || ''}`;

const Talks = ({ talks }: { talks: SanitizedTalk[] }) => {
  const { depth, note } = useReader();
  const [showAll, setShowAll] = useState(false);
  const filtered = useFiltered(talks, talkText, showAll);
  return (
    <Section id="talks" title="Talks">
      <FilterNote
        {...filtered}
        showAll={showAll}
        onToggle={() => setShowAll(!showAll)}
      />
      <ul className={depth === 'headline' ? 'space-y-3' : 'space-y-6'}>
        {filtered.list.map(({ item: t }) => (
          <li key={t.title} onClickCapture={() => note(talkText(t))}>
            <p className="meta">{t.date}</p>
            <h3 className="mt-1 font-serif text-xl font-medium text-base-content leading-snug">
              {t.link ? (
                <ExtLink
                  href={t.link}
                  className="hover:text-primary transition-colors"
                >
                  {t.title}
                </ExtLink>
              ) : (
                t.title
              )}
            </h3>
            {t.description && depth !== 'headline' && (
              <p
                className={`text-sm text-base-content/60 mt-1 leading-relaxed ${
                  depth === 'full' ? '' : 'line-clamp-2'
                }`}
              >
                {t.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Talks;
