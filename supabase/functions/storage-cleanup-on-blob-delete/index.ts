import { createClient } from '@supabase/supabase-js';

type DbWebhookPayload = {
  type?: string;
  table?: string;
  old_record?: { storage_path?: string | null } | null;
  record?: { storage_path?: string | null } | null;
};

Deno.serve(async (req) => {
  try {
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
