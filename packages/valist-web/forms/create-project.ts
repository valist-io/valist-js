import { z } from 'zod';
import { ProjectMeta, GalleryMeta, Client } from '@valist/sdk';
import { ApolloCache, gql } from '@apollo/client';

import { 
  showNotification, 
  hideNotification, 
  updateNotification 
} from '@mantine/notifications';

// notification IDs
const LOADING_ID = 'project-create-loading';
const ERROR_ID = 'project-create-error';

export interface FormValues {
  projectName: string;
  displayName: string;
  website: string;
  description: string;
  shortDescription: string;
}

export interface Project {
  id: string;
  metaURI: string;
  name: string;
}

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
): Promise<Project | undefined> {
  try {
    hideNotification(ERROR_ID);

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
      gallery: [],
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

    if (mainCapsule) {
      const content = { path: mainCapsule.name, content: mainCapsule };
      meta.main_capsule = await valist.writeFile(content);
    }

    if (values.youTubeLink) {
      const src = values.youTubeLink;
      meta.gallery.push({ name: src, type: 'youtube', src });
    }

    for (const item of gallery) {
      const content = { path: item.name, content: item };
      const src = await valist.writeFile(content);
      meta.gallery.push({ name: item.name, type: 'image', src });
    }

    updateNotification({
      id: LOADING_ID,
      autoClose: false,
      disallowClose: true,
      loading: true,
      title: 'Loading',
      message: 'Waiting for transaction',
    });

    const transaction = await valist.createProject(accountId, values.projectName, meta, members);
    const receipt = await transaction.wait();
    const event = receipt.events?.find(event => event.event === 'ProjectCreated');

    const project = {
      __typename: 'Project',
      id: event?.args?.['_projectID']?.toHexString() ?? '',
      metaURI: event?.args?.['_metaURI'] ?? '',
      name: event?.args?.['_name'] ?? '',
    };

    cache.updateFragment({
      id: `Account:${accountId}`,
      fragment: gql`
        fragment OptimisticProject on Account {
          projects
        }
      `,
    }, (data: any) => {
      const projects = data?.account?.projects ?? [];
      return { projects: [...projects, project] };
    });

    return project;
  } catch(error: any) {
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

// see https://stackoverflow.com/a/27728417
const youTubeLinkRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/; 

export const schema = z.object({
  projectName: z.string()
    .min(3, { 
      message: 'Project name should have at least 3 characters',
    })
    .max(24, { 
      message: 'Project name should not be longer than 24 characters',
    })
    .regex(/^[\w-]+$/g, { 
      message: 'Project name can only contain letters, numbers, and dashes',
    })
    .refine((val) => val.toLocaleLowerCase() === val, { 
      message: 'Project name can only contain lowercase letters',
    }),
  displayName: z.string()
    .min(3, {
      message: 'Display name should have at least 3 characters',
    })
    .max(24, {
      message: 'Display name should not be longer than 32 characters',
    }),
  website: z.string(),
  description: z.string(),
  youTubeLink: z.string()
    .regex(youTubeLinkRegex, {
      message: 'YouTube link format is invalid.'
    })
    .optional(),
  shortDescription: z.string()
    .max(100, {
      message: 'Description should be shorter than 100 characters',
    }),
});
