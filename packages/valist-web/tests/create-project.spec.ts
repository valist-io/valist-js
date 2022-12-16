import { expect } from '@playwright/test';
import { test } from './fixtures';
import { connectWallet } from './helpers';

test('name-taken', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // start at account page
  await page.goto('/yolo');

  // connect wallet
  await connectWallet(page, wallet);

  // navigate to new project
  await page.getByText('New Project').click();

  // enter taken project name
  await page.getByLabel('Project Name').fill('yolo');

  // error should be shown
  await expect(page.getByText('Name has been taken')).toBeVisible();

  // continue button disabled
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
});