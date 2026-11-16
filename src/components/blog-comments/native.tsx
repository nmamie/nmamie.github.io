import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { formatDistanceToNowStrict, format } from 'date-fns';
import {
  REACTIONS,
  savedName,
  Thread,
  ThreadComment,
} from '../../utils/comments-api';
import ReactionBar from './reactions';

type Sort = 'top' | 'new' | 'old';

const MAX_LINKS = 2;

/**
 * Names guests cannot sign with (compared without accents, case, spacing or
 * punctuation). Checked in the browser only: it stops casual impersonation.
 * The author can unlock it in their own browser by running
 * localStorage.setItem('blog-author', '1') in the developer console.
 */
const RESERVED_NAMES = ['noahmamie', 'nmamie', 'author', 'admin', 'editor'];
const normalizeName = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
const isReservedName = (name: string) => {
  try {
    if (localStorage.getItem('blog-author') === '1') return false;
  } catch {
    /* storage blocked: treat as a guest */
  }
  const n = normalizeName(name);
  return RESERVED_NAMES.some((r) => n === r || (r.length > 6 && n.includes(r)));
};

/** Plain text -> paragraphs with clickable links. No HTML is ever injected. */
const renderBody = (body: string) =>
  body.split(/\n{2,}/).map((para, i) => {
    const parts: ReactNode[] = [];
    const re = /https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(para))) {
      parts.push(para.slice(last, m.index));
      parts.push(
        <a
          key={m.index}
          href={m[0]}
          target="_blank"
          rel="noopener nofollow ugc"
        >
          {m[0].replace(/^https?:\/\/(www\.)?/, '')}
        </a>,
      );
      last = m.index + m[0].length;
    }
    parts.push(para.slice(last));
    return <p key={i}>{parts}</p>;
  });

const Composer = ({
  thread,
  parentId = null,
  onDone,
  autoFocus = false,
}: {
  thread: Thread;
  parentId?: string | null;
  onDone?: () => void;
  autoFocus?: boolean;
}) => {
  const [name, setName] = useState(savedName.get);
  const [body, setBody] = useState('');
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{
    kind: 'error' | 'info';
    text: string;
  } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (trap) return; // honeypot: bots fill every field
    if (!name.trim() || !body.trim()) {
      setNote({ kind: 'error', text: 'Please add your name and a comment.' });
      return;
    }
    if (isReservedName(name)) {
      setNote({
        kind: 'error',
        text: 'That name is reserved for the author. Please sign with your own name.',
      });
      return;
    }
    if ((body.match(/https?:\/\/|www\./gi) ?? []).length > MAX_LINKS) {
      setNote({
        kind: 'error',
        text: `Please include at most ${MAX_LINKS} links per comment.`,
      });
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const published = await thread.post(body.trim(), name.trim(), parentId);
      setBody('');
      if (published) onDone?.();
      else
        setNote({
          kind: 'info',
          text: 'Thanks! Your comment will appear once it has been approved.',
        });
    } catch (err) {
      setNote({ kind: 'error', text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className={parentId ? 'composer composer-reply' : 'composer'}
    >
      <label className="sr-only" htmlFor={`body-${parentId ?? 'root'}`}>
        Comment
      </label>
      <textarea
        id={`body-${parentId ?? 'root'}`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={parentId ? 3 : 4}
        maxLength={5000}
        autoFocus={autoFocus}
        placeholder={
          parentId
            ? 'Write a reply…'
            : 'Share a thought, a question or a disagreement…'
        }
      />
      {/* honeypot, hidden from people */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
      />
      <div className="composer-foot">
        <label className="composer-sign">
          <span>— Signed,</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="your name"
            autoComplete="name"
          />
        </label>
        <div className="flex items-center gap-3">
          {onDone && (
            <button type="button" className="comment-action" onClick={onDone}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-pill" disabled={busy}>
            {busy ? 'Sending…' : parentId ? 'Reply' : 'Submit'}
          </button>
        </div>
      </div>
      {note && (
        <p
          role={note.kind === 'error' ? 'alert' : 'status'}
          className={`mt-2 text-sm ${note.kind === 'error' ? 'text-error' : 'text-base-content/70 italic'}`}
        >
          {note.text}
        </p>
      )}
      {!parentId && (
        <p className="mt-3 meta">
          No account needed. Plain text; links become clickable. Be kind.
        </p>
      )}
    </form>
  );
};

const score = (thread: Thread, id: string) => {
  const t = thread.tallyFor(id);
  return REACTIONS.reduce(
    (s, r) => s + (r.kind === 'disagree' ? 0 : (t[r.kind]?.count ?? 0)),
    0,
  );
};

const CommentNode = ({
  comment,
  childrenOf,
  thread,
  depth,
}: {
  comment: ThreadComment;
  childrenOf: Map<string | null, ThreadComment[]>;
  thread: Thread;
  depth: number;
}) => {
  const [replying, setReplying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const replies = childrenOf.get(comment.id) ?? [];
  const date = new Date(comment.created_at);

  return (
    <li className="comment" data-depth={Math.min(depth, 4)}>
      <article id={`comment-${comment.id}`}>
        <header className="comment-head">
          <button
            type="button"
            className="comment-toggle"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand thread' : 'Collapse thread'}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? '+' : '−'}
          </button>
          <span className="comment-author">{comment.author_name}</span>
          <time
            dateTime={comment.created_at}
            title={format(date, 'PPpp')}
            className="meta"
          >
            {formatDistanceToNowStrict(date, { addSuffix: true })}
          </time>
          {collapsed && replies.length > 0 && (
            <span className="meta">
              · {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </header>

        {!collapsed && (
          <>
            <div className="comment-body">{renderBody(comment.body)}</div>
            <footer className="comment-foot">
              <button
                type="button"
                className="comment-action"
                onClick={() => setReplying((r) => !r)}
              >
                Reply
              </button>
              {comment.mine && (
                <button
                  type="button"
                  className="comment-action"
                  onClick={() => {
                    if (window.confirm('Delete your comment?'))
                      thread.remove(comment.id);
                  }}
                >
                  Delete
                </button>
              )}
              <div className="ml-auto">
                <ReactionBar
                  tally={thread.tallyFor(comment.id)}
                  onReact={(k) => thread.react(comment.id, k)}
                />
              </div>
            </footer>
            {replying && (
              <Composer
                thread={thread}
                parentId={comment.id}
                autoFocus
                onDone={() => setReplying(false)}
              />
            )}
          </>
        )}
      </article>

      {!collapsed && replies.length > 0 && (
        <ol className="comment-replies">
          {replies.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              childrenOf={childrenOf}
              thread={thread}
              depth={depth + 1}
            />
          ))}
        </ol>
      )}
    </li>
  );
};

const NativeComments = ({ thread }: { thread: Thread }) => {
  const [sort, setSort] = useState<Sort>('top');

  const childrenOf = useMemo(() => {
    const map = new Map<string | null, ThreadComment[]>();
    for (const c of thread.comments) {
      const k = c.parent_id;
      map.set(k, [...(map.get(k) ?? []), c]);
    }
    const roots = map.get(null) ?? [];
    const time = (c: ThreadComment) => new Date(c.created_at).getTime();
    roots.sort((a, b) =>
      sort === 'old'
        ? time(a) - time(b)
        : sort === 'new'
          ? time(b) - time(a)
          : score(thread, b.id) - score(thread, a.id) || time(a) - time(b),
    );
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.comments, sort, thread.tallyFor]);

  const roots = childrenOf.get(null) ?? [];

  return (
    <>
      <Composer thread={thread} />

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-b border-base-content pb-2">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-base-content/70">
          {thread.comments.length}{' '}
          {thread.comments.length === 1 ? 'comment' : 'comments'}
        </p>
        {roots.length > 1 && (
          <div className="seg" role="group" aria-label="Sort comments">
            {(
              [
                ['top', 'Top'],
                ['new', 'Newest'],
                ['old', 'Oldest'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={sort === id}
                onClick={() => setSort(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {thread.status === 'loading' && (
        <p className="py-8 meta">Loading the conversation…</p>
      )}
      {thread.status === 'error' && (
        <p className="py-8 text-sm text-base-content/70">
          Comments could not be loaded.{' '}
          <button
            type="button"
            className="link-underline"
            onClick={thread.reload}
          >
            Try again
          </button>
        </p>
      )}
      {thread.status === 'ready' && roots.length === 0 && (
        <p className="py-8 font-serif italic text-base-content/60">
          No letters yet. Be the first to write in.
        </p>
      )}
      {roots.length > 0 && (
        <ol className="comment-list">
          {roots.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              childrenOf={childrenOf}
              thread={thread}
              depth={0}
            />
          ))}
        </ol>
      )}
    </>
  );
};

export default NativeComments;
