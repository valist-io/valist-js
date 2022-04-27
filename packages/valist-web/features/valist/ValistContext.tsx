import React from 'react';
import { Client, createReadOnly } from '@valist/sdk';
import { defaultProvider } from '../../utils/Providers';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default React.createContext<Client>(createReadOnly(defaultProvider,
  {
    chainId: Number(publicRuntimeConfig.CHAIN_ID),
  },
));
