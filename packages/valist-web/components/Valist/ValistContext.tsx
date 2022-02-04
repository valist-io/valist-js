import { Client, Contract, createIPFS, deployedAddresses } from '@valist/sdk';
import { ethers } from 'ethers';
import React from 'react';
import { ValistCtxInterface } from '../../utils/Account/types';

export default React.createContext<ValistCtxInterface>({
  valist: new Client(
    new Contract.EVM(
      deployedAddresses[80001], 
      new ethers.providers.JsonRpcProvider("https://rpc.valist.io/mumbai"),
    ),
    createIPFS(),
  ),
  ipfsGateway: '',
});
