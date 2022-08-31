import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box, Chip, Container, IconButton, 
  Stack, Tooltip, Typography,
} from '@mui/material'
import {
  ClearAll as ClearResultsIcon,
  Visibility as ResultsVisibleIcon,
  VisibilityOff as ResultsHiddenIcon,
} from '@mui/icons-material'
import { useOntology } from '../components/ontology'
import { SearchForm } from '../components/search-form'
import { Workspace } from '../components/workspace'
import elasticlunr from 'elasticlunr'

//

var index = elasticlunr(function () {
  this.addField('id')
  this.addField('labels')
  this.setRef('id')
})

//

export const SearchView = () => {
  const ontology = useOntology()
  const [searchText, setSearchText] = useState('')
  const [filteredTerms, setFilteredTerms] = useState(ontology.terms)
  const searchInputRef = useRef()
  const [results, setResults] = useState({})

  useEffect(() => {
    setFilteredTerms(ontology.terms)
  }, [ontology.terms])

  // if/when the terms change, let's re-index.
  useEffect(() => {
    if (ontology.terms.length === 0) {
      return
    }
    ontology.terms.forEach(term => {
      index.addDoc(term)
    })
  }, [ontology.terms])
  
  // add functionality to let the user press backslash to
  // focus the search input field.
  useEffect(() => {
    // we're going to be interfacing with the input field, so
    // bail out if it hasn't been found yet.
    if (!searchInputRef.current) {
      return
    }
    const handleKeyPress = event => {
      if (event.ctrlKey && event.keyCode === 220) { // ctrl + backslash ("\") 
        searchInputRef.current.focus()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [searchInputRef.current])

  // this function uses the incoming query to filter terms to those that match.
  // currently, this fires with every keypress in the search input field.
  const requestSearch = incomingQuery => {
    const results = index.search(incomingQuery, {
      expand: true,
    })
    setSearchText(incomingQuery)
    setFilteredTerms(results.map(res => ontology.find(res.ref)))
  }

  const resultsCount = useMemo(() => {
    return Object.keys(results)
      .reduce((countObj, key) => {
        const total = countObj.total + results[key].items.length
        const visible = results[key].visibility
          ? countObj.visible + results[key].items.length
          : countObj.visible
        return { total, visible }
      }, { total: 0, visible: 0 })
  }, [results])

  const toggleResultVisibility = key => () => {
    const newResults = { ...results }
    newResults[key].visibility = !newResults[key].visibility
    setResults(newResults)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{ p: 4 }}>
          <SearchForm
            searchText={ searchText }
            searchHandler={ requestSearch }
            inputRef={ searchInputRef }
            matches={ filteredTerms }
          />
        </Box>
        
        <Workspace results={ results } setResults={ setResults } />

        {
          /* results summary header */
          results && Object.keys(results).length > 0 && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Stack>
                <Typography>
                  { resultsCount.total } results
                </Typography>
                <Typography variant="caption">
                  Showing { resultsCount.total === resultsCount.visible ? 'all' : `${ resultsCount.visible } of` } { resultsCount.total } results
                </Typography>
              </Stack>
              <Stack direction="row" spacing={ 2 }>
                {
                  Object.keys(results).map(key => (
                    <Chip
                      key={ `${ key }-results-toggle` }
                      icon={ results[key].visibility
                        ? <ResultsVisibleIcon /> : <ResultsHiddenIcon /> }
                      variant="outlined"
                      color={ results[key].visibility ? 'primary' : 'default' }
                      label={ `${ key } (${ results[key].items.length })` }
                      onClick={ toggleResultVisibility(key) }
                    />
                  ))
                }
              </Stack>
              <Tooltip title="Clear results" placement="left">
                <IconButton onClick={ () => setResults({}) }>
                  <ClearResultsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }

        {
          /* results list */
          results && Object.keys(results).length > 0 && (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 2,
            }}>
              RESULTS!!
            </Box>
          )
        }
      </Box>
    </Container>
  )
}
