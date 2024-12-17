@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting build process...

:: Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

:: Build React app
echo 🔨 Building React app...
call npm run build

:: Create installers
echo 📀 Creating installers...

:: Windows
echo 🪟 Building Windows installer...
call npm run package:win

:: Linux
echo 🐧 Building Linux installer...
call npm run package:linux

:: Generate checksums
echo 🔒 Generating checksums...
cd dist-electron
certutil -hashfile "Luna AI Assistant Setup.exe" SHA256 > checksums.txt
cd ..

echo 🎉 All done! Check dist-electron/ for your installers

pause