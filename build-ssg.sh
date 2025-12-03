#!/bin/bash

echo "🚀 Building SSG (Static Site Generation) Files..."
echo ""

# Step 1: Generate routes
echo "📝 Step 1: Generating routes..."
npm run generate-routes

if [ $? -ne 0 ]; then
    echo "❌ Error generating routes. Exiting."
    exit 1
fi

echo "✅ Routes generated"
echo ""

# Step 2: Build browser bundle
echo "🔨 Step 2: Building browser bundle..."
ng build --configuration production

if [ $? -ne 0 ]; then
    echo "❌ Error building browser bundle. Exiting."
    exit 1
fi

echo "✅ Browser bundle built"
echo ""

# Step 3: Build server bundle
echo "🔨 Step 3: Building server bundle..."
ng run wizbooking:server:production

if [ $? -ne 0 ]; then
    echo "❌ Error building server bundle. Exiting."
    exit 1
fi

echo "✅ Server bundle built"
echo ""

# Step 4: Run prerender
echo "🔨 Step 4: Running prerender (this generates static HTML files)..."
ng run wizbooking:prerender:production

if [ $? -ne 0 ]; then
    echo "❌ Error during prerender. Exiting."
    exit 1
fi

echo "✅ Prerender complete"
echo ""

# Step 5: Verify output
echo "📦 Verifying output..."
BROWSER_DIR="dist/wizbooking/browser"
HTML_COUNT=$(find "$BROWSER_DIR" -type f -name "*.html" 2>/dev/null | wc -l)

echo "📄 Found $HTML_COUNT HTML files in $BROWSER_DIR"
echo ""

if [ "$HTML_COUNT" -gt 1 ]; then
    echo "✅ SUCCESS! Static HTML files generated:"
    find "$BROWSER_DIR" -type f -name "*.html" | head -10
    echo ""
    echo "📋 All files are ready in: $BROWSER_DIR"
else
    echo "⚠️  WARNING: Only $HTML_COUNT HTML file(s) found"
    echo "   Expected multiple files for each route"
    echo ""
    echo "🔍 Checking routes.txt..."
    if [ -f "routes.txt" ]; then
        ROUTE_COUNT=$(wc -l < routes.txt)
        echo "   Routes in routes.txt: $ROUTE_COUNT"
    fi
fi

echo ""
echo "✅ Build process complete!"

