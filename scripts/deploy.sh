#!/bin/bash

# Deploy script for GitHub Pages
echo "🚀 Building for production..."

# Generate static files
npm run generate

# Create .nojekyll file for GitHub Pages
touch dist/.nojekyll

echo "✅ Build completed! Files are in the 'dist' directory."
echo "📁 You can now deploy the 'dist' folder to GitHub Pages."
echo ""
echo "To deploy:"
echo "1. Copy the contents of 'dist' folder to your GitHub Pages repository"
echo "2. Or push to the main branch if you have GitHub Actions set up"

