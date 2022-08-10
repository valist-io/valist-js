import { boolean, z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { ProjectMeta, GalleryMeta, Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';
import { refineYouTube } from './common';

export interface FormValues {
  displayName: string;
  website: string;
  description: string;
  shortDescription: string;
  youTubeLink: string;
  type: string;
  tags: string[];
  launchExternal: boolean;
}

export const schema = z.object({
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
  launchExternal: z.boolean(),
});

export async function updateProject(
  address: string | undefined,
  projectId: string,
  image: File | undefined,
  mainCapsule: File | undefined,
  gallery: File[],
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
  	utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    const meta: ProjectMeta = {
      name: values.displayName,
      description: values.description,
      external_url: values.website,
      type: values.type,
      tags: values.tags,
      gallery: [],
      launch_external: values.launchExternal,
    };

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await valist.writeFile(image);
    }

    if (mainCapsule) {
      meta.main_capsule = await valist.writeFile(mainCapsule);
    }

    if (values.youTubeLink) {
      const src = values.youTubeLink;
      meta.gallery?.push({ name: '', type: 'youtube', src });
    }

    for (const item of gallery) {
      const src = await valist.writeFile(item);
      meta.gallery?.push({ name: '', type: 'image', src });
    }

    utils.updateLoading('Waiting for transaction');
    const transaction = await valist.setProjectMeta(projectId, meta);
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch(error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}

export async function addProjectMember(
  address: string | undefined,
  projectId: string,
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
    const transaction = await valist.addProjectMember(projectId, member);
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

export async function removeProjectMember(
  address: string | undefined,
  projectId: string,
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
    const transaction = await valist.removeProjectMember(projectId, member);
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