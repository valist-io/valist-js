import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { ProjectMeta, Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';
import { normalizeError, refineYouTube } from './common';
import { Anchor } from '@mantine/core';
import { getBlockExplorer } from '@/components/Activity';

export interface FormValues {
  displayName: string;
  website: string;
  description: string;
  shortDescription: string;
  youTubeLink: string;
  type: string;
  donationAddress: string;
  tags: string[];
  launchExternal: boolean;
  promptDonation: boolean;
  linkRepository: boolean;
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
  promptDonation: z.boolean(),
  launchExternal: z.boolean(),
  linkRepository: z.boolean(),
});

export async function updateProject(
  address: string | undefined,
  projectId: string,
  image: File | undefined,
  mainCapsule: File | undefined,
  gallery: File[],
  repository: string,
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

    const meta: ProjectMeta = {
      name: values.displayName,
      short_description: values.shortDescription,
      description: values.description,
      external_url: values.website,
      type: values.type,
      tags: values.tags,
      gallery: [],
      repository,
      launch_external: values.launchExternal,
      donation_address: values.donationAddress,
      prompt_donation: values.promptDonation,
    };

    utils.showLoading('Uploading files');

    if (image) {
      meta.image = await utils.writeFile(image, valist, (progress: number) => {
        utils.updateLoading(`Uploading ${image.name}: ${progress}%`);
      });
    };

    if (mainCapsule) {
      meta.main_capsule = await utils.writeFile(mainCapsule, valist, (progress: number) => {
        utils.updateLoading(`Uploading ${mainCapsule.name}: ${progress}%`);
      });
    };

    if (values.youTubeLink) {
      const src = values.youTubeLink;
      meta.gallery?.push({ name: '', type: 'youtube', src });
    };

    for (const item of gallery) {
      const src = await utils.writeFile(item, valist, (progress: number) => {  
        utils.updateLoading(`Uploading ${item.name}: ${progress}%`);
      });
      meta.gallery?.push({ name: '', type: 'image', src });
    };

    utils.updateLoading('Creating transaction');
    const transaction = await valist.setProjectMeta(projectId, meta);
    
    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch(error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  };
};

export async function addProjectMember(
  address: string | undefined,
  projectId: string,
  member: string,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Creating transaction');
    const transaction = await valist.addProjectMember(projectId, member);
    
    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
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
  chainId: number,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = await valist.removeProjectMember(projectId, member);
    
    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);
    
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}