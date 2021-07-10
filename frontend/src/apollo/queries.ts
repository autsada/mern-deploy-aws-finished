import { gql } from '@apollo/client'

export const ME = gql`
  query {
    me {
      id
      username
      email
      roles
      createdAt
    }
  }
`

export const QUERY_USERS = gql`
  query {
    users {
      id
      username
      email
      roles
      createdAt
    }
  }
`
