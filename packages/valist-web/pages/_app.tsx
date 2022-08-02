import '@rainbow-me/rainbowkit/styles.css';
import '@valist/ui/public/styles.css';

import type { AppProps } from 'next/app';
import { useState } from 'react';
import { SWRConfig } from 'swr';
import { NextLink } from '@mantine/next';
import { useLocalStorage } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import { ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { ThemeProvider } from '@valist/ui';
import { AccountProvider } from '@/components/AccountProvider';
import { ApolloProvider } from '@/components/ApolloProvider';
import { RainbowKitProvider } from '@/components/RainbowKitProvider';
import { ValistProvider } from '@/components/ValistProvider';

const fetcher = (url: string) => fetch(url).then(res => res.json());

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
  
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <SWRConfig value={{ fetcher }}>
      <RainbowKitProvider colorScheme={colorScheme}>
        <ApolloProvider>
          <AccountProvider>
            <ValistProvider metaTx>
              <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <ThemeProvider theme={{ colorScheme, components }}>
                  <NotificationsProvider>
                    <Component {...pageProps} />
                  </NotificationsProvider>
                </ThemeProvider>
              </ColorSchemeProvider>
            </ValistProvider>
          </AccountProvider>
        </ApolloProvider>
      </RainbowKitProvider>
    </SWRConfig>
  );
}

export default ValistApp;
