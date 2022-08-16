import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { AccountMeta, Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';

export interface FormValues {
  displayName: string;
  website: string;
  description: string;
}

export const schema = z.object({
  displayName: z.string()
    .min(3, { message: 'Display name should have at least 3 characters' })
    .max(24, { message: 'Display name should not be longer than 32 characters' }),
  website: z.string(),
  description: z.string()
    .max(100, { message: 'Description should be shorter than 100 characters' }),
});

export async function updateAccount(
  address: string | undefined,
  accountId: string,
  image: File | undefined,
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    const meta: AccountMeta = {
      name: values.displayName,
      description: values.description,
      external_url: values.website,
    };

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await utils.writeFile(image, valist);
    }

    utils.updateLoading('Waiting for transaction');
    const transaction = await valist.setAccountMeta(accountId, meta);
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}

export async function addAccountMember(
  address: string | undefined,
  accountId: string,
  member: string,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = await valist.addAccountMember(accountId, member);
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}

export async function removeAccountMember(
  address: string | undefined,
  accountId: string,
  member: string,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = await valist.removeAccountMember(accountId, member);
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}