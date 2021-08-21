import { createContext, useContext, useState } from 'react'
import { api } from './api'

const SearchContext = createContext({})

export const SearchContextProvider = ({ children }) => {
  const [terms, setTerms] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [busy, setBusy] = useState(false)

  const doSearch = query => {
    setBusy(true)
    api.select(query)
      .then(terms => setTerms(terms))
      .catch(error => console.error(error))
      .finally(setBusy(false))
  }

  return (
    <SearchContext.Provider
      value={{
        busy,
        doSearch,
        terms,
        selectedTerm,
        setSelectedTerm,
      }}
    >
      { children }
    </SearchContext.Provider>
  )
}

export const useSearchContext = () => useContext(SearchContext)
