import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'
import axios from 'axios'
import { Forest } from './selection-forest'
import { useWorkspace } from '../../workspace'

//

axios.defaults.timeout = 5000

//

const API_URL = `https://neurobridges-ml.renci.org/nb_translator`

//

const InterfaceContext = createContext({})

export const Form = () => {
  const { register } = useWorkspace()
  const ontology = useOntology()
  const basket = useBasket()
  const [values, setValues] = useState({})

  // this effect gets triggered when the basket contents update.
  // it handles updating the values this component holds in its state by
  // first starting with a base selection of "0" for all basket terms and their
  // descendants, and then spreading in the existing state already in state.
  useEffect(() => {
    const previousValues = { ...values }
    let baseValues
    basket.ids
      .forEach(id => {
        const descendants = [
          id,
          ...ontology.descendantsOf(id).map(term => term.id),
        ]
        baseValues = {
          ...baseValues,
          ...descendants
            .reduce((obj, id) => ({ [id]: 0, ...obj }), {}),
        }
      })
      setValues({ ...baseValues, ...previousValues })
  }, [basket.ids])

  const toggleTermSelection = id => event => {
    const newValue = (values[id] + 1) % 3
    const newValues = { ...values, [id]: newValue }
    // if the CTRL key is held down, then also toggle all
    // descendants to have the same state as the clicked term.
    if (event.nativeEvent.ctrlKey) {
      ontology.descendantsOf(id).forEach(term => {
        newValues[term.id] = newValue
      })
    }
    setValues(newValues)
  }

  // this is basically a copy of the ids of the basket contents,
  // with the non-checked (value = 0) ones filtered out.
  const roots = useMemo(() => {
    return [...basket.ids.filter(id => basket.contents[id] === 1)]
  }, [basket.ids])

  // here, we construct the query.
  const query = useMemo(() => {
    const groups = roots.reduce((obj, root) => {
      return {
        ...obj,
        [root]: [
          ...ontology
            .descendantsOf(root)
            .map(term => term.id)
        ]
      }
    }, {})
    let _query = { and: [] }
    roots.forEach(id => {
      _query.and.push({
        or: [
          ...groups[id]
            .filter(id => values[id] !== 0)
            .map(id => values[id] === 1 ? id : { not: [id] }),
        ]
      })
    })
    if (roots.length === 1) {
      _query = _query.and[0]
    }
    return _query
  }, [roots, values])

  const fetchResults = useCallback(() => {
    return axios.post(
      API_URL,
      JSON.stringify({ query: { expression: query }, max_res: 100 }),
      { headers: { 'Content-Type': 'text/html;charset=utf-8' } },
    ).then(response => {
      if (!response?.data?.docs) {
        throw new Error('An error occurred while fetching results.')
      }
      const results = response.data.docs
        .map(result => ({
          title: result.title,
          snippet: result.snippet,
          score: result.score,
          pmid: result.pmid,
          pubmed_url: result.pmc_link,
          pmcid: result.pmcid,
          pmc_url: result.pmc_link,
        }))
      return results
    }).catch(error => {
      console.error(error.message)
      return []
    })
  }, [values])

  useLayoutEffect(() => {
    register('neurobridge2', fetchResults)
  }, [fetchResults])

  return (
    <InterfaceContext.Provider value={{ values, toggleTermSelection, query }}>
      <Forest />
    </InterfaceContext.Provider>
  )
} 

export const useInterfaceContext = () => useContext(InterfaceContext)
