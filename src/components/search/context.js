import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../../api'
import { navigate } from '@reach/router'
const SearchContext = createContext({})
import { useLocalStorage} from '../../hooks'

export const SearchContextProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history', [])
  const [terms, setTerms] = useState([])
  const [currentTerm, setCurrentTerm] = useState(null)
  const [searchedQuery, setSearchedQuery] = useState(null)
  const [busy, setBusy] = useState(false)

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

  console.log(searchHistory)

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
