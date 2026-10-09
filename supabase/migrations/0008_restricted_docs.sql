-- ════════════════════════════════════════════════════════════════════
--  0008 · restricted_docs — login-gated confidential documents
--  Backs the "Dossier Attribution" page (apps/unicredit-engagement/dossier).
--  Content lives HERE (RLS-protected), never in the static bundle. Readable
--  only by super admins or users with a role on the doc's experience
--  (granted from /console/users/). Bilingual IT/EN.
--  Idempotent: safe to re-run. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.restricted_docs (
  slug            text primary key,
  experience_slug text not null references public.experiences (slug) on delete cascade,
  content         jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

alter table public.restricted_docs enable row level security;

-- read: super admin, OR any user with a role on the doc's experience
drop policy if exists restricted_docs_select on public.restricted_docs;
create policy restricted_docs_select on public.restricted_docs
  for select using (
    public.is_super_admin()
    or exists (
      select 1 from public.user_experience_roles r
      where r.user_id = auth.uid()
        and r.experience_slug = restricted_docs.experience_slug
    )
  );

-- write: super admin only
drop policy if exists restricted_docs_super_all on public.restricted_docs;
create policy restricted_docs_super_all on public.restricted_docs
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ── seed ────────────────────────────────────────────────────────────
--  Il seed del dossier «Attribution — UniCredit» NON sta più qui.
--
--  Fino al 9 ottobre 2026 questo file tracciato portava tutto il contenuto del
--  dossier: otto persone del cliente con nome, ruolo e URL del profilo
--  LinkedIn, la lettura interna di ognuna, la tesi e le fonti. Il repository è
--  pubblico, quindi era leggibile da chiunque su raw.githubusercontent.com —
--  la stessa esposizione dei dossier di `trenitalia-connessioni` e
--  `eni-orbita` (0027, 0028), per una via che l'inventario dei nomi nei
--  documenti di handover non guardava.
--
--  Il contenuto è in `docs/UniCredit/0008b_seed_unicredit_attribution_dossier.sql`
--  (git-ignorato), come per ogni altro dossier. Vedi il README 0008b.
--  Regola: in un file tracciato va il RUOLO, mai il nome.
-- ────────────────────────────────────────────────────────────────────
