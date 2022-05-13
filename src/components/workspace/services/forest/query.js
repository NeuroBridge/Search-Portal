import { useMemo } from 'react'
import { CardContent } from '@mui/material'
import { useForest } from './context'
import { useOntology } from '../../../ontology'
import { useBasket } from '../../../basket'

export const Query = () => {
  const ontology = useOntology()
  const basket = useBasket()
  const { values } = useForest()

  // this is basically a copy of the ids of the basket contents,
  // with the non-checked (value = 0) ones filtered out.
  const roots = useMemo(() => {
    return [...basket.ids.filter(id => basket.contents[id] === 1)]
  }, [basket.ids])

  // here, we construct the query.
  const query = useMemo(() => {
    const groups = roots.reduce((obj, root) => {
      return {
        ...obj,
        [root]: [
          ...ontology
            .descendantsOf(root)
            .map(term => term.id)
        ]
      }
    }, {})
    let q = {
      description: '...',
      expression: {},
    }
    q.expression.or = []
    roots.forEach(id => {
      q.expression.or.push({
        and: [
          ...groups[id]
            .filter(id => values[id] !== 0)
            .map(id => values[id] === 1 ? id : { not: [id] }),
        ]
      })
    })
    return q
  }, [roots, values])

  return (
    <CardContent>
      <pre style={{
        backgroundColor: '#eee',
        color: '#789',
        fontSize: '75%',
        margin: 0,
        padding: '0.5rem',
        whiteSpace: 'pre-wrap',
      }}>
        { JSON.stringify(query, null, 2) }
      </pre>
    </CardContent>
  )
}
