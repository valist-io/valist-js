import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import { getCapacitorElectronConfig, setupElectronDeepLinking } from '@capacitor-community/electron';
import { ipcMain, MenuItemConstructorOptions } from 'electron';
import { app, MenuItem } from 'electron';
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';
// import { autoUpdater } from 'electron-updater';

import { ElectronCapacitorApp, setupContentSecurityPolicy, setupReloadWatcher } from './setup';

import path from 'path';
import os from 'os';
import fs from "fs";
import axios from 'axios';

import { execCommand, getInstallPath } from './install/install';

// Graceful handling of unhandled errors.
unhandled();

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: 'Quit App', role: 'quit' })];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
  { role: 'viewMenu' },
];

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? 'mycapacitorapp',
  });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp);
}

// Run Application
(async () => {
  // Wait for electron app to be ready.
  await app.whenReady();
  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  setupContentSecurityPolicy(myCapacitorApp.getCustomURLScheme());
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init();
  // Check for updates if we are in a packaged app.
  // autoUpdater.checkForUpdatesAndNotify();
})();

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When the dock icon is clicked.
app.on('activate', async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init();
  }
});

const valistDir = path.join(os.homedir(), '.valist', 'apps');
const libraryFile = path.join(valistDir, 'library.json');

type ProjectType = "native" | "web";
type Library = {
  [key: string]: {
    name: string,
    version: string,
    type: ProjectType,
    path: string,
  },
};

async function readLibrary(): Promise<Library> {
  try {
    const data = await fs.promises.readFile(libraryFile, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code == "ENOENT") {
      return {};
    } else {
      throw e;
    }
  }
}

async function writeLibrary(library: Library) {
  await fs.promises.writeFile(libraryFile, JSON.stringify(library));
}

// Place all ipc or other electron api calls and custom functionality under this line
ipcMain.handle("getApps", async () => {
  return await readLibrary();
});

interface InstallArgs {
  projectID: string,
  name: string,
  version: string,
  type: ProjectType,
  release: {
    external_url: string,
    install: any,
  },
}

ipcMain.handle("install", async (event, args: InstallArgs) => {
  if (!args.release.external_url) {
    return Error('invalid release url');
  }

  await fs.promises.mkdir(valistDir, { recursive: true });

  let filePath = args.release.external_url;
  if (args.type == "native") {
    if (!args.release.install) {
      return Error('package is not installable');
    }

    const artifactName = getInstallPath(args.release.install);
    if (!artifactName) {
      console.log(`this project supports the following: ${Object.keys(args.release.install).toString().replace('name,', '')}`);
      return Error(`unsupported platform/arch: ${process.platform}/${process.arch}`);
    }

    const resp = await axios({
      method: "get",
      url: `${args.release.external_url}/${artifactName}`,
      responseType: "stream",
    });
    const readStream = resp.data;
    const downloadSize = parseFloat(resp.headers["content-length"]);

    filePath = path.join(valistDir, artifactName);

    const writeStream = fs.createWriteStream(filePath, { flags: 'w' });
    let downloadCurrent = 0;
    readStream.on("data", chunk => {
      downloadCurrent += chunk.length;
      const progress = downloadCurrent / downloadSize;
      event.sender.send("install-progress", progress);
    });
    readStream.pipe(writeStream);
    await new Promise(resolve => {
      readStream.on('end', resolve);
    });

    await fs.promises.chmod(filePath, 755);
  }

  const library = await readLibrary();
  library[args.projectID] = {
    name: args.name,
    version: args.version,
    type: args.type,
    path: filePath,
  };
  await writeLibrary(library);

  return 'Successfully installed!';
});


ipcMain.handle("launchApp", async (event, projectId: string) => {
  const library = await readLibrary();

  const execPath = library[projectId].path;
  console.log("execPath", execPath);

  execCommand(execPath);
  return execPath;
});

ipcMain.handle("uninstall", async (event, args) => {
  const valistDir = path.join(os.homedir(), '.valist', 'apps');
  const libraryJSONPath = path.join(valistDir, 'library.json');
  const data = await fs.promises.readFile(libraryJSONPath, 'utf-8');

  var appsObject = JSON.parse(data);
  if (appsObject[args]) delete appsObject[args];

  fs.writeFile(libraryJSONPath, JSON.stringify(appsObject), 'utf-8', function (err) {
    if (err) throw err;
  });
});