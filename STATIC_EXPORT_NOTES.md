# Static Export Configuration

This project is now configured for static site generation (SSG).

## Changes Made

1. **next.config.js**: Added `output: 'export'` to enable static export
2. **Removed `export const dynamic = 'force-dynamic'`** from all pages to allow static generation
3. **Images**: Set to `unoptimized: true` for static export compatibility
4. **API Route**: Moved to `app/api.disabled/` (API routes are not supported in static exports)

## Important Notes

### API Routes Limitation

⚠️ **API routes do NOT work in static exports.**

The `/api/chat` route has been moved to `app/api.disabled/chat/` and will not function in the static build. The chatbot component will:
- Show an error message when users try to use it in the static build
- Work normally in development mode (when API routes are available)
- To enable the chatbot in production, you'll need to:
  - Deploy with API route support (not static export), OR
  - Use a separate backend service for API calls

### Building Static Site

To build the static site:

```bash
npm run build
```

This will generate a `out/` directory with all static files that can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

### Deployment

The `out/` directory contains:
- All HTML files (pre-rendered)
- All JavaScript bundles
- All static assets (CSS, images, etc.)

Simply upload the contents of `out/` to your static hosting provider.

### Client-Side Features

All client-side features (localStorage, window, useEffect) will work normally after the page loads, as they run in the browser. The static export only affects the initial HTML generation.

