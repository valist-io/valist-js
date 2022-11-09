import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import EventEmitter from 'events';

type Request = { method: string, params?: Array<any> };
type Callback = (error: null | Error, result: any) => void;
type Listener = (...args: any[]) => void;

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(0);

ipcRenderer.on('accountsChanged', (event, args) => eventEmitter.emit('accountsChanged', args));
ipcRenderer.on('installStarted', (event, args) => eventEmitter.emit('installStarted', args));
ipcRenderer.on('installSuccess', (event, args) => eventEmitter.emit('installSuccess', args));
ipcRenderer.on('installFailed', (event, args) => eventEmitter.emit('installFailed', args));
ipcRenderer.on('uninstallSuccess', (event, args) => eventEmitter.emit('uninstallSuccess', args));
ipcRenderer.on('uninstallFailed', (event, args) => eventEmitter.emit('uninstallFailed', args));
ipcRenderer.on('openWallet', (event, args) => eventEmitter.emit('openWallet', args));
ipcRenderer.on('hideWallet', (event, args) => eventEmitter.emit('hideWallet', args));

contextBridge.exposeInMainWorld('ethereum', {
  send: (request: Request, callback: Callback) => {
    ipcRenderer.invoke(request.method, request.params)
      .catch(error => callback(error, null))
      .then(result => callback(null, { result }));
  },
  
  request: (request: Request) => {
    return ipcRenderer.invoke(request.method, request.params);
  },

  on: (eventName: string, listener: Listener) => {
    eventEmitter.on(eventName, listener);
  },

  removeListener: (eventName: string, listener: Listener) => {
    eventEmitter.removeListener(eventName, listener);
  },
});

contextBridge.exposeInMainWorld('sapphire', {
  request: (request: Request) => {
    return ipcRenderer.invoke(request.method, request.params);
  },

  on: (eventName: string, listener: Listener) => {
    eventEmitter.on(eventName, listener);
  },

  removeListener: (eventName: string, listener: Listener) => {
    eventEmitter.removeListener(eventName, listener);
  },
});