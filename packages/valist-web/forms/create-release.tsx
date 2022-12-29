import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { ReleaseMeta, Client, SupportedPlatform, PlatformsMeta, toImportCandidate } from '@valist/sdk';
import { Event } from 'ethers';
import { handleEvent } from './events';
import * as utils from './utils';
import { normalizeError, versionRegex } from './common';
import { Anchor } from '@mantine/core';
import { getBlockExplorer } from '@/components/Activity';
import { ImportCandidate } from 'ipfs-core-types/src/utils';

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
  filesObject: Record<string, File[]>,
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

    if (Object.values(filesObject).flat(1).length === 0) {
      throw new Error('files cannot be empty');
    }

    const meta: ReleaseMeta = new ReleaseMeta();
    meta.platforms = new PlatformsMeta();
    meta.name = values.displayName;
    meta.description = values.description;

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await valist.writeFile(image, false, (progress: number) => {
        utils.updateLoading(`Uploading ${image?.name}: ${progress}%`);
      });
    }

    if (filesObject) {
      const { web, ...nonWebFiles } = filesObject;
      let webCID, nativeCID = '';

      const webIC:ImportCandidate[] = web.map(file => ({
        path: file.webkitRelativePath,
        content: file,
      }));

      const nonWebIC:ImportCandidate[] = Object.entries(nonWebFiles)
        .flatMap(([platform, files]) => files
          .map(file => ({
            path: `${platform}/${file.name}`,
            content: file,
          }),
        ));

      if (webIC.length !== 0) {
        webCID = await valist.writeFolder(webIC, false, (progress: number) => {
          utils.updateLoading(`Uploading release archive for web: ${progress}%`);
        });
        meta.platforms.web = {
          external_url: webCID,
          name: 'web',
        };
      };

      if (nonWebIC.length !== 0) {
        nativeCID = await valist.writeFolder(nonWebIC, true, (progress: number) => {
          utils.updateLoading(`Uploading releases for native: ${progress}%`);
        });

        Object.keys(nonWebFiles).forEach((platform) => {
          if (meta.platforms && filesObject[platform] && filesObject[platform].length !== 0) {
            meta.platforms[platform as SupportedPlatform] = {
              external_url: `${nativeCID}/${platform}/${filesObject[platform][0].name}`,
              name: filesObject[platform][0].name,
            };
          }
        });
      };

      meta.external_url = webCID || nativeCID;
    };

    utils.updateLoading('Creating transaction');
    const transaction = await valist.createRelease(projectId, values.releaseName, meta);

    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach((event: Event) => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(normalizeError(error));
  } finally {
    utils.hideLoading();
  }
}