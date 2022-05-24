import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';

import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
import { ApolloProvider } from '@apollo/client';
import { chain, createClient, WagmiProvider } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {
  configureChains,
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit';

import { store } from '../app/store';
import client from '../utils/Apollo/client';
import { magic } from '../utils/Providers/magic';

// TODO configure based on next public config
const defaultProvider = jsonRpcProvider({ 
  rpc: (chain) => ({ http: 'https://rpc.valist.io/mumbai' }),
});

const { chains, provider } = configureChains([chain.polygonMumbai], [defaultProvider]);

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      wallet.coinbase({ appName: 'Valist', chains }),
      wallet.metaMask({ chains }),
      magic(),
    ],
  },
  {
    groupName: 'Mobile',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.walletConnect({ chains }),
    ]
  }
]);

const wagmiClient = createClient({ autoConnect: true, connectors, provider });

function ValistApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <WagmiProvider client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiProvider>
      </ApolloProvider>
    </Provider>
  );
}

export default ValistApp;
