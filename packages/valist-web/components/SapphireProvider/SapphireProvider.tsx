import React, { useState, useEffect } from 'react';

import { 
  Client,
  DefaultClient,
  SapphireClient,
  isSapphire,
} from './client';

const defaultClient = new DefaultClient();

export const SapphireContext = React.createContext<Client>(defaultClient);

export interface SapphireProviderProps {
  children?: React.ReactNode;
}

export function SapphireProvider(props: SapphireProviderProps) {
  const [client, setClient] = useState<Client>(defaultClient);

  useEffect(() => {
    if (isSapphire()) {
      setClient(new SapphireClient());
    }
  }, []);

  return (
    <SapphireContext.Provider value={client}>
      {props.children}
    </SapphireContext.Provider>
  );
}