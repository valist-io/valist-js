import { expect } from '@playwright/test';
import { test } from './fixtures';
import { connectWallet } from './helpers';

test('name-taken', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // navigate to new account
  await page.goto('/-/create/account');

  // connect wallet
  await connectWallet(page, wallet);

  // enter taken account name
  await page.getByLabel('Account Name').fill('yolo');

  // error should be shown
  await expect(page.getByText('Name has been taken')).toBeVisible();

  // continue button disabled
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
});

test('create-transaction', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // navigate to new account
  await page.goto('/-/create/account');

  // connect wallet
  await connectWallet(page, wallet);

  // use a unique name
  const accountName = Date.now().toString();

  // Basic Info
  await page.getByLabel('Account Name').fill(accountName);
  await page.getByLabel('Display Name').fill(accountName);
  await page.getByLabel('Website').fill('https://yolo.com');
  await page.getByLabel('Description').fill('playwright test');

  // Members
  await page.getByRole('button', { name: 'Continue' }).click();

  // create account
  await page.getByRole('button', { name: 'Create' }).click();

  // wait for loading dialog
  await expect(page.getByText('Creating transaction')).toBeVisible();
});