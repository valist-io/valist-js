import { expect } from '@playwright/test';
import { test } from './fixtures';
import { connectWallet } from './helpers';

test('dashboard', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // start at dashboard
  await page.goto('/-/dashboard');

  // connect wallet
  await connectWallet(page, wallet);

  // make sure buttons are visible
  await expect(page.getByText('New Project')).toBeVisible();
  await expect(page.getByText('Settings')).toBeVisible();
});