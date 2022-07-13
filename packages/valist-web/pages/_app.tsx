import '@rainbow-me/rainbowkit/styles.css';
import '@valist/ui/public/styles.css';

import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { ThemeProvider } from '@valist/ui';
import { NotificationsProvider } from '@mantine/notifications';
import { AccountProvider } from '@/components/AccountProvider';
import { ApolloProvider } from '@/components/ApolloProvider';
import { RainbowKitProvider } from '@/components/RainbowKitProvider';
import { ValistProvider } from '@/components/ValistProvider';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function ValistApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <SWRConfig value={{ fetcher }}>
      <RainbowKitProvider>
        <ApolloProvider>
          <AccountProvider>
            <ValistProvider metaTx>
              <ThemeProvider>
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
