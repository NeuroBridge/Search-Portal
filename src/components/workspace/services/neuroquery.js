import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Box, Button, CardContent, Collapse, Divider, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'
import { Link } from '../../link'
import { Add as PlusIcon } from '@mui/icons-material'
import {
  Info as ExpandIcon,
} from '@mui/icons-material'

const BASE_URL = `https://neurobridges.renci.org:13374/query`

export const NeuroQueryServiceInterface = ({ setLoading, setResults }) => {
  const basket = useBasket()
  const ontology = useOntology()
  const [termLabels, setTermLabels] = useState({})
  const [showHelp, setShowHelp] = useState(false)

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
      <CardContent sx={{ display: 'flex', gap: '1rem' }}>
        <Collapse in={ showHelp }>
          <Typography paragraph>
            This interface allows interfacing with <Link to="https://neuroquery.org/">NeuroQuery</Link>,
            which returns PubMed publications.
          </Typography>
          <Typography paragraph>
            Terms in your workspace will appear here as select boxes.
            Many terms in the NeuroBridge Ontology have multiple string representations, or <em>labels</em>.
            Before sending your request to NeuroQuery, you have the ability to fine-tune your search by
            selecting the appropriate label to represent each term.
            Verify the query you construct before sending it to NeuroQuery.
          </Typography>
          <Typography paragraph>
          </Typography>
        </Collapse>
        <Box>
          <IconButton onClick={ () => setShowHelp(!showHelp) } size="small">
            <ExpandIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>

      <Divider />

      <CardContent>
        <Stack
          direction="row"
          divider={ <PlusIcon color="disabled" /> }
          spacing={ 2 }
          alignItems="center"
          sx={{ flexWrap: 'wrap', padding: '0.5rem', }}
        >
          {
            terms.map(term => (
              <Box
                key={ `${ term.id }-select` }
                sx={{ padding: '0.5rem' }}
              >
                <Select
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
              </Box>
            ))
          }
        </Stack>
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-start' }}>
        <pre style={{ backgroundColor: '#eee', color: '#789', fontSize: '75%', margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap', flex: 1 }}>
          { url }
        </pre>
        <Button variant="contained" onClick={ handleClickQueryButton }>Send Query</Button>
      </CardContent>
    </Box>
  )
}

NeuroQueryServiceInterface.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setResults: PropTypes.func.isRequired,
}
