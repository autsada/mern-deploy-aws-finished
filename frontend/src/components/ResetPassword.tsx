import React, { useContext } from 'react'
import { useMutation } from '@apollo/client'
import { useForm, ErrorMessage } from 'react-hook-form'
import Loader from 'react-loader-spinner'

import Modal from './modal/Modal'
import {
    FormContainer,
    Header,
    StyledForm,
    InputContainer,
    Input,
    Button,
    StyledError,
    StyledInform,
} from './SignUp'
import { RESET_PASSWORD } from '../apollo/mutations'
import { AuthContext } from '../context/AuthContextProvider'

const ResetPassword: React.FC<{ token: string }> = ({ token }) => {
    const { handleAuthAction } = useContext(AuthContext)
    const { register, handleSubmit, errors } = useForm<{ password: string }>()

    const [resetPassword, { loading, error, data }] =
        useMutation<
            { resetPassword: { message: string } },
            { token: string; password: string }
        >(RESET_PASSWORD)

    const handleSubmitResetPassword = handleSubmit(async ({ password }) => {
        await resetPassword({ variables: { token, password } })
    })

    console.log('Error: ', error)
    return (
        <Modal>
            <FormContainer>
                <Header>
                    <h4>Enter your new password below.</h4>
                </Header>

                <StyledForm onSubmit={handleSubmitResetPassword}>
                    <InputContainer>
                        <Input
                            type='password'
                            name='password'
                            id='password'
                            placeholder='Your password'
                            ref={register({
                                required: 'Password is required.',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password must be at least 6 characters.',
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        'Password must be not more than 50 characters.',
                                },
                            })}
                        />

                        <ErrorMessage errors={errors} name='password'>
                            {({ message }) => (
                                <StyledError>{message}</StyledError>
                            )}
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
                            {error.graphQLErrors[0]?.message ||
                                'Sorry, something went wrong'}
                        </StyledError>
                    )}
                </StyledForm>

                {data && (
                    <StyledInform>
                        <p>
                            {data.resetPassword?.message}{' '}
                            <span
                                style={{ cursor: 'pointer', color: 'red' }}
                                onClick={() => handleAuthAction('signin')}
                            >
                                sign in
                            </span>
                        </p>
                    </StyledInform>
                )}
            </FormContainer>
        </Modal>
    )
}

export default ResetPassword
