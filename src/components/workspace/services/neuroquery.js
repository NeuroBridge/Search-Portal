import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Box, Button, Divider, MenuItem, Select, Stack } from '@mui/material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'
import { Add as PlusIcon } from '@mui/icons-material'

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
      <Stack
        direction="row"
        divider={ <PlusIcon color="disabled" /> }
        spacing={ 2 }
        alignItems="center"
        sx={{ flexWrap: 'wrap'}}
      >
        {
          terms.map(term => (
            <Select
              key={ `${ term.id }-select` }
              id={ `${ term.id }-select` }
              value={ termLabels[term.id] || 0 }
              onChange={ handleChangeTermLabel(term.id) }
              sx={{ margin: '1rem 0'}}
            >
              {
                term.labels.map((label, i) => (
                  <MenuItem key={ `${ term.id }-label-${ i }` } value={ i }>{ label }</MenuItem>
                ))
              }
            </Select>
          ))
        }
      </Stack>

      <br />
      <Divider />
      <br />

      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-start' }}>
        <pre style={{ backgroundColor: '#eee', color: '#789', fontSize: '75%', margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap', flex: 1 }}>
          { url }
        </pre>
        <Button variant="contained" onClick={ handleClickQueryButton }>Query</Button>
      </Box>
    </Box>
  )
}

NeuroQueryServiceInterface.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setResults: PropTypes.func.isRequired,
}
