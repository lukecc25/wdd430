import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { auth } from './firebase.js';

if (typeof window === 'undefined') {
  throw new Error('Apollo Client is client-only (CSR). Do not import on the server.');
}

// Same-origin /graphql in dev (Vite proxy) and on Render (unified Node server).
// Set VITE_GRAPHQL_URL only when the API is on a different host.
const graphqlUri = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

const httpLink = createHttpLink({
  uri: graphqlUri,
});

const authLink = setContext(async (_, { headers }) => {
  const user = auth.currentUser;
  if (!user) return { headers };

  const token = await user.getIdToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only' },
    query: { fetchPolicy: 'network-only' },
    mutate: { fetchPolicy: 'no-cache' },
  },
});
