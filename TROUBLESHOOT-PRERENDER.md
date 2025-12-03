# Troubleshooting Prerender Not Generating HTML Files

## Problem
After running `ng run wizbooking:prerender:production`, only `index.html` is generated, not route-specific HTML files.

## Step 1: Verify Current State

On your VPS, run:

```bash
# Check how many HTML files exist
find dist/wizbooking/browser -name "*.html" | wc -l

# If it shows 1, prerender didn't work
```

## Step 2: Check Prerequisites

```bash
# 1. Verify routes.txt exists and has content
cat routes.txt | wc -l
head -10 routes.txt

# 2. Verify server bundle exists
ls -la dist/wizbooking/server/

# 3. Verify browser bundle exists
ls -la dist/wizbooking/browser/
```

## Step 3: Try Alternative Prerender Approach

If the separate prerender builder isn't working, try using the integrated approach:

### Option A: Use build with prerender flag (Angular 17+)

```bash
# Generate routes first
npm run generate-routes

# Build with prerender
ng build --configuration production --prerender
```

### Option B: Manual prerender with verbose output

```bash
# Run prerender with verbose logging
ng run wizbooking:prerender:production --verbose

# Or check for errors
ng run wizbooking:prerender:production 2>&1 | tee prerender.log
```

## Step 4: Check routes.txt Format

Ensure `routes.txt` has:
- One route per line
- Routes start with `/`
- No trailing slashes (except root `/`)
- No empty lines

Example:
```
/
/aboutcompany
/destinations/gangtok
```

## Step 5: Verify Angular Version Compatibility

```bash
ng version
```

For Angular 17, the prerender builder should work. If issues persist:

1. **Try updating Angular CLI:**
   ```bash
   npm install -g @angular/cli@latest
   ```

2. **Check if @angular/ssr is installed:**
   ```bash
   npm list @angular/ssr
   ```

   If not installed:
   ```bash
   ng add @angular/ssr
   ```

## Step 6: Alternative - Use Static Routes Array

If `routesFile` isn't working, try using `routes` array directly in `angular.json`:

```json
"prerender": {
  "builder": "@angular-devkit/build-angular:prerender",
  "options": {
    "browserTarget": "wizbooking:build:production",
    "serverTarget": "wizbooking:server:production",
    "routes": ["/", "/aboutcompany", "/destinations/gangtok"]
  }
}
```

## Step 7: Check for Runtime Errors

Prerender might be failing silently due to runtime errors. Check:

1. **Console errors during prerender**
2. **API calls that fail during SSR** (prerender runs in Node.js, not browser)
3. **Browser-only APIs** (window, document, localStorage) used in components

## Step 8: Test with Minimal Routes

Create a test `routes-test.txt` with just:
```
/
/aboutcompany
```

Then run:
```bash
ng run wizbooking:prerender:production --routesFile=routes-test.txt
```

## Expected Output

When prerender works correctly, you should see:
- Messages like "Prerendering route /aboutcompany..."
- Multiple HTML files in `dist/wizbooking/browser/`
- One HTML file per route (in subdirectories for nested routes)

## Quick Fix Command

Try this complete rebuild:

```bash
# Clean previous builds
rm -rf dist/

# Generate routes
npm run generate-routes

# Build everything fresh
npm run build:production

# Verify
find dist/wizbooking/browser -name "*.html" | wc -l
```

If still only 1 file, check the prerender output for errors.

