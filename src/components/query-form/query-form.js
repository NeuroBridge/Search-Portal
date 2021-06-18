import React, { useRef, useState } from 'react'
import ReactJson from 'react-json-view'
import './query-form.css'
import { sampleResponse } from '../../sample-response'

export const QueryForm = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef()

  const handleResetQuery = event => {
    inputRef.current.value = ''
    setQuery('')
    setResults([])
  }

  const handleSubmitQuery = async () => {
    setQuery(inputRef.current.value)
    try {
      setResults(sampleResponse)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="query-form">
      <input className="query-input" ref={ inputRef } placeholder="Enter search term" />
      
      <div className="buttons">
        <button onClick={ handleSubmitQuery }>Submit Query</button>
        <button onClick={ handleResetQuery }>Reset</button>
      </div>
      
      { query && <div>You searched for "{ query }"</div> }

      {
        results.map(result => (
          <ReactJson
            key={ result.id }
            src={ result }
            collapsed={ false }
            enableClipboard={ false }
            theme="monokai"
            style={{ borderRadius: '4px', padding: '1rem' }}
          />
        ))
      }
    </div>
  )
}
