import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { Wallet } from './wallet';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:3000');
};

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  const windows = BrowserWindow.getAllWindows();
  if (app.isReady() && windows.length === 0) createWindow();
});

const wallet = new Wallet();

ipcMain.handle('eth:request', (event, params) => wallet.request(params));