import { app, BrowserWindow, ipcMain } from 'electron';
import { createReadOnly } from '@valist/sdk';
import { createController } from 'ipfsd-ctl';
import serveNextAt from 'next-electron-server';
import { ethers } from 'ethers';
import keytar from 'keytar';
import tar from 'tar';

import fs from 'fs';
import os from 'os';
import path from 'path';
import EventEmitter from 'events';

import * as utils from './utils';

//////////////////////
/// Electron Setup ///
//////////////////////

serveNextAt('next://app');

const baseURL = app.isPackaged 
  ? 'next://app'
  : 'http://localhost:3000';

const providerURL = app.isPackaged
  ? 'https://rpc.valist.io'
  : 'https://rpc.valist.io/mumbai';

const chainId = app.isPackaged 
  ? 137
  : 80001;

let mainWindow: BrowserWindow;
let walletWindow: BrowserWindow;
let signingWindow: BrowserWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(baseURL);
  mainWindow.once('closed', () => { mainWindow = undefined });
};

const createWalletWindow = () => {
  walletWindow = new BrowserWindow({
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  walletWindow.loadURL(`${baseURL}/-/wallet`);
  walletWindow.once('closed', () => { walletWindow = undefined });
};

const createSigningWindow = () => {
  if (!walletWindow) createWalletWindow();

  signingWindow = new BrowserWindow({
    parent: walletWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  signingWindow.loadURL(`${baseURL}/-/wallet/sign`);
  signingWindow.once('closed', () => { signingWindow = undefined });
};

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (app.isReady() && !mainWindow) createMainWindow();
});

//////////////////
/// IPFS Setup ///
//////////////////

const libraryDir = path.join(os.homedir(), '.valist', 'apps');
const downloads = new Set<string>();

let ipfs: any;

const createIPFS = async () => {
  // TODO find a better spot for this
  await fs.promises.mkdir(libraryDir, { recursive: true });

  ipfs = await createController({
    ipfsHttpModule: require('ipfs-http-client'),
    ipfsBin: require('go-ipfs').path(),
    remote: false,
    disposable: false,
    test: false,
  });

  if (!ipfs.initialized) await ipfs.init();
  if (!ipfs.started) await ipfs.start();
};

app.on('quit', async () => {
  await ipfs?.stop();
});

app.whenReady().then(() => {
  createIPFS();
});

const launch = async (id: string) => {
  if (!ipfs || !valist) {
    throw new Error('not initialized');
  }

  const meta = await valist.getReleaseMeta(id);
  if (!meta.external_url) {
    throw new Error('invalid release url');
  }

  const platformArch = utils.getPlatformArch();
  const artifactPath = meta.install?.[platformArch];
  if (!artifactPath) {
    throw new Error(`unsupported platform/arch: ${platformArch}`);
  }

  const execPath = path.join(libraryDir, id, artifactPath);
  return utils.execCommand(execPath);
}

const install = async (id: string) => {
  if (!ipfs || !valist) {
    throw new Error('not initialized');
  }

  const meta = await valist.getReleaseMeta(id);
  if (!meta.external_url) {
    throw new Error('invalid release url');
  }

  const platformArch = utils.getPlatformArch();
  const artifactPath = meta.install?.[platformArch];
  if (!artifactPath) {
    throw new Error(`unsupported platform/arch: ${platformArch}`);
  }

  const downloadDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'valist-'));
  const downloadPath = path.join(downloadDir, 'download');

  const ipfsIndex = meta.external_url.indexOf('/ipfs/');
  const ipfsPath = meta.external_url.slice(ipfsIndex);

  const file = await fs.promises.open(downloadPath, 'w+');
  for await (const chunk of ipfs.api.get(`${ipfsPath}/${artifactPath}`)) {
    await file.write(chunk);
  }

  const extractPath = path.join(libraryDir, id);
  await fs.promises.mkdir(extractPath, { recursive: true });
  await tar.x({ C: extractPath, file: downloadPath });

  const binPath = path.join(extractPath, artifactPath);
  await fs.promises.chmod(binPath, 755);
};

//////////////////
/// Web3 Setup ///
//////////////////

interface SigningRequest {
  type: 'eth_signTypedData_v4' | 'eth_signTransaction';
  data: any;
}

const walletEvents = new EventEmitter();
const signingQueue = new Array<SigningRequest>();

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const valist = createReadOnly(provider, { chainId });

let wallet: ethers.Wallet;

let incomingId = 0;
let outgoingId = 0;

const switchAccount = async (account: string) => {
  const privateKey = await keytar.getPassword('VALIST', account);
  wallet = new ethers.Wallet(privateKey, provider);
  walletEvents.emit('accountsChanged', [account]);
  mainWindow?.webContents.send('accountsChanged', [account]);
};

const enqueueSigningRequest = async (request: SigningRequest) => {
  signingQueue.push(request);
  if (!signingWindow) createSigningWindow();

  const requestId = incomingId++;
  const rejectEvent = `signingRejected_${requestId}`;
  const approveEvent = `signingApproved_${requestId}`;

  return new Promise<void>((resolve, reject) => {
    walletEvents.once(rejectEvent, () => reject('User rejected signing'));
    walletEvents.once(approveEvent, () => resolve());
  });
};

const dequeueSigningRequest = () => {
  signingQueue.shift();
  if (signingQueue.length === 0) signingWindow?.close();
  return outgoingId++;
};

/////////////////////////
/// Ethereum Handlers ///
/////////////////////////

ipcMain.handle('eth_accounts', async (event, params) => {
  return wallet ? [wallet.address] : [];
});

ipcMain.handle('eth_requestAccounts', async (event, params) => {
  if (wallet) return [wallet.address];
  if (!walletWindow) createWalletWindow();

  return await new Promise((resolve, reject) => {
    walletEvents.once('accountsChanged', resolve);
  });
});

ipcMain.handle('net_version', async (event, params) => {
  const network = await provider.getNetwork();
  return network.chainId;
});

ipcMain.handle('eth_chainId', async (event, params) => {
  const network = await provider.getNetwork();
  return network.chainId;
});

ipcMain.handle('eth_call', async (event, params) => {
  const [tx, blockTag] = params;
  const call = { ...tx, gasLimit: tx.gas };
  return await provider.call(call, blockTag);
});

ipcMain.handle('eth_getBalance', async (event, params) => {
  const [address, blockTag] = params;
  const balance = await provider.getBalance(address, blockTag);
  return balance.toHexString();
});

ipcMain.handle('eth_blockNumber', async (event, params) => {
  return await provider.getBlockNumber();
});

ipcMain.handle('eth_getTransactionCount', async (event, params) => {
  const [address, blockTag] = params;
  return await provider.getTransactionCount(address, blockTag);
});

ipcMain.handle('eth_signTypedData_v4', async (event, params) => {
  const [address, payload] = params;
  await enqueueSigningRequest({ type: 'eth_signTypedData_v4', data: payload });

  const { domain, types, message } = JSON.parse(payload);
  delete types['EIP712Domain']; // required for signing
  return await wallet._signTypedData(domain, types, message);
});

ipcMain.handle('eth_sendTransaction', async (event, params) => {
  const [payload] = params;
  await enqueueSigningRequest({ type: 'eth_signTransaction', data: payload });

  const tx = { ...payload, gasLimit: payload.gas };
  delete tx.gas;

  const { hash } = await wallet.sendTransaction(tx);
  return hash;
});

ipcMain.handle('eth_gasPrice', async (event, params) => {
  const gasPrice = await provider.getGasPrice();
  return gasPrice.toHexString();
});

ipcMain.handle('eth_getLogs', async (event, params) => {
  const [filter] = params;
  return await provider.getLogs(filter);
});

ipcMain.handle('eth_estimateGas', async (event, params) => {
  const [tx] = params;
  const gasLimit = await provider.estimateGas(tx);
  return gasLimit.toHexString();
});

ipcMain.handle('eth_getBlockByNumber', async (event, params) => {
  const [blockNumber, includeTx] = params;
  const block = includeTx
    ? await provider.getBlockWithTransactions(blockNumber)
    : await provider.getBlock(blockNumber);
  return utils.formatBlock(block);
});

ipcMain.handle('eth_getTransactionReceipt', async (event, params) => {
  const [hash] = params;
  const rcpt = await provider.getTransactionReceipt(hash);
  return utils.formatReceipt(rcpt);
});

ipcMain.handle('eth_getTransactionByHash', async (event, params) => {
  const [hash] = params;
  const tx = await provider.getTransaction(hash);
  return utils.formatTransaction(tx);
});

///////////////////////
/// Wallet Handlers ///
///////////////////////

ipcMain.handle('wallet_switchEthereumChain', async (event, params) => {
  return null;
});

ipcMain.handle('wallet_switchAccount', async (event, params) => {
  const [account] = params;
  await switchAccount(account);
});

ipcMain.handle('wallet_approveSigning', async (event, params) => {
  const requestId = dequeueSigningRequest();
  walletEvents.emit(`signingApproved_${requestId}`);
});

ipcMain.handle('wallet_rejectSigning', async (event, params) => {
  const requestId = dequeueSigningRequest();
  walletEvents.emit(`signingRejected_${requestId}`);
});

ipcMain.handle('wallet_signingRequest', async (event, params) => {
  if (signingQueue.length === 0) return;
  return signingQueue[0];
});

ipcMain.handle('wallet_listAccounts', async (event, params) => {
  const credentials = await keytar.findCredentials('VALIST');
  return credentials.map(c => c.account);
});

/////////////////////////
/// Sapphire Handlers ///
/////////////////////////

ipcMain.handle('sapphire_install', async (event, params) => {
  const [id] = params;
  if (downloads.has(id)) throw new Error('download in progress');

  downloads.add(id);
  mainWindow?.webContents.send('installStarted', id);

  install(id)
    .then(() => mainWindow?.webContents.send('installSuccess', id))
    .catch(err => mainWindow?.webContents.send('installFailed', id))
    .finally(() => downloads.delete(id));
});

ipcMain.handle('sapphire_uninstall', async (event, params) => {
  const [id] = params;
  const installPath = path.join(libraryDir, id);
  
  fs.promises.rm(installPath, { recursive: true, force: true })
    .then(() => mainWindow?.webContents.send('uninstallSuccess', id))
    .catch(err => mainWindow?.webContents.send('uninstallFailed', id));
});

ipcMain.handle('sapphire_launch', async (event, params) => {
  const [id] = params;
  await launch(id);
});

ipcMain.handle('sapphire_update', async (event, params) => {

});

ipcMain.handle('sapphire_listInstalled', async (event, params) => {
  const files = await fs.promises.readdir(libraryDir, { withFileTypes: true });
  return files.filter(f => f.isDirectory()).map(f => f.name);
});

ipcMain.handle('sapphire_listDownloads', async (event, params) => {
  return Array.from(downloads.values());
});