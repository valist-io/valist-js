import React, { useState, useEffect } from 'react';
import { providers } from 'ethers';
import { useSigner, useProvider, useNetwork } from 'wagmi';
import { Client, Options, createReadOnly, create } from '@valist/sdk';

// default to read-only polygon mainnet
const defaultProvider = new providers.JsonRpcProvider('https://rpc.valist.io');
const defaultClient = createReadOnly(defaultProvider, { chainId: 137 });

export const ValistContext = React.createContext<Client>(defaultClient);

export interface ValistProviderProps {
  children?: React.ReactNode;
  metaTx?: boolean;
}

export function ValistProvider(props: ValistProviderProps) {
  const [client, setClient] = useState<Client | undefined>();
  
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  // update the valist client when the signer or network changes
  useEffect(() => {
    const options: Partial<Options> = { chainId: chain?.id, metaTx: props.metaTx };
    if (signer?.provider) {
      create(signer.provider as any, options).then(setClient);
    } else {
      setClient(createReadOnly(provider as any, options));
    }
  }, [signer?.provider, chain?.id, provider, props.metaTx]);

  return (
    <ValistContext.Provider value={client ?? defaultClient}>
      {props.children}
    </ValistContext.Provider>
  );
}
