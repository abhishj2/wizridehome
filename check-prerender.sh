#!/bin/bash

echo "🔍 Checking Prerender Output..."
echo ""

BROWSER_DIR="dist/wizbooking/browser"

if [ ! -d "$BROWSER_DIR" ]; then
    echo "❌ Browser directory not found: $BROWSER_DIR"
    echo "   Run 'npm run build:production' first"
    exit 1
fi

echo "📁 Checking files in: $BROWSER_DIR"
echo ""

# Count HTML files
HTML_COUNT=$(find "$BROWSER_DIR" -type f -name "*.html" 2>/dev/null | wc -l)
echo "📄 Total HTML files found: $HTML_COUNT"
echo ""

if [ "$HTML_COUNT" -eq 1 ]; then
    echo "⚠️  Only index.html found - Prerender may not have run!"
    echo ""
    echo "🔧 Try running prerender separately:"
    echo "   ng run wizbooking:prerender:production"
    echo ""
else
    echo "✅ Multiple HTML files found - Prerender appears to have worked!"
    echo ""
    echo "📋 Sample HTML files:"
    find "$BROWSER_DIR" -type f -name "*.html" | head -10
fi

echo ""
echo "📊 Directory structure:"
ls -la "$BROWSER_DIR" | head -20

