import React, { useState, useEffect } from 'react';
import { showNotification } from '@mantine/notifications';

import { 
  Client,
  DefaultClient,
  SapphireClient,
} from './client';

const defaultClient = new DefaultClient();
const sapphireClient = new SapphireClient();

export const SapphireContext = React.createContext<Client>(defaultClient);

export interface SapphireProviderProps {
  children?: React.ReactNode;
}

const installSuccess = (id: string) => showNotification({
  color: 'green',
  title: 'Install Success',
  message: id,
});

const installFailed = (id: string) => showNotification({
  color: 'red',
  title: 'Install Failed',
  message: id,
});

if (typeof window !== 'undefined') {
  window?.sapphire?.on('installSuccess', installSuccess);
  window?.sapphire?.on('installFailed', installFailed);  
}

export function SapphireProvider(props: SapphireProviderProps) {
  const [client, setClient] = useState<Client>(defaultClient);

  useEffect(() => {
    if (window?.sapphire) {
      setClient(sapphireClient);
    }
  }, []);

  return (
    <SapphireContext.Provider value={client}>
      {props.children}
    </SapphireContext.Provider>
  );
}