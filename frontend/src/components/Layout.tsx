import React, { useContext, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { config, dom } from '@fortawesome/fontawesome-svg-core'

import '../fontAwesome'

import { theme } from '../theme'
import NavBar from './NavBar'
import { AuthContext } from '../context/AuthContextProvider'
import Backdrop from './modal/Backdrop'
import SignUp from './SignUp'
import SignIn from './SignIn'
import RequestResetPassword from './RequestResetPassword'
import ResetPassword from './ResetPassword'

config.autoAddCss = false

interface Props {
  title?: string
}

const GlobalStyle = createGlobalStyle`
  ${dom.css()}

   html {
      box-sizing: border-box;
      font-size: 10px;
   }
   *, *:before, *:after {
      box-sizing: inherit;
   }
   body {
      margin: 0;
      padding: 0;
      font-size: 1.4rem;
      font-family: 'Noto Sans', sans-serif;
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
   }

   button {
    border: none;
    background: white;
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.darkTeal};
    padding: 0.5rem 1rem;
    border-radius: ${(props) => props.theme.radius};
    cursor: pointer;
    transition: background-color ${(props) => props.theme.transition} ease-in;

    &:hover {
        background: ${(props) => props.theme.colors.lightGrey};
    }
   }
`

const StyledPage = styled.div`
  background: white;
  color: ${(props) => props.theme.fontColors.primary};
`

const DisplayedPage = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
`

const Layout: React.FC<Props> = ({ children }) => {
  const { authAction, handleAuthAction } = useContext(AuthContext)

  const { asPath, replace, pathname, query } = useRouter()

  useEffect(() => {
    if (asPath === '/dashboard#_=_' || asPath === '/dashboard#') {
      replace('/dashboard')
    }

    if (asPath === '/#_=_' || asPath === '/#') {
      replace('/')
    }
  }, [asPath, replace])

  useEffect(() => {
    if (query?.resetToken) handleAuthAction('reset')
  }, [query])

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <StyledPage>
          <Head>
            <title>
              {pathname === '/' ? 'HOME' : pathname.split('/')[1].toUpperCase()}
            </title>
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='initial-scale=1.0, width=device-width'
            />
            <link
              href='https://fonts.googleapis.com/css2?family=Noto+Sans&family=Roboto&display=swap'
              rel='stylesheet'
            />
          </Head>

          <NavBar />

          <DisplayedPage>
            <>{children}</>
            <>
              {authAction !== 'close' && (
                <>
                  {authAction === 'signup' && (
                    <>
                      <Backdrop />
                      <SignUp />
                    </>
                  )}
                  {authAction === 'signin' && (
                    <>
                      <Backdrop />
                      <SignIn />
                    </>
                  )}
                  {authAction === 'request' && (
                    <>
                      <Backdrop />
                      <RequestResetPassword />
                    </>
                  )}
                  {authAction === 'reset' && (
                    <>
                      <Backdrop />
                      <ResetPassword token={query?.resetToken as string} />
                    </>
                  )}
                </>
              )}
            </>
          </DisplayedPage>
        </StyledPage>
      </>
    </ThemeProvider>
  )
}
export default Layout
