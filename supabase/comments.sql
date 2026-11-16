-- Guest comments + reactions for the blog (no visitor account needed).
--
-- Setup (one time, ~2 minutes):
--   1. Create a free project at https://supabase.com
--   2. Open SQL Editor -> New query, paste this whole file, Run.
--   3. Project Settings -> API: copy "Project URL" and the "anon public" key
--      into `comments.supabaseUrl` / `comments.supabaseAnonKey` in
--      gitprofile.config.ts.
--
-- Security model: visitors never touch the tables directly. The anon key can
-- only call the four functions below, which validate input, rate-limit and
-- never expose the anonymous per-browser ids.
--
-- Moderation:
--   * Hide a comment:   update public.comments set approved = false where id = '...';
--   * Pre-moderate all: alter table public.comments alter column approved set default false;
--     (then approve in the Table Editor by ticking `approved`)
--   * Delete:           delete from public.comments where id = '...';

create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_slug   text not null check (char_length(post_slug) between 1 and 120),
  parent_id   uuid references public.comments (id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 60),
  body        text not null check (char_length(body) between 1 and 5000),
  client_id   uuid not null,
  approved    boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_slug, created_at);
create index if not exists comments_client_idx on public.comments (client_id, created_at);

create table if not exists public.reactions (
  post_slug  text not null check (char_length(post_slug) between 1 and 120),
  comment_id uuid references public.comments (id) on delete cascade,
  kind       text not null check (kind in ('insightful', 'agree', 'disagree', 'changed-mind', 'thanks', 'citation')),
  client_id  uuid not null,
  created_at timestamptz not null default now(),
  unique nulls not distinct (post_slug, comment_id, kind, client_id)
);
create index if not exists reactions_post_idx on public.reactions (post_slug);

alter table public.comments enable row level security;
alter table public.reactions enable row level security;
-- No policies: with RLS on and no policies, direct table access is denied.
revoke all on public.comments, public.reactions from anon, authenticated;

-- Whole thread for one post: approved comments + reaction tallies.
create or replace function public.get_thread(p_slug text, p_client uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'comments', coalesce((
      select json_agg(json_build_object(
        'id', c.id,
        'parent_id', c.parent_id,
        'author_name', c.author_name,
        'body', c.body,
        'created_at', c.created_at,
        'mine', c.client_id = p_client
      ) order by c.created_at)
      from comments c
      where c.post_slug = p_slug and c.approved
    ), '[]'::json),
    'reactions', coalesce((
      select json_agg(json_build_object(
        'comment_id', r.comment_id,
        'kind', r.kind,
        'count', r.n,
        'mine', r.mine
      ))
      from (
        select comment_id, kind, count(*) as n, bool_or(client_id = p_client) as mine
        from reactions
        where post_slug = p_slug
        group by comment_id, kind
      ) r
    ), '[]'::json)
  );
$$;

create or replace function public.post_comment(
  p_slug text, p_parent uuid, p_name text, p_body text, p_client uuid
)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_name text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
  v_body text := btrim(coalesce(p_body, ''));
  v_row  comments;
begin
  if v_name = '' or v_body = '' then
    raise exception 'Name and comment are required';
  end if;
  if p_parent is not null and not exists (
    select 1 from comments where id = p_parent and post_slug = p_slug and approved
  ) then
    raise exception 'Unknown parent comment';
  end if;
  -- flood control: per browser, and a global ceiling
  if (select count(*) from comments where client_id = p_client and created_at > now() - interval '2 minutes') >= 3 then
    raise exception 'You are commenting too quickly. Please wait a minute.';
  end if;
  if (select count(*) from comments where created_at > now() - interval '10 minutes') >= 40 then
    raise exception 'Too many comments right now. Please try again later.';
  end if;

  insert into comments (post_slug, parent_id, author_name, body, client_id)
  values (p_slug, p_parent, left(v_name, 60), left(v_body, 5000), p_client)
  returning * into v_row;

  return json_build_object(
    'id', v_row.id,
    'parent_id', v_row.parent_id,
    'author_name', v_row.author_name,
    'body', v_row.body,
    'created_at', v_row.created_at,
    'approved', v_row.approved,
    'mine', true
  );
end;
$$;

-- Authors can delete their own comment from the same browser.
create or replace function public.delete_comment(p_id uuid, p_client uuid)
returns boolean
language sql
volatile
security definer
set search_path = public
as $$
  with d as (delete from comments where id = p_id and client_id = p_client returning 1)
  select exists (select 1 from d);
$$;

-- Toggle one reaction; returns true if it is now on.
create or replace function public.toggle_reaction(
  p_slug text, p_comment uuid, p_kind text, p_client uuid
)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  delete from reactions
  where post_slug = p_slug and comment_id is not distinct from p_comment
    and kind = p_kind and client_id = p_client;
  if found then
    return false;
  end if;
  if p_comment is not null and not exists (
    select 1 from comments where id = p_comment and post_slug = p_slug and approved
  ) then
    raise exception 'Unknown comment';
  end if;
  if (select count(*) from reactions where client_id = p_client and created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Too many reactions. Please slow down.';
  end if;
  insert into reactions (post_slug, comment_id, kind, client_id)
  values (p_slug, p_comment, p_kind, p_client);
  return true;
end;
$$;

-- Works with "Automatically expose new tables" switched off: the Data API
-- roles only get the schema itself plus these four functions.
grant usage on schema public to anon, authenticated;

revoke all on function public.get_thread(text, uuid) from public;
revoke all on function public.post_comment(text, uuid, text, text, uuid) from public;
revoke all on function public.delete_comment(uuid, uuid) from public;
revoke all on function public.toggle_reaction(text, uuid, text, uuid) from public;
grant execute on function public.get_thread(text, uuid) to anon, authenticated;
grant execute on function public.post_comment(text, uuid, text, text, uuid) to anon, authenticated;
grant execute on function public.delete_comment(uuid, uuid) to anon, authenticated;
grant execute on function public.toggle_reaction(text, uuid, text, uuid) to anon, authenticated;
