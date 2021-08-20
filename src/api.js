import axios from 'axios'

//
// See OLS API Documentation: https://www.ebi.ac.uk/ols/docs/api
//

const API_ROOT = `https://neurobridges.renci.org:8444/api`
const ONTOLOGY_NAME = 'neurobridges_ontology'

export const api = {
  select: async q => {
    try {
      const { data } = await axios.get(`${ API_ROOT }/select`, { params: { ontology: ONTOLOGY_NAME, q }})
      if (!data) {
        throw new Error('An error occurred while fetching terms')
      }
      return data.response.docs
    } catch (error) {
      console.log(error)
    }
  },

  hierarchicalChildren: async q => {
    try {
      const { data } = await axios.get(`${ API_ROOT }/ontologies/${ ONTOLOGY_NAME }/terms/${ q }/hierarchicalChildren`)
      if (!data) {
        throw new Error('An error occurred while fetching children')
      }
      if (data?._embedded?.terms) {
        return data._embedded.terms
      }
    } catch (error) {
      console.log(error)
    }
    return []
  },

  hierarchicalParents: async q => {
    try {
      const { data } = await axios.get(`${ API_ROOT }/ontologies/${ ONTOLOGY_NAME }/terms/${ q }/hierarchicalParents`)
      if (!data) {
        throw new Error('An error occurred while fetching children')
      }
      if (data?._embedded?.terms) {
        return data._embedded.terms
      }
    } catch (error) {
      console.log(error)
    }
    return []
  },
  
}
