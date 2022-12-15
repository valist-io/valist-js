import { Page } from '@playwright/test';
import { Web3ProviderBackend } from 'headless-web3-provider';

export async function connectWallet(page: Page, wallet: Web3ProviderBackend) {
  // open connect modal
  await page.getByRole('banner').getByRole('button', { name: 'Connect Wallet' }).click();

  // connect to metamask
  await page.getByRole('button', { name: 'MetaMask' }).click();

  // wait for eth_accounts or eth_requestAccounts
  await new Promise(resolve => setTimeout(resolve, 1000));

  // authorize eth_accounts or eth_requestAccounts
  wallet.authorizeAll();
}
