import React from 'react';
import getConfig from 'next/config';
import { ethers } from 'ethers';
import { Client, Options, createClient } from '@valist/sdk';

const { publicRuntimeConfig } = getConfig();

export const defaultProvider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER);

export function createValistClient(provider: Contract.EVM_Provider) {
  const options: Options = {
    chainID: publicRuntimeConfig.CHAIN_ID,
    metaTx: publicRuntimeConfig.METATX_ENABLED,
    ipfsHost: publicRuntimeConfig.IPFS_HOST,
    ipfsGateway: publicRuntimeConfig.IPFS_GATEWAY
  };

  return createClient(provider, options);
}

export default React.createContext<Client>(
  createValistClient(defaultProvider),
);
