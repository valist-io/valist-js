import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        user: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: 'User',
              id: args?.id,
            });
          },
        },
        account: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: 'Account',
              id: args?.id,
            });
          },
        },
        project: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: 'Project',
              id: args?.id,
            });
          },
        },
        release: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: 'Release',
              id: args?.id,
            });
          },
        },
      },
    },
  },
});

export default cache;