import React from 'react';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { getAuthToken } from '../auth';

export const HomeUrl = 'http://127.0.0.1:8000'
//const authLink = (authToken: any) =>{
const authLink = () =>{
  //const authToken  = getAuthToken();
  //return setContext((_, { headers }) =>{
  return setContext((request, { headers }) =>{
    return{
      headers:{
        ...headers,
        //authorization: authToken ? `Bearer ${authToken}` : "",
        authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : "",
      }
    }
  });
}

const httpLink = createUploadLink({
//const httpLink = createHttpLink({
  //uri:'http://localhost:8000/graphql/',
  uri:'http://127.0.0.1:8000/graphql/',
  credentials: 'same-origin',
  //credentials: 'include',
  headers:{
    "keep-alive":"true",
  },
})

const cache = new InMemoryCache({});

//persistCache({
  //cache,
  //storage: window.localStorage,
//});

const apiclient = () =>{
  //const [ authToken ] = useAuthToken();
  //const authToken  = getAuthToken();
  return new ApolloClient({
    cache: cache,
    //link: httpLink,
    //link: authLink(authToken).concat(httpLink),
    link: authLink().concat(httpLink),
    //typeDefs,
    //resolvers,
  })
}

{/*
export const client = new ApolloClient({
    cache: cache,
    link: httpLink,
})
*/}

export const clear_cache = (action:any, target:any, variables:any) => {
  const data = apiclient().readQuery({query:action});
  //console.log(data,'---------',action);
  data[target] = null;
  //console.log(data,'========');
  apiclient().writeQuery({
    query:action,
    data:data
  });
}

export default apiclient;
