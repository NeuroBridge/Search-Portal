import { createContext, useContext, useMemo, useState } from 'react'
import { api } from './api'

const SearchContext = createContext({})

export const SearchContextProvider = ({ children }) => {
  const [terms, setTerms] = useState([])
  const [currentTerm, setCurrentTerm] = useState(null)
  const [searchedQuery, setSearchedQuery] = useState(null)
  const [busy, setBusy] = useState(false)

  const doSearch = query => {
    setBusy(true)
    setSearchedQuery(query)
    api.select(query)
      .then(terms => setTerms(terms))
      .catch(error => console.error(error))
      .finally(setBusy(false))
  }

  const previousTerm = useMemo(() => {
    if (currentTerm) {
      const index = terms.findIndex(term => term.short_form === currentTerm.short_form)
      if (0 <= index - 1) {
        return terms[index - 1]
      }
    }
    return null
  }, [currentTerm])

  const nextTerm = useMemo(() => {
    if (currentTerm) {
      const index = terms.findIndex(term => term.short_form === currentTerm.short_form)
      if (index + 1 < terms.length) {
        return terms[index + 1]
      }
    }
    return null
  }, [currentTerm])

  return (
    <SearchContext.Provider
      value={{
        busy,
        doSearch,
        terms,
        currentTerm, setCurrentTerm,
        previousTerm, nextTerm,
        searchedQuery,
      }}
    >
      { children }
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => useContext(SearchContext)
