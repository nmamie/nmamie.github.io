import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  DEPTHS,
  HALF_LIFE_DAYS,
  INTERESTS,
  keyOf,
  Ranked,
  useReader,
} from '../../utils/reader';

export const DepthSwitch = ({ compact = false }: { compact?: boolean }) => {
  const { depth, setDepth } = useReader();
  return (
    <div className="seg" role="group" aria-label="Reading depth">
      {DEPTHS.map((d) => (
        <button
          key={d.id}
          type="button"
          aria-pressed={depth === d.id}
          title={d.hint}
          onClick={() => setDepth(d.id)}
          className={compact ? 'px-2' : ''}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
};

/** Masthead row: the edition (reading depth), plus a quiet entry point to the profile panel. */
export const EditionBar = () => {
  const { profile, enabled, setPanelOpen } = useReader();
  return (
    <div className="mt-10 border-y border-base-content/80 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="meta uppercase">This edition</span>
      <DepthSwitch />
      <span className="text-base-content/60 italic">
        Liquid content: the page reflows to the depth you choose.
      </span>
      <button
        type="button"
        data-opens-profile
        onClick={() => setPanelOpen(true)}
        className="meta ml-auto hover:text-primary transition-colors"
      >
        ◐{' '}
        {enabled
          ? `For you${profile.length ? ` · ${profile.length}` : ''}`
          : 'Personalize (off)'}{' '}
        →
      </button>
    </div>
  );
};

const Toggle = ({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-base-content/80 hover:text-base-content"
  >
    <span
      aria-hidden="true"
      className={`relative inline-block w-7 h-3.5 border border-base-content transition-colors ${
        on ? 'bg-base-content' : ''
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 transition-all ${
          on
            ? 'left-[calc(100%-0.6rem)] bg-base-100'
            : 'left-0.5 bg-base-content'
        }`}
      />
    </span>
    {label}
  </button>
);

/** Everything about the visitor's profile: keywords, adding/removing, filter, reset. */
const ProfilePanel = ({ vocabulary }: { vocabulary: string[] }) => {
  const {
    profile,
    enabled,
    setEnabled,
    filter,
    setFilter,
    add,
    remove,
    reset,
    pending,
    applyRanking,
  } = useReader();
  const [draft, setDraft] = useState('');
  const max = Math.max(1, ...profile.map((k) => k.w));
  const have = new Set(profile.map((k) => k.key));
  const suggestions = INTERESTS.filter((i) => !have.has(i.id));
  const options = [
    ...new Set([...INTERESTS.map((i) => i.label), ...vocabulary]),
  ].filter((o) => !have.has(keyOf(o)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    add(draft);
    setDraft('');
  };

  if (!enabled)
    return (
      <div className="space-y-3 text-sm">
        <p className="text-base-content/80 leading-relaxed">
          Personalization is <strong className="font-medium">off</strong>. If you turn it on, this
          page learns keywords from the papers and projects you open, ranks them for you and, if you
          like, hides what doesn't match.
        </p>
        <p className="text-base-content/60 leading-relaxed">
          Your keywords are kept only in your browser's local storage. Nothing is sent to me or to
          anyone else, and you can see, edit or delete them at any time. Turning it off deletes them.
        </p>
        <button
          type="button"
          onClick={() => setEnabled(true)}
          className="btn-pill"
        >
          Turn on personalization
        </button>
      </div>
    );

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="meta uppercase mb-2">Your keywords</p>
        {profile.length === 0 ? (
          <p className="text-base-content/60 italic">
            Empty. Open papers and projects, or add keywords below, and the page
            adapts to them.
          </p>
        ) : (
          <ul
            className="flex flex-wrap gap-1.5"
            aria-label="Keywords in your profile"
          >
            {profile.map((k) => (
              <li
                key={k.key}
                className="chip chip-active gap-2 pr-1"
                title={`Weight ${k.w.toFixed(1)}${k.curated ? ' · theme (includes related terms)' : ' · keyword'}`}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 bg-primary"
                  style={{ width: 4 + (k.w / max) * 22 }}
                />
                {k.label}
                <button
                  type="button"
                  onClick={() => remove(k.key)}
                  aria-label={`Remove ${k.label}`}
                  className="px-1 opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={submit} className="flex">
        <label htmlFor="reader-keyword" className="sr-only">
          Add a keyword to your profile
        </label>
        <input
          id="reader-keyword"
          list="reader-vocabulary"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a keyword, e.g. stance detection"
          maxLength={40}
          className="flex-1 min-w-0 bg-transparent border border-base-content/40 focus:border-base-content outline-none px-2.5 py-1 font-mono text-[0.75rem] placeholder:text-base-content/40"
        />
        <datalist id="reader-vocabulary">
          {options.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
        <button
          type="submit"
          className="border border-l-0 border-base-content px-3 font-mono text-[0.75rem] hover:bg-base-content hover:text-base-100 transition-colors"
          aria-label="Add keyword"
        >
          +
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => add(i.label)}
              className="chip border-dashed hover:border-base-content hover:text-base-content transition-colors"
              aria-label={`Add ${i.label}`}
            >
              + {i.label}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-base-300 pt-3 space-y-2">
        <p className="text-base-content/70 leading-snug">
          Papers and projects are{' '}
          <strong className="font-medium">ranked</strong> by your keywords, with
          one pick kept from outside them.
        </p>
        <Toggle
          on={filter}
          onChange={setFilter}
          label="Also hide what doesn't match"
        />
      </div>

      {pending && (
        <button
          type="button"
          onClick={applyRanking}
          className="btn-pill text-primary border-primary hover:bg-primary hover:text-base-100"
        >
          Apply new signals ↻
        </button>
      )}

      <p className="meta leading-relaxed">
        Built from what you open and type here; older signals fade by half every{' '}
        {HALF_LIFE_DAYS} days. Stored only in your browser.
        {profile.length > 0 && (
          <>
            {' · '}
            <button
              type="button"
              onClick={reset}
              className="hover:text-primary"
            >
              Reset
            </button>
          </>
        )}
        {' · '}
        <button type="button" onClick={() => setEnabled(false)} className="hover:text-primary">
          Turn off &amp; delete
        </button>
      </p>
    </div>
  );
};

/**
 * Bottom-right dock: a "For you" button that expands into the profile panel, and the
 * edition switch once the masthead has scrolled away.
 */
export const FloatingReader = ({
  vocabulary = [],
}: {
  vocabulary?: string[];
}) => {
  const { pending, enabled, profile, filter, panelOpen, setPanelOpen } =
    useReader();
  const [pastMasthead, setPastMasthead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const about = document.getElementById('about');
      setPastMasthead(!!about && about.getBoundingClientRect().bottom < 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setPanelOpen(false);
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      // ignore clicks inside the dock and on any control that opens it
      if (ref.current?.contains(t) || t.closest?.('[data-opens-profile]'))
        return;
      setPanelOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [panelOpen, setPanelOpen]);

  const count = enabled ? profile.length : 0;

  return (
    <div
      ref={ref}
      className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2"
    >
      {panelOpen && (
        <section
          role="dialog"
          aria-label="Your reading profile"
          className="w-[22rem] max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-base-100 border border-base-content shadow-lg p-4"
        >
          <div className="flex items-baseline justify-between mb-3 border-b-2 border-base-content pb-1.5">
            <h2 className="font-serif text-lg font-medium">For you</h2>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="meta hover:text-primary"
              aria-label="Close profile panel"
            >
              Close ×
            </button>
          </div>
          <ProfilePanel vocabulary={vocabulary} />
        </section>
      )}

      <div className="flex gap-2 items-stretch">
        <div
          className={`hidden sm:block bg-base-100/90 backdrop-blur shadow-sm transition-opacity duration-300 ${
            pastMasthead ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          inert={!pastMasthead}
        >
          <DepthSwitch compact />
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen(!panelOpen)}
          aria-expanded={panelOpen}
          title="Your reading profile"
          className={`relative whitespace-nowrap py-1 backdrop-blur shadow-sm border border-base-content px-2.5 font-mono text-[0.7rem] uppercase tracking-wider transition-colors ${
            panelOpen
              ? 'bg-base-content text-base-100'
              : 'bg-base-100/90 text-base-content/80 hover:text-base-content'
          }`}
        >
          ◐ {enabled ? 'For you' : 'Personalize'}
          {count > 0 ? ` · ${count}` : ''}
          {filter && count > 0 ? ' · filtered' : ''}
          {pending && (
            <span
              title="New signals to apply"
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
            />
          )}
        </button>
      </div>
    </div>
  );
};

/** Per-section line when the filter is on: how much is hidden, and a way to see it. */
export const FilterNote = ({
  hidden,
  filtering,
  noMatch,
  showAll,
  onToggle,
}: {
  hidden: number;
  filtering: boolean;
  noMatch?: boolean;
  showAll: boolean;
  onToggle: () => void;
}) => {
  if (noMatch)
    return (
      <p className="meta mb-6">
        ◐ Nothing here matches your keywords, so everything is shown.
      </p>
    );
  if (!filtering || hidden === 0) return null;
  return (
    <p className="meta mb-6">
      ◐{' '}
      {showAll
        ? `Showing all, ${hidden} outside your keywords`
        : `${hidden} hidden by your keywords`}
      {' · '}
      <button
        type="button"
        onClick={onToggle}
        className="underline underline-offset-2 hover:text-primary"
      >
        {showAll ? 'hide again' : 'show'}
      </button>
    </p>
  );
};

/** Why an item sits where it does: matched the profile, or a deliberate pick from outside it. */
export const RankNote = ({
  kind,
  reason,
  className = '',
}: Pick<Ranked<unknown>, 'kind' | 'reason'> & { className?: string }) =>
  kind === 'match' && reason ? (
    <span
      title="Matches a keyword in your profile"
      className={`font-mono text-[0.7rem] uppercase tracking-wider text-secondary not-italic ${className}`}
    >
      ↑ For you · {reason}
    </span>
  ) : kind === 'bubble' ? (
    <span
      title="Matches none of your keywords: shown on purpose so personalization doesn't narrow what you see"
      className={`font-mono text-[0.7rem] uppercase tracking-wider text-primary not-italic ${className}`}
    >
      ↗ Outside your bubble
    </span>
  ) : null;
