import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

type DbWebhookPayload = {
  type?: string;
  table?: string;
  old_record?: { storage_path?: string | null } | null;
  record?: { storage_path?: string | null } | null;
};

// Comparação em tempo constante via digest — evita timing attack no secret.
async function secretMatches(provided: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(provided)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ]);
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  try {
    // Fail closed: sem secret configurado ou sem header válido, nada é
    // deletado. O webhook (Database → Webhooks) deve enviar o header
    // `x-webhook-secret` com o mesmo valor do env WEBHOOK_SECRET.
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
    if (!expectedSecret) {
      console.error('[storage-cleanup-on-blob-delete] missing WEBHOOK_SECRET env');
      return new Response(JSON.stringify({ ok: false, error: 'missing_env' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const providedSecret = req.headers.get('x-webhook-secret') ?? '';
    if (!(await secretMatches(providedSecret, expectedSecret))) {
      console.error('[storage-cleanup-on-blob-delete] invalid webhook secret');
      return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as DbWebhookPayload;
    const isBlobDelete =
      body?.type === 'DELETE' &&
      body?.table === 'vault_file_blobs';

    const oldRecord = body?.old_record ?? body?.record;
    const storage_path = oldRecord?.storage_path;

    if (!isBlobDelete || !storage_path || typeof storage_path !== 'string') {
      console.error('[storage-cleanup-on-blob-delete] unexpected payload', body);
      return new Response(JSON.stringify({ ok: false, error: 'invalid_payload' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      console.error('[storage-cleanup-on-blob-delete] missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(JSON.stringify({ ok: false, error: 'missing_env' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.storage.from('vault').remove([storage_path]);
    if (error) {
      console.error(`Failed to remove ${storage_path}:`, error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[storage-cleanup-on-blob-delete]', e);
    return new Response(JSON.stringify({ ok: false, error: 'internal_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
