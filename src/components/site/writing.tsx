import { useState } from 'react';
import { format } from 'date-fns';
import { Article } from '../../interfaces/article';
import Section, { TextButton } from './section';
import { useFiltered, useReader } from '../../utils/reader';
import { FilterNote } from './reader-bar';

const articleText = (a: Article) =>
  `${a.title} ${a.description} ${a.categories.join(' ')}`;

const PLATFORMS = ['Blog', 'Medium', 'Substack', 'LessWrong', 'Dev.to'];

const platformOf = (a: Article) =>
  PLATFORMS.find((p) => a.categories.includes(p)) || '';

const Writing = ({
  articles,
  initial = 4,
}: {
  articles: Article[];
  initial?: number;
}) => {
  const [all, setAll] = useState(false);
  const { depth, note } = useReader();
  const [showAll, setShowAll] = useState(false);
  const filtered = useFiltered(articles, articleText, showAll);
  if (articles.length === 0) return null;
  const pool = filtered.list.map((r) => r.item);
  const expanded = all || depth === 'full';
  const shown = expanded ? pool : pool.slice(0, initial);
  const headline = depth === 'headline';

  return (
    <Section
      id="blog"
      title="Writing"
      action={
        pool.length > initial &&
        depth !== 'full' && (
          <TextButton onClick={() => setAll(!all)}>
            {all ? 'Show less' : `All ${pool.length} posts`}
          </TextButton>
        )
      }
    >
      <FilterNote
        {...filtered}
        showAll={showAll}
        onToggle={() => setShowAll(!showAll)}
      />
      <ul className={headline ? 'space-y-2' : 'space-y-4'}>
        {shown.map((a) => {
          const internal = a.link.startsWith('#');
          const platform = platformOf(a);
          return (
            <li key={a.link}>
              <a
                href={a.link}
                target={internal ? undefined : '_blank'}
                rel={internal ? undefined : 'noreferrer'}
                onClick={() => note(articleText(a))}
                className={`hover-card group grid grid-cols-[1fr_auto] gap-6 items-start ${
                  headline ? 'px-4 py-3' : 'p-4 sm:p-5'
                }`}
              >
                <div className="min-w-0">
                  <p className="meta">
                    {format(a.publishedAt, 'MMM d, yyyy')}
                    {platform && (
                      <>
                        {' · '}
                        {platform === 'Blog' ? 'On this site' : platform}
                      </>
                    )}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-medium text-base-content leading-snug group-hover:text-primary transition-colors">
                    {a.title}
                    {!internal && (
                      <span className="opacity-40 group-hover:opacity-100">
                        {' '}
                        ↗
                      </span>
                    )}
                  </h3>
                  {!headline && (
                    <p
                      className={`text-sm text-base-content/60 mt-1.5 leading-relaxed ${
                        depth === 'full' ? 'line-clamp-6' : 'line-clamp-2'
                      }`}
                    >
                      {a.description}
                    </p>
                  )}
                </div>
                {!headline &&
                  a.thumbnail &&
                  !a.thumbnail.includes('lesswrong.png') && (
                    <img
                      src={a.thumbnail}
                      alt=""
                      loading="lazy"
                      className="w-24 h-20 sm:w-32 sm:h-24 object-cover border border-base-300 grayscale group-hover:grayscale-0 transition-[filter] duration-300"
                    />
                  )}
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Writing;
