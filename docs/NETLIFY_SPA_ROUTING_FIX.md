# Netlify SPA Routing Fix

## Problem
When performing a hard refresh (Ctrl+Shift+R) or directly navigating to client-side routes like `/career/collection`, Netlify returned a 404 error.

## Root Cause
Netlify's server looks for physical files at the requested path. Since React Router handles routing client-side, these paths don't exist as physical files on the server, causing 404 errors.

## Solution
Added `packages/web/public/_redirects` file with SPA fallback configuration:

```
/*    /index.html   200
```

This tells Netlify to:
1. Serve `index.html` for ALL routes (`/*`)
2. Return a 200 status (not a redirect)
3. Let React Router handle the routing client-side

## How It Works

### Before (404 Error):
1. User navigates to `pathcte.com/career/collection`
2. Netlify looks for `/career/collection/index.html` file
3. File doesn't exist → 404 error

### After (Working):
1. User navigates to `pathcte.com/career/collection`
2. Netlify matches `/*` redirect rule
3. Serves `index.html` with 200 status
4. React app loads
5. React Router sees `/career/collection` route
6. Renders correct component ✅

## Files Modified
- **Added:** `packages/web/public/_redirects`

## Testing
After deployment, test by:
1. Navigate to any route (e.g., `/career/collection`)
2. Press Ctrl+Shift+R (hard refresh)
3. Page should load correctly without 404 error

## References
- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [SPA Routing Best Practices](https://docs.netlify.com/routing/redirects/redirect-options/#history-pushstate-and-single-page-apps)
