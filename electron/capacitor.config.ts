import { CapacitorElectronConfig } from '@capacitor-community/electron';

const config: CapacitorElectronConfig = {
  appId: 'io.valist.app',
  appName: 'Valist',
  webDir: 'packages/valist-web/out',
  bundledWebRuntime: false,
  electron: {
    appId: 'io.valist.app',
    appName: 'Valist',
  }
};

export default config;