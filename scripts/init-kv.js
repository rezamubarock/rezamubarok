/**
 * KV Initialization Script
 * Run this to populate Cloudflare KV with initial data from JSON files
 * 
 * Usage: 
 * 1. Create KV namespace in Cloudflare dashboard
 * 2. Update wrangler.toml with KV namespace ID
 * 3. Run: wrangler kv:key put --binding=SITE_KV "links" "$(cat links.json)"
 *    Or use this script with wrangler
 */

const fs = require('fs');
const path = require('path');

// Read JSON files
const linksPath = path.join(__dirname, '..', 'links.json');
const settingsPath = path.join(__dirname, '..', 'settings.json');
const privatePath = path.join(__dirname, '..', 'private-links.json');

const links = fs.existsSync(linksPath) ? fs.readFileSync(linksPath, 'utf8') : '{"categories":[],"dock":[]}';
const settings = fs.existsSync(settingsPath) ? fs.readFileSync(settingsPath, 'utf8') : '{}';
const privateLinks = fs.existsSync(privatePath) ? fs.readFileSync(privatePath, 'utf8') : '{"items":[]}';

console.log('=== KV Initialization Commands ===\n');
console.log('Run these commands to populate your KV namespace:\n');
console.log(`wrangler kv:key put --binding=SITE_KV "links" '${links.replace(/'/g, "\\'")}'`);
console.log('');
console.log(`wrangler kv:key put --binding=SITE_KV "settings" '${settings.replace(/'/g, "\\'")}'`);
console.log('');
console.log(`wrangler kv:key put --binding=SITE_KV "private-links" '${privateLinks.replace(/'/g, "\\'")}'`);
console.log('\n=== Or upload via Dashboard ===');
console.log('Go to Cloudflare Dashboard > Workers & Pages > KV > Your Namespace');
console.log('Add keys: links, settings, private-links');
