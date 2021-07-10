import React, { createContext, useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import Router from 'next/router'

import { User } from '../types'
import { ME } from '../apollo/queries'

interface Props {}

type Actions = 'signup' | 'signin' | 'request' | 'reset' | 'close'

type HandleAuthAction = (action: Actions) => void

interface AuthContextValues {
  authAction: Actions
  handleAuthAction: HandleAuthAction
  loggedInUser: User | null
  setAuthUser: (user: User | null) => void
}

const initialState: AuthContextValues = {
  authAction: 'close',
  handleAuthAction: () => {},
  loggedInUser: null,
  setAuthUser: () => {},
}

export const AuthContext = createContext<AuthContextValues>(initialState)

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authAction, setAuthAction] = useState<Actions>('close')
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)

  const { data } = useQuery<{ me: User }>(ME)

  useEffect(() => {
    if (data?.me) setLoggedInUser(data.me)
  }, [data?.me])

  useEffect(() => {
    const syncSignout = (e: StorageEvent) => {
      if (e.key === 'signout') {
        // Log user out
        setLoggedInUser(null)

        // Push user to home page
        Router.push('/')
      }
    }

    window.addEventListener('storage', syncSignout)

    return () => window.removeEventListener('storage', syncSignout)
  }, [])

  const handleAuthAction: HandleAuthAction = (action) => {
    setAuthAction(action)
  }

  const setAuthUser = (user: User | null) => setLoggedInUser(user)

  return (
    <AuthContext.Provider
      value={{
        authAction,
        handleAuthAction,
        loggedInUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
