import { useEffect, useState } from 'react'
import { Paper } from '@mui/material'
import { useBasket } from '../basket'
import { useOntology } from '../ontology'
import { WorkspaceItem } from './item'

//

export const Workspace = () => {
  const ontology = useOntology()
  const basket = useBasket()
  const [terms, setTerms] = useState([])

  useEffect(() => {
    let newTerms = []
    basket.contents.forEach(id => {
      const index = ontology.terms.findIndex(term => term.id === id)
      if (index > -1) {
        newTerms.push(ontology.terms[index])
      }
    })
    setTerms(newTerms)
  }, [basket.contents])

  return (
    <Paper sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      padding: '1rem',
      background: 'radial-gradient(#33669944 0px, transparent 3px)',
      backgroundColor: '#33669933',
      backgroundSize: '1rem 1rem',
    }}>
      { terms.map(term => <WorkspaceItem key={ term.id } term={ term } />) }
    </Paper>
  )
}
