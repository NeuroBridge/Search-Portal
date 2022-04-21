import { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material'
import { useBasket } from '../basket'
import { useOntology } from '../ontology'

//

export const Workspace = () => {
  const ontology = useOntology()
  const basket = useBasket()
  const [terms, setTerms] = useState([])
  const [query, setQuery] = useState({
    description: '',
    expression: {
      and: ['AcuteDepression', 'AnxietyDisorder']
    },
  })

  useEffect(() => {
    let newTerms = []
    basket.contents.forEach(id => {
      const index = ontology.terms.findIndex(term => term.id === id)
      if (index > -1) {
        newTerms = [...newTerms, ontology.terms[index]]
      }
    })
    setTerms(newTerms)
  }, [basket.contents])

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundSize: '1rem 1rem',
      overflow: 'hidden',
    }}>
      <CardHeader title="Query Workspace" />
      <CardContent>
        <button>+ term</button>
        <button>+ expression</button>
      </CardContent>

      <Divider />

      <CardContent>
      </CardContent>

      <Divider />

      <CardContent>
        <pre>{ JSON.stringify(query, null, 2) }</pre>
      </CardContent>
    </Card>
  )
}

