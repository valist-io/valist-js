export interface Client {
  launch: (id: string) => Promise<void>;
  install: (id: string) => Promise<void>;
  uninstall: (id: string) => Promise<void>;
  
  listInstalled: () => Promise<string[]>;
  listDownloads: () => Promise<string[]>;

  on: (eventName: string, listener: Function) => void;
  removeListener: (eventName: string, listener: Function) => void;
}

export class SapphireClient {
  async launch(id: string) {
    await window?.sapphire?.request({ method: 'sapphire_launch', params: [id] });
  }

  async install(id: string) {
    await window?.sapphire?.request({ method: 'sapphire_install', params: [id] });
  }

  async uninstall(id: string) {
    await window?.sapphire?.request({ method: 'sapphire_uninstall', params: [id] });
  }

  async listInstalled() {
    return await window?.sapphire?.request({ method: 'sapphire_listInstalled' });
  }

  async listDownloads() {
    return await window?.sapphire?.request({ method: 'sapphire_listDownloads' });
  }

  on(eventName: string, listener: Function) {
    window?.sapphire?.on(eventName, listener);
  }

  removeListener(eventName: string, listener: Function) {
    window?.sapphire?.removeListener(eventName, listener);
  }
}

export class DefaultClient {
  async launch(id: string) {
    // do nothing
  }
  
  async install(id: string) {
    // do nothing
  }
  
  async uninstall(id: string) {
    // do nothing
  }

  async listInstalled() { 
    return []; 
  }

  async listDownloads() {
    return [];
  }

  on(eventName: string, listener: Function) {
    // do nothing
  }

  removeListener(eventName: string, listener: Function) {
    // do nothing
  }
}
