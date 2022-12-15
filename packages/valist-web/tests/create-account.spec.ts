import { expect } from '@playwright/test';
import { test } from './fixtures';
import { connectWallet } from './helpers';

test('name-taken', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // start at dashboard
  await page.goto('/-/dashboard');

  // connect wallet
  await connectWallet(page, wallet);

  // open account select modal
  await page.getByRole('button', { name: 'yolo' }).click();

  // navigate to new account page
  await page.getByText('New Account').click();

  // enter taken release name
  await page.getByLabel('Account Name').fill('yolo');

  await new Promise(resolve => setTimeout(resolve, 1000));

  // error should be shown
  await expect(page.getByText('Name has been taken')).toBeVisible();

  // continue button disabled
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
});