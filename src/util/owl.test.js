const fs = require('fs');
const parseString = require('xml2js').parseString;
import { extractIdFromIri, extractTerms } from './owl';

const owl = fs.readFileSync('./src/data/ontology.owl', 'utf8');

//

test('id extraction from iri works', () => {
  const iri = 'http://maven.renci.org/NeuroBridge/neurobridge#Schizophrenia';
  const id = extractIdFromIri(iri);
  expect(id).toBe('Schizophrenia');
});

test('term extraction from owl file works', () => {
  parseString(owl, function(error, obj) {
    const terms = extractTerms(obj);
    expect(terms.length).toBeGreaterThan(0);

    /*
      this test verifies that each term is shaped like this example:
      {
        id: 'CatatonicSchizophrenia',
        labels: [ 'CatatonicSchizophrenia', 'Schizophrenia, catatonic' ],
        parentId: 'Schizophrenia'
      },
    */
    const allShapedRight = terms.every(term => {
      const termKeys = Object.keys(term)
      return (
        JSON.stringify(termKeys.sort()) === '["id","labels","parentId"]'
          && typeof term.id === 'string'
          && Array.isArray(term.labels)
          && (typeof term.parentId === 'string' || term.parentId === null)
      )
    })
    expect(allShapedRight).toBe(true)
  });
});
