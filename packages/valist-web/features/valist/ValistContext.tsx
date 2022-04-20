import React from 'react';
import { Client } from '@valist/sdk';

export default React.createContext<Client | null>(null);
