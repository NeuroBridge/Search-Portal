import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Box, Button, Divider, MenuItem, Select } from '@mui/material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'

const BASE_URL = `https://neurobridges.renci.org:13374/query`

export const NeuroQueryServiceInterface = ({ setLoading, setResults }) => {
  const basket = useBasket()
  const ontology = useOntology()
  const [termLabels, setTermLabels] = useState({})

  const terms = useMemo(() => {
    return basket.ids.filter(id => basket.contents[id] === 1)
      .map(item => ontology.find(item))
  }, [basket.ids])

  useEffect(() => {
    const newTermLabels = terms.reduce((obj, term) => ({ [term.id]: 0, ...obj }), {})
    setTermLabels({ ...newTermLabels, ...termLabels })
  }, [terms])

  const querystring = useMemo(() => terms.map(term => term.labels[termLabels[term.id]]).join('+'), [termLabels])
  const url = useMemo(() => `${ BASE_URL }?${ querystring }`, [querystring])

  const handleClickQueryButton = () => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await axios.get(BASE_URL, {
          params: { searchTerms: querystring}
        })
        if (!response?.data?.data) {
          throw new Error('An error occurred while querying NeuroQuery.')
        }
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

  const handleChangeTermLabel = id => event => {
    const newTermLabels = { ...termLabels, [id]: event.target.value }
    setTermLabels(newTermLabels)
  }

  return (
    <Box>
      <pre>
        terms: { JSON.stringify(terms.map(term => term.labels[0])) }
      </pre>
      {
        terms.map(term => (
          <Select
            key={ `${ term.id }-select` }
            id={ `${ term.id }-select` }
            value={ termLabels[term.id] || 0 }
            onChange={ handleChangeTermLabel(term.id) }
          >
            {
              term.labels.map((label, i) => (
                <MenuItem key={ `${ term.id }-label-${ i }` } value={ i }>{ label }</MenuItem>
              ))
            }
          </Select>
        ))
      }
      <pre>
        url: { JSON.stringify(url) }
      </pre>

      <br />
      <Divider />
      <br />

      <Box sx={{ textAlign: 'right' }}>
        <Button variant="contained" onClick={ handleClickQueryButton }>Query</Button>
      </Box>
    </Box>
  )
}

NeuroQueryServiceInterface.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setResults: PropTypes.func.isRequired,
}
