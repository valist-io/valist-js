import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:8000/subgraphs/name/valist-io/valist",
    cache: new InMemoryCache(),
});

export default client;