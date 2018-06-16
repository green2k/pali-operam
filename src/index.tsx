import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import App from './components/App'

// Build GraphQL client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

// Render ReactJS app
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app-container')
)
