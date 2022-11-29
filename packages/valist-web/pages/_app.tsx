import '@rainbow-me/rainbowkit/styles.css';
import '@valist/ui/public/styles.css';

import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { useEnsName } from 'wagmi';
import { NextLink } from '@mantine/next';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { ThemeProvider, AddressProvider } from '@valist/ui';
import { ApolloProvider } from '@/components/ApolloProvider';
import { WagmiProvider } from '@/components/WagmiProvider';
import { RainbowKitProvider } from '@/components/RainbowKitProvider';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const resolveName = (address: string) => useEnsName({ address, chainId: 1 }); // eslint-disable-line react-hooks/rules-of-hooks

// theme overrides
const components = {
  Anchor: {
    defaultProps: {
      component: NextLink,
    },
  },
};

function ValistApp(props: AppProps) {
  const { Component, pageProps } = props;
  
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: systemColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <SWRConfig value={{ fetcher }}>
      <AddressProvider value={{ resolveName }}>
        <WagmiProvider>
          <RainbowKitProvider colorScheme={colorScheme}>
            <ApolloProvider>
              <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <ThemeProvider theme={{ colorScheme, components }}>
                  <NotificationsProvider>
                    <Component {...pageProps} />
                  </NotificationsProvider>
                </ThemeProvider>
              </ColorSchemeProvider>
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </AddressProvider>
    </SWRConfig>
  );
}

export default ValistApp;
