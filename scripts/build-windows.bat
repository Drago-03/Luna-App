@echo off
echo Building Luna AI Assistant for Windows...

:: Clean previous builds
if exist dist-electron rmdir /s /q dist-electron

:: Install dependencies
call npm install

:: Build and package
call npm run package:win

echo Build complete! Check dist-electron folder for the installer
pause