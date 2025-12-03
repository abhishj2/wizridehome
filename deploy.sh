#!/bin/bash

echo "🚀 Starting SSG Deployment Process..."
echo ""

# Step 1: Generate routes
echo "📝 Step 1: Generating routes..."
npm run generate-routes

if [ $? -ne 0 ]; then
    echo "❌ Error generating routes. Exiting."
    exit 1
fi

echo "✅ Routes generated successfully"
echo ""

# Step 2: Build SSG files
echo "🔨 Step 2: Building SSG files..."
npm run build:ssg

if [ $? -ne 0 ]; then
    echo "❌ Error building SSG files. Exiting."
    exit 1
fi

echo "✅ SSG build complete!"
echo ""

# Step 3: Show output location
echo "📦 Build Output Location:"
echo "   dist/wizbooking/browser/"
echo ""

# Step 4: Count generated files
FILE_COUNT=$(find dist/wizbooking/browser -type f -name "*.html" | wc -l)
echo "📄 Generated $FILE_COUNT HTML files"
echo ""

echo "✅ Deployment build complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Copy files from 'dist/wizbooking/browser/' to your web server"
echo "   2. Configure your web server (nginx/Apache) to serve these files"
echo "   3. Ensure your server is configured for Angular routing (see DEPLOYMENT.md)"
echo ""
echo "🌐 To test locally, run: npm run serve:ssg"

