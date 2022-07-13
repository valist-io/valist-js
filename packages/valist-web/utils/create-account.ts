import { AccountMeta, Client } from '@valist/sdk';
import { InMemoryCache } from '@apollo/client';
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

  return {
    id: event?.args['_accountID']?.toHexString() ?? '',
    metaURI: event?.args['_metaURI'] ?? '',
    name: event?.args['_name'] ?? '',
  };
}

export function optimisticAccount(
  address: string,
  account: Account,
  cache: InMemoryCache,
) {
  const update = (data: any) => {
    const id = data.user?.id ?? address.toLowerCase(); 
    const accounts = data.user?.accounts ?? [];
    const optimistic = {__typename: 'Account', ...account};
    
    return {
      user: {
        id: id,
        accounts: [...accounts, optimistic],
      },
    };
  };

  cache.updateQuery({
    query: query,
    variables: { address: address.toLowerCase() },
  }, update);
}