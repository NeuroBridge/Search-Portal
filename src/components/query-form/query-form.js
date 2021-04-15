import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { QueryField } from './query-field'
import { QueryResetButton, QuerySubmitButton } from './buttons'
import ReactJson from 'react-json-view'

const QUERY_TEST_ENDPOINT = `${ process.env.REACT_APP_API_URL }/query`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    & button {
      flex: 1;
    }
    @media (min-width: 600px) {
      flex-direction: row;
      justify-content: center;
      gap: 2rem;
    }
  }
`

export const QueryForm = () => {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState({})

  const handleChangeQuery = event => setQuery(event.target.value)
  const handleResetQuery = event => {
    setQuery('')
    setResult({})
  }
  const handleSubmitQuery = async () => {
    try {
      const response = await axios.get(QUERY_TEST_ENDPOINT)
      setResult(response.data)
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <Wrapper>
      <QueryField value={ query } onChange={ handleChangeQuery } />
      <div className="actions">
        <QuerySubmitButton onClick={ handleSubmitQuery }/>
        <QueryResetButton onClick={ handleResetQuery }/>
      </div>
      {

      }
      <ReactJson src={ result } collapsed={ false } enableClipboard={ false } theme="monokai" style={{ borderRadius: '4px', padding: '1rem' }} />
    </Wrapper>
  )
}
