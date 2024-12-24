import { app, BrowserWindow } from 'electron';
import path from 'path';

class LunaApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initApp();
  }

  private initApp() {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupUpdater();
    });
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
  }

  private setupUpdater() {
    // Implement auto-updater logic here
  }
}

new LunaApp();