import { expect, Page } from '@playwright/test';
import { test } from './fixtures';

import { 
  Web3RequestKind,
  Web3ProviderBackend,
  IWeb3Provider,
} from 'headless-web3-provider';

async function connectWallet(page: Page, wallet: Web3ProviderBackend) {
  // open connect modal
  await page.getByRole('banner').getByRole('button', { name: 'Connect Wallet' }).click();

  // connect to metamask
  await page.getByRole('button', { name: 'MetaMask' }).click();

  // wait for eth_accounts or eth_requestAccounts
  await new Promise(resolve => setTimeout(resolve, 1000));

  // authorize eth_accounts or eth_requestAccounts
  wallet.authorizeAll();
}

test('onboarding-step-1', async({ page, injectWeb3Provider, signers }) => {
  // start at dashboard
  await page.goto('/-/dashboard');

  // make sure onboarding text is shown
  await expect(page.getByText('Hello & Welcome to Valist 🎉')).toBeVisible();
});

test('onboarding-step-2', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[0]);

  // start at dashboard
  await page.goto('/-/dashboard');

  // connect wallet
  await connectWallet(page, wallet);

  // make sure create account form is shown
  await expect(page.getByText('Account Details')).toBeVisible();
});

test('onboarding-step-3', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[1]);

  // start at dashboard
  await page.goto('/-/dashboard');

  // connect wallet
  await connectWallet(page, wallet);

  // make sure create account form is shown
  await expect(page.getByText('Project Details')).toBeVisible();
});

test('onboarding-complete', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // start at dashboard
  await page.goto('/-/dashboard');

  // connect wallet
  await connectWallet(page, wallet);

  // make sure onboarding is hidden
  await expect(page.getByText('Account Details')).toBeHidden();
  await expect(page.getByText('Project Details')).toBeHidden();
});