import '../styles/global.css';
import type { AppProps } from 'next/app';
import { store } from '../app/store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
import { ApolloProvider } from '@apollo/client';
import client from '../utils/Apollo/client';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { getCookie, setCookies } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { theme } from '@/utils/Theme';

const AppContainer = dynamic(
  () => import('../features/valist/ValistContainer'),
  { ssr: false },
);

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
      <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <AppContainer>
                <Component {...pageProps} />
            </AppContainer>
          </ApolloProvider>
        </Provider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

ValistApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'dark',
});

export default ValistApp;
