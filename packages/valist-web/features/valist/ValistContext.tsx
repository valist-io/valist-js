import React from 'react';
import { Client } from '@valist/sdk';
import { createValistClient } from '../../utils/Account';
import { defaultProvider } from '../../utils/Providers';

export default React.createContext<Client>(
  createValistClient(defaultProvider),
);
