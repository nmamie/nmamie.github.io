import { useState } from 'react';
import { format } from 'date-fns';
import { Article } from '../../interfaces/article';
import Section, { TextButton } from './section';

const PLATFORMS = ['Blog', 'Medium', 'Substack', 'LessWrong', 'Dev.to'];

const platformOf = (a: Article) => PLATFORMS.find((p) => a.categories.includes(p)) || '';

const Writing = ({ articles, initial = 4 }: { articles: Article[]; initial?: number }) => {
  const [all, setAll] = useState(false);
  if (articles.length === 0) return null;
  const shown = all ? articles : articles.slice(0, initial);

  return (
    <Section
      id="blog"
      title="Writing"
      action={
        articles.length > initial && (
          <TextButton onClick={() => setAll(!all)}>
            {all ? 'Show less' : `All ${articles.length} posts`}
          </TextButton>
        )
      }
    >
      <ul className="space-y-4">
        {shown.map((a) => {
          const internal = a.link.startsWith('#');
          const platform = platformOf(a);
          return (
            <li key={a.link}>
              <a
                href={a.link}
                target={internal ? undefined : '_blank'}
                rel={internal ? undefined : 'noreferrer'}
                className="hover-card group grid grid-cols-[1fr_auto] gap-6 items-start p-4 sm:p-5"
              >
                <div className="min-w-0">
                  <p className="text-xs text-base-content/50">
                    {format(a.publishedAt, 'MMM d, yyyy')}
                    {platform && (
                      <>
                        {' · '}
                        {platform === 'Blog' ? 'On this site' : platform}
                      </>
                    )}
                  </p>
                  <h3 className="mt-1 font-medium text-base-content leading-snug group-hover:text-primary transition-colors">
                    {a.title}
                    {!internal && <span className="opacity-40 group-hover:opacity-100"> ↗</span>}
                  </h3>
                  <p className="text-sm text-base-content/60 mt-1.5 leading-relaxed line-clamp-2">
                    {a.description}
                  </p>
                </div>
                {a.thumbnail && !a.thumbnail.includes('lesswrong.png') && (
                  <img
                    src={a.thumbnail}
                    alt=""
                    loading="lazy"
                    className="w-24 h-20 sm:w-32 sm:h-24 object-cover rounded-md border border-base-300"
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
