import { createContext, useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { arrayToTree } from 'performant-array-to-tree'
import { extractTerms } from '../../util/owl'
const OntologyContext = createContext({})

// this array describes the fields that comprise a term...
// ...at least the ones that the user will see. each field's
// `type` will (1) inform our search function how to test for
// the user's query and (2) indicate how it should be rendered.
const termFields = [
  {
    key: 'id',
    readableName: 'ID',
    type: 'string',
  },
  {
    key: 'parentId',
    readableName: 'Parent ID',
    type: 'string',
  },
  {
    key: 'labels',
    readableName: 'Labels',
    type: 'array',
  },
]

//

export const OntologyProvider = ({ children, owlFile }) => {
  const meta = useMemo(() => ({
    version: owlFile['rdf:RDF']['owl:Ontology'][0]['owl:versionInfo'][0]['_'],
    comment: owlFile['rdf:RDF']['owl:Ontology'][0]['rdfs:comment'][0]['_'],
    editorialNote: owlFile['rdf:RDF']['owl:Ontology'][0]['prov:editorialNote'][1]['_'],
  }), [owlFile])
  
  const terms = useMemo(() => {
    return extractTerms(owlFile)
  }, [owlFile])

  console.log(terms)

  const trees = useMemo(() => {
    if (!terms) {
      return
    }
    return arrayToTree(terms)
  }, [terms])

  const find = useCallback(id => {
    try {
      const index = terms.findIndex(term => term.id === id)
      return terms[index]
    } catch (error) {
      console.error(error.message)
      return null
    }
  }, [terms])

  const childrenOf = useCallback(id => {
    return terms.filter(term => term.parentId === id)
  }, [])

  const descendantsOf = useCallback((id, options = { strict: false }) => {
    const root = find(id)
    let descendants = options.strict ? [] : [root]
    const children = childrenOf(id)
    children.forEach(child => {
      descendants = [...descendants, ...descendantsOf(child.id)]
    })

    return descendants
  }, [])

  // this function generates the graph data object for the ForceGraph2D component.
  const generateGraph = terms => {
    const nodes = [...terms]
    const links = terms.reduce((collection, term) => {
      // if the term has a parent, create an edge...
      if (term.parentId) {
        return [...collection, { source: term.id, target: term.parentId }]
      }
      // ...otherwise, continue on with what we've collected thus far.
      return [...collection]
    }, [])
    return { nodes, links }
  }

  const pathToRoot = id => {
    let path = []
    let term = find(id)
    while (term) {
      path.unshift(term.id)
      term = find(term.parentId)
    }
    return path
  }

  return (
    <OntologyContext.Provider value={{ terms, termFields, trees, find, childrenOf, descendantsOf, pathToRoot, generateGraph, meta }}>
      { children }
    </OntologyContext.Provider>
  )
}

OntologyProvider.propTypes = {
  children: PropTypes.node.isRequired,
  owlFile: PropTypes.object,
}

export const useOntology = () => useContext(OntologyContext)
