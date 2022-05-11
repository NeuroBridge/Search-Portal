import { useEffect, useRef, useState } from 'react'
import { Box, Container } from '@mui/material'
import { useOntology } from '../components/ontology'
import { SearchForm } from '../components/search-form'
import { Workspace } from '../components/workspace'

//

const escapeRegExp = value => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

//

export const SearchView = () => {
  const { terms, termFields } = useOntology()
  const [searchText, setSearchText] = useState('')
  const [filteredTerms, setFilteredTerms] = useState(terms)
  const searchInputRef = useRef()

  useEffect(() => {
    setFilteredTerms(terms)
  }, [terms])
  
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
    // depending on how this search query compares to what it was on the
    // previous keystroke, we will either filter from what's already
    // filtered or start over and filter everything.
    const termsToFilter = incomingQuery.includes(searchText) ? filteredTerms : terms
    
    // the first thing we'll do is save that search query to state
    setSearchText(incomingQuery)
    
    // now, we construct a regular expression from the text in the search field.
    const searchRegex = new RegExp(escapeRegExp(incomingQuery), 'i')
    
    // filter out terms that don't match the search regex above
    setFilteredTerms(termsToFilter.filter(row => {
      // we check for _some_ matching field.
      return termFields.some(field => {
        // if the field contains a string value, test regex.
        if (typeof row[field.key] === 'string') {
          return searchRegex.test(row[field.key])
        }
        
        // if the field contains an array value,
        // test for _some_ matching item.
        if (Array.isArray(row[field.key])) {
          return row[field.key].some(item => {
            // now we test each item in the array.
            // they should be strings.
            // return false otherwise.
            if (typeof item === 'string') {
              return searchRegex.test(item)
            }
            return false
          })
        }
        return false
      })
    }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Container maxWidth="md" sx={{ padding: '2rem 1rem' }}>
        <SearchForm
          searchText={ searchText }
          searchHandler={ requestSearch }
          inputRef={ searchInputRef }
          matches={ filteredTerms }
        />
      </Container>

      <Container maxWidth="xl">
        <Workspace />
      </Container>

    </Box>
  )
}
