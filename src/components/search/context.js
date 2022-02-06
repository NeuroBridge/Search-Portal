import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useOntology } from '../ontology'

const SearchContext = createContext({})

export const SearchContextProvider = ({ children }) => {
  const [busy, setBusy] = useState(false)
  const [roots, setRoots] = useState({})
  const ontology = useOntology()

  /**
   * The array `roots` consists of objects that represent terms
   * and have the following shape:
   *   {
   *     iri: String,
   *     short_form: String,
   *     label: String,
   *     ontology_name: String,
   *     ontology_prefix: String,
   *     type: String,
   *     has_children: Bool,
   *     operator: String ( 'AND' | 'OR' ),
   *     relations: Array<{
   *       id: String, // from term.short_form
   *       parentId: String, // from term.short_form
   *       value: Number ( 0 | 1 | 2 ), // See (*) below
   *     }>,
   *   }
   * (*) The values of `value` reflect the user's selection:
   *   - 0: unselected
   *   - 1: selected and use (gets green check icon)
   *   - 2: selected and ignore (gets red x icon)
   */

  /**
   *
   * when `roots` changes, we check each term for
   * the `relations` property, and build it if needed.
   *
   */
  useEffect(async () => {
    // first, though, an async function to communicate with the api.
    const constructTreeRelations = async root => {
      let relations = [{ id: root.short_form, parentId: '', value: 0 }]
      try {
        const descendants = await ontology.fetchDescendants(root)
        if (!descendants.length) {
          return relations
        }
        let queue = [root]
        while (queue.length > 0) {
          const t = queue.pop()
          const children = await ontology.fetchChildren(t)
          queue = [...children, ...queue]
          relations = [
            ...relations,
            ...children.map(child => ({
              id: child.short_form,
              parentId: t.short_form,
              value: 0,
            })),
          ]
        }
        return relations
      } catch (error) {
        console.log(error)
      }
      return relations
    }
    // now, we set each root's operator and relations...
    Object.keys(roots).forEach(async id => {
      if (!roots[id].relations) {
        let newRoots = { ...roots }
        newRoots[id].relations = await constructTreeRelations(roots[id])
        newRoots[id].operator = 'AND'
        setRoots(newRoots)
      }
    })
  }, [roots])

  /**
   *
   * Root & term selection functions
   *
   */
  // adds & removes roots
  const toggleRootSelection = useCallback(root => {
    const { short_form } = root 
    let newRoots = { ...roots }
    if (short_form in newRoots) {
      delete newRoots[root.short_form]
      setRoots({ ...newRoots })
      return
    }
    newRoots[short_form] = root
    setRoots({ ...newRoots })
  }, [roots])
  
  // unselects all roots
  const clearRootSelection = useCallback(() => setRoots({}), [])

  // counts roots (this is just shorter than `Object.keys(roots).length`)
  const rootsCount = useMemo(() => Object.keys(roots).length, [roots])

  // toggles a term's value, under given root 
  const toggleTermSelection = useCallback((rootId, id, cascade = true) => {
    // make a copy of current roots state
    let newRoots = { ...roots }
    
    // get index in `newRoots` where the given term can be found
    const index = newRoots[rootId].relations
      .findIndex(rel => rel.id === id && rel.rootId === rootId)
    
    // save the current and future values of this node/relation
    const currentValue = newRoots[rootId].relations[index].value
    const newValue = (currentValue + 1) % 3

    // set this node's value, and all its descendant
    // node's values to this same newValue.
    newRoots[rootId].relations[index].value = newValue
    
    // we'll collect descendants in this array
    let descendants = [id]

    // unless `cascade` is prevented,
    if (cascade === true) {
      // add remaining descendants to the `descendants` array
      let queue = [id]
      while (queue.length > 0) {
        const t = queue.pop()
        const children = newRoots[rootId].relations
          .filter(rel => rel.parentId === t)
          .map(rel => rel.id)
        queue = [...children, ...queue]
        descendants = [...descendants, ...children]
      }
    }
    
    // now that the descendants are collected,
    // assign the respective values
    newRoots[rootId].relations.forEach((rel, i) => {
      if (descendants.includes(rel.id)) {
        newRoots[rootId].relations[i].value = newValue
      }
    })

    // define new roots
    setRoots(newRoots)
  }, [roots])
  
  const rootHasTermSelected = (root_short_form, short_form) => {
    return termValue(root_short_form, short_form) > 0
  }

  const rootSelectedTermsCount = root_short_form => {
    return roots[root_short_form].relations
      ? roots[root_short_form].relations
        .filter(rel => rel.value > 0).length
      : 0
  }

  const selectedTermsCount = useMemo(() => {
    return Object.keys(roots)
      .reduce((sum, root_short_form) => sum + rootSelectedTermsCount(root_short_form), 0)
  }, [roots])

  const clearTermSelection = () => {
    const newRoots = { ...roots }
    Object.keys(newRoots).forEach(short_form => {
      newRoots[short_form].relations.forEach(rel => rel.value = 0)
    })
    setRoots(newRoots)
  }

  const termValue = (root_short_form, short_form) => {
    const index = roots[root_short_form].relations
      .findIndex(rel => {
        return rel.id === short_form && rel.rootId === root_short_form
      })
    if (index === -1) {
      return undefined
    }
    return roots[root_short_form].relations[index].value
  }

  const startOver = () => {
    clearRootSelection()
  }

  //

  const neuroquery = useCallback(async () => {
    const searchTerms = Object.keys(roots).map(short_form => {
      const selectedTermsCount = rootSelectedTermsCount(short_form)
      if (!selectedTermsCount) {
        return ''
      }
      return roots[short_form].relations
        .filter(rel => rel.value > 0)
        .map(rel => rel.id)
        .join('+')
    }).join('+')

    try {
      console.log(searchTerms)
      const response = await axios.get(`https://neurobridges.renci.org:13374/query`, { params: { searchTerms: searchTerms } })
      console.log(response)
      if (!response?.data?.data) {
        throw new Error('An error occurred while querying Neruoquery.')
      }
      return response.data.data
    } catch (error) {
      console.log(error)
      return []
    }
  }, [roots, selectedTermsCount])

  /**
   *
   * Return
   *
   */
  
  return (
    <SearchContext.Provider
      value={{
        busy, setBusy,
        roots, rootsCount,
        toggleRootSelection, clearRootSelection,
        rootSelectedTermsCount, rootHasTermSelected, selectedTermsCount, termValue,
        toggleTermSelection, clearTermSelection,
        startOver,
        neuroquery,
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
