import { Client, Contract, createIPFS } from '@valist/sdk';
import { ethers } from 'ethers';
import React from 'react';
import { ValistCtxInterface } from '../../utils/Account/types';
import getConfig from 'next/config';
import { licenseAddresses, valistAddresses } from '@valist/sdk/dist/contract';
const { publicRuntimeConfig } = getConfig();

export default React.createContext<ValistCtxInterface>({
  valist: new Client(
    new Contract.EVM(
      {
        valistAddress: valistAddresses[publicRuntimeConfig.CHAIN_ID],
        licenseAddress: licenseAddresses[publicRuntimeConfig.CHAIN_ID],
        metaTx: (publicRuntimeConfig.METATX_ENABLED as boolean) , 
      },
      new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER),
    ),
    createIPFS(),
  ),
  ipfsGateway: '',
});
