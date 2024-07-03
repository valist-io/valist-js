import { 
  ApolloProvider as Provider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';

import { config } from './cache';
import { getSubgraphURI } from '@/utils/config';

export const client = new ApolloClient({
  uri: getSubgraphURI(),
  cache: new InMemoryCache(config),
  ssrMode: true,
});

export interface ApolloProviderProps {
  children?: React.ReactNode;
}

export function ApolloProvider(props: ApolloProviderProps) {
  return (
    <Provider client={client}>
      {props.children}
    </Provider>
  );
}