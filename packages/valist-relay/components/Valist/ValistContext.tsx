import React from 'react';
import Valist from '@valist/sdk';
import { Web3Providers } from '@valist/sdk/dist/utils';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default React.createContext<Valist>(new Valist({
  web3Provider: new Web3Providers.HttpProvider(publicRuntimeConfig.WEB3_PROVIDER),
  metaTx: false,
}));
