export type AppConfig = {
  "projectID": string;
  "version": string;
  "type": string;
  "path": string;
}

export const launchApp = async (appConfig: AppConfig) => {
  console.log('clicked with config', appConfig);
  if (appConfig.type === 'native') {
    const resp  = await window.valist.launchApp(appConfig.path);
    console.log('response', resp);
  } else if (appConfig.type === 'web') {
    window.open(appConfig.path);
  }
};