import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Box, Button, CardContent, MenuItem, Select, Stack, Typography } from '@mui/material'
import { Add as PlusIcon } from '@mui/icons-material'

import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'

//

axios.defaults.timeout = 5000

//

const API_URL = `https://neurobridges.renci.org:13374/query`

//

export const Form = (/*{ searchWrapper }*/) => {
  const ontology = useOntology()
  const basket = useBasket()
  // `termLabels` is an object whose keys are term ids,
  // and each value is the index for the selected term label.
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
  const url = useMemo(() => `${ API_URL }?${ querystring }`, [querystring])

  const fetchResults = async () => {
    try {
      const response = await axios.get(url, {
        params: { searchTerms: querystring }
      })
      if (!response?.data?.data) {
        throw new Error('An error occurred while querying NeuroQuery.')
      }
      return response.data.data.map(result => ({
        title: result.title,
        snippet: result.snippet,
        url: result.pubmed_url,
        pmid: result.pmid,
        score: result.similarity,
      }))
    } catch (error) {
      console.error(error)
    }
    return
  }

  const handleChangeTermLabel = id => event => {
    const newTermLabels = { ...termLabels, [id]: event.target.value }
    setTermLabels(newTermLabels)
  }

  return (
    <CardContent>
      <Stack
        direction="row"
        divider={ <PlusIcon color="disabled" /> }
        spacing={ 0 }
        alignItems="center"
        sx={{ flexWrap: 'wrap', padding: '0.5rem' }}
      >
        {
          terms.map(term => term.labels.length === 1
            ? (
              <Box
                key={ `${ term.id }-select-box` }
                sx={{
                  border: '1px solid #c4c4c4',
                  borderRadius: '4px',
                  padding: '0.4rem 0.5rem',
                  margin: '0 0.5rem',
                }}
              >
                <Typography>{ term.id }</Typography>
              </Box>
            ) : (
              <Box key={ `${ term.id }-select-box` } sx={{ padding: '0.5rem' }}>
                <Select
                  id={ `${ term.id }-select` }
                  value={ termLabels[term.id] || 0 }
                  onChange={ handleChangeTermLabel(term.id) }
                  sx={{ '.MuiSelect-select': { padding: '0.5rem' } }}
                >
                  {
                    term.labels.map((label, i) => (
                      <MenuItem key={ `${ term.id }-label-${ i }` } value={ i }>{ label }</MenuItem>
                    ))
                  }
                </Select>
              </Box>
            )
          )
        }
        <Button onClick={ () => fetchResults() }>search</Button>
      </Stack>
    </CardContent>
  )
} 

Form.propTypes = {
  searchWrapper: PropTypes.func.isRequired,
}
