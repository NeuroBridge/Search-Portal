import { Fragment, useMemo, useState } from 'react'
import axios from 'axios'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { useBasket } from '../basket'
import { useOntology } from '../ontology'
import 'regenerator-runtime/runtime'
import ReactJson from 'react-json-view'

const BASE_URL = `https://neurobridges.renci.org:13374/query`

export const NeuroQueryInterface = () => {
  const basket = useBasket()
  const ontology = useOntology()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const terms = useMemo(() => {
    return basket.contents.map(item => ontology.find(item))
  }, [basket.contents])

  const querystring = useMemo(() => {
    return terms.map(term => term.labels[0]).join('+')
  }, [terms])

  const url = useMemo(() => `${ BASE_URL }?${ querystring }`, [querystring])

  const handleClickQueryNeuroquery = () => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await axios.get(BASE_URL, {
          params: { searchTerms: querystring}
        })
        if (!response?.data?.data) {
          throw new Error('An error occurred while querying Neuroquery.')
        }
        console.log(response.data.data)
        setResults(response.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
      return
    }
    setResults([])
    fetchResults()
  }

  return (
    <Box>
      <Button variant="outlined" onClick={ handleClickQueryNeuroquery }>Query</Button>
      &nbsp;
      <Button variant="outlined" onClick={ () => setResults([]) }>Clear Results</Button>

      <br />
      
      <pre style={{ backgroundColor: '#ccc', padding: '0.5rem', fontSize: '75%' }}>{ url }</pre>

      <br />

      { loading && <CircularProgress /> }

      {
        results.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            '& .pretty-json-container': {
              padding: '1rem',
              fontSize: '75%',
            }
          }}>
            Results:
            <hr />
            {
              results.map(result => (
                <Fragment key={ `result-${ result.title }` }>
                  <Typography>{ result.title }</Typography>
                  <ReactJson src={ result } theme="ocean" />
                </Fragment>
              ))
            }
          </Box>
        )
      }
    </Box>
  )
}