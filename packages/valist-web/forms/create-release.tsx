import { z } from 'zod';
import { ApolloCache } from '@apollo/client';
import { ReleaseMeta, Client, InstallMeta } from '@valist/sdk';
import { Event } from 'ethers';
import { handleEvent } from './events';
import * as utils from './utils';
import { versionRegex } from './common';
import { Anchor } from '@mantine/core';
import { getBlockExplorer } from '@/components/Activity';

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

    const meta: ReleaseMeta = {
      name: values.displayName,
      description: values.description,
    };
    meta.install = new InstallMeta(),

    utils.showLoading('Uploading files');
    if (image) {
      meta.image = await utils.writeFile(image, valist, (progress: number) => {
        utils.updateLoading(`Uploading ${image?.name}: ${progress}`);
      });
    }

    if (filesObject) {
      let { web, ..._nonWebFiles } = filesObject;
      const nonWebFiles = Object.values(_nonWebFiles).flat(1);

      Object.keys(_nonWebFiles).forEach(async (platform) => {
        // @ts-ignore
        if (filesObject[platform] && filesObject[platform].length !== 0) meta.install[platform] = filesObject[platform][0].name;
      });

      if (web?.length !== 0) {
        const webCID = await valist.writeFolder(web, false, (progress: number) => {
          utils.updateLoading(`Uploading release archive for web: ${progress}`);
        });
        meta.install.web = webCID;
      };

      if (nonWebFiles && nonWebFiles?.length !== 0) {
        meta.external_url = await valist.writeFolder(nonWebFiles, false, (progress: number) => {
          utils.updateLoading(`Uploading release archive for native: ${progress}`);
        });
      };
    };

    /*

    {
      "external_url": "webCID || nativeCID",
      "artifacts": {
        "web": {
          "external_url": "webCID",
          "name": "web_bundle"
        },
        "linux_amd64": {
          "external_url": "nativeCID/linux_amd64_build",
          "name": "binaryname"
        },
        "linux_arm64": {
          "external_url": "nativeCID/linux_arm64_build",
          "name": "binaryname"
        },
        "windows_amd64": {
          "external_url": "nativeCID/windows_amd64_build",
          "name": "binaryname",
          "dependencies": {
            "cpp-libs@version": "microsoft_link || cid"
          }
        }
      }
    }



    */

    utils.updateLoading('Creating transaction');
    const transaction = await valist.createRelease(projectId, values.releaseName, meta);

    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

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