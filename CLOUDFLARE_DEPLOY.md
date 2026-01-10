# Cloudflare Pages Deployment Guide

## Project Structure
```
rezamubarok.com/
├── public/           # Static files served by Cloudflare Pages
│   ├── index.html
│   ├── styles.css
│   ├── auth.js       # Hybrid auth (API + fallback)
│   ├── content-loader.js
│   ├── admin.html    # Admin panel
│   ├── game/
│   └── *.json        # Static content files
├── functions/        # Cloudflare Pages Functions (Workers)
│   └── api/
│       ├── auth.js   # Authentication API
│       └── content.js # Content management API
├── wrangler.toml     # Cloudflare config
└── package.json
```

## Deployment Steps

### 1. Create Cloudflare Account
1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for free account
3. Add your domain (optional, can use `.pages.dev` subdomain)

### 2. Create KV Namespace
1. Dashboard → Workers & Pages → KV
2. Create namespace: `REZAMUBAROK_KV`
3. Copy the namespace ID

### 3. Update wrangler.toml
Replace `YOUR_KV_NAMESPACE_ID` with your actual KV namespace ID.

### 4. Set Environment Variables
Dashboard → Workers & Pages → Your Project → Settings → Environment Variables

Add:
- `JWT_SECRET` = (generate random 32+ character string)
- `MAIN_PASSWORD` = your main login password
- `ADMIN_PASSWORD` = your admin password
- `PRIVATE_PASSWORD` = your private folder password

### 5. Connect GitHub
1. Dashboard → Workers & Pages → Create Application → Pages
2. Connect GitHub repository
3. Configure:
   - Build command: (leave empty)
   - Build output directory: `public`
4. Deploy!

### 6. Initialize KV Data (First Time)
Run the init script to see commands:
```bash
node scripts/init-kv.js
```

Or manually add in Dashboard → KV → Your Namespace:
- Key: `links` → Value: contents of links.json
- Key: `settings` → Value: contents of settings.json
- Key: `private-links` → Value: contents of private-links.json

## URLs
- Main site: `your-project.pages.dev` or `rezamubarok.com`
- Admin panel: `your-project.pages.dev/admin.html`
- Game: `your-project.pages.dev/game/`

## Fallback Mode
If Workers API is not configured, the site falls back to static JSON files automatically.
