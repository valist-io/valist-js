import { LoginType } from './types';
import getConfig from 'next/config';
import { create, Client, Options, Provider } from '@valist/sdk';
import { notify } from '../Notifications';

const { publicRuntimeConfig } = getConfig();

export const checkLoggedIn = (required:boolean, loginType:LoginType) => {
  if (required) {
    return (loginType !== 'readOnly') ? true : false;
  }
  return true;
};

export async function createValistClient(provider: Provider): Promise<Client | null> {
  const options: Partial<Options> = {
    metaTx: publicRuntimeConfig.METATX_ENABLED,
    ipfsHost: publicRuntimeConfig.IPFS_HOST,
    ipfsGateway: publicRuntimeConfig.IPFS_GATEWAY,
    chainId: Number(publicRuntimeConfig.CHAIN_ID),
  };

  try {
    return await create(provider, options);
  } catch (err: any) {
       notify('error', 'Unsupported network!');
  }

  return null;
}