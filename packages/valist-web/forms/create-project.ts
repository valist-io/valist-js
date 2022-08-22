import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { ProjectMeta, GalleryMeta, Client } from '@valist/sdk';
import { Event } from 'ethers';
import { handleEvent } from './events';
import * as utils from './utils';
import { shortnameRegex, refineYouTube } from './common';

export interface FormValues {
  projectName: string;
  displayName: string;
  website: string;
  description: string;
  shortDescription: string;
  youTubeLink: string;
  type: string;
  tags: string[];
}

export const schema = z.object({
  projectName: z.string()
    .min(3, { message: 'Project name should have at least 3 characters' })
    .max(24, { message: 'Project name should not be longer than 24 characters' })
    .regex(shortnameRegex, { message: 'Project name can only contain letters, numbers, and dashes' })
    .refine((val: string) => val.toLocaleLowerCase() === val, { message: 'Project name can only contain lowercase letters' }),
  displayName: z.string()
    .min(3, { message: 'Display name should have at least 3 characters' })
    .max(24, { message: 'Display name should not be longer than 32 characters' }),
  website: z.string(),
  description: z.string(),
  youTubeLink: z.string()
    .refine(refineYouTube, { message: 'YouTube link format is invalid.' }),
  shortDescription: z.string()
    .max(100, { message: 'Description should be shorter than 100 characters' }),
  type: z.string(),
  tags: z.string().array(),
});

export async function createProject(
  address: string | undefined,
  accountId: string | undefined,
  image: File | undefined,
  mainCapsule: File | undefined,
  gallery: File[],
  members: string[],
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    if (!accountId) {
      throw new Error('create an account to continue');
    }

    const meta: ProjectMeta = {
      name: values.displayName,
      description: values.description,
      external_url: values.website,
      type: values.type,
      tags: values.tags,
      gallery: [],
    };

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await utils.writeFile(image, valist);
    }

    if (mainCapsule) {
      meta.main_capsule = await valist.writeFile(mainCapsule);
    }

    if (values.youTubeLink) {
      const src = values.youTubeLink;
      meta.gallery?.push({ name: '', type: 'youtube', src });
    }

    for (const item of gallery) {
      const src = await valist.writeFile(item as File);
      meta.gallery?.push({ name: '', type: 'image', src });
    }

    utils.updateLoading('Creating transaction');
    const transaction = await valist.createProject(accountId, values.projectName, meta, members);

    utils.updateLoading('Waiting for transaction', transaction.hash);
    const receipt = await transaction.wait();
    receipt.events?.forEach((event: Event) => handleEvent(event, cache));

    return true;
  } catch(error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}