import { Client, Contract, createIPFS, deployedAddresses } from '@valist/sdk';
import { ethers } from 'ethers';
import React from 'react';
import { ValistCtxInterface } from '../../utils/Account/types';
import getConfig from 'next/config';
const {publicRuntimeConfig } = getConfig();

export default React.createContext<ValistCtxInterface>({
  valist: new Client(
    new Contract.EVM(
      deployedAddresses[publicRuntimeConfig.CHAIN_ID], 
      new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER)
    ),
    createIPFS(),
  ),
  ipfsGateway: '',
})
