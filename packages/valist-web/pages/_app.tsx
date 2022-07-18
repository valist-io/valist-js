import '@rainbow-me/rainbowkit/styles.css';
import '@valist/ui/public/styles.css';

import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { useColorScheme } from '@mantine/hooks';
import { ThemeProvider } from '@valist/ui';
import { NotificationsProvider } from '@mantine/notifications';
import { AccountProvider } from '@/components/AccountProvider';
import { ApolloProvider } from '@/components/ApolloProvider';
import { RainbowKitProvider } from '@/components/RainbowKitProvider';
import { ValistProvider } from '@/components/ValistProvider';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function ValistApp(props: AppProps) {
  const { Component, pageProps } = props;
  const colorScheme = useColorScheme();

  return (
    <SWRConfig value={{ fetcher }}>
      <RainbowKitProvider colorScheme={colorScheme}>
        <ApolloProvider>
          <AccountProvider>
            <ValistProvider metaTx>
              <ThemeProvider colorScheme={colorScheme}>
                <NotificationsProvider>
                  <Component {...pageProps} />
                </NotificationsProvider>
              </ThemeProvider>
            </ValistProvider>
          </AccountProvider>
        </ApolloProvider>
      </RainbowKitProvider>
    </SWRConfig>
  );
}

export default ValistApp;
