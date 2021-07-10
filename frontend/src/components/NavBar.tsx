import React, { useContext } from 'react'
import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { AuthContext } from '../context/AuthContextProvider'
import { isAdmin } from '../helpers/authHelpers'
import { SIGN_OUT } from '../apollo/mutations'

interface Props {}

const Header = styled.header`
  width: 100%;
  height: 10rem;
  background: ${(props) => props.theme.backgroundColors.main};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Nav = styled.nav`
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${(props) => props.theme.size.md} {
    width: 90%;
  }
`

const Logo = styled.div`
  width: 20%;
  margin: 0 auto;
  color: white;
  font-size: 2rem;
  cursor: pointer;

  @media ${(props) => props.theme.size.lg} {
    width: 15%;
  }

  @media ${(props) => props.theme.size.md} {
    width: 10%;
  }

  @media ${(props) => props.theme.size.sm} {
    display: flex;
    justify-content: flex-start;
  }
`

const Ul = styled.ul`
  width: 62%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 4rem;

  @media ${(props) => props.theme.size.sm} {
    display: none;
  }

  .active {
    color: ${(props) => props.theme.fontColors.primary};
  }

  a {
    text-decoration: none;
    list-style: none;
    color: white;
    transition: all 0.35s linear;
    font-size: 1.6rem;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Actions = styled.div`
  width: 18%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${(props) => props.theme.size.lg} {
    width: 20%;
  }

  @media ${(props) => props.theme.size.md} {
    width: 25%;
  }

  @media ${(props) => props.theme.size.sm} {
    display: none;
  }
`

const HamMenu = styled.div`
  display: none;

  @media ${(props) => props.theme.size.sm} {
    display: block;
  }
`

const NavBar: React.FC<Props> = () => {
  const { handleAuthAction, loggedInUser, setAuthUser } = useContext(
    AuthContext
  )

  const router = useRouter()

  const [signout] = useMutation<{ signout: { message: string } }>(SIGN_OUT)

  const handleSignout = async () => {
    try {
      const response = await signout()

      if (response?.data?.signout?.message) {
        // Set auth user to null
        setAuthUser(null)

        // Sync signout
        window.localStorage.setItem('signout', Date.now().toString())

        // Push user to home page
        router.push('/')
      }
    } catch (error) {
      alert('Sorry, cannot proceed.')
    }
  }

  return (
    <Header>
      <Nav>
        <Link href='/'>
          <Logo>
            <a className={router.pathname === '/' ? 'active' : ''}>MyShop</a>
          </Logo>
        </Link>
        <Ul>
          <Link href='/'>
            <a className={router.pathname === '/' ? 'active' : ''}>Home</a>
          </Link>

          <Link href='/products'>
            <a className={router.pathname === '/products' ? 'active' : ''}>
              Products
            </a>
          </Link>

          {loggedInUser && (
            <Link href='/dashboard'>
              <a className={router.pathname === '/dashboard' ? 'active' : ''}>
                Dashboard
              </a>
            </Link>
          )}

          {loggedInUser && isAdmin(loggedInUser) && (
            <Link href='/admin'>
              <a className={router.pathname === '/admin' ? 'active' : ''}>
                Admin
              </a>
            </Link>
          )}
        </Ul>
        <Actions>
          {loggedInUser ? (
            <button onClick={handleSignout}>Sign Out</button>
          ) : (
            <>
              <button onClick={() => handleAuthAction('signin')}>
                Sign In
              </button>
              <button onClick={() => handleAuthAction('signup')}>
                Sign Up
              </button>
            </>
          )}
        </Actions>
        <HamMenu>
          <FontAwesomeIcon icon={['fas', 'bars']} size='2x' />
        </HamMenu>
      </Nav>
    </Header>
  )
}

export default NavBar
