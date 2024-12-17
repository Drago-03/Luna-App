#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist dist-electron

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build React app
echo "🔨 Building React app..."
npm run build

# Build installers for all platforms
echo "📀 Creating installers..."

# Windows
echo "🪟 Building Windows installer..."
npm run package:win

# macOS (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "🍎 Building macOS installer..."
  npm run package:mac
fi

# Linux
echo "🐧 Building Linux installer..."
npm run package:linux

echo "✅ Build complete! Installers available in dist-electron/"

# Optional: Generate checksums
echo "🔒 Generating checksums..."
cd dist-electron
sha256sum * > checksums.txt
cd ..

echo "🎉 All done! Check dist-electron/ for your installers"