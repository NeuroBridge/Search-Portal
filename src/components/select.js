import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.select`
  padding: 0.5rem 1rem;
`

export const Select = ({ children, ...props }) => {
  return (
    <Wrapper { ...props }>
      { children }
    </Wrapper>
  )
}
