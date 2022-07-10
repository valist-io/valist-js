import { AccountMeta, Client } from '@valist/sdk';
import { InMemoryCache } from '@apollo/client';
import { query } from '@/components/AccountProvider';

export async function createAccount(
  address: string | undefined,
  accountName: string,
  displayName: string,
  description: string,
  website: string,
  image: File | undefined,
  members: string[],
  valist: Client,
  cache: InMemoryCache,
) {
  if (!address) {
    throw new Error('connect your wallet to continue');
  }

  const meta: AccountMeta = {
    name: displayName,
    description: description,
    external_url: website,
  };

  if (image) {
    meta.image = await valist.writeFile(image);
  }

  const transaction = await valist.createAccount(accountName, meta, members);
  const receipt = await transaction.wait();
  const event = receipt.events?.find(event => event.event === 'AccountCreated');

  if (event && event.args) {
    const account = {
      __typename: 'Account',
      id: event.args['_accountID'].toHexString(),
      metaURI: event.args['_metaURI'],
      name: event.args['_name'],
    };

    const update = (data: any) => ({
      user: {
        id: data.user.id ?? address.toLowerCase(),
        accounts: [...data.user.accounts, account],
      },
    });

    cache.updateQuery({
      query: query,
      variables: { address: address.toLowerCase() },
    }, update);
  }
}
