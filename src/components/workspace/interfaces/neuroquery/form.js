import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { createContext, useContext } from 'react'
import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'
import { TermSelects } from './term-selects'

//

axios.defaults.timeout = 5000

//

const API_URL = `https://neurobridges.renci.org:13374/query`

//

const InterfaceContext = createContext({})

export const Form = ({ searchWrapper }) => {
  const ontology = useOntology()
  const basket = useBasket()
  // `termLabels` is an object whose keys are term ids,
  // and each value is the index for the selected term label.
  const [termLabels, setTermLabels] = useState({})

  const terms = useMemo(() => {
    return basket.ids.filter(id => basket.contents[id] === 1)
      .map(item => ontology.find(item))
  }, [basket.ids])

  useEffect(() => {
    const newTermLabels = terms.reduce((obj, term) => ({ [term.id]: 0, ...obj }), {})
    setTermLabels({ ...newTermLabels, ...termLabels })
  }, [terms])

  const querystring = useMemo(() => terms.map(term => term.labels[termLabels[term.id]]).join('+'), [termLabels])
  const url = useMemo(() => `${ API_URL }?${ querystring }`, [querystring])

  const fetchResults = () => {
    searchWrapper(async () => {
      try {
        const response = await axios.get(url, {
          params: { searchTerms: querystring }
        })
        if (!response?.data?.data) {
          throw new Error('An error occurred while querying NeuroQuery.')
        }
        return response.data.data.map(result => ({
          title: result.title,
          snippet: result.snippet,
          url: result.pubmed_url,
          pmid: result.pmid,
          score: result.similarity,
        }))
      } catch (error) {
        console.error(error)
      }
      return
    })
  }

  const handleChangeTermLabel = id => event => {
    const newTermLabels = { ...termLabels, [id]: event.target.value }
    setTermLabels(newTermLabels)
  }

  return (
    <InterfaceContext.Provider value={{
      fetchResults,
      terms, termLabels,
      querystring, url,
      handleChangeTermLabel,
    }}>
      <TermSelects />
    </InterfaceContext.Provider>
  )
} 

Form.propTypes = {
  searchWrapper: PropTypes.func.isRequired,
}

export const useInterfaceContext = () => useContext(InterfaceContext)