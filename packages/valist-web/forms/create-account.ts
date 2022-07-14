import { z } from 'zod';
import { AccountMeta, Client } from '@valist/sdk';
import { ApolloCache } from '@apollo/client';
import { query } from '@/components/AccountProvider';

export interface Account {
  id: string;
  metaURI: string;
  name: string;
}

export async function createAccount(
  address: string | undefined,
  accountName: string,
  displayName: string,
  description: string,
  website: string,
  image: File | undefined,
  members: string[],
  valist: Client,
  cache: ApolloCache<any>,
): Account {
  if (!address) {
    throw new Error('connect your wallet to continue');
  }

  const meta: AccountMeta = {
    name: displayName,
    description: description,
    external_url: website,
  };

  if (image) {
    meta.image = await valist.writeFile({ path: image.name, content: image});
  }

  const transaction = await valist.createAccount(accountName, meta, members);
  const receipt = await transaction.wait();
  const event = receipt.events?.find(event => event.event === 'AccountCreated');

  const account = {
    __typename: 'Account',
    id: event?.args['_accountID']?.toHexString() ?? '',
    metaURI: event?.args['_metaURI'] ?? '',
    name: event?.args['_name'] ?? '',
  };

  cache.updateQuery({
    query: query,
    variables: { address: address.toLowerCase() },
  }, (data: any) => {
    const id = data.user?.id ?? address.toLowerCase(); 
    const existingAccounts = data.user?.accounts ?? [];
    const accounts = [...existingAccounts, account];
    return { user: { id, accounts } };
  });

  return account;
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

export interface FormValues {
  accountName: string;
  displayName: string;
  website: string;
  description: string;
}