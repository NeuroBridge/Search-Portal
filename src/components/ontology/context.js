import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

//
// See OLS API Documentation: https://www.ebi.ac.uk/ols/docs/api
//

const API_ROOT = `https://neurobridges.renci.org:8444/api`
const ONTOLOGY_NAME = 'neurobridges_ontology'

const OntologyContext = createContext({})

export const OntologyProvider = ({ children }) => {
  const [ontology, setOntology] = useState([])
  
  const fetchAllTerms = useCallback(async () => {
    let terms = []
    const termsEndpoint = `${ API_ROOT }/ontologies/${ ONTOLOGY_NAME }/terms`
    try {
      const { data } = await axios.get(termsEndpoint)
      if (!data) {
        throw new Error('An error occurred while fetching terms.')
      }
      let { page: { totalPages } } = data
      const promises = [...Array(totalPages).keys()].map(i => axios.get(termsEndpoint, { params: { page: i } }))
      const responses = await Promise.all(promises)
      terms = responses.reduce((arr, response) => [...arr, ...response.data._embedded.terms], [])
    } catch (error) {
      console.error(error)
    }
    return terms
  }, [])

  useEffect(async () => {
    try {
      let terms = await fetchAllTerms()
      terms = terms.map(term => ({
          ...term,
          id: term.short_form,
          ...term.annotation,
        }))
      setOntology(terms)
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <OntologyContext.Provider value={{ ontology }}>
      {
        ontology.length
          ? children
          : (
            <div>
              Fetching the NeuroBridge Ontology...
            </div>
          )
      }
    </OntologyContext.Provider>
  )
}

OntologyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useOntology = () => useContext(OntologyContext)
