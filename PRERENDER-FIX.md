# Fix: Prerender Not Running

## Problem
The build completes but only generates `index.html`, not route-specific HTML files. This means the **prerender step didn't run**.

## Solution

After your build completes, you need to **explicitly run the prerender step**:

```bash
# Run prerender to generate static HTML files for all routes
ng run wizbooking:prerender:production
```

## Complete Build Process

Run this **complete command** on your VPS:

```bash
npm run build:production
```

This will:
1. ✅ Generate routes.txt
2. ✅ Build browser bundle
3. ✅ Build server bundle  
4. ✅ **Run prerender** (generates static HTML files)

## Verify Prerender Ran

After running the build, check if prerender generated files:

```bash
# Count HTML files (should be > 1)
find dist/wizbooking/browser -name "*.html" | wc -l

# List all HTML files
find dist/wizbooking/browser -name "*.html"
```

**Expected output:**
- `dist/wizbooking/browser/index.html`
- `dist/wizbooking/browser/aboutcompany/index.html`
- `dist/wizbooking/browser/destinations/gangtok/index.html`
- ... (one HTML file per route in routes.txt)

## If Prerender Still Doesn't Run

1. **Check routes.txt exists:**
   ```bash
   ls -la routes.txt
   cat routes.txt | head -10
   ```

2. **Run prerender manually:**
   ```bash
   ng run wizbooking:prerender:production
   ```

3. **Check for errors** in the prerender output

4. **Verify angular.json configuration:**
   - Prerender builder should be configured
   - `routesFile: "routes.txt"` should be set

## Quick Test

```bash
# 1. Generate routes
npm run generate-routes

# 2. Build everything including prerender
npm run build:production

# 3. Verify output
find dist/wizbooking/browser -name "*.html" | wc -l
```

If the count is > 1, prerender worked! ✅

