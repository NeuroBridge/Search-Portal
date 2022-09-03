import { useEffect, useRef, useState } from 'react'
import { Box, Container } from '@mui/material'
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
        
        <Workspace />

      </Box>
    </Container>
  )
}
