import { Client, Contract, Storage} from '@valist/sdk';
import { create } from "ipfs-http-client";
import { ethers } from 'ethers';
import React from 'react';
import { ValistCtxInterface } from '../../utils/Account/types';

export default React.createContext<ValistCtxInterface>({
  valist: new Client(
    new Contract.EVM(
      '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab', 
      new ethers.providers.JsonRpcProvider('http://localhost:8545')
    ),
    new Storage.IPFS(create({host:'localhost', port:5001})),
    )
});
