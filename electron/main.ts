import { app, BrowserWindow, Tray, ipcMain, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LunaApp {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private isListening: boolean = false;

  constructor() {
    this.initApp();
    this.handleAppEvents();
    this.createTray();
    this.setupGlobalShortcut();
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

  private createTray() {
    this.tray = new Tray(path.join(__dirname, '../build/icon.ico'));
    this.tray.setToolTip('Luna AI Assistant');
    this.tray.on('click', () => this.toggleAssistant());
  }

  private setupGlobalShortcut() {
    // Listen for "Hey Luna" wake word
    ipcMain.on('wake-word-detected', () => {
      this.showFloatingWindow();
    });
  }

  private toggleAssistant() {
    if (this.mainWindow && this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showFloatingWindow();
    }
  }

  private showFloatingWindow() {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    
    if (!this.mainWindow) {
      this.mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        x: width - 420,
        y: 40,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.js')
        }
      });
    }

    this.mainWindow.show();
    this.mainWindow.focus();
  }
}

// Initialize app
new LunaApp();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});