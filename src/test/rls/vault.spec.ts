/**
 * @vitest-environment node
 *
 * Não importar `@/config/env`: a validação zod corre no load do módulo e
 * quebra o CI sem `.env.test`. Usamos `process.env` e `skipIf` quando faltar Supabase.
 */
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

function hasVaultRlsEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && anon && svc);
}

describe.skipIf(!hasVaultRlsEnv())('Vault RLS isolation', () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  let admin: SupabaseClient;
  let userA: User;
  let userB: User;
  const password = 'TestVaultRls!2026';
  let emailA: string;
  let emailB: string;

  beforeAll(async () => {
    admin = createClient(url!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const stamp = Date.now();
    emailA = `vault-rls-a-${stamp}@test.local`;
    emailB = `vault-rls-b-${stamp}@test.local`;

    const { data: a, error: e1 } = await admin.auth.admin.createUser({
      email: emailA,
      password,
      email_confirm: true,
    });
    const { data: b, error: e2 } = await admin.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    });

    if (e1 || !a.user) throw e1 ?? new Error('createUser A failed');
    if (e2 || !b.user) throw e2 ?? new Error('createUser B failed');

    userA = a.user;
    userB = b.user;
  });

  afterAll(async () => {
    await admin.auth.admin.deleteUser(userA.id);
    await admin.auth.admin.deleteUser(userB.id);
  });

  async function clientFor(user: User, userEmail: string): Promise<SupabaseClient> {
    const sb = createClient(url!, anonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await sb.auth.signInWithPassword({
      email: userEmail,
      password,
    });
    if (error) throw error;
    const {
      data: { user: u },
    } = await sb.auth.getUser();
    expect(u?.id).toBe(user.id);
    return sb;
  }

  test('User B cannot SELECT User A files', async () => {
    const supabaseA = await clientFor(userA, emailA);
    const { data: inserted, error: insErr } = await supabaseA
      .from('vault_files')
      .insert({
        user_id: userA.id,
        display_name: 'rls-doc',
        original_name: 'rls-doc.pdf',
        status: 'pending',
      })
      .select('id')
      .single();

    expect(insErr).toBeNull();
    const fileId = inserted!.id as string;

    const supabaseB = await clientFor(userB, emailB);
    const { data, error } = await supabaseB.from('vault_files').select('*').eq('id', fileId).maybeSingle();

    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  test('User B cannot UPDATE User A files', async () => {
    const supabaseA = await clientFor(userA, emailA);
    const { data: inserted } = await supabaseA
      .from('vault_files')
      .insert({
        user_id: userA.id,
        display_name: 'keep-name',
        original_name: 'keep.pdf',
        status: 'pending',
      })
      .select('id')
      .single();

    const fileId = (inserted!.id as string) ?? '';

    const supabaseB = await clientFor(userB, emailB);
    const { error: upErr } = await supabaseB
      .from('vault_files')
      .update({ display_name: 'hacked' })
      .eq('id', fileId);

    expect(upErr).toBeNull();

    const { data: after } = await supabaseA.from('vault_files').select('display_name').eq('id', fileId).single();

    expect(after?.display_name).toBe('keep-name');
  });

  test('User B cannot DELETE User A files', async () => {
    const supabaseA = await clientFor(userA, emailA);
    const { data: inserted } = await supabaseA
      .from('vault_files')
      .insert({
        user_id: userA.id,
        display_name: 'to-delete-try',
        original_name: 'del.pdf',
        status: 'pending',
      })
      .select('id')
      .single();

    const fileId = inserted!.id as string;

    const supabaseB = await clientFor(userB, emailB);
    const { error: delErr } = await supabaseB.from('vault_files').delete().eq('id', fileId);

    expect(delErr).toBeNull();

    const { data: still } = await supabaseA.from('vault_files').select('id').eq('id', fileId).maybeSingle();

    expect(still?.id).toBe(fileId);
  });

  test('User B cannot read storage object of User A', async () => {
    const supabaseA = await clientFor(userA, emailA);
    const objectPath = `${userA.id}/rls-isolation/test.txt`;
    const body = new Uint8Array([72, 105]);

    const { error: upErr } = await supabaseA.storage.from('vault').upload(objectPath, body, {
      contentType: 'text/plain',
      upsert: true,
    });
    expect(upErr).toBeNull();

    const supabaseB = await clientFor(userB, emailB);
    const { data, error } = await supabaseB.storage.from('vault').download(objectPath);

    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });

  test('User B cannot insert vault_classifier_overrides for User A', async () => {
    const supabaseB = await clientFor(userB, emailB);
    const { error } = await supabaseB.from('vault_classifier_overrides').insert({
      user_id: userA.id,
      pattern: 'malicious-pattern',
      category_slug: 'outros',
      weight: 5,
    });

    expect(error).not.toBeNull();
  });

  test('User B cannot SELECT User A audit events', async () => {
    const supabaseA = await clientFor(userA, emailA);
    const { data: inserted } = await supabaseA
      .from('vault_files')
      .insert({
        user_id: userA.id,
        display_name: 'audit-source',
        original_name: 'audit.pdf',
        status: 'pending',
      })
      .select('id')
      .single();

    const fileId = inserted!.id as string;

    const supabaseB = await clientFor(userB, emailB);
    const { data: rows, error } = await supabaseB
      .from('vault_audit_events')
      .select('id')
      .eq('entity_id', fileId);

    expect(error).toBeNull();
    expect(rows?.length ?? 0).toBe(0);
  });
});
