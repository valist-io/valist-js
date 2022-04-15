import { LoginType } from './types';
import getConfig from 'next/config';
import { Options, createClient, Provider } from '@valist/sdk';

const { publicRuntimeConfig } = getConfig();

export const checkLoggedIn = (required:boolean, loginType:LoginType) => {
  if (required) {
    return (loginType !== 'readOnly') ? true : false;
  }
  return true;
};

export function createValistClient(provider: Provider) {
  const options: Options = {
    chainID: publicRuntimeConfig.CHAIN_ID,
    metaTx: publicRuntimeConfig.METATX_ENABLED,
    ipfsHost: publicRuntimeConfig.IPFS_HOST,
    ipfsGateway: publicRuntimeConfig.IPFS_GATEWAY,
  };

  // read-only if the provider is not capable of signing
  const signer = provider.connection.url.match(/meta|eip/) ? provider.getSigner() : undefined;

  return createClient(provider, signer, options);
}