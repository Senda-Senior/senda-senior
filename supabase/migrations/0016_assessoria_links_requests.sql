-- 0016_assessoria_links_requests.sql
-- Assessoria: allowlist de assessoras, vínculos e solicitações ligadas a vault_files.
--
-- Segurança:
--   - Cofre permanece single-owner (vault_files_owner intacta).
--   - Assessora ganha SELECT estreito só em arquivos citáveis por document_requests
--     de um advisory_links.active (não lista o cofre inteiro).
--   - Storage: SELECT estreito no path do blob entregue (necessário para
--     createSignedUrl com JWT do caller — sem service-role). Sem INSERT/UPDATE/DELETE.
--   - Triggers validam dono do arquivo, is_private e papéis nas mutações.
--
-- Pré-requisito: 0015 (avatar) no remoto quando for push.
-- Seed MVP: Julianne Pimentel + Luciana Moura (user_ids do projeto linkado).

-- ═══ 1) allowlist de assessoras ═════════════════════════════════════

create table if not exists public.advisory_advisors (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  label      text        not null,
  active     boolean     not null default true,
  created_at timestamptz not null default now()
);

comment on table public.advisory_advisors is
  'Allowlist MVP de quem pode atuar como assessora (criar vínculos/solicitações).';

alter table public.advisory_advisors enable row level security;

drop policy if exists "advisory_advisors_select_active" on public.advisory_advisors;
create policy "advisory_advisors_select_active"
  on public.advisory_advisors for select
  to authenticated
  using (active = true);

-- Mutação só via migration / service role (sem policy de write para authenticated).

insert into public.advisory_advisors (user_id, label, active)
select v.user_id, v.label, true
from (
  values
    ('e92fd3db-53c2-469c-a38d-6cb597520235'::uuid, 'Julianne Pimentel'),
    ('10c5da31-7b67-4604-81f6-3c9bb6d838a5'::uuid, 'Luciana Moura')
) as v(user_id, label)
inner join auth.users u on u.id = v.user_id
on conflict (user_id) do update
  set label = excluded.label,
      active = excluded.active;

-- Helper SECURITY DEFINER (EXECUTE revogado — só policies/triggers via owner).
create or replace function public.is_advisory_advisor(p_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.advisory_advisors a
    where a.user_id = p_uid
      and a.active = true
  );
$$;

revoke all on function public.is_advisory_advisor(uuid) from public;
revoke all on function public.is_advisory_advisor(uuid) from anon;
revoke all on function public.is_advisory_advisor(uuid) from authenticated;

-- ═══ 2) vínculos ════════════════════════════════════════════════════

create table if not exists public.advisory_links (
  id                uuid        primary key default gen_random_uuid(),
  assessor_user_id  uuid        not null references auth.users(id) on delete cascade,
  client_user_id    uuid        references auth.users(id) on delete cascade,
  status            text        not null default 'pending'
    check (status in ('pending', 'active', 'revoked', 'declined')),
  invited_email     text        not null,
  invite_token      text        unique,
  created_at        timestamptz not null default now(),
  accepted_at       timestamptz,
  revoked_at        timestamptz,
  constraint advisory_links_assessor_ne_client
    check (client_user_id is null or assessor_user_id <> client_user_id),
  constraint advisory_links_active_needs_client
    check (status <> 'active' or client_user_id is not null),
  constraint advisory_links_invited_email_len
    check (char_length(trim(invited_email)) between 3 and 320)
);

create unique index if not exists advisory_links_active_pair_uq
  on public.advisory_links (assessor_user_id, client_user_id)
  where status = 'active' and client_user_id is not null;

create unique index if not exists advisory_links_pending_email_uq
  on public.advisory_links (assessor_user_id, lower(invited_email))
  where status = 'pending';

create index if not exists advisory_links_client_idx
  on public.advisory_links (client_user_id, status)
  where client_user_id is not null;

create index if not exists advisory_links_assessor_idx
  on public.advisory_links (assessor_user_id, status);

create index if not exists advisory_links_invite_token_idx
  on public.advisory_links (invite_token)
  where invite_token is not null;

alter table public.advisory_links enable row level security;

-- SELECT: participante (assessora ou cliente vinculado)
drop policy if exists "advisory_links_participant_select" on public.advisory_links;
create policy "advisory_links_participant_select"
  on public.advisory_links for select
  to authenticated
  using (
    assessor_user_id = auth.uid()
    or client_user_id = auth.uid()
  );

-- INSERT pending: só assessora allowlist, como ela mesma
drop policy if exists "advisory_links_advisor_insert" on public.advisory_links;
create policy "advisory_links_advisor_insert"
  on public.advisory_links for insert
  to authenticated
  with check (
    assessor_user_id = auth.uid()
    and public.is_advisory_advisor(auth.uid())
    and status = 'pending'
  );

-- UPDATE: assessora (revogar / ajustar pending) ou cliente (aceitar / declinar / revogar)
drop policy if exists "advisory_links_participant_update" on public.advisory_links;
create policy "advisory_links_participant_update"
  on public.advisory_links for update
  to authenticated
  using (
    assessor_user_id = auth.uid()
    or client_user_id = auth.uid()
  )
  with check (
    assessor_user_id = auth.uid()
    or client_user_id = auth.uid()
  );

-- Sem DELETE para authenticated (revogar via status).

create or replace function public.advisory_links_enforce_transition()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text;
begin
  -- Não permitir trocar as partes do vínculo.
  if new.assessor_user_id is distinct from old.assessor_user_id then
    raise exception 'advisory_link_assessor_immutable' using errcode = '42501';
  end if;

  if tg_op = 'UPDATE' then
    -- Cliente aceita: pending → active
    if old.status = 'pending' and new.status = 'active' then
      if auth.uid() is null then
        raise exception 'not_authenticated' using errcode = '28000';
      end if;
      if auth.uid() = old.assessor_user_id then
        raise exception 'advisory_link_assessor_cannot_accept' using errcode = '42501';
      end if;
      if old.client_user_id is not null and old.client_user_id is distinct from auth.uid() then
        raise exception 'advisory_link_accept_wrong_user' using errcode = '42501';
      end if;

      select u.email into v_email from auth.users u where u.id = auth.uid();
      if v_email is null
         or lower(trim(v_email)) is distinct from lower(trim(old.invited_email)) then
        raise exception 'advisory_link_email_mismatch' using errcode = '42501';
      end if;

      new.client_user_id := auth.uid();
      new.accepted_at := coalesce(new.accepted_at, now());
      new.revoked_at := null;
      return new;
    end if;

    -- Declinar: pending → declined (cliente)
    if old.status = 'pending' and new.status = 'declined' then
      if auth.uid() = old.assessor_user_id then
        raise exception 'advisory_link_assessor_cannot_decline' using errcode = '42501';
      end if;
      if old.client_user_id is not null and old.client_user_id is distinct from auth.uid() then
        raise exception 'advisory_link_decline_forbidden' using errcode = '42501';
      end if;
      if new.client_user_id is null then
        new.client_user_id := auth.uid();
      end if;
      return new;
    end if;

    -- Revogar: active|pending → revoked (qualquer participante)
    if new.status = 'revoked' and old.status in ('pending', 'active') then
      if auth.uid() is distinct from old.assessor_user_id
         and auth.uid() is distinct from coalesce(old.client_user_id, auth.uid()) then
        raise exception 'advisory_link_revoke_forbidden' using errcode = '42501';
      end if;
      -- Se pending sem client, só assessora revoga
      if old.client_user_id is null and auth.uid() is distinct from old.assessor_user_id then
        raise exception 'advisory_link_revoke_forbidden' using errcode = '42501';
      end if;
      new.revoked_at := coalesce(new.revoked_at, now());
      return new;
    end if;

    -- Demais transições de status bloqueadas
    if new.status is distinct from old.status then
      raise exception 'advisory_link_invalid_transition' using errcode = '22000';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists advisory_links_enforce_transition on public.advisory_links;
create trigger advisory_links_enforce_transition
  before update on public.advisory_links
  for each row execute function public.advisory_links_enforce_transition();

revoke all on function public.advisory_links_enforce_transition() from public;
revoke all on function public.advisory_links_enforce_transition() from anon;
revoke all on function public.advisory_links_enforce_transition() from authenticated;

-- ═══ 3) solicitações de documentos ══════════════════════════════════

create table if not exists public.document_requests (
  id              uuid        primary key default gen_random_uuid(),
  link_id         uuid        not null references public.advisory_links(id) on delete cascade,
  requested_by    uuid        not null references auth.users(id) on delete cascade,
  title           text        not null,
  due_at          date,
  assessor_note   text,
  review_note     text,
  status          text        not null default 'pendente'
    check (status in (
      'pendente',
      'enviado',
      'em_revisao',
      'aprovado',
      'precisa_atualizacao'
    )),
  vault_file_id   uuid        references public.vault_files(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  submitted_at    timestamptz,
  constraint document_requests_title_len
    check (char_length(trim(title)) between 1 and 200),
  constraint document_requests_assessor_note_len
    check (assessor_note is null or char_length(assessor_note) <= 2000),
  constraint document_requests_review_note_len
    check (review_note is null or char_length(review_note) <= 2000)
);

create index if not exists document_requests_link_idx
  on public.document_requests (link_id, status);

create index if not exists document_requests_file_idx
  on public.document_requests (vault_file_id)
  where vault_file_id is not null;

create index if not exists document_requests_requested_by_idx
  on public.document_requests (requested_by);

drop trigger if exists document_requests_updated_at on public.document_requests;
create trigger document_requests_updated_at
  before update on public.document_requests
  for each row execute function public.set_updated_at();

alter table public.document_requests enable row level security;

-- SELECT: participantes do vínculo
drop policy if exists "document_requests_participant_select" on public.document_requests;
create policy "document_requests_participant_select"
  on public.document_requests for select
  to authenticated
  using (
    exists (
      select 1
      from public.advisory_links l
      where l.id = document_requests.link_id
        and (l.assessor_user_id = auth.uid() or l.client_user_id = auth.uid())
    )
  );

-- INSERT: assessora do vínculo active
drop policy if exists "document_requests_advisor_insert" on public.document_requests;
create policy "document_requests_advisor_insert"
  on public.document_requests for insert
  to authenticated
  with check (
    requested_by = auth.uid()
    and vault_file_id is null
    and status = 'pendente'
    and exists (
      select 1
      from public.advisory_links l
      where l.id = link_id
        and l.assessor_user_id = auth.uid()
        and l.status = 'active'
        and public.is_advisory_advisor(auth.uid())
    )
  );

-- UPDATE: participante (detalhe das colunas no trigger)
drop policy if exists "document_requests_participant_update" on public.document_requests;
create policy "document_requests_participant_update"
  on public.document_requests for update
  to authenticated
  using (
    exists (
      select 1
      from public.advisory_links l
      where l.id = document_requests.link_id
        and l.status = 'active'
        and (l.assessor_user_id = auth.uid() or l.client_user_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.advisory_links l
      where l.id = link_id
        and l.status = 'active'
        and (l.assessor_user_id = auth.uid() or l.client_user_id = auth.uid())
    )
  );

-- DELETE: assessora dona do pedido
drop policy if exists "document_requests_advisor_delete" on public.document_requests;
create policy "document_requests_advisor_delete"
  on public.document_requests for delete
  to authenticated
  using (
    requested_by = auth.uid()
    and exists (
      select 1
      from public.advisory_links l
      where l.id = document_requests.link_id
        and l.assessor_user_id = auth.uid()
        and public.is_advisory_advisor(auth.uid())
    )
  );

create or replace function public.document_requests_enforce_mutation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_link public.advisory_links%rowtype;
  v_file public.vault_files%rowtype;
  v_uid uuid := auth.uid();
  v_is_assessor boolean;
  v_is_client boolean;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_link
  from public.advisory_links
  where id = coalesce(new.link_id, old.link_id);

  if not found then
    raise exception 'advisory_link_not_found' using errcode = '23503';
  end if;

  v_is_assessor := (v_link.assessor_user_id = v_uid);
  v_is_client := (v_link.client_user_id is not null and v_link.client_user_id = v_uid);

  if tg_op = 'INSERT' then
    if not v_is_assessor or not public.is_advisory_advisor(v_uid) then
      raise exception 'document_request_insert_forbidden' using errcode = '42501';
    end if;
    if v_link.status is distinct from 'active' then
      raise exception 'document_request_link_not_active' using errcode = '22000';
    end if;
    if new.vault_file_id is not null then
      raise exception 'document_request_file_on_insert' using errcode = '22000';
    end if;
    if new.requested_by is distinct from v_uid then
      raise exception 'document_request_requested_by_mismatch' using errcode = '42501';
    end if;
    new.status := 'pendente';
    new.review_note := null;
    new.submitted_at := null;
    return new;
  end if;

  -- UPDATE
  if new.link_id is distinct from old.link_id then
    raise exception 'document_request_link_immutable' using errcode = '42501';
  end if;
  if new.requested_by is distinct from old.requested_by then
    raise exception 'document_request_requested_by_immutable' using errcode = '42501';
  end if;

  if v_link.status is distinct from 'active' then
    raise exception 'document_request_link_not_active' using errcode = '22000';
  end if;

  -- Assessora: metadados + revisão; nunca anexa arquivo
  if v_is_assessor and public.is_advisory_advisor(v_uid) then
    if new.vault_file_id is distinct from old.vault_file_id then
      raise exception 'document_request_assessor_cannot_attach' using errcode = '42501';
    end if;

    -- Edição de pedido (título/prazo/nota) só enquanto pendente ou precisa_atualizacao sem reenvio em curso
    if new.status is not distinct from old.status
       and old.status in ('pendente', 'precisa_atualizacao') then
      return new;
    end if;

    -- Transições de revisão
    if old.status in ('enviado', 'em_revisao')
       and new.status in ('em_revisao', 'aprovado', 'precisa_atualizacao') then
      if new.status = 'precisa_atualizacao'
         and (new.review_note is null or length(trim(new.review_note)) = 0) then
        raise exception 'document_request_review_note_required' using errcode = '22000';
      end if;
      return new;
    end if;

    if new.status is distinct from old.status
       or new.title is distinct from old.title
       or new.due_at is distinct from old.due_at
       or new.assessor_note is distinct from old.assessor_note
       or new.review_note is distinct from old.review_note then
      -- allow soft metadata while in review without status change already handled
      if old.status in ('enviado', 'em_revisao', 'aprovado')
         and new.status is not distinct from old.status
         and new.vault_file_id is not distinct from old.vault_file_id then
        -- só review_note / assessor_note em revisão
        if new.title is distinct from old.title or new.due_at is distinct from old.due_at then
          raise exception 'document_request_assessor_edit_locked' using errcode = '22000';
        end if;
        return new;
      end if;
      raise exception 'document_request_assessor_invalid_update' using errcode = '22000';
    end if;

    return new;
  end if;

  -- Cliente: anexa arquivo / reenvio
  if v_is_client then
    if new.title is distinct from old.title
       or new.due_at is distinct from old.due_at
       or new.assessor_note is distinct from old.assessor_note
       or new.requested_by is distinct from old.requested_by then
      raise exception 'document_request_client_cannot_edit_meta' using errcode = '42501';
    end if;

    -- Envio inicial: pendente → enviado com arquivo
    if old.status = 'pendente' and new.status = 'enviado' then
      if new.vault_file_id is null then
        raise exception 'document_request_file_required' using errcode = '22000';
      end if;
    elsif old.status = 'precisa_atualizacao' and new.status = 'enviado' then
      if new.vault_file_id is null then
        raise exception 'document_request_file_required' using errcode = '22000';
      end if;
      new.review_note := null;
    elsif new.status is distinct from old.status
          or new.vault_file_id is distinct from old.vault_file_id then
      raise exception 'document_request_client_invalid_update' using errcode = '22000';
    else
      return new;
    end if;

    select * into v_file
    from public.vault_files
    where id = new.vault_file_id;

    if not found then
      raise exception 'document_request_file_not_found' using errcode = '23503';
    end if;

    if v_file.user_id is distinct from v_link.client_user_id then
      raise exception 'document_request_file_not_owned' using errcode = '42501';
    end if;
    if v_file.deleted_at is not null then
      raise exception 'document_request_file_deleted' using errcode = '22000';
    end if;
    if v_file.status is distinct from 'ready' then
      raise exception 'document_request_file_not_ready' using errcode = '22000';
    end if;
    if v_file.is_private is true then
      raise exception 'document_request_file_private' using errcode = '42501';
    end if;

    new.submitted_at := coalesce(new.submitted_at, now());
    return new;
  end if;

  raise exception 'document_request_update_forbidden' using errcode = '42501';
end;
$$;

drop trigger if exists document_requests_enforce_mutation on public.document_requests;
create trigger document_requests_enforce_mutation
  before insert or update on public.document_requests
  for each row execute function public.document_requests_enforce_mutation();

revoke all on function public.document_requests_enforce_mutation() from public;
revoke all on function public.document_requests_enforce_mutation() from anon;
revoke all on function public.document_requests_enforce_mutation() from authenticated;

-- ═══ 4) RLS estreito em vault_files (+ blobs) ═══════════════════════

drop policy if exists "vault_files_assessor_read_delivered" on public.vault_files;
create policy "vault_files_assessor_read_delivered"
  on public.vault_files for select
  to authenticated
  using (
    exists (
      select 1
      from public.document_requests r
      join public.advisory_links l on l.id = r.link_id
      where r.vault_file_id = vault_files.id
        and l.assessor_user_id = auth.uid()
        and l.status = 'active'
        and r.status in ('enviado', 'em_revisao', 'aprovado', 'precisa_atualizacao')
    )
  );

drop policy if exists "vault_file_blobs_assessor_read_delivered" on public.vault_file_blobs;
create policy "vault_file_blobs_assessor_read_delivered"
  on public.vault_file_blobs for select
  to authenticated
  using (
    exists (
      select 1
      from public.vault_files f
      join public.document_requests r on r.vault_file_id = f.id
      join public.advisory_links l on l.id = r.link_id
      where f.id = vault_file_blobs.file_id
        and f.current_blob_id = vault_file_blobs.id
        and l.assessor_user_id = auth.uid()
        and l.status = 'active'
        and r.status in ('enviado', 'em_revisao', 'aprovado', 'precisa_atualizacao')
    )
  );

-- Storage: SELECT só no path do blob entregue (createSignedUrl com JWT do assessor).
drop policy if exists "vault_storage_assessor_read_delivered" on storage.objects;
create policy "vault_storage_assessor_read_delivered"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'vault'
    and exists (
      select 1
      from public.vault_file_blobs b
      join public.vault_files f on f.current_blob_id = b.id
      join public.document_requests r on r.vault_file_id = f.id
      join public.advisory_links l on l.id = r.link_id
      where b.storage_path = name
        and l.assessor_user_id = auth.uid()
        and l.status = 'active'
        and r.status in ('enviado', 'em_revisao', 'aprovado', 'precisa_atualizacao')
    )
  );

notify pgrst, 'reload schema';
