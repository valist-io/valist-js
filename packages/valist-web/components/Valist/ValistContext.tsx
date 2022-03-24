import React from 'react';
import getConfig from 'next/config';
import { ethers } from 'ethers';
import { Client, Options, createClient, Provider } from '@valist/sdk';

const { publicRuntimeConfig } = getConfig();

export const defaultProvider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER);

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

export default React.createContext<Client>(
  createValistClient(defaultProvider),
);
