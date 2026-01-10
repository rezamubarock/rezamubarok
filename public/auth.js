/**
 * Authentication Module - Cloudflare Workers Compatible
 * Supports both API-based auth and fallback to client-side
 */

const AUTH_API = '/api/auth';

// Store tokens
let mainToken = sessionStorage.getItem('mainToken');
let privateToken = sessionStorage.getItem('privateToken');

// Fallback passwords (obfuscated - same as original)
const _0x = [0x61, 0x6e, 0x6e, 0x65, 0x6c, 0x69, 0x65, 0x73];
const _k = () => _0x.map(c => String.fromCharCode(c)).join('');
const _1x = [0x4d, 0x30, 0x6a, 0x30, 0x70, 0x75, 0x6e, 0x6b, 0x72, 0x30, 0x63, 0x6b, 0x65, 0x72, 0x2f, 0x2e, 0x2c];
const _pk = () => _1x.map(c => String.fromCharCode(c)).join('');

// Check if API is available
let useAPI = true;

async function checkAPI() {
    try {
        const res = await fetch(`${AUTH_API}/verify`, { method: 'GET' });
        useAPI = res.ok;
    } catch {
        useAPI = false;
    }
    return useAPI;
}

// Main site authentication
async function validateAccess(input) {
    if (useAPI) {
        try {
            const res = await fetch(`${AUTH_API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: input, type: 'main' })
            });
            const data = await res.json();
            if (data.success) {
                mainToken = data.token;
                sessionStorage.setItem('mainToken', mainToken);
                return true;
            }
            return false;
        } catch {
            // Fallback to client-side
        }
    }

    // Client-side fallback
    const h = Array.from(input).reduce((a, c) => a + c.charCodeAt(0), 0);
    const v = _0x.reduce((a, c) => a + c, 0);
    if (h !== v) return false;
    return input === _k();
}

function checkAuth() {
    if (mainToken) {
        // Token-based check
        return true; // Will be verified by API on protected routes
    }
    // Fallback to session-based
    return sessionStorage.getItem('_auth') === btoa(_k() + new Date().toDateString());
}

function setAuth() {
    if (!mainToken) {
        sessionStorage.setItem('_auth', btoa(_k() + new Date().toDateString()));
    }
}

function clearAuth() {
    mainToken = null;
    sessionStorage.removeItem('mainToken');
    sessionStorage.removeItem('_auth');
}

// Private folder authentication
async function validatePrivate(input) {
    if (useAPI) {
        try {
            const res = await fetch(`${AUTH_API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: input, type: 'private' })
            });
            const data = await res.json();
            if (data.success) {
                privateToken = data.token;
                sessionStorage.setItem('privateToken', privateToken);
                return true;
            }
            return false;
        } catch {
            // Fallback to client-side
        }
    }

    // Client-side fallback
    const h = Array.from(input).reduce((a, c) => a + c.charCodeAt(0), 0);
    const v = _1x.reduce((a, c) => a + c, 0);
    if (h !== v) return false;
    return input === _pk();
}

function checkPrivateAuth() {
    if (privateToken) {
        return true;
    }
    return sessionStorage.getItem('_priv') === btoa(_pk() + new Date().toDateString());
}

function setPrivateAuth() {
    if (!privateToken) {
        sessionStorage.setItem('_priv', btoa(_pk() + new Date().toDateString()));
    }
}

function clearPrivateAuth() {
    privateToken = null;
    sessionStorage.removeItem('privateToken');
    sessionStorage.removeItem('_priv');
}

// Get auth token for API calls
function getAuthToken() {
    return mainToken || privateToken || null;
}

// Initialize API check
checkAPI();
