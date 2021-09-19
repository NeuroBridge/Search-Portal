import axios from 'axios'

//
// See OLS API Documentation: https://www.ebi.ac.uk/ols/docs/api
//

const API_ROOT = `https://neurobridges.renci.org:8444/api`
const ONTOLOGY_NAME = 'neurobridges_ontology'

export const api = {
  search: async q => {
    try {
      const { data } = await axios.get(`${ API_ROOT }/search`, {
        params: {
          q: q,
          ontology: ONTOLOGY_NAME,
          fieldList: 'iri,label,short_form,obo_id,ontology_name,ontology_prefix,description,type,has_children,comment_annotation',
          queryFields: 'label,short_form,description,type,comment_annotation',
        }
      })
      if (!data) {
        throw new Error('An error occurred while searching terms')
      }
      console.log(data.response)
      return data.response.docs
    } catch (error) {
      console.log(error)
    }
  },

  select: async q => {
    try {
      const response = await axios.get(`${ API_ROOT }/select`, { params: { ontology: ONTOLOGY_NAME, q, fieldList: 'iri,label,short_form,obo_id,ontology_name,ontology_prefix,description,type,has_children,comment_annotation' }})
      console.log(response)
      const { data } = response
      if (!data) {
        throw new Error('An error occurred while selecting terms')
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
