import React, { useContext } from 'react'
import { useMutation } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm, ErrorMessage } from 'react-hook-form'
import { useRouter } from 'next/router'
import Loader from 'react-loader-spinner'

import Modal from './modal/Modal'
import { AuthContext } from '../context/AuthContextProvider'
import {
  FormContainer,
  Header,
  StyledForm,
  InputContainer,
  Input,
  Button,
  StyledSwitchAction,
  Divider,
  StyledSocial,
  StyledError,
} from './SignUp'
import { SigninArgs, User } from '../types'
import { SIGN_IN } from '../apollo/mutations'
import { isAdmin } from '../helpers/authHelpers'

interface Props { }

const SignIn: React.FC<Props> = () => {
  const { handleAuthAction, setAuthUser } = useContext(AuthContext)
  const { register, handleSubmit, errors } = useForm<SigninArgs>()

  const router = useRouter()

  const [signin, { loading, error }] = useMutation<
    { signin: User },
    SigninArgs
  >(SIGN_IN)

  const handleSignin = handleSubmit(async ({ email, password }) => {
    try {
      const response = await signin({ variables: { email, password } })

      if (response?.data?.signin) {
        const user = response.data.signin
        // Close form
        handleAuthAction('close')

        // Set auth user in context api
        setAuthUser(user)

        // Push user to admin page or dashboard page
        if (isAdmin(user)) {
          // Push user to their admin page
          router.push('/admin')
        } else {
          // Push user to their dashboard page
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setAuthUser(null)
    }
  })

  console.log('Error: ', error)
  return (
    <Modal>
      <FormContainer>
        <Header>
          <h2>Sign In</h2>
        </Header>

        <StyledSocial>
          <button className='facebook'>
            <FontAwesomeIcon icon={['fab', 'facebook-f']} size='lg' />
            <a href='/backend/auth/facebook'>
              Log in with Facebook
            </a>
          </button>
          <button className='google'>
            <FontAwesomeIcon icon={['fab', 'google']} />
            <a href='/backend/auth/google'>
              Log in with Google
            </a>
          </button>
        </StyledSocial>

        <Divider />

        <StyledForm onSubmit={handleSignin}>
          <p className='email_section_label'>or sign in with an email</p>

          <InputContainer>
            <label>Email</label>

            <Input
              type='text'
              name='email'
              id='email'
              placeholder='Your email'
              autoComplete='new-password'
              ref={register({
                required: 'Email is required.',
                // pattern: {
                //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                //   message: 'Email is in wrong format.',
                // },
              })}
            />

            <ErrorMessage errors={errors} name='email'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <label>Password</label>

            <Input
              type='password'
              name='password'
              id='password'
              placeholder='Your password'
              ref={register({
                required: 'Password is required.',
              })}
            />

            <ErrorMessage errors={errors} name='password'>
              {({ message }) => <StyledError>{message}</StyledError>}
            </ErrorMessage>
          </InputContainer>

          <Button
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <Loader
                type='Oval'
                color='white'
                height={30}
                width={30}
                timeout={30000}
              />
            ) : (
              'Submit'
            )}
          </Button>

          {error && (
            <StyledError>
              {error.graphQLErrors[0]?.message || 'Sorry, something went wrong'}
            </StyledError>
          )}
        </StyledForm>
        <StyledSwitchAction>
          <p>
            Don't have an account yet?{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('signup')}
            >
              sign up
            </span>{' '}
            instead.
          </p>
          <p>
            Forgot password? click{' '}
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => handleAuthAction('request')}
            >
              here.
            </span>
          </p>
        </StyledSwitchAction>
      </FormContainer>
    </Modal>
  )
}

export default SignIn
