import '../styles/global.css';
import type { AppProps } from 'next/app';
import { store } from '../app/store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
import { ApolloProvider } from '@apollo/client';
import client from '../utils/Apollo/client';

const AppContainer = dynamic(
  () => import('../features/valist/ValistContainer'),
  { ssr: false },
);

function ValistApp({ Component, pageProps }: AppProps) {
  return (
    // @ts-ignore
    <Provider store={store}>
      <ApolloProvider client={client}>
        { // @ts-ignore 
          <AppContainer>
          { // @ts-ignore
            <Component {...pageProps} />
          }
        </AppContainer>}
      </ApolloProvider>
    </Provider>
  );
}

export default ValistApp;
