import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Box, CircularProgress, Typography } from '@mui/material'

//
// See OLS API Documentation: https://www.ebi.ac.uk/ols/docs/api
//

const API_ROOT = `https://neurobridges.renci.org:8444/api`
const ONTOLOGY_NAME = 'neurobridges_ontology'

const OntologyContext = createContext({})

const api = {
  children: async term => {
    const q = encodeURIComponent(encodeURIComponent(term.iri))
    try {
      const { data } = await axios.get(`${ API_ROOT }/ontologies/${ ONTOLOGY_NAME }/terms/${ q }/children?size=250`)
      if (!data) {
        throw new Error('An error occurred while fetching children')
      }
      if (data?._embedded?.terms) {
        return data._embedded.terms
      }
    } catch (error) {
      console.error(error)
    }
    return []
  },
  descendants: async term => {
    const q = encodeURIComponent(encodeURIComponent(term.iri))
    try {
      const { data } = await axios.get(`${ API_ROOT }/ontologies/${ ONTOLOGY_NAME }/terms/${ q }/descendants?size=250`)
      if (!data) {
        throw new Error('An error occurred while fetching children')
      }
      if (data?._embedded?.terms) {
        return data._embedded.terms
      }
    } catch (error) {
      console.error(error)
    }
    return []
  },
}

export const OntologyProvider = ({ children }) => {
  const [terms, setTerms] = useState([])

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
      setTerms(terms)
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <OntologyContext.Provider value={{ api, terms }}>
      {
        terms.length
          ? children
          : (
            <Box
              sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
              <Typography paragraph>
                Fetching the NeuroBridge Ontology...
              </Typography>
            </Box>
          )
      }
    </OntologyContext.Provider>
  )
}

OntologyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useOntology = () => useContext(OntologyContext)
