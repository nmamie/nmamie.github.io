import { useState } from 'react';
import { HiOutlineCheck, HiOutlineClipboardDocument } from 'react-icons/hi2';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { useLiveCitations } from '../../utils/useLiveCitations';
import Section, { ExtLink } from './section';

const SELF = /Noah Mami[ée]/;

const Authors = ({ pub }: { pub: SanitizedPublication }) => {
  const names = (pub.authors || '').split(/,\s*|\s+and\s+/).filter(Boolean);
  return (
    <>
      {names.map((n, i) => {
        const sep = i === 0 ? '' : i === names.length - 1 ? ' and ' : ', ';
        const link = pub.authorLinks?.[n];
        const el = SELF.test(n) ? (
          <span className="font-medium text-base-content">{n}</span>
        ) : link ? (
          <ExtLink href={link} className="hover:text-primary">
            {n}
          </ExtLink>
        ) : (
          n
        );
        return (
          <span key={n}>
            {sep}
            {el}
          </span>
        );
      })}
    </>
  );
};

const PublicationItem = ({
  pub,
  citations,
}: {
  pub: SanitizedPublication;
  citations?: number;
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const venue = pub.conferenceName || pub.journalName;

  const copyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(pub.bibtex || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const linkCls = 'hover:text-primary transition-colors';

  return (
    <article
      id={`pub-${pub.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 60)}`}
      className="grid sm:grid-cols-[180px_1fr] gap-5 sm:gap-7 scroll-mt-24"
    >
      {pub.imageUrl ? (
        <ExtLink href={pub.link || '#'} className="block">
          <img
            src={pub.imageUrl}
            alt=""
            loading="lazy"
            className="w-full aspect-[4/3] object-contain bg-white rounded-lg border border-base-300 p-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_14px_40px_-18px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]"
          />
        </ExtLink>
      ) : (
        <div className="hidden sm:block" />
      )}

      <div className="min-w-0">
        <h3 className="font-medium text-base-content leading-snug text-[1.05rem]">
          {pub.link ? (
            <ExtLink href={pub.link} className="hover:text-primary transition-colors">
              {pub.title}
            </ExtLink>
          ) : (
            pub.title
          )}
        </h3>
        <p className="text-sm text-base-content/65 mt-1.5">
          <Authors pub={pub} />
        </p>
        <p className="text-sm text-base-content/65 mt-0.5">
          <span className="italic">{venue}</span>
          {pub.year && !venue?.includes(pub.year) ? `, ${pub.year}` : ''}
          {pub.journalAward && (
            <span className="ml-2 inline-block rounded-full bg-secondary/12 text-secondary px-2 py-0.5 text-xs font-medium not-italic">{pub.journalAward}</span>
          )}
        </p>

        {pub.tldr && (
          <p className="text-sm text-base-content/80 mt-3 leading-relaxed">{pub.tldr}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-base-content/60">
          {pub.link && (
            <ExtLink href={pub.link} className={linkCls}>
              Paper
            </ExtLink>
          )}
          {pub.codeUrl && (
            <ExtLink href={pub.codeUrl} className={linkCls}>
              Code
            </ExtLink>
          )}
          {pub.slidesUrl && (
            <ExtLink href={pub.slidesUrl} className={linkCls}>
              Slides
            </ExtLink>
          )}
          {(pub.description || pub.laymanSummary) && (
            <button type="button" onClick={() => setOpen(!open)} className={linkCls}>
              {open ? 'Hide abstract' : 'Abstract'}
            </button>
          )}
          {pub.bibtex && (
            <button
              type="button"
              onClick={copyBibtex}
              className={`${linkCls} inline-flex items-center gap-1`}
            >
              {copied ? <HiOutlineCheck /> : <HiOutlineClipboardDocument />}
              {copied ? 'Copied' : 'BibTeX'}
            </button>
          )}
          {pub.googleScholarLink && (
            <ExtLink href={pub.googleScholarLink} className={linkCls}>
              {citations ? `Cited by ${citations}` : 'Scholar'}
            </ExtLink>
          )}
        </div>

        {open && (
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-base-content/80 border-l-2 border-primary/40 pl-4">
            {pub.laymanSummary && (
              <p>
                <span className="font-medium text-base-content">In short: </span>
                {pub.laymanSummary}
              </p>
            )}
            {pub.description && <p className="text-base-content/70">{pub.description}</p>}
          </div>
        )}
      </div>
    </article>
  );
};

const Publications = ({
  publications,
  topic,
  onTopicChange,
}: {
  publications: SanitizedPublication[];
  topic: string;
  onTopicChange: (t: string) => void;
}) => {
  const citations = useLiveCitations(publications);
  const topics = ['All', ...new Set(publications.flatMap((p) => p.topics || []))];
  const shown =
    topic === 'All' ? publications : publications.filter((p) => p.topics?.includes(topic));

  return (
    <Section id="publications" title="Publications">
      <div className="flex flex-wrap gap-2 mb-10">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTopicChange(t)}
            className={`chip transition-colors ${
              t === topic ? 'chip-active' : 'hover:border-base-content/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-12">
        {shown.map((p) => (
          <PublicationItem key={p.title} pub={p} citations={citations[p.title] ?? p.citations} />
        ))}
      </div>
    </Section>
  );
};

export default Publications;
