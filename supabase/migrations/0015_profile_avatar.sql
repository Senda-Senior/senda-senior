-- 0015_profile_avatar.sql
-- Foto de perfil — coluna avatar_url + bucket público avatars
-- Tabelas: public.profiles | storage.buckets/objects (avatars)

alter table public.profiles
  add column if not exists avatar_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Path: {user_id}/avatar.{ext}
drop policy if exists "avatars_storage_select_public" on storage.objects;
create policy "avatars_storage_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars_storage_insert_own" on storage.objects;
create policy "avatars_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_storage_update_own" on storage.objects;
create policy "avatars_storage_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_storage_delete_own" on storage.objects;
create policy "avatars_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
