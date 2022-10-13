import { app, BrowserWindow, ipcMain } from 'electron';
import { createReadOnly } from '@valist/sdk';
import { ethers } from 'ethers';
import keytar from 'keytar';
import tar from 'tar';

import fs from 'fs';
import os from 'os';
import path from 'path';
import EventEmitter from 'events';

import { createController } from 'ipfsd-ctl';
import * as utils from './utils';

//////////////////////
/// Electron Setup ///
//////////////////////

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

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.once('closed', () => { mainWindow = undefined });
};

const createWalletWindow = () => {
  walletWindow = new BrowserWindow({
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  walletWindow.loadURL('http://localhost:3000/-/wallet');
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

  signingWindow.loadURL('http://localhost:3000/-/wallet/sign');
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

app.on('quit', () => {
  ipfs?.stop();
});

app.whenReady().then(() => {
  createIPFS();
});

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

  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'valist-'));
  const tempPath = path.join(downloadDir, id);
  const tempStream = fs.createWriteStream(tempPath, { flags: 'w' });

  const ipfsPath = `${meta.external_url}/${artifactPath}`;
  for await (const chunk of ipfs.api.get(ipfsPath)) {
    tempStream.write(chunk);
  }

  const extractDir = await fs.promises.mkdir(libraryDir, { recursive: true });
  const extractPath = path.join(extractDir, id);
  await tar.x({ C: extractPath, file: tempPath });

  //const binPath = path.join(extractPath, artifactPath);
  //await fs.promises.chmod(binPath, 755);
};

//////////////////
/// Web3 Setup ///
//////////////////

interface SigningRequest {
  type: 'eth_signTypedData_v4';
  data: any;
}

const walletEvents = new EventEmitter();
const signingQueue = new Array<SigningRequest>();

let wallet: ethers.Wallet;
let provider = new ethers.providers.JsonRpcProvider('https://rpc.valist.io');
let valist = createReadOnly(provider, { chainId: 137 });

let incomingId = 0;
let outgoingId = 0;

const switchAccount = async (account: string) => {
  const privateKey = await keytar.getPassword('VALIST', account);
  wallet = new ethers.Wallet(privateKey);
  walletEvents.emit('accountsChanged', [account]);
  mainWindow?.webContents.send('accountsChanged', [account]);
};

const signTypedData = async (payload: string) => {
  if (!wallet) throw new Error('Signing requires a wallet');
  const { domain, types, message } = JSON.parse(payload);
  delete types['EIP712Domain']; // required for signing
  return await wallet._signTypedData(domain, types, message);
};

const enqueueSigningRequest = (request: SigningRequest) => {
  signingQueue.push(request);
  if (!signingWindow) createSigningWindow();
  return incomingId++;
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
  const requestId = enqueueSigningRequest({ 
    type: 'eth_signTypedData_v4',
    data: payload,
  });

  return await new Promise((resolve, reject) => {
    walletEvents.once(`signingRejected_${requestId}`, () => { 
      reject('User rejected signing');
    });
    walletEvents.once(`signingApproved_${requestId}`, () => { 
      signTypedData(payload).then(resolve);
    });
  });
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
  install(id)
    .then(() => mainWindow?.webContents.send('installSuccess', id))
    .catch(err => mainWindow?.webContents.send('installFailed', err))
    .finally(() => downloads.delete(id));
});

ipcMain.handle('sapphire_uninstall', async (event, params) => {
  const [id] = params;
  await fs.promises.rmdir(path.join(libraryDir, id));
});

ipcMain.handle('sapphire_launch', async (event, params) => {

});

ipcMain.handle('sapphire_listApps', async (event, params) => {
  const files = await fs.promises.readdir(libraryDir, { withFileTypes: true });
  return files.filter(f => f.isDirectory()).map(f => f.name);
});
