import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type Request = { method: string, params?: Array<any> };
type Callback = (error: null | Error, result: any) => void;
type Listener = (...args: any[]) => void;

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
    ipcRenderer.on(eventName, (event, args) => listener(args));
  },

  removeListener: (eventName: string, listener: Listener) => {
    ipcRenderer.removeListener(eventName, (event, args) => listener(args));
  },
});

contextBridge.exposeInMainWorld('sapphire', {
  request: (request: Request) => {
    return ipcRenderer.invoke(request.method, request.params);
  },

  on: (eventName: string, listener: Listener) => {
    ipcRenderer.on(eventName, (event, args) => listener(args));
  },

  removeListener: (eventName: string, listener: Listener) => {
    ipcRenderer.removeListener(eventName, (event, args) => listener(args));
  },
});