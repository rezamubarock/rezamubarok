/**
 * Cloudflare Pages Function - Content API
 * Handles reading and updating site content from KV
 */

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Verify JWT token (simplified version)
async function verifyToken(token, secret) {
    try {
        const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
        const signatureInput = `${encodedHeader}.${encodedPayload}`;

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        const signatureBytes = Uint8Array.from(atob(encodedSignature), c => c.charCodeAt(0));
        const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(signatureInput));

        if (!valid) return null;

        const payload = JSON.parse(atob(encodedPayload));
        if (payload.exp && Date.now() > payload.exp) return null;

        return payload;
    } catch {
        return null;
    }
}

// Check if user is admin
async function isAdmin(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

    const token = authHeader.slice(7);
    const JWT_SECRET = env.JWT_SECRET || 'default-secret-change-me';
    const payload = await verifyToken(token, JWT_SECRET);

    return payload?.role === 'admin';
}

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/content', '');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const KV = env.SITE_KV;

    try {
        // GET /api/content/links - Get links.json
        if (path === '/links' && request.method === 'GET') {
            let links = await KV?.get('links', 'json');

            // Fallback to default if KV not initialized
            if (!links) {
                links = {
                    categories: [],
                    dock: []
                };
            }

            return new Response(JSON.stringify(links), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // GET /api/content/settings - Get settings.json
        if (path === '/settings' && request.method === 'GET') {
            let settings = await KV?.get('settings', 'json');

            if (!settings) {
                settings = {
                    siteName: 'Reza Mubarok',
                    siteTitle: 'Reza Mubarok'
                };
            }

            return new Response(JSON.stringify(settings), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // GET /api/content/private - Get private-links (requires auth)
        if (path === '/private' && request.method === 'GET') {
            const authHeader = request.headers.get('Authorization');
            if (!authHeader) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            let privateLinks = await KV?.get('private-links', 'json');
            if (!privateLinks) {
                privateLinks = { items: [] };
            }

            return new Response(JSON.stringify(privateLinks), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // PUT /api/content/links - Update links (admin only)
        if (path === '/links' && request.method === 'PUT') {
            if (!await isAdmin(request, env)) {
                return new Response(JSON.stringify({ error: 'Admin access required' }), {
                    status: 403,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const body = await request.json();
            await KV.put('links', JSON.stringify(body));

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // PUT /api/content/settings - Update settings (admin only)
        if (path === '/settings' && request.method === 'PUT') {
            if (!await isAdmin(request, env)) {
                return new Response(JSON.stringify({ error: 'Admin access required' }), {
                    status: 403,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const body = await request.json();
            await KV.put('settings', JSON.stringify(body));

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // PUT /api/content/private - Update private links (admin only)
        if (path === '/private' && request.method === 'PUT') {
            if (!await isAdmin(request, env)) {
                return new Response(JSON.stringify({ error: 'Admin access required' }), {
                    status: 403,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const body = await request.json();
            await KV.put('private-links', JSON.stringify(body));

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
