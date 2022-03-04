import React from 'react';
import getConfig from 'next/config';
import { ethers } from 'ethers';
import { Client, Contract, Storage } from '@valist/sdk';
import { create as createIPFS } from "ipfs-http-client";
const { publicRuntimeConfig } = getConfig();

export const defaultProvider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER);

export function createValistClient(chainID, metaTx, ipfsHost, ipfsGateway, provider) {
  console.log(metaTx);
  const options = new Contract.EVM_Options(chainID, metaTx);
  const contract = new Contract.EVM(options, provider);
  const storage = new Storage.IPFS(createIPFS(ipfsHost), ipfsGateway);
  return new Client(contract, storage);  
}

export default React.createContext<Client>(
  createValistClient(
    publicRuntimeConfig.CHAIN_ID,
    publicRuntimeConfig.METATX_ENABLED,
    publicRuntimeConfig.IPFS_HOST,
    publicRuntimeConfig.IPFS_GATEWAY,
    defaultProvider
  )
);
