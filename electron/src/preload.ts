require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getApps: (arg) => ipcRenderer.invoke("getApps", arg),
  install: (arg) => ipcRenderer.invoke("install", arg),
  onInstallProgress: (callback) => ipcRenderer.on("install-progress", callback),
  uninstall: (arg) => ipcRenderer.invoke("uninstall", arg),
  launch: (arg) => ipcRenderer.invoke("launch", arg),
});
