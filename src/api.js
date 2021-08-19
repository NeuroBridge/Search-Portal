import axios from 'axios'

const API_ROOT = `https://neurobridges.renci.org:8444/api`

export const api = {
  select: async q => {
    try {
      const { data } = await axios.get(`${ API_ROOT }/select`, { params: { ontology: 'neurobridges_ontology', q }})
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
      const { data } = await axios.get(`${ API_ROOT }/ontologies/neurobridges_ontology/terms/${ q }/hierarchicalChildren`)
      if (!data) {
        throw new Error('An error occurred while fetching children')
      }
      return data._embedded.terms
    } catch (error) {
      console.log(error)
    }
    return []
  },

  hierarchicalParents: async q => {
    try {
      const { data } = await axios.get(`${ API_ROOT }/ontologies/neurobridges_ontology/terms/${ q }/hierarchicalParents`)
      if (!data) {
        throw new Error('An error occurred while fetching children')
      }
      return data._embedded.terms
    } catch (error) {
      console.log(error)
    }
    return []
  },
}
