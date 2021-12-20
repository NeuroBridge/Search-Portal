import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { navigate } from '@reach/router'
const SearchContext = createContext({})
import { useLocalStorage } from '../../hooks'

export const SearchContextProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history', [])
  const [busy, setBusy] = useState(false)
  const [terms, setTerms] = useState([])
  const [selectedTerms, setSelectedTerms] = useState({})
  const [searchedQuery, setSearchedQuery] = useState(null)

  useEffect(() => console.log(Object.keys(selectedTerms)), [selectedTerms])

  const toggleTermSelection = newTerm => {
    let newTerms = { ...selectedTerms }
    const id = newTerm.short_form
    if (id in newTerms) {
      delete newTerms[id]
    } else {
      newTerms[id] = newTerm
    }
    setSelectedTerms({ ...newTerms })
  }

  const selectTerm = newTerm => {
    let newTerms = { ...selectedTerms }
    const id = newTerm.short_form
    newTerms[id] = newTerm
    setSelectedTerms({ ...newTerms })
  }

  const deselectTerm = newTerm => {
    let newTerms = { ...selectedTerms }
    const id = newTerm.short_form
    if (id in newTerms) {
      delete newTerms[id]
    }
    setSelectedTerms({ ...newTerms })
  }

  const clearTermSelection = () => {
    setSelectedTerms({})
  }

  const doSearch = query => {
    if (query.trim()) {
      setBusy(true)
      setSearchedQuery(query)
      api.select(query)
        .then(terms => {
          setTerms(terms)
          const newHistoryItem = {
            query: query,
            timestamp: new Date(),
          }
          setSearchHistory([newHistoryItem, ...searchHistory])
          navigate('/')
        })
        .catch(error => console.error(error))
        .finally(() => {
          setBusy(false)
        })
    }
  }

  const resetSearch = () => {
    setTerms([])
    setSearchedQuery('')
  }

  return (
    <SearchContext.Provider
      value={{
        busy, resetSearch,
        doSearch,
        terms, selectedTerms,
        selectTerm, deselectTerm, toggleTermSelection, clearTermSelection,
        searchedQuery,
      }}
    >
      { children }
    </SearchContext.Provider>
  )
}

SearchContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useSearchContext = () => useContext(SearchContext)
