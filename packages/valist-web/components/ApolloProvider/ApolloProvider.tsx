import { 
  ApolloProvider as Provider,
  ApolloClient,
} from '@apollo/client';

import { useState, useEffect } from 'react';
import { useNetwork } from 'wagmi';
import cache from './cache';

const localClient = new ApolloClient({
  uri: 'http://localhost:8000/subgraphs/name/valist-io/valist',
  cache,
});

const polygonClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/valist-io/valist',
  cache,
});

const mumbaiClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai',
  cache,
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
    // clear the cache
    client.resetStore();
  }, [chain?.id]);

  return (
    <Provider client={client}>
      {props.children}
    </Provider>
  );
}