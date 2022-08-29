import React from 'react';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { connectors } from '@/components/RainbowKitProvider/connectors';
import { CookieStorage } from './storage';

import {
  chain, 
  createClient,
  configureChains,
  createStorage,
  WagmiConfig,
} from 'wagmi';

// TODO replace this with alchemy & infura providers
const valistProvider = jsonRpcProvider({
  rpc: (chain) => {
    if (chain.id === 1) {
      return { http: 'https://rpc.valist.io/ens' };
    } else if (chain.id === 137) {
      return { http: 'https://rpc.valist.io' };
    } else if (chain.id === 80001) {
      return { http: 'https://rpc.valist.io/mumbai' };
    } else if (chain.id === 1337) {
      return { http: 'http://localhost:8584' };
    }
    return null;
  },
});

export const { 
  chains: [/* omit mainnet */, ...chains], 
  provider,
} = configureChains(
  [chain.mainnet, chain.polygon, chain.polygonMumbai], 
  [valistProvider],
);

export const wagmiClient = createClient({ 
  autoConnect: true, 
  connectors: connectors(chains), 
  provider: provider,
  storage: createStorage({ storage: new CookieStorage() }),
});

export function rehydrate (cookie: string) {
  try {
    const { state } = JSON.parse(JSON.parse(cookie));
    wagmiClient.setState((current) => ({ ...current, ...state }));
  } catch (err: any) {
    console.warn('failed to rehydrate wagmi store');
  }
}

export interface WagmiProviderProps {
  children?: React.ReactNode;
}

export function WagmiProvider(props: WagmiProviderProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      {props.children}
    </WagmiConfig>
  );
}