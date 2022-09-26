import React, { useState, useEffect } from 'react';
import { providers } from 'ethers';
import { useSigner, useProvider } from 'wagmi';
import { getChainId } from '@/utils/config';

import { 
  Client, 
  Options,
  contracts,
  create,
  createReadOnly, 
} from '@valist/sdk';


const chainId = getChainId();

// default to read-only
const defaultProvider = new providers.JsonRpcProvider('https://rpc.valist.io');
const defaultClient = createReadOnly(defaultProvider, { chainId });

export const ValistContext = React.createContext<Client>(defaultClient);

export interface ValistProviderProps {
  children?: React.ReactNode;
  metaTx?: boolean;
}

export function ValistProvider(props: ValistProviderProps) {
  const [client, setClient] = useState<Client | undefined>();
  
  const provider = useProvider();
  const { data: signer } = useSigner();

  // update the valist client when the signer or network changes
  useEffect(() => {
    const options: Partial<Options> = { chainId, metaTx: props.metaTx };
    if (signer?.provider) {
      create(signer.provider as any, options).then(setClient);
    } else {
      setClient(createReadOnly(provider as any, options));
    }
  }, [signer?.provider, provider, props.metaTx]);

  return (
    <ValistContext.Provider value={client ?? defaultClient}>
      {props.children}
    </ValistContext.Provider>
  );
}
