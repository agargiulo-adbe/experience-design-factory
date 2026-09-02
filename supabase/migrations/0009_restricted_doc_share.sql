-- ════════════════════════════════════════════════════════════════════
--  0009 · restricted_docs share token — unlisted secret-link access
--  Lets a confidential doc be opened WITHOUT login via a hard-to-guess
--  secret token in the URL (?t=<uuid>), for low-friction sharing with
--  colleagues — while staying OFF the public web (page is noindex, the
--  content is never in the static bundle, and the URL is unguessable).
--  The login/RLS path (0008) is unchanged. Revoke/rotate by updating or
--  nulling share_token. Idempotent: safe to re-run.
-- ════════════════════════════════════════════════════════════════════

alter table public.restricted_docs
  add column if not exists share_token uuid;

-- One token ⇒ one doc (tokens are unique when present; null = no link access).
create unique index if not exists restricted_docs_share_token_key
  on public.restricted_docs (share_token) where share_token is not null;

-- SECURITY DEFINER read-by-token: the anon role can fetch ONLY the doc whose
-- secret token matches exactly. Returns just `content`. A null token never
-- matches (so passing null can't leak a token-less row). RLS on the table is
-- untouched — this function is the single, narrow, auditable escape hatch.
create or replace function public.get_shared_doc(p_token uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select content
  from public.restricted_docs
  where p_token is not null and share_token = p_token
  limit 1;
$$;

revoke all on function public.get_shared_doc(uuid) from public;
grant execute on function public.get_shared_doc(uuid) to anon, authenticated;

-- Mint a secret token for the UniCredit attribution dossier (idempotent:
-- only when not already set, so re-runs don't rotate it unintentionally).
update public.restricted_docs
  set share_token = gen_random_uuid()
  where slug = 'unicredit-attribution' and share_token is null;
