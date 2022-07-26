import { 
  ApolloProvider as Provider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

import { useState, useEffect } from 'react';
import { useNetwork } from 'wagmi';
import { config } from './cache';

const localClient = new ApolloClient({
  uri: 'http://localhost:8000/subgraphs/name/valist-io/valist',
  cache: new InMemoryCache(config),
});

const polygonClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/valist-io/valist',
  cache: new InMemoryCache(config),
});

const mumbaiClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai',
  cache: new InMemoryCache(config),
});

export interface ApolloProviderProps {
  children?: React.ReactNode;
}

export function ApolloProvider(props: ApolloProviderProps) {
  const { chain } = useNetwork();
  const [client, setClient] = useState(polygonClient);

  // change the apollo client based on network id
  useEffect(() => {
    if (chain?.id === 80001) {
      setClient(mumbaiClient);
    } else if (chain?.id === 1337) {
      setClient(localClient);
    } else {
      setClient(polygonClient);
    }
  }, [chain?.id]);

  return (
    <Provider client={client}>
      {props.children}
    </Provider>
  );
}