import styled from 'styled-components'

import { appear } from '../../theme'

export default styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);
  animation: ${appear} 0.5s linear;
`
