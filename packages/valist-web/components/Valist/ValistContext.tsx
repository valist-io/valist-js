import React from 'react';
import getConfig from 'next/config';
import { ethers } from 'ethers';
import { Client, Contract, Storage } from '@valist/sdk';
import { create as createIPFS } from "ipfs-http-client";

const { publicRuntimeConfig } = getConfig();

export const defaultProvider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER);

export function createValistClient(provider) {
  const chainID = publicRuntimeConfig.CHAIN_ID;
  const metaTx = publicRuntimeConfig.METATX_ENABLED;
  const ipfsHost = publicRuntimeConfig.IPFS_HOST;
  const ipfsGateway = publicRuntimeConfig.IPFS_GATEWAY;
  const pinataJWT = publicRuntimeConfig.PINATA_JWT;

  const options = new Contract.EVM_Options(chainID, metaTx);
  const contract = new Contract.EVM(options, provider);
  const storage = new Storage.Pinata(pinataJWT, ipfsGateway);
  return new Client(contract, storage);
}

export default React.createContext<Client>(
  createValistClient(defaultProvider)
);
