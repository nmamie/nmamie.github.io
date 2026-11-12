import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { flushSync } from 'react-dom';

/**
 * "Liquid" reading: one page, many editions.
 * - depth: how much of every item is shown (headline / brief / full)
 * - profile: keywords learned from what the visitor opens or types, visible and
 *   editable, stored only in this browser. Off until the visitor opts in. It either re-ranks or filters content.
 *   Ranking changes are applied explicitly so content never jumps under the cursor.
 */

export type Depth = 'headline' | 'brief' | 'full';
export const DEPTHS: { id: Depth; label: string; hint: string }[] = [
  { id: 'headline', label: 'Headline', hint: 'Titles only' },
  { id: 'brief', label: 'Brief', hint: 'Titles and short summaries' },
  { id: 'full', label: 'Full', hint: 'Everything, abstracts expanded' },
];

/** Curated interests: broad themes with synonyms, so e.g. "recommend" counts as news recommendation. */
export type Interest = { id: string; label: string; re: RegExp };
export const INTERESTS: Interest[] = [
  {
    id: 'news',
    label: 'News recommendation',
    re: /recommend|\bnews\b|informfully/i,
  },
  {
    id: 'transparency',
    label: 'Transparency',
    re: /transparen|scrutab|interpretab|explainab/i,
  },
  {
    id: 'field',
    label: 'Field studies',
    re: /field stud|informfully|user stud/i,
  },
  {
    id: 'democracy',
    label: 'NLP for democracy',
    re: /democra|voting|stance|political/i,
  },
  {
    id: 'collective',
    label: 'Collective intelligence',
    re: /swarm|collective|multi-agent|hivemind/i,
  },
  {
    id: 'rl',
    label: 'Reinforcement learning',
    re: /reinforcement|atari|q-network/i,
  },
  {
    id: 'genai',
    label: 'Generative AI & LLMs',
    re: /language model|\bllms?\b|generative|open-weight|foundation model/i,
  },
];

export const interestsOf = (text: string) =>
  INTERESTS.filter((i) => i.re.test(text));

/* ---------- keywords ---------- */

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const curatedById = new Map(INTERESTS.map((i) => [i.id, i]));

/** Profile key for a label: a curated id when the label names one, else the lower-cased keyword. */
export const keyOf = (label: string) => {
  const l = label.trim().toLowerCase();
  return (
    INTERESTS.find((i) => i.label.toLowerCase() === l || i.id === l)?.id ?? l
  );
};

const matcherCache = new Map<string, (text: string) => boolean>();
/** Curated keys use their synonym regex; free keywords match as a phrase, or when all their words appear. */
const matcher = (key: string) => {
  let m = matcherCache.get(key);
  if (!m) {
    const curated = curatedById.get(key);
    if (curated) m = (t) => curated.re.test(t);
    else {
      const phrase = new RegExp(`\\b${escapeRe(key)}`, 'i');
      const words = key.split(/[\s/&-]+/).filter((w) => w.length > 2);
      const wordRes = words.map((w) => new RegExp(`\\b${escapeRe(w)}`, 'i'));
      m = (t) =>
        phrase.test(t) ||
        (wordRes.length > 1 && wordRes.every((r) => r.test(t)));
    }
    matcherCache.set(key, m);
  }
  return m;
};

/* ---------- storage, decay ---------- */

export type Keyword = {
  key: string;
  label: string;
  w: number;
  curated: boolean;
};
/** Weight at the moment of the last update, that moment, and the label as typed/seen. */
type Signal = { w: number; t: number; label?: string };
type Stored = Record<string, Signal>;

/** A signal counts half as much after this many days. */
export const HALF_LIFE_DAYS = 14;
/** MMR trade-off: 1 = pure relevance, 0 = pure diversity. */
export const MMR_LAMBDA = 0.7;
/** Position (0-based) reserved for one item from outside the visitor's profile. */
const BUBBLE_SLOT = 2;
/** Keep the profile readable: weakest keywords beyond this are dropped. */
const MAX_KEYWORDS = 14;

const DAY = 24 * 60 * 60 * 1000;
const decayed = (s: Signal, now: number) =>
  s.w * 0.5 ** (Math.max(0, now - s.t) / (HALF_LIFE_DAYS * DAY));

const keywordsOf = (st: Stored, now = Date.now()): Keyword[] =>
  Object.entries(st)
    .map(([key, s]) => ({
      key,
      label: curatedById.get(key)?.label ?? s.label ?? key,
      w: decayed(s, now),
      curated: curatedById.has(key),
    }))
    .filter((k) => k.w >= 0.05)
    .sort((a, b) => b.w - a.w);

const prune = (st: Stored): Stored => {
  const keep = new Set(
    keywordsOf(st)
      .slice(0, MAX_KEYWORDS)
      .map((k) => k.key),
  );
  return Object.fromEntries(Object.entries(st).filter(([k]) => keep.has(k)));
};

const bump = (
  st: Stored,
  label: string,
  by: number,
  now = Date.now(),
): Stored => {
  const key = keyOf(label);
  if (!key) return st;
  return {
    ...st,
    [key]: {
      w: (st[key] ? decayed(st[key], now) : 0) + by,
      t: now,
      label: curatedById.has(key)
        ? undefined
        : (st[key]?.label ?? label.trim()),
    },
  };
};

/** Accept earlier formats (plain counts) as fresh signals. */
const migrate = (raw: unknown): Stored => {
  if (!raw || typeof raw !== 'object') return {};
  const now = Date.now();
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).flatMap(([k, v]) =>
      typeof v === 'number'
        ? [[k, { w: v, t: now }]]
        : v && typeof v === 'object' && 'w' in v && 't' in v
          ? [[k, v as Signal]]
          : [],
    ),
  );
};

const DEPTH_KEY = 'reader-depth';
const PROFILE_KEY = 'reader-profile';
const ENABLED_KEY = 'reader-personalize';
const FILTER_KEY = 'reader-filter';

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

/** Animate a state change with the View Transitions API where available. */
export const liquid = (update: () => void) => {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  };
  const reduced = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  if (doc.startViewTransition && !reduced)
    doc.startViewTransition(() => flushSync(update));
  else update();
};

/* ---------- context ---------- */

type ReaderCtx = {
  depth: Depth;
  setDepth: (d: Depth) => void;
  /** ranking is always on with a non-empty profile; this additionally hides non-matching items */
  filter: boolean;
  setFilter: (on: boolean) => void;
  /** the floating profile panel */
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  enabled: boolean;
  setEnabled: (on: boolean) => void;
  /** live profile (decayed, strongest first), updated on every interaction */
  profile: Keyword[];
  /** profile the current ranking / filter is based on */
  applied: Keyword[];
  pending: boolean;
  /** record a visit: curated themes found in `text`, plus the item's own keywords */
  note: (text: string, keywords?: string[]) => void;
  add: (label: string) => void;
  remove: (key: string) => void;
  reset: () => void;
  applyRanking: () => void;
};

const Ctx = createContext<ReaderCtx | null>(null);

export const ReaderProvider = ({ children }: { children: ReactNode }) => {
  const [depth, setDepthState] = useState<Depth>(() =>
    load<Depth>(DEPTH_KEY, 'brief'),
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [filter, setFilterState] = useState<boolean>(() =>
    load<boolean>(FILTER_KEY, false),
  );
  const [enabled, setEnabledState] = useState<boolean>(() =>
    load(ENABLED_KEY, false),
  );
  const [stored, setStored] = useState<Stored>(() =>
    migrate(load<unknown>(PROFILE_KEY, {})),
  );
  const [appliedStored, setAppliedStored] = useState<Stored>(stored);

  const commit = useCallback((raw: Stored, apply: boolean) => {
    const next = prune(raw);
    save(PROFILE_KEY, next);
    if (apply)
      liquid(() => {
        setStored(next);
        setAppliedStored(next);
      });
    else setStored(next);
  }, []);

  const value = useMemo<ReaderCtx>(() => {
    const now = Date.now();
    const pending =
      enabled && JSON.stringify(stored) !== JSON.stringify(appliedStored);
    return {
      depth,
      setDepth: (d) => {
        save(DEPTH_KEY, d);
        liquid(() => setDepthState(d));
      },
      panelOpen,
      setPanelOpen,
      filter,
      setFilter: (on) => {
        save(FILTER_KEY, on);
        liquid(() => {
          setFilterState(on);
          setAppliedStored(stored);
        });
      },
      enabled,
      setEnabled: (on) => {
        save(ENABLED_KEY, on);
        if (!on) {
          // turning personalization off deletes what was learned
          save(PROFILE_KEY, {});
          try {
            localStorage.removeItem(PROFILE_KEY);
            localStorage.removeItem(FILTER_KEY);
          } catch {
            /* storage unavailable */
          }
        }
        liquid(() => {
          setEnabledState(on);
          if (!on) {
            setStored({});
            setAppliedStored({});
            setFilterState(false);
          } else setAppliedStored(stored);
        });
      },
      profile: keywordsOf(stored, now),
      applied: keywordsOf(appliedStored, now),
      pending,
      note: (text, keywords = []) => {
        if (!enabled) return;
        const labels = [
          ...interestsOf(text).map((i) => i.id),
          // an item's own tags become new keywords, unless a curated theme already covers them
          ...keywords.filter((k) => !INTERESTS.some((i) => i.re.test(k))),
        ];
        if (labels.length === 0) return;
        commit(
          [...new Set(labels)].reduce((st, l) => bump(st, l, 1), stored),
          false,
        );
      },
      add: (label) => label.trim() && commit(bump(stored, label, 2), true),
      remove: (key) => {
        const next = { ...stored };
        delete next[key];
        commit(next, true);
      },
      reset: () => commit({}, true),
      applyRanking: () => liquid(() => setAppliedStored(stored)),
    };
  }, [depth, filter, panelOpen, enabled, stored, appliedStored, commit]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useReader = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useReader outside ReaderProvider');
  return ctx;
};

/* ---------- ranking & filtering ---------- */

export type Ranked<T> = {
  item: T;
  /** label of the strongest matching keyword, when the item is relevant */
  reason?: string;
  /** 'match' = ranked up for the profile, 'bubble' = deliberate pick from outside it */
  kind?: 'match' | 'bubble';
};
export type Personalized<T> = {
  list: Ranked<T>[];
  /** items left out by the filter (0 when the filter is off) */
  hidden: number;
  /** whether the filter is active for this list (filter on, non-empty profile) */
  filtering: boolean;
  /** filter on, but nothing in this list matches: everything is shown instead of an empty section */
  noMatch?: boolean;
};

const jaccard = (a: Set<string>, b: Set<string>) => {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  a.forEach((x) => b.has(x) && inter++);
  return inter / (a.size + b.size - inter);
};

const useScored = <T,>(items: T[], textOf: (item: T) => string) => {
  const { applied, enabled } = useReader();
  return useMemo(() => {
    const cands = items.map((item, index) => {
      const text = textOf(item);
      const hits = applied.filter((k) => matcher(k.key)(text)); // already strongest first
      const rel = hits.reduce((s, k) => s + k.w, 0);
      const ids = new Set([
        ...interestsOf(text).map((i) => i.id),
        ...hits.map((k) => k.key),
      ]);
      return { item, index, rel, ids, top: hits[0]?.label };
    });
    return { cands, active: enabled && applied.length > 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, applied, enabled]);
};

/**
 * Content-based re-ranking with a diversity term, for papers and projects.
 * relevance = Σ decayed weight of profile keywords the item matches (normalized to 0..1);
 * order     = greedy MMR: λ·relevance − (1−λ)·max Jaccard similarity to items already placed;
 * bubble    = the first item matching none of the keywords is guaranteed a slot near the top
 *             and labeled, so personalization never hides a whole area.
 * With the filter on, only matching items (plus the bubble pick) are kept, unless `showAll`.
 */
export const useRanked = <T,>(
  items: T[],
  textOf: (item: T) => string,
  showAll = false,
): Personalized<T> => {
  const { filter } = useReader();
  const { cands, active } = useScored(items, textOf);
  return useMemo(() => {
    const maxRel = Math.max(0, ...cands.map((c) => c.rel));
    const noMatch = active && filter && maxRel === 0;
    const filtering = active && filter && !noMatch;
    if (!active || noMatch)
      return {
        list: cands.map(({ item }) => ({ item })),
        hidden: 0,
        filtering,
        noMatch,
      };

    const rest = [...cands];
    const order: typeof cands = [];
    while (rest.length) {
      let best = 0;
      let bestScore = -Infinity;
      rest.forEach((c, i) => {
        const sim = Math.max(0, ...order.map((o) => jaccard(c.ids, o.ids)));
        const score =
          MMR_LAMBDA * (maxRel ? c.rel / maxRel : 0) - (1 - MMR_LAMBDA) * sim;
        if (score > bestScore + 1e-9) {
          best = i;
          bestScore = score;
        }
      });
      order.push(...rest.splice(best, 1));
    }

    const b = order.findIndex((c) => c.rel === 0);
    const slot = Math.min(BUBBLE_SLOT, order.length - 1);
    if (b > slot) order.splice(slot, 0, ...order.splice(b, 1));
    const bubble =
      b >= 0 && maxRel > 0 ? order.find((c) => c.rel === 0) : undefined;

    const kept =
      filtering && !showAll
        ? order.filter((c) => c.rel > 0 || c === bubble)
        : order;
    const list = kept.map((c) =>
      c === bubble
        ? { item: c.item, kind: 'bubble' as const }
        : c.rel > 0
          ? { item: c.item, kind: 'match' as const, reason: c.top }
          : { item: c.item },
    );
    const hidden = filtering
      ? order.filter((c) => !(c.rel > 0 || c === bubble)).length
      : 0;
    return { list, hidden, filtering };
  }, [cands, active, filter, showAll]);
};

/** Chronological lists (news, writing, talks): never reordered, only filtered when the filter is on. */
export const useFiltered = <T,>(
  items: T[],
  textOf: (item: T) => string,
  showAll = false,
): Personalized<T> => {
  const { filter } = useReader();
  const { cands, active } = useScored(items, textOf);
  return useMemo(() => {
    const noMatch = active && filter && cands.every((c) => c.rel === 0);
    const filtering = active && filter && !noMatch;
    const hidden = filtering ? cands.filter((c) => c.rel === 0).length : 0;
    const kept = filtering && !showAll ? cands.filter((c) => c.rel > 0) : cands;
    return {
      list: kept.map((c) =>
        filtering && c.rel > 0
          ? { item: c.item, kind: 'match' as const, reason: c.top }
          : { item: c.item },
      ),
      hidden,
      filtering,
      noMatch,
    };
  }, [cands, active, filter, showAll]);
};
