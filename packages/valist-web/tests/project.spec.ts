import { expect } from '@playwright/test';
import { test } from './fixtures';
import { connectWallet } from './helpers';

test('project', async ({ page, injectWeb3Provider, signers }) => {
  const wallet = await injectWeb3Provider(signers[2]);

  // start at dashboard
  await page.goto('/yolo/yolo');

  // connect wallet
  await connectWallet(page, wallet);

  // make sure buttons are visible
  await expect(page.getByText('New Release')).toBeVisible();
  await expect(page.getByText('Download')).toBeVisible();
});

test('project-404', async ({ page, injectWeb3Provider, signers }) => {
  await page.goto('/yolo/empty');

  await expect(page.getByText('The project you are looking for doesn\'t seem to exist')).toBeVisible();
});