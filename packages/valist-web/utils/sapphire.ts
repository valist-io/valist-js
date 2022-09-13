
declare global {
  interface Window {
    valist: any;
  }
}

export type AppConfig = {
  projectID: string;
  version: string;
  type: string;
  path: string;
}

export async function getApps(): Promise<AppConfig[]> {
  return await window.valist.getApps();  
}

export async function launchApp(appConfig: AppConfig) {
  if (appConfig.type === 'executable') {
    await window.valist.launchApp(appConfig.path);
  } else if (appConfig.type === 'web') {
    window.open(appConfig.path);
  }
};

export const uninstallApp = async (appName: string) => {
  const resp = await window.valist.uninstall(appName);
  alert(resp);
};

export const installApp = async (name: string, release: any, projectID: string) => {
  const resp = await window.valist.install({ name, release, projectID });
  alert(resp);  
}