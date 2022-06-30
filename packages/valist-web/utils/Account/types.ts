import React from 'react';
import { ethers } from 'ethers';

export type SetUseState<T> = React.Dispatch<React.SetStateAction<T>>;

export type LoginType = 'readOnly' | 'metaMask' | 'walletConnect' | 'magic';

export type ValistProvider = ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider;
