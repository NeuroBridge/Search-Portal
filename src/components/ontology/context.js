import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { api } from '../../api'

const OntologyContext = createContext({})

export const OntologyProvider = ({ children }) => {
  const [ontology, setOntology] = useState([])

  useEffect(async () => {
    try {
      let terms = await api.allTerms()
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
