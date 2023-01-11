import { ApolloClient, InMemoryCache } from "@apollo/client";
import getConfig from "next/config";

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/valist-io/valist',
  cache: new InMemoryCache(),
});

export default client;