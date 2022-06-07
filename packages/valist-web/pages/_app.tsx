import '../styles/global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { store } from '../app/store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
import { ApolloProvider } from '@apollo/client';
import client from '../utils/Apollo/client';
import { chain, createClient, WagmiConfig, configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { magic } from '../utils/Providers/magic';
import {
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from '@rainbow-me/rainbowkit';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { getCookie, setCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { theme } from '@/utils/Theme';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const AppContainer = dynamic(
  () => import('../features/valist/ValistContainer'),
  { ssr: false },
);

const defaultProvider = jsonRpcProvider({
  rpc: chain => ({
    http: publicRuntimeConfig.WEB3_PROVIDER,
  }),
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
    ],
  },
]);

const wagmiClient = createClient({ autoConnect: true, connectors, provider });

function ValistApp(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ ...theme, colorScheme } as any} withGlobalStyles withNormalizeCSS>
        <Provider store={store}>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ApolloProvider client={client}>
                <AppContainer>
                    <Component {...pageProps} />
                </AppContainer>
              </ApolloProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

ValistApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});

export default ValistApp;
