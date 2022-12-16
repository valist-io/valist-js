import type { InMemoryCacheConfig } from '@apollo/client';

export const config: InMemoryCacheConfig = {
  typePolicies: {
    Project: {
      fields: {
        releases: {
          merge(existing = [], incoming: any[]) {
            return [...incoming, ...existing];
          },
        },
      },
    },
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
};