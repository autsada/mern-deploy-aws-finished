import { gql } from '@apollo/client'

export const SIGN_UP = gql`
  mutation SIGN_UP($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id
      username
      email
      roles
      createdAt
    }
  }
`

export const SIGN_IN = gql`
  mutation SIGN_IN($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      username
      email
      roles
      createdAt
    }
  }
`

export const SIGN_OUT = gql`
  mutation {
    signout {
      message
    }
  }
`

export const REQUEST_TO_RESET_PASSWORD = gql`
  mutation REQUEST_TO_RESET_PASSWORD($email: String!) {
    requestResetPassword(email: $email) {
      message
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      message
    }
  }
`

export const UPDATE_ROLES = gql`
  mutation UPDATE_ROLES($userId: String!, $newRoles: [String!]!) {
    updateRoles(userId: $userId, newRoles: $newRoles) {
      id
      username
      email
      roles
      createdAt
    }
  }
`

export const DELETE_USER = gql`
  mutation DELETE_USER($userId: String!) {
    deleteUser(userId: $userId) {
      message
    }
  }
`
