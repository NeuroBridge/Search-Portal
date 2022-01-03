import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { navigate } from '@reach/router'
const SearchContext = createContext({})
import { useLocalStorage } from '../../hooks'
import { arrayToTree } from 'performant-array-to-tree'

export const SearchContextProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history', '[]')
  const [busy, setBusy] = useState(false)
  const [terms, setTerms] = useState([])
  const [selectedTerms, setSelectedTerms] = useState({})
  const [searchedQuery, setSearchedQuery] = useState(null)

  const constructTreeRelations = async root => {
    let relations = [{ id: root.short_form, parentId: '' }]
    try {
      const descendants = await api.descendants(root)
      if (!descendants.length) {
        return relations
      }
      let queue = [root]
      while (queue.length > 0) {
        const t = queue.pop()
        const children = await api.children(t)
        queue = [...children, ...queue]
        relations = [...relations, ...children.map(child => ({ id: child.short_form, parentId: t.short_form }))]
      }
      return relations
    } catch (error) {
      console.log(error)
    }
    console.log(relations)
    console.log(arrayToTree(relations))
    return relations
  }

  useEffect(async () => {
    // when selectedTerms changes, we check each term for a tree property,
    // and building it if needed.
    Object.keys(selectedTerms).forEach(async label => {
      if (!selectedTerms[label].tree) {
        let newSelectedTerms = { ...selectedTerms }
        const [tree] = arrayToTree(await constructTreeRelations(selectedTerms[label]))
        newSelectedTerms[label].tree = tree
        setSelectedTerms(newSelectedTerms)
      }
    })
  }, [selectedTerms])

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
    newTerms[id] = { ...newTerm, tree: null }
    console.log(newTerms)
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

  const clickSelectedTerm = term => {
    console.log(`clicked ${ term.label }`)
  }

  const doSearch = query => {
    if (query.trim()) {
      setBusy(true)
      setSearchedQuery(query)
      api.select(query)
        .then(terms => {
          setTerms(terms)
          addSearchHistoryItem(query)
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

  const addSearchHistoryItem = query => {
    const newHistoryItem = {
      query: query,
      timestamp: new Date(),
    }
    setSearchHistory([newHistoryItem, ...searchHistory])
  }

  const deleteSearchHistoryItem = timestamp => () => {
    const index = searchHistory.findIndex(item => item.timestamp === timestamp)
    if (index === -1) {
      return
    }
    let newHistory = [...searchHistory]
    newHistory.splice(index, 1)
    setSearchHistory(newHistory)
  }

  const clearSearchHistory = () => setSearchHistory([])

  return (
    <SearchContext.Provider
      value={{
        busy, setBusy, resetSearch,
        doSearch,
        terms, selectedTerms,
        selectTerm, deselectTerm, toggleTermSelection, clearTermSelection, clickSelectedTerm,
        searchedQuery,
        searchHistory, addSearchHistoryItem, deleteSearchHistoryItem, clearSearchHistory,
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
