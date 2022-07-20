import { z } from 'zod';
import { ReleaseMeta, Client } from '@valist/sdk';
import { ApolloCache, gql } from '@apollo/client';
import { query } from '@/components/AccountProvider';
import type { FileWithPath } from 'file-selector';

import { 
  showNotification, 
  hideNotification,
  updateNotification,
} from '@mantine/notifications';

// notification IDs
const LOADING_ID = 'release-create-loading';
const ERROR_ID = 'release-create-error';

export interface Release {
  id: string;
  metaURI: string;
  name: string;
}

export interface FormValues {
  releaseName: string;
  displayName: string;
  description: string;
}

export async function createRelease(
  address: string | undefined,
  projectId: string,
  image: File | undefined,
  files: FileWithPath[],
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
): Account {
  try {
    hideNotification(ERROR_ID);

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

    showNotification({
      id: LOADING_ID,
      autoClose: false,
      disallowClose: true,
      loading: true,
      title: 'Loading',
      message: 'Uploading files',
    });

    if (image) {
      const content = { path: image.name, content: image};
      meta.image = await valist.writeFile(content);
    }

    const content = files.map(file => ({ path: file.path, content: file }));
    meta.external_url = await valist.writeFolder(content);

    updateNotification({
      id: LOADING_ID,
      autoClose: false,
      disallowClose: true,
      loading: true,
      title: 'Loading',
      message: 'Waiting for transaction',
    });

    const transaction = await valist.createRelease(projectId, values.releaseName, meta);
    const receipt = await transaction.wait();
    const event = receipt.events?.find(event => event.event === 'ReleaseCreated');

    const release = {
      __typename: 'Release',
      id: event?.args?.['_releaseID']?.toHexString() ?? '',
      metaURI: event?.args?.['_metaURI'] ?? '',
      name: event?.args?.['_name'] ?? '',
    };

    cache.updateFragment({
      id: `Project:${projectId}`,
      fragment: gql`
        fragment OptimisticRelease on Project {
          releases
        }
      `,
    }, (data: any) => {
      const releases = data?.project?.releases ?? [];
      return { releases: [...releases, release] };
    });

    return release;
  } catch (error: any) {
    showNotification({
      id: ERROR_ID,
      autoClose: false,
      color: 'red',
      title: 'Error',
      message: error.data?.message ?? error.message,
    });
  } finally {
    hideNotification(LOADING_ID);
  }
}

export const schema = z.object({
  releaseName: z.string()
    .min(3, { 
      message: 'Release name should have at least 3 characters',
    })
    .max(24, { 
      message: 'Release name should not be longer than 24 characters',
    })
    .regex(/^[\w-.]+$/g, { 
      message: 'Release name can only contain letters, numbers, and dashes',
    })
    .refine((val) => val.toLocaleLowerCase() === val, { 
      message: 'Release name can only contain lowercase letters',
    }),
  displayName: z.string()
    .min(3, {
      message: 'Display name should have at least 3 characters',
    })
    .max(24, {
      message: 'Display name should not be longer than 32 characters',
    }),
  description: z.string()
    .max(100, {
      message: 'Description should be shorter than 100 characters',
    }),
});
