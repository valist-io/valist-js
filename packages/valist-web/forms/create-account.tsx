import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { AccountMeta, Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';
import { normalizeError, shortnameRegex } from './common';
import { Anchor } from '@mantine/core';
import { getBlockExplorer } from '@/components/Activity';

export interface FormValues {
  accountName: string;
  displayName: string;
  website: string;
  description: string;
}

export const schema = z.object({
  accountName: z.string()
    .min(3, { message: 'Account name should have at least 3 characters' })
    .max(24, { message: 'Account name should not be longer than 24 characters' })
    .regex(shortnameRegex, { message: 'Account name can only contain letters, numbers, and dashes' })
    .refine((val) => val.toLocaleLowerCase() === val, { message: 'Account name can only contain lowercase letters' }),
  displayName: z.string()
    .min(3, { message: 'Display name should have at least 3 characters' })
    .max(24, { message: 'Display name should not be longer than 32 characters' }),
  website: z.string(),
  description: z.string()
    .max(100, { message: 'Description should be shorter than 100 characters' }),
});

export async function createAccount(
  address: string | undefined,
  image: File | undefined,
  members: string[],
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    if (members.length === 0) {
      throw new Error('members cannot be empty');
    }

    const meta: AccountMeta = {
      name: values.displayName,
      description: values.description,
      external_url: values.website,
    };

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await valist.writeFile(image, false, (percentOrBytes: number | string) => {
        utils.updateLoading(`Uploading ${image.name}: ${percentOrBytes}`);
      });
    }

    utils.updateLoading('Creating transaction');
    const transaction = await valist.createAccount(values.accountName, meta, members);

    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    console.log('error Obj', error);
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}