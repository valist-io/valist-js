import { ethers } from 'ethers';
import { test as base } from '@playwright/test';

import { 
  injectHeadlessWeb3Provider,
  Web3ProviderBackend,
} from 'headless-web3-provider';

declare global {
  interface Window {
    ethereum: IWeb3Provider
  }
}

type Web3Test = {
  rpcUrl: string;
  chainId: number;
  signers: string[];
  accounts: string[];
  injectWeb3Provider: (privateKey?: string) => Promise<Web3ProviderBackend>;
}

export const test = base.extend<Web3Test>({
  rpcUrl: 'https://rpc.valist.io',

  chainId: 137,

  signers: [
    // this signer has 0 accounts and 0 projects
    '0xdca135777b1197f47f10390c531f5b27a84f89446e99b27795151d1821af495a',
    // this signer has 1 account and 0 projects
    // account name "jalapeno"
    '0xc267561ef4e17dbb84e669dff65f266fcfb79667f41813b50cd0e270f4e98472',
    // this signer has 1 account and 1 project
    // account name "yolo" project name "yolo"
    '0xb8e433a8af8461b3216de7ad99e189aa40feaaf3826144ca28c23b8f12273b2d',
  ],

  accounts: async ({ signers }, use) => {
    await use(signers.map((k) => new ethers.Wallet(k).address))
  },

  injectWeb3Provider: async ({ page, signers, chainId, rpcUrl }, use) => {
    await use(async (privateKey = signers[0]) => {
      const wallet = await injectHeadlessWeb3Provider(page, [privateKey], chainId, rpcUrl);
      await page.addInitScript(() => (window.ethereum.isMetaMask = true));
      return wallet;
    });
  },
});
