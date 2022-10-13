declare global {
  interface Window {
    sapphire: any;
  }
}

export interface Client {
  listApps: () => Promise<string[]>;
  launch: (id: string) => Promise<void>;
  install: (id: string) => Promise<void>;
  uninstall: (id: string) => Promise<void>;
}

export class SapphireClient {
  async listApps() {
    return await window?.sapphire?.request({ method: 'sapphire_listApps' });
  }

  async launch(id: string) {
    await window?.sapphire?.request({ method: 'sapphire_launch', params: [id] });
  }

  async install(id: string) {
    await window?.sapphire?.request({ method: 'sapphire_install', params: [id] });
  }

  async uninstall(id: string) {
    await window?.sapphire?.request({ method: 'sapphire_uninstall', params: [id] });
  }
}

export class DefaultClient {
  async listApps() { 
    return []; 
  }
  
  async launch(id: string) {
    // do nothing
  }
  
  async install(id: string) {
    // do nothing
  }
  
  async uninstall(id: string) {
    // do nothing
  }
}

export const isSapphire = () => {
  return typeof window.sapphire !== "undefined";
};