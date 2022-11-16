import { createContext, useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { arrayToTree } from 'performant-array-to-tree'

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

const extractIdFromIri = iri => {
  const idPattern = new RegExp(/^.+#(.+)$/)
  const matches = idPattern.exec(iri)
  if (!matches[1]) {
    return iri
  }
  return matches[1]
}

export const OntologyProvider = ({ children, owlFile }) => {
  const terms = useMemo(() => {
    return owlFile['rdf:RDF']['owl:Class'].map(term => {
      // every term will have this shape
      const termObject = {
        id: '',
        labels: [],
        parentId: null,
      }
      // we'll pull the id off the end of the IRI
      termObject.id = extractIdFromIri(term['$']['rdf:about'])
      // labels
      if (term['rdfs:label']) {
        termObject.labels = term['rdfs:label']
          .map(label => label._)
      }
      // check for parent term and add its ID to term object if so.
      // this will help construct a subtree rooted at a given term.
      if ('rdfs:subClassOf' in term) {
        termObject.parentId = extractIdFromIri(term['rdfs:subClassOf'][0]['$']['rdf:resource'])
      }
      return termObject
    }).sort((t, u) => {
      return t.id.toLowerCase() < u.id.toLowerCase() ? -1 : 1
    })
  }, [owlFile])

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
      console.log(error)
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
    <OntologyContext.Provider value={{ terms, termFields, trees, find, childrenOf, descendantsOf, pathToRoot, generateGraph }}>
      { children }
    </OntologyContext.Provider>
  )
}

OntologyProvider.propTypes = {
  children: PropTypes.node.isRequired,
  owlFile: PropTypes.object,
}

export const useOntology = () => useContext(OntologyContext)
