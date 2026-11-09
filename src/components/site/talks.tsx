import { SanitizedTalk } from '../../interfaces/sanitized-config';
import Section, { ExtLink } from './section';

const Talks = ({ talks }: { talks: SanitizedTalk[] }) => (
  <Section id="talks" title="Talks">
    <ul className="space-y-6">
      {talks.map((t) => (
        <li key={t.title}>
          <p className="text-xs text-base-content/50">{t.date}</p>
          <h3 className="mt-1 font-medium text-base-content leading-snug">
            {t.link ? (
              <ExtLink href={t.link} className="hover:text-primary transition-colors">
                {t.title}
              </ExtLink>
            ) : (
              t.title
            )}
          </h3>
          {t.description && (
            <p className="text-sm text-base-content/60 mt-1 leading-relaxed line-clamp-2">
              {t.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  </Section>
);

export default Talks;
