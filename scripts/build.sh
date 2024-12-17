#!/bin/bash

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

# Create installers
echo "📀 Creating installers..."

# Build for current platform
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Building Windows installer..."
    npm run package:win
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Building macOS installer..."
    npm run package:mac
else
    echo "🐧 Building Linux installer..."
    npm run package:linux
fi

echo "✅ Build complete! Installers available in dist-electron/"

# Generate checksums
echo "🔒 Generating checksums..."
cd dist-electron
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    certutil -hashfile "Luna AI Assistant Setup.exe" SHA256 > checksums.txt
else
    sha256sum * > checksums.txt
fi
cd ..

echo "🎉 All done! Check dist-electron/ for your installers"