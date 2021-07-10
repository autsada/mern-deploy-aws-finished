import React, { useContext } from 'react'
import styled from 'styled-components'

import { appear } from '../../theme'
import { AuthContext } from '../../context/AuthContextProvider'

interface Props {}

const ModalContainer = styled.div`
  position: fixed;
  overflow-y: scroll;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
`

const StyledModal = styled.div`
  position: relative;
  top: 2%;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: white;
  height: auto;
  margin: 0 auto;
  padding: 1rem 2rem;
  border-radius: ${(props) => props.theme.radius};
  box-shadow: 0px 30px 20px rgba(0, 0, 0, 0.4);
  animation: ${appear} 1s linear;

  @media ${(props) => props.theme.size.lg} {
    width: 40%;
    top: 10%;
  }

  @media ${(props) => props.theme.size.md} {
    width: 50%;
    top: 13%;
  }

  @media ${(props) => props.theme.size.sm} {
    width: 80%;
    top: 5%;
  }
`

const StyledAction = styled.div`
  position: absolute;
  top: 1rem;
  right: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  cursor: pointer;
  font-weight: bolder;
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
  transition: background-color ${(props) => props.theme.transition} ease-in;

  &:hover {
    color: red;
    background: ${(props) => props.theme.colors.lightGrey};
  }
`

const Modal: React.FC<Props> = ({ children }) => {
  const { handleAuthAction } = useContext(AuthContext)

  return (
    <ModalContainer>
      <StyledModal>
        <StyledAction onClick={() => handleAuthAction('close')}>
          &times;
        </StyledAction>
        {children}
      </StyledModal>
    </ModalContainer>
  )
}

export default Modal
