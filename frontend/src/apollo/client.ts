import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BACKEND_URI,
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          roles: {
            merge(_ignored, incoming) {
              return incoming
            },
          },
        },
      },
      Query: {
        fields: {
          users: {
            merge(_ignored, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
  credentials: 'include',
})
