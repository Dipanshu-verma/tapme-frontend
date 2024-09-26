import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://tapme-backend-bbs3.onrender.com', 
  cache: new InMemoryCache(),
});

export default client;
