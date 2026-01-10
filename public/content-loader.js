/**
 * Content Loader - Cloudflare Workers Compatible
 * Loads content from API with fallback to static JSON files
 */

const CONTENT_API = '/api/content';

// Try API first, fallback to static files
async function loadContent(type) {
    try {
        // Try API first
        const res = await fetch(`${CONTENT_API}/${type}`);
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // API not available, fallback to static
    }

    // Fallback to static JSON files
    const staticPaths = {
        links: 'links.json',
        settings: 'settings.json',
        private: 'private-links.json'
    };

    try {
        const res = await fetch(staticPaths[type] || `${type}.json`);
        if (res.ok) {
            return await res.json();
        }
    } catch {
        console.warn(`Failed to load ${type}`);
    }

    return null;
}

// Load links data
async function loadLinksData() {
    return await loadContent('links') || { categories: [], dock: [] };
}

// Load settings data
async function loadSettingsData() {
    return await loadContent('settings') || { siteName: 'Site', siteTitle: 'Site' };
}

// Load private links (requires auth)
async function loadPrivateLinksData() {
    const token = sessionStorage.getItem('privateToken');

    if (token) {
        try {
            const res = await fetch(`${CONTENT_API}/private`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                return await res.json();
            }
        } catch {
            // Fallback
        }
    }

    // Fallback to static file
    return await loadContent('private') || { items: [] };
}
