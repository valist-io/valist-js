require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("valist", {
  getApps: (arg) => ipcRenderer.invoke("getApps", arg),
  install: (arg) => ipcRenderer.invoke("install", arg),
  onInstallProgress: (callback) => ipcRenderer.on("install-progress", callback),
  uninstall: (arg) => ipcRenderer.invoke("uninstall", arg),
  launchApp: (arg) => ipcRenderer.invoke("launchApp", arg),
});
