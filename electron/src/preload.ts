require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
console.log('User Preload!');

const { ipcRenderer, contextBridge} = require("electron");

contextBridge.exposeInMainWorld("valist", {
  getApps: (arg) => ipcRenderer.invoke("getApps", arg),
  launchApp: (arg) => ipcRenderer.invoke("launchApp", arg),
});