import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';

class LunaApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initApp();
    this.handleAppEvents();
  }

  private initApp() {
    app.whenReady().then(() => {
      this.createWindow();
      this.setupUpdater();
    });
  }

  private handleAppEvents() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    app.on('ready', () => {
      // Setup IPC handlers here
      ipcMain.handle('get-platform', () => process.platform);
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
      },
      // Window styling
      frame: false,
      transparent: true,
      backgroundColor: '#00ffffff'
    });

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupUpdater() {
    autoUpdater.on('update-available', () => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-available');
      }
    });

    autoUpdater.on('update-downloaded', () => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-downloaded');
      }
    });

    autoUpdater.on('error', (err) => {
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-error', err);
      }
    });

    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Initialize app
new LunaApp();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});