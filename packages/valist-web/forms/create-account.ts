import { z } from 'zod';
import { AccountMeta, Client } from '@valist/sdk';
import { ApolloCache } from '@apollo/client';
import { query } from '@/components/AccountProvider';

import { 
  showNotification, 
  hideNotification,
  updateNotification,
} from '@mantine/notifications';

// notification IDs
const LOADING_ID = 'account-create-loading';
const ERROR_ID = 'account-create-error';

export interface Account {
  id: string;
  metaURI: string;
  name: string;
  projects: any[];
}

export interface FormValues {
  accountName: string;
  displayName: string;
  website: string;
  description: string;
}

export async function createAccount(
  address: string | undefined,
  image: File | undefined,
  members: string[],
  values: FormValues,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<Account | undefined> {
  try {
    hideNotification(ERROR_ID);

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

    updateNotification({
      id: LOADING_ID,
      autoClose: false,
      disallowClose: true,
      loading: true,
      title: 'Loading',
      message: 'Waiting for transaction',
    });

    const transaction = await valist.createAccount(values.accountName, meta, members);
    const receipt = await transaction.wait();
    const event = receipt.events?.find(event => event.event === 'AccountCreated');

    const account = {
      __typename: 'Account',
      id: event?.args?.['_accountID']?.toHexString() ?? '',
      metaURI: event?.args?.['_metaURI'] ?? '',
      name: event?.args?.['_name'] ?? '',
      projects: [],
    };

    cache.updateQuery({ 
      query: query,
      variables: { 
        address: address.toLowerCase() 
      },
    }, (data) => {
      const accounts = data?.user?.accounts ?? [];
      return {
        user: {
          __typename: 'User',
          id: address.toLowerCase(),
          accounts: [...accounts, account],
        }
      };
    });

    return account;
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
  accountName: z.string()
    .min(3, { 
      message: 'Account name should have at least 3 characters',
    })
    .max(24, { 
      message: 'Account name should not be longer than 24 characters',
    })
    .regex(/^[\w-]+$/g, { 
      message: 'Account name can only contain letters, numbers, and dashes',
    })
    .refine((val) => val.toLocaleLowerCase() === val, { 
      message: 'Account name can only contain lowercase letters',
    }),
  displayName: z.string()
    .min(3, {
      message: 'Display name should have at least 3 characters',
    })
    .max(24, {
      message: 'Display name should not be longer than 32 characters',
    }),
  website: z.string(),
  description: z.string()
    .max(100, {
      message: 'Description should be shorter than 100 characters',
    }),
});
