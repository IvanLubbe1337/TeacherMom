// Vercel Serverless Function: /api/resources
// Handles shared cloud catalog persistence for TeacherMom via Supabase (Free PostgreSQL) or Vercel KV.

export default async function handler(req, res) {
  // 1. CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Discover Database Credentials (Supports Vercel prefixes like STORAGE_SUPABASE_*)
  let supabaseUrl = (
    process.env.STORAGE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.REACT_APP_SUPABASE_URL ||
    ''
  ).replace(/\/$/, '');

  let supabaseKey =
    process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.STORAGE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_STORAGE_SUPABASE_ANON_KEY ||
    process.env.STORAGE_SUPABASE_SECRET_KEY ||
    process.env.STORAGE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY;

  // Dynamic fallback: scan for any custom prefix like [NAME]_SUPABASE_URL
  if (!supabaseUrl || !supabaseKey) {
    for (const [key, val] of Object.entries(process.env)) {
      if (!supabaseUrl && key.includes('SUPABASE') && key.includes('URL') && typeof val === 'string' && val.startsWith('http')) {
        supabaseUrl = val.replace(/\/$/, '');
      }
      if (!supabaseKey && key.includes('SUPABASE') && (key.includes('KEY') || key.includes('SECRET')) && typeof val === 'string' && val.length > 20) {
        supabaseKey = val;
      }
    }
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  const useSupabase = Boolean(supabaseUrl && supabaseKey);
  const useKV = !useSupabase && Boolean(kvUrl && kvToken);

  const detectedKeys = Object.keys(process.env).filter(k => 
    k.includes('SUPABASE') || k.includes('POSTGRES') || k.includes('KV')
  );

  if (!useSupabase && !useKV) {
    if (req.method === 'GET') {
      return res.status(200).json({
        connected: false,
        provider: 'none',
        resources: [],
        message: 'Supabase credentials not found in Vercel environment.',
        detectedKeys
      });
    }
    return res.status(503).json({
      connected: false,
      error: 'Supabase credentials not detected in Vercel. Ensure your Vercel project has SUPABASE_URL and SUPABASE_ANON_KEY set.',
      detectedKeys
    });
  }

  // ==========================================
  // --- 3. SUPABASE (PostgreSQL REST API) ---
  // ==========================================
  if (useSupabase) {
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    };

    // Helper: Upsert row to Supabase, auto-adapting to JSON data column or flat columns
    async function upsertRows(items) {
      const rowsWithData = items.map(r => ({ id: r.id, title: r.title, data: r }));
      let response = await fetch(`${supabaseUrl}/rest/v1/resources`, {
        method: 'POST',
        headers: {
          ...headers,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(rowsWithData)
      });

      if (!response.ok) {
        const errText = await response.text();
        // Check if table missing
        if (response.status === 404 || errText.includes('42P01') || errText.includes('does not exist')) {
          if (!errText.includes('data')) {
            throw new Error('Table "resources" does not exist in your Supabase database yet. Please run the SQL table creation script in Supabase SQL editor.');
          }
        }
        // If table doesn't have a "data" column, retry with flat object
        if (errText.includes('data') && errText.includes('does not exist')) {
          response = await fetch(`${supabaseUrl}/rest/v1/resources`, {
            method: 'POST',
            headers: {
              ...headers,
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(items)
          });
          if (!response.ok) {
            const retryErr = await response.text();
            throw new Error(`Supabase insert failed: ${retryErr}`);
          }
        } else {
          throw new Error(`Supabase insert failed: ${errText}`);
        }
      }
      return response;
    }

    try {
      // GET /api/resources -> Fetch live shared catalog
      if (req.method === 'GET') {
        const response = await fetch(`${supabaseUrl}/rest/v1/resources?select=*`, { headers });

        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 404 || errText.includes('does not exist')) {
            return res.status(200).json({
              connected: true,
              provider: 'supabase',
              tableMissing: true,
              resources: [],
              message: 'Table "resources" does not exist in Supabase yet. Please run the SQL table setup script.'
            });
          }
          throw new Error(`Supabase query error (${response.status}): ${errText}`);
        }

        const data = await response.json();
        const resources = (Array.isArray(data) ? data : []).map(row => {
          if (row.data && typeof row.data === 'object') {
            return { ...row.data, id: row.id || row.data.id };
          }
          return row;
        });

        return res.status(200).json({
          connected: true,
          provider: 'supabase',
          count: resources.length,
          resources
        });
      }

      // POST /api/resources -> Upload or bulk sync
      if (req.method === 'POST') {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

        // Bulk catalog sync
        if (payload.action === 'set_all' && Array.isArray(payload.resources)) {
          await upsertRows(payload.resources);
          return res.status(200).json({
            connected: true,
            provider: 'supabase',
            success: true,
            count: payload.resources.length
          });
        }

        // Single resource upload/update
        const newResource = payload.resource || payload;
        if (!newResource || !newResource.id || !newResource.title) {
          return res.status(400).json({ error: 'Resource must contain id and title.' });
        }

        await upsertRows([newResource]);

        return res.status(200).json({
          connected: true,
          provider: 'supabase',
          success: true,
          resource: newResource
        });
      }

      // DELETE /api/resources -> Delete resource
      if (req.method === 'DELETE') {
        const id = req.query.id || (req.body && req.body.id);
        if (!id) {
          return res.status(400).json({ error: 'Missing resource id.' });
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/resources?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Supabase delete error (${response.status}): ${errText}`);
        }

        return res.status(200).json({
          connected: true,
          provider: 'supabase',
          success: true,
          deletedId: id
        });
      }

      return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    } catch (err) {
      console.error('Supabase error:', err);
      return res.status(500).json({
        connected: true,
        provider: 'supabase',
        error: err.message || 'Supabase operation failed'
      });
    }
  }

  // ==========================================
  // --- 4. VERCEL KV / UPSTASH (Fallback) ---
  // ==========================================
  const STORAGE_KEY = 'teachermom_catalog_v3';

  async function runRedisCommand(commandArray) {
    const response = await fetch(kvUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commandArray)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`KV command failed: ${response.status} ${errText}`);
    }
    return await response.json();
  }

  try {
    if (req.method === 'GET') {
      const data = await runRedisCommand(['GET', STORAGE_KEY]);
      const resources = data?.result ? (typeof data.result === 'string' ? JSON.parse(data.result) : data.result) : [];
      return res.status(200).json({ connected: true, provider: 'kv', count: resources.length, resources });
    }

    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (payload.action === 'set_all' && Array.isArray(payload.resources)) {
        await runRedisCommand(['SET', STORAGE_KEY, JSON.stringify(payload.resources)]);
        return res.status(200).json({ connected: true, provider: 'kv', success: true });
      }

      const newResource = payload.resource || payload;
      const data = await runRedisCommand(['GET', STORAGE_KEY]);
      const list = data?.result ? (typeof data.result === 'string' ? JSON.parse(data.result) : data.result) : [];
      const idx = list.findIndex(r => r.id === newResource.id);
      if (idx >= 0) list[idx] = newResource;
      else list.unshift(newResource);

      await runRedisCommand(['SET', STORAGE_KEY, JSON.stringify(list)]);
      return res.status(200).json({ connected: true, provider: 'kv', success: true, resource: newResource });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || (req.body && req.body.id);
      const data = await runRedisCommand(['GET', STORAGE_KEY]);
      const list = data?.result ? (typeof data.result === 'string' ? JSON.parse(data.result) : data.result) : [];
      const filtered = list.filter(r => r.id !== id);
      await runRedisCommand(['SET', STORAGE_KEY, JSON.stringify(filtered)]);
      return res.status(200).json({ connected: true, provider: 'kv', success: true });
    }
  } catch (err) {
    return res.status(500).json({ connected: true, error: err.message });
  }
}
