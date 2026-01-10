/**
 * Cloudflare Pages Function - Authentication API
 * Handles login, logout, and session verification
 */

// Simple password hashing comparison (for demo)
// In production, use bcrypt hash stored in env
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Generate JWT token
async function generateToken(payload, secret) {
    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput));
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// Verify JWT token
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

        // Check expiration
        if (payload.exp && Date.now() > payload.exp) return null;

        return payload;
    } catch {
        return null;
    }
}

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/auth', '');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // JWT secret from environment
    const JWT_SECRET = env.JWT_SECRET || 'default-secret-change-me';

    // Passwords from environment (hashed)
    const MAIN_PASSWORD = env.MAIN_PASSWORD || 'annelies';
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'admin123';
    const PRIVATE_PASSWORD = env.PRIVATE_PASSWORD || 'M0j0punkr0cker/.,';

    try {
        // POST /api/auth/login - Main site login
        if (path === '/login' && request.method === 'POST') {
            const body = await request.json();
            const { password, type = 'main' } = body;

            let validPassword = '';
            let role = 'user';

            if (type === 'admin') {
                validPassword = ADMIN_PASSWORD;
                role = 'admin';
            } else if (type === 'private') {
                validPassword = PRIVATE_PASSWORD;
                role = 'private';
            } else {
                validPassword = MAIN_PASSWORD;
                role = 'user';
            }

            if (password === validPassword) {
                const token = await generateToken({
                    role,
                    type,
                    iat: Date.now(),
                    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                }, JWT_SECRET);

                return new Response(JSON.stringify({
                    success: true,
                    token,
                    role
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid password'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // GET /api/auth/verify - Verify token
        if (path === '/verify' && request.method === 'GET') {
            const authHeader = request.headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ valid: false }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const token = authHeader.slice(7);
            const payload = await verifyToken(token, JWT_SECRET);

            return new Response(JSON.stringify({
                valid: !!payload,
                role: payload?.role || null
            }), {
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
