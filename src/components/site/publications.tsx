import { useEffect, useState } from 'react';
import { HiOutlineCheck, HiOutlineClipboardDocument } from 'react-icons/hi2';
import { SanitizedPublication } from '../../interfaces/sanitized-config';
import { useLiveCitations } from '../../utils/useLiveCitations';
import Section, { ExtLink } from './section';
import { Ranked, useRanked, useReader } from '../../utils/reader';
import { FilterNote, RankNote } from './reader-bar';

export const pubText = (p: SanitizedPublication) =>
  [p.title, ...(p.topics || []), p.tldr].join(' ');

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
  reason,
  kind,
}: {
  pub: SanitizedPublication;
  citations?: number;
  reason?: string;
  kind?: Ranked<unknown>['kind'];
}) => {
  const { depth, note } = useReader();
  const [open, setOpen] = useState(depth === 'full');
  useEffect(() => setOpen(depth === 'full'), [depth]);
  const headline = depth === 'headline';
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

  const slug = pub.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 60);

  return (
    <article
      id={`pub-${slug}`}
      style={{
        viewTransitionName: `pub-${slug.replace(/-+/g, '-').replace(/-$/, '')}`,
      }}
      onClickCapture={() => note(pubText(pub), pub.topics)}
      className={`grid gap-5 sm:gap-7 scroll-mt-24 ${headline ? '' : 'sm:grid-cols-[180px_1fr]'}`}
    >
      {headline ? null : pub.imageUrl ? (
        <ExtLink href={pub.link || '#'} className="block">
          <img
            src={pub.imageUrl}
            alt=""
            loading="lazy"
            className="w-full aspect-[4/3] object-contain bg-white border border-base-300 p-2 transition-colors duration-300 hover:border-base-content/60"
          />
        </ExtLink>
      ) : (
        <div className="hidden sm:block" />
      )}

      <div className="min-w-0">
        <h3 className="font-serif text-xl font-medium text-base-content leading-snug">
          {pub.link ? (
            <ExtLink
              href={pub.link}
              className="hover:text-primary transition-colors"
            >
              {pub.title}
            </ExtLink>
          ) : (
            pub.title
          )}
        </h3>
        {!headline && (
          <p className="text-sm text-base-content/65 mt-1.5">
            <Authors pub={pub} />
          </p>
        )}
        <p className="text-sm text-base-content/65 mt-0.5">
          <span className="italic">{venue}</span>
          {pub.year && !venue?.includes(pub.year) ? `, ${pub.year}` : ''}
          {pub.journalAward && (
            <span className="ml-2 font-mono text-[0.7rem] uppercase tracking-wider text-primary not-italic">
              ★ {pub.journalAward.replace(/\s*🏆/, '')}
            </span>
          )}
          <RankNote
            kind={kind}
            reason={reason}
            className="ml-2 inline-block whitespace-nowrap"
          />
        </p>

        {headline ? null : (
          <>
            {pub.tldr && (
              <p className="text-sm text-base-content/80 mt-3 leading-relaxed">
                {pub.tldr}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 font-mono text-[0.72rem] uppercase tracking-wider text-base-content/60">
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
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className={linkCls}
                >
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
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-base-content/80 border-l-2 border-primary pl-4">
                {pub.laymanSummary && (
                  <p>
                    <span className="font-medium text-base-content">
                      In short:{' '}
                    </span>
                    {pub.laymanSummary}
                  </p>
                )}
                {pub.description && (
                  <p className="text-base-content/70">{pub.description}</p>
                )}
              </div>
            )}
          </>
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
  const { depth, note } = useReader();
  const topics = [
    'All',
    ...new Set(publications.flatMap((p) => p.topics || [])),
  ];
  const filtered =
    topic === 'All'
      ? publications
      : publications.filter((p) => p.topics?.includes(topic));
  const [showAll, setShowAll] = useState(false);
  // an explicitly chosen topic overrides the profile filter
  const ranked = useRanked(filtered, pubText, showAll || topic !== 'All');

  return (
    <Section id="publications" title="Publications">
      <div className="flex flex-wrap gap-2 mb-10">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              if (t !== 'All') note(t, [t]);
              onTopicChange(t);
            }}
            className={`chip transition-colors ${
              t === topic ? 'chip-active' : 'hover:border-base-content/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <FilterNote
        {...ranked}
        showAll={showAll}
        onToggle={() => setShowAll(!showAll)}
      />
      <div className={depth === 'headline' ? 'space-y-5' : 'space-y-12'}>
        {ranked.list.map(({ item: p, reason, kind }) => (
          <PublicationItem
            key={p.title}
            pub={p}
            reason={reason}
            kind={kind}
            citations={citations[p.title] ?? p.citations}
          />
        ))}
      </div>
    </Section>
  );
};

export default Publications;
