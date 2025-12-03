#!/bin/bash

echo "🔍 Verifying Prerender Output..."
echo ""

BROWSER_DIR="dist/wizbooking/browser"

if [ ! -d "$BROWSER_DIR" ]; then
    echo "❌ Browser directory not found: $BROWSER_DIR"
    exit 1
fi

echo "📁 Checking files in: $BROWSER_DIR"
echo ""

# Count HTML files
HTML_COUNT=$(find "$BROWSER_DIR" -type f -name "*.html" 2>/dev/null | wc -l)
echo "📄 Total HTML files found: $HTML_COUNT"
echo ""

if [ "$HTML_COUNT" -eq 1 ]; then
    echo "❌ PROBLEM: Only index.html found!"
    echo "   Prerender did NOT generate route-specific HTML files"
    echo ""
    echo "🔍 Troubleshooting steps:"
    echo ""
    echo "1. Check if routes.txt exists:"
    if [ -f "routes.txt" ]; then
        ROUTE_COUNT=$(wc -l < routes.txt)
        echo "   ✅ routes.txt exists with $ROUTE_COUNT routes"
        echo "   First 5 routes:"
        head -5 routes.txt | sed 's/^/      /'
    else
        echo "   ❌ routes.txt NOT FOUND!"
        echo "   Run: npm run generate-routes"
    fi
    echo ""
    echo "2. Check server bundle:"
    if [ -d "dist/wizbooking/server" ]; then
        echo "   ✅ Server bundle exists"
        ls -lh dist/wizbooking/server/ | head -5
    else
        echo "   ❌ Server bundle NOT FOUND!"
        echo "   Run: ng run wizbooking:server:production"
    fi
    echo ""
    echo "3. Try running prerender with verbose output:"
    echo "   ng run wizbooking:prerender:production --verbose"
    echo ""
else
    echo "✅ SUCCESS! Multiple HTML files found - Prerender worked!"
    echo ""
    echo "📋 Sample HTML files:"
    find "$BROWSER_DIR" -type f -name "*.html" | head -10 | sed 's/^/   /'
    echo ""
    echo "📊 Total: $HTML_COUNT HTML files generated"
fi

echo ""
echo "📂 Directory structure:"
ls -la "$BROWSER_DIR" | head -15

