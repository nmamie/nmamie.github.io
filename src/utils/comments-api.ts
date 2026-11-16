import { useCallback, useEffect, useMemo, useState } from 'react';
import { SanitizedComments } from '../interfaces/sanitized-config';

/**
 * Guest comments + reactions backed by Supabase RPC functions
 * (see supabase/comments.sql). Plain fetch, no SDK.
 */

export const REACTIONS = [
  { kind: 'insightful', glyph: '✦', label: 'Insightful' },
  { kind: 'agree', glyph: '\u2713\uFE0E', label: 'Agreed' },
  { kind: 'disagree', glyph: '✕', label: 'Disagree' },
  { kind: 'changed-mind', glyph: '↻', label: 'Changed my mind' },
  { kind: 'thanks', glyph: '\u2665\uFE0E', label: 'Thanks' },
  { kind: 'citation', glyph: '†', label: 'Citation needed' },
] as const;

export type ReactionKind = (typeof REACTIONS)[number]['kind'];

export interface ThreadComment {
  id: string;
  parent_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
  mine: boolean;
}

interface ReactionRow {
  comment_id: string | null;
  kind: ReactionKind;
  count: number;
  mine: boolean;
}

export type Tally = Partial<
  Record<ReactionKind, { count: number; mine: boolean }>
>;

const POST_KEY = '__post__';

const storage = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode: fine, just not remembered */
    }
  },
};

/**
 * Anonymous, per-browser id. Lets people undo their own reactions and delete
 * their own comments. Only created on the first comment or reaction; reading
 * a thread sends a null id.
 */
const NO_CLIENT = '00000000-0000-0000-0000-000000000000';
const clientId = (create = true) => {
  const existing = storage.get('blog-client-id');
  if (existing || !create) return existing || NO_CLIENT;
  const id = crypto.randomUUID();
  storage.set('blog-client-id', id);
  return id;
};

export const savedName = {
  get: () => storage.get('blog-comment-name') || '',
  set: (name: string) => storage.set('blog-comment-name', name),
};

type Conn = Pick<SanitizedComments, 'supabaseUrl' | 'supabaseAnonKey'>;

const rpc = async <T>(
  cfg: Conn,
  fn: string,
  args: Record<string, unknown>,
): Promise<T> => {
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: cfg.supabaseAnonKey,
      Authorization: `Bearer ${cfg.supabaseAnonKey}`,
    },
    body: JSON.stringify(args),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data && (data.message as string)) || `Request failed (${res.status})`,
    );
  }
  return data as T;
};

export type Thread = ReturnType<typeof useThread>;

/** Loads one post's comments and reactions, and exposes the write actions. */
export const useThread = (slug: string, cfg: SanitizedComments) => {
  const enabled = cfg.display && cfg.provider === 'native';
  const { supabaseUrl, supabaseAnonKey } = cfg;
  const conn = useMemo(
    () => ({ supabaseUrl, supabaseAnonKey }),
    [supabaseUrl, supabaseAnonKey],
  );
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [reactions, setReactions] = useState<ReactionRow[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  const load = useCallback(async () => {
    if (!enabled) return;
    try {
      const data = await rpc<{
        comments: ThreadComment[];
        reactions: ReactionRow[];
      }>(conn, 'get_thread', { p_slug: slug, p_client: clientId(false) });
      setComments(data.comments);
      setReactions(data.reactions);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [enabled, slug, conn]);

  useEffect(() => {
    setStatus('loading');
    setComments([]);
    setReactions([]);
    load();
  }, [load]);

  /** reaction tallies keyed by comment id (POST_KEY for the post itself) */
  const tallies = useMemo(() => {
    const map = new Map<string, Tally>();
    for (const r of reactions) {
      const key = r.comment_id ?? POST_KEY;
      const t = map.get(key) ?? {};
      t[r.kind] = { count: r.count, mine: r.mine };
      map.set(key, t);
    }
    return map;
  }, [reactions]);

  const tallyFor = useCallback(
    (commentId: string | null): Tally =>
      tallies.get(commentId ?? POST_KEY) ?? {},
    [tallies],
  );

  const react = async (commentId: string | null, kind: ReactionKind) => {
    // optimistic toggle
    const apply = (on: boolean) =>
      setReactions((rows) => {
        const i = rows.findIndex(
          (r) => r.comment_id === commentId && r.kind === kind,
        );
        if (i < 0)
          return on
            ? [...rows, { comment_id: commentId, kind, count: 1, mine: true }]
            : rows;
        const row = rows[i];
        const count = Math.max(0, row.count + (on ? 1 : -1));
        const next = [...rows];
        if (count === 0) next.splice(i, 1);
        else next[i] = { ...row, count, mine: on };
        return next;
      });
    const wasOn = !!tallyFor(commentId)[kind]?.mine;
    apply(!wasOn);
    try {
      const on = await rpc<boolean>(conn, 'toggle_reaction', {
        p_slug: slug,
        p_comment: commentId,
        p_kind: kind,
        p_client: clientId(),
      });
      if (on === wasOn) load();
    } catch {
      load();
    }
  };

  const post = async (body: string, name: string, parentId: string | null) => {
    const created = await rpc<ThreadComment & { approved: boolean }>(
      conn,
      'post_comment',
      {
        p_slug: slug,
        p_parent: parentId,
        p_name: name,
        p_body: body,
        p_client: clientId(),
      },
    );
    savedName.set(name);
    if (created.approved) setComments((c) => [...c, created]);
    return created.approved;
  };

  const remove = async (id: string) => {
    const ok = await rpc<boolean>(conn, 'delete_comment', {
      p_id: id,
      p_client: clientId(),
    });
    if (ok) load();
  };

  return {
    enabled,
    status,
    comments,
    tallyFor,
    react,
    post,
    remove,
    reload: load,
  };
};
