import { useEffect, useRef, useState } from 'react';
import { REACTIONS, ReactionKind, Tally } from '../../utils/comments-api';

/**
 * LessWrong-style "reacts": typographic marks instead of emoji.
 * `full` shows every reaction (used under the article). Otherwise only the
 * reactions in use are shown, plus a small "React" palette.
 */
const ReactionBar = ({
  tally,
  onReact,
  full = false,
}: {
  tally: Tally;
  onReact: (kind: ReactionKind) => void;
  full?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent
          ? e.key === 'Escape'
          : !ref.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const shown = full
    ? REACTIONS
    : REACTIONS.filter((r) => tally[r.kind]?.count);

  return (
    <div ref={ref} className="relative flex flex-wrap items-center gap-1.5">
      {shown.map((r) => {
        const t = tally[r.kind];
        return (
          <button
            key={r.kind}
            type="button"
            className="react-chip"
            aria-pressed={!!t?.mine}
            title={t?.mine ? `${r.label} (click to undo)` : r.label}
            onClick={() => onReact(r.kind)}
          >
            <span className="react-glyph" aria-hidden>
              {r.glyph}
            </span>
            {full && <span>{r.label}</span>}
            {!!t?.count && <span className="react-count">{t.count}</span>}
            {!full && <span className="sr-only">{r.label}</span>}
          </button>
        );
      })}

      {!full && (
        <>
          <button
            type="button"
            className="comment-action"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            React
          </button>
          {open && (
            <div role="menu" className="react-palette">
              {REACTIONS.map((r) => (
                <button
                  key={r.kind}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={!!tally[r.kind]?.mine}
                  onClick={() => {
                    onReact(r.kind);
                    setOpen(false);
                  }}
                >
                  <span className="react-glyph" aria-hidden>
                    {r.glyph}
                  </span>
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReactionBar;
