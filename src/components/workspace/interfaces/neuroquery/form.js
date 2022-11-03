import { Fragment, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Box, CardContent, Divider, MenuItem, Select, Stack, Typography,
} from '@mui/material'
import { Add as PlusIcon } from '@mui/icons-material'
import { useWorkspace } from '../../workspace'
import { Link } from '../../../link'
import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'

//

axios.defaults.timeout = 5000

//

const API_URL = `https://neurobridges.renci.org:13374/query`

//

export const Form = (/*{ searchWrapper }*/) => {
  const { register } = useWorkspace()
  const ontology = useOntology()
  const basket = useBasket()
  // `termLabels` is an object whose keys are term ids,
  // and each value is the index for the selected term label.
  const [termLabels, setTermLabels] = useState({})

  const terms = useMemo(() => {
    return basket.ids.map(item => ontology.find(item))
  }, [basket.ids])

  useEffect(() => {
    const newTermLabels = terms.reduce((obj, term) => ({ [term.id]: 0, ...obj }), {})
    setTermLabels({ ...newTermLabels, ...termLabels })
  }, [terms])


  const querystring = useMemo(() => terms.map(term => term.labels[termLabels[term.id]]).join('+'), [termLabels])

  useEffect(() => {
    const nqFetchResults = () => axios.get(API_URL, { params: { searchTerms: querystring } })
      .then(response => {
        if (!response?.data?.data) {
          throw new Error('An error occurred while querying NeuroQuery.')
        }
        const results = response.data.data.map(result => ({
          title: result.title,
          snippet: result.snippet,
          pubmed_url: result.pubmed_url,
          pmid: result.pmid,
          score: result.similarity,
        }))
        return results
      }).catch(error => {
        console.error(error)
      })
    register('neuroquery', nqFetchResults)
  }, [termLabels])

  const handleChangeTermLabel = id => event => {
    const newTermLabels = { ...termLabels, [id]: event.target.value }
    setTermLabels(newTermLabels)
  }

  return (
    <Fragment>
      <CardContent sx={{ minHeight: '150px' }}>
        <Stack direction="column" gap={ 4 } divider={ <Divider flexItem /> }>
          <Stack
            direction="row"
            divider={ <PlusIcon color="disabled" /> }
            spacing={ 0 }
            alignItems="center"
            sx={{ flexWrap: 'wrap' }}
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
                  <Box key={ `${ term.id }-select-box` } sx={{ p: 1 }}>
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
          </Stack>
        </Stack>
      </CardContent>

      <CardContent>
        <Link to={ `https://neuroquery.org/query?text=${ querystring }` }>
          View the results at NeuroQuery.org
        </Link>
      </CardContent>

    </Fragment>
  )
}
