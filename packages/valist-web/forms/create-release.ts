import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { ReleaseMeta, Client } from '@valist/sdk';
import type { FileWithPath } from 'file-selector';
import { Event } from 'ethers';
import { handleEvent } from './events';
import * as utils from './utils';
import { versionRegex } from './common';

export interface FormValues {
  releaseName: string;
  displayName: string;
  description: string;
}

export const schema = z.object({
  releaseName: z.string()
    .min(3, { message: 'Release name should have at least 3 characters' })
    .max(24, { message: 'Release name should not be longer than 24 characters' })
    .regex(versionRegex, { message: 'Release name can only contain letters, numbers, and dashes' })
    .refine((val: string) => val.toLocaleLowerCase() === val, { message: 'Release name can only contain lowercase letters' }),
  displayName: z.string()
    .min(3, { message: 'Display name should have at least 3 characters' })
    .max(24, { message: 'Display name should not be longer than 32 characters' }),
  description: z.string()
    .max(100, { message: 'Description should be shorter than 100 characters' }),
});

export async function createRelease(
  address: string | undefined,
  projectId: string,
  image: File | undefined,
  files: FileWithPath[],
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
  	utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    if (files.length === 0) {
      throw new Error('files cannot be empty');
    }

    const meta: ReleaseMeta = {
      name: values.displayName,
      description: values.description,
    };

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await valist.writeFile(image);
    }

    meta.external_url = await valist.writeFolder(files);

    utils.updateLoading('Waiting for transaction');
    const transaction = await valist.createRelease(projectId, values.releaseName, meta);
    const receipt = await transaction.wait();
    receipt.events?.forEach((event: Event) => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}