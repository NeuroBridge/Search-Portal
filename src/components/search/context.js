import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'
import { navigate } from '@reach/router'
const SearchContext = createContext({})
import { useLocalStorage } from '../../hooks'
import { arrayToTree } from 'performant-array-to-tree'

export const SearchContextProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('search-history', [])
  const [busy, setBusy] = useState(false)
  const [terms, setTerms] = useState([])
  const [selectedRoots, setSelectedRoots] = useState({})
  const [selectedTerms, setSelectedTerms] = useState([])
  const [searchedQuery, setSearchedQuery] = useState('')

  useEffect(async () => {
    // when selectedRoots changes, we check each term
    // for a `tree` property, and build it if needed.

    // first, a function to fetch and construct child-parent relationships
    const constructTreeRelations = async root => {
      let relations = [{ id: root.short_form, parentId: '', rootId: root.short_form }]
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
          relations = [...relations, ...children.map(child => ({ id: child.short_form, parentId: t.short_form, rootId: root.short_form }))]
        }
        return relations
      } catch (error) {
        console.log(error)
      }
      return relations
    }

    Object.keys(selectedRoots).forEach(async label => {
      if (!selectedRoots[label].tree) {
        let newSelectedRoots = { ...selectedRoots }
        const [tree] = arrayToTree(await constructTreeRelations(selectedRoots[label]))
        newSelectedRoots[label].tree = tree
        setSelectedRoots(newSelectedRoots)
      }
    })
  }, [selectedRoots])

  /**
   *
   * Root Term Selection Functions
   *
   */
  
  const toggleRootSelection = newTerm => {
    let newRoots = { ...selectedRoots }
    const id = newTerm.short_form
    if (id in newRoots) {
      // remove the root
      delete newRoots[id]
      // remove selected terms that were descendants of this root
      const newSelectedTerms = selectedTerms.filter(t => t.rootId !== id)
      setSelectedTerms(newSelectedTerms)
    } else {
      newRoots[id] = newTerm
    }
    setSelectedRoots({ ...newRoots })
  }
  
  const selectedRootsCount = useMemo(() => Object.keys(selectedRoots).length, [selectedRoots])

  const clearRootSelection = () => {
    setSelectedRoots({})
    clearTermSelection()
  }

  /**
   *
   * All Term Selection Functions
   *
   */
  
  const toggleTermSelection = (id, rootId) => {
    let newSelectedTerms = [...selectedTerms]
    const index = newSelectedTerms.findIndex(t => t.id === id && t.rootId === rootId)
    if (index === -1) {
      newSelectedTerms.push({
        id: id,
        rootId: rootId,
        value: 1,
      })
    } else {
      newSelectedTerms[index].value = (newSelectedTerms[index].value + 1) % 3
      if (newSelectedTerms[index].value === 0) {
        newSelectedTerms.splice(index, 1)
      }
    }
    setSelectedTerms(newSelectedTerms)
  }
  
  const selectedTermsCount = useMemo(() => selectedTerms.length, [selectedTerms])

  const isSelectedTerm = useCallback(id => selectedTerms.some(t => t.id === id), [selectedTerms])

  const clearTermSelection = () => setSelectedTerms([])

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

  /**
   *
   * Search History Functions
   *
   */
  
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

  /**
   *
   * Return
   *
   */
  
  return (
    <SearchContext.Provider
      value={{
        busy, setBusy, resetSearch,
        doSearch, terms,
        selectedRoots, selectedRootsCount,
        toggleRootSelection, clearRootSelection,
        selectedTerms, selectedTermsCount, isSelectedTerm,
        toggleTermSelection, clearTermSelection,
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
