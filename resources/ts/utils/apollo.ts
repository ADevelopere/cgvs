import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAuthToken } from './auth';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
  credentials: 'include', // This ensures cookies are sent with requests
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  }
});

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient;
