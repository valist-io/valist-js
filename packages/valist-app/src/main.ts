import { app, BrowserWindow, ipcMain } from 'electron';
import { ethers } from 'ethers';
import keytar from 'keytar';
import path from 'path';
import EventEmitter from 'events';
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

let incomingId = 0;
let outgoingId = 0;

const signingRequest = (request: SigningRequest) => {
  if (!signingWindow) createSigningWindow();
  signingQueue.push(request);
  return incomingId++;
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
  const { domain, types, message } = JSON.parse(payload);

  const requestId = signingRequest({ 
    type: 'eth_signTypedData_v4',
    data: message,
  });

  return await new Promise((resolve, reject) => {
    walletEvents.once(`signingRejected_${requestId}`, () => { 
      reject('User rejected signing');
    });

    walletEvents.once(`signingApproved_${requestId}`, () => {
      delete types['EIP712Domain'];
      wallet?._signTypedData(domain, types, message).then(resolve);
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
  const privateKey = await keytar.getPassword('VALIST', account);
  wallet = new ethers.Wallet(privateKey);
  walletEvents.emit('accountsChanged', params);
  mainWindow?.webContents.send('accountsChanged', params);
});

ipcMain.handle('wallet_approveSigning', async (event, params) => {
  signingQueue.shift();
  walletEvents.emit(`signingApproved_${outgoingId++}`);
  if (signingQueue.length === 0) signingWindow?.close();
});

ipcMain.handle('wallet_rejectSigning', async (event, params) => {
  signingQueue.shift();
  walletEvents.emit(`signingRejected_${outgoingId++}`);
  if (signingQueue.length === 0) signingWindow?.close();
});

ipcMain.handle('wallet_signingRequest', async (event, params) => {
  if (signingQueue.length === 0) return;
  return signingQueue[0];
});

ipcMain.handle('wallet_listAccounts', async (event, params) => {
  const credentials = await keytar.findCredentials('VALIST');
  return credentials.map(c => c.account);
});
