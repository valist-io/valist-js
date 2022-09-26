import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

type Request = { method: string, params?: Array<any> };

contextBridge.exposeInMainWorld('ethereum', {
  request: (request: Request) => {
    return ipcRenderer.invoke('eth:request', request);
  },

  send: (request: Request, callback: (error: null | Error, result: any) => void) => {
    ipcRenderer.invoke('eth:request', request)
      .catch(error => callback(error, null))
      .then(result => callback(null, { result }));
  },

  // on: (eventName: string, listener: Listener) => {
  //   ipcRenderer.on(`eth:${eventName}`, listener);
  // },

  // removeListener: (eventName: string, listener: Listener) => {
  //   ipcRenderer.removeListener(`eth:${eventName}`, listener);
  // },
});