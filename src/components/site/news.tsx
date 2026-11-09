import { useState } from 'react';
import { SanitizedNews } from '../../interfaces/sanitized-config';
import Section, { ExtLink, TextButton } from './section';

const News = ({ news, initial = 4 }: { news: SanitizedNews[]; initial?: number }) => {
  const [all, setAll] = useState(false);
  const shown = all ? news : news.slice(0, initial);

  return (
    <Section
      id="news"
      title="News"
      action={
        news.length > initial && (
          <TextButton onClick={() => setAll(!all)}>
            {all ? 'Show less' : `All ${news.length} updates`}
          </TextButton>
        )
      }
    >
      <ul className="relative space-y-6 sm:before:absolute sm:before:left-[136px] sm:before:top-2 sm:before:bottom-2 sm:before:w-px sm:before:bg-base-300">
        {shown.map((n) => (
          <li key={n.title} className="group grid sm:grid-cols-[130px_1fr] gap-1 sm:gap-6">
            <span className="text-sm text-base-content/50 tabular-nums pt-0.5">{n.date}</span>
            <div className="relative">
              <span
                aria-hidden="true"
                className="hidden sm:block absolute -left-[29px] top-[7px] w-2.5 h-2.5 rounded-full bg-base-100 border-2 border-primary group-hover:bg-primary transition-colors"
              />
              <p className="text-base-content leading-snug">
                {n.link ? (
                  <ExtLink href={n.link} className="hover:text-primary transition-colors">
                    {n.title}
                  </ExtLink>
                ) : (
                  n.title
                )}
              </p>
              {n.description && (
                <p className="text-sm text-base-content/60 mt-1 leading-relaxed line-clamp-2">
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
