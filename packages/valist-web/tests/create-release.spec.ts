import { expect } from '@playwright/test';
import { test } from './fixtures';
import { connectWallet } from './helpers';

test('name-taken', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // start at project page
  await page.goto('/yolo/yolo');

  // connect wallet
  await connectWallet(page, wallet);

  // navigate to new release
  await page.getByText('New Release').click();

  // enter taken release name
  await page.getByLabel('Release Name').fill('0.0.3');

  // error should be shown
  await expect(page.getByText('Name has been taken')).toBeVisible();

  // continue button disabled
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
});