/*
given a long IRI string, this pulls out the term id
*/
export const extractIdFromIri = iri => {
  const idPattern = new RegExp(/^.+#(.+)$/)
  const matches = idPattern.exec(iri)
  if (!matches[1]) {
    return iri
  }
  return matches[1]
}

/*
given the OWL file, as an object,
this function pulls out the ontology terms.
*/
export const extractTerms = owl => owl['rdf:RDF']['owl:Class'].map(term => {
  // every term will have this shape
  const termObject = {
    id: '',
    labels: [],
    parentId: null,
    seeAlso: null,
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
  // is see also present?
  if ('rdfs:seeAlso' in term) {
    termObject.seeAlso = term['rdfs:seeAlso'][0]._
  }
  
  return termObject
}).sort((t, u) => {
  return t.id.toLowerCase() < u.id.toLowerCase() ? -1 : 1
})

