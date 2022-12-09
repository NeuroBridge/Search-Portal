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

    const allShapedRight = terms.every(term => {
      const termKeys = Object.keys(term).sort((t, u) => t.id < u.id ? -1 : 1)
      return JSON.stringify(termKeys) === '["id","labels","parentId"]'
    })
    expect(allShapedRight).toBe(true)
  });
});
