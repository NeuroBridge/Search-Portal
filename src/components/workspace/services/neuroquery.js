import { Fragment, useEffect, useMemo, useState } from 'react'
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

const HelpText = () => {
  return (
    <Fragment>
      <Typography paragraph>
        This interface allows communication with <Link to="https://neuroquery.org/">NeuroQuery</Link>,
        which receives terms and returns PubMed publications.
      </Typography>
      <Typography paragraph>
        Terms in your workspace will appear in this interface as selection boxes.
        Many terms in the NeuroBridge Ontology have multiple string representations, or <em>labels</em>.
        Before sending your request to NeuroQuery, you may fine-tune your NeuroQuery search by
        selecting the most appropriate label to represent each term.
        Verify the constructed URL and query before sending your request to NeuroQuery.
      </Typography>
    </Fragment>
  )
}

export const NeuroQueryServiceInterface = ({ doSearch }) => {
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
    doSearch(async () => {
      try {
        const response = await axios.get(BASE_URL, {
          params: { searchTerms: querystring }
        })
        if (!response?.data?.data) {
          throw new Error('An error occurred while querying NeuroQuery.')
        }
        return response.data.data.map(result => ({
          title: result.title,
          url: result.pubmed_url,
          pmid: result.pmid,
        }))
      } catch (error) {
        console.error(error)
      }
      return
    })
  }

  const handleChangeTermLabel = id => event => {
    const newTermLabels = { ...termLabels, [id]: event.target.value }
    setTermLabels(newTermLabels)
  }

  return (
    <Box>
      <CardContent sx={{ display: 'flex', gap: '1rem' }}>
        <Collapse in={ showHelp } sx={{ flex: 1 }}>
          <HelpText />
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
          spacing={ 0 }
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
                  sx={{ '.MuiSelect-select': { padding: '0.5rem' } }}
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
  doSearch: PropTypes.func.isRequired,
}
