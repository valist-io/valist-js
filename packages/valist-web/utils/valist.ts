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
const options: Partial<Options> = { chainId, metaTx: true };

// default to read-only
const defaultProvider = new providers.JsonRpcProvider('https://rpc.valist.io');
const defaultClient = createReadOnly(defaultProvider, { chainId });

export function useValist() {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [client, setClient] = useState<Client | undefined>();

  // update the valist client when the signer or network changes
  useEffect(() => {
    if (signer?.provider) {
      create(signer.provider as any, options).then(setClient);
    } else {
      setClient(createReadOnly(provider as any, options));
    }
  }, [signer?.provider, provider]);

  return client ?? defaultClient;
}