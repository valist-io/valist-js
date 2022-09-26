declare global {
  interface Window {
    electron: any;
  }
}

export type AppConfig = {
  projectID: string;
  version: string;
  type: string;
  path: string;
}

export interface Client {
  getApps: () => Promise<AppConfig[]>;
  launch: (id: string) => Promise<void>;
  install: (config: AppConfig) => Promise<void>;
  uninstall: (id: string) => Promise<void>;
}

export class SapphireClient {
  async getApps() {
    return await window?.electron?.getApps();
  }

  async launch(id: string) {
    await window?.electron?.launch(id);
  }

  async install(config: AppConfig) {
    await window?.electron?.install(config);
  }

  async uninstall(id: string) {
    await window?.electron?.uninstall(id);
  }
}

export class DefaultClient {
  async getApps() { 
    return []; 
  }
  
  async launch(id: string) {
    // do nothing
  }
  
  async install(config: AppConfig) {
    // do nothing
  }
  
  async uninstall(id: string) {
    // do nothing
  }
}

export const setupEvents = () => {
  window?.electron?.onInstallProgress((event: any, progress: number) => {
    // TODO notification
  });
};

export const isElectron = () => {
  return typeof window.electron !== "undefined";
};