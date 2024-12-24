import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Type declarations for TypeScript
declare global {
  interface Window {
    electron: {
      platform: string;
      getVersion: () => string;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      onUpdateError: (callback: (error: Error) => void) => void;
      isDevMode: () => boolean;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
    luna: {
      ready: () => Promise<void>;
      speak: (text: string) => void;
      listen: () => void;
      stopListening: () => void;
    };
  }
}

// Expose Electron APIs
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('get-version'),
  onUpdateAvailable: (callback: () => void) => 
    ipcRenderer.on('update-available', callback),
  onUpdateDownloaded: (callback: () => void) => 
    ipcRenderer.on('update-downloaded', callback),
  onUpdateError: (callback: (event: IpcRendererEvent, error: Error) => void) => 
    ipcRenderer.on('update-error', (event, error) => callback(event, error)),
  isDevMode: () => process.env.NODE_ENV === 'development',
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
});

// Expose Luna-specific APIs
contextBridge.exposeInMainWorld('luna', {
  ready: () => ipcRenderer.invoke('luna-ready'),
  speak: (text: string) => ipcRenderer.send('luna-speak', text),
  listen: () => ipcRenderer.send('luna-listen'),
  stopListening: () => ipcRenderer.send('luna-stop-listening')
});

// Handle errors
window.addEventListener('error', (event) => {
  ipcRenderer.send('error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});