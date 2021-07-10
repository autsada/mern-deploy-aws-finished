import React from 'react'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import Layout from '../components/Layout'
import AuthContextProvider from '../context/AuthContextProvider'
import { client } from '../apollo/client'

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </ApolloProvider>
  )
}

export default App
