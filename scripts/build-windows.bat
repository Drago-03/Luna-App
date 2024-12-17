@echo off
setlocal enabledelayedexpansion

echo Building Luna AI Assistant...

:: Clean previous builds
if exist dist-electron rmdir /s /q dist-electron
if exist dist rmdir /s /q dist

:: Install dependencies
call npm install

:: Build app
call npm run build

:: Create Windows installer
call npm run package:win

echo Build complete! Check dist-electron folder
pause