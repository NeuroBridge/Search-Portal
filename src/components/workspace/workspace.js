import { useEffect, useState } from 'react'
import { Box, Divider, Paper } from '@mui/material'
import { useBasket } from '../basket'
import { useOntology } from '../ontology'
import { WorkspaceItem } from './item'
import { ServicesInterface } from './services-interface'

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
      flexDirection: 'column',
      background: 'radial-gradient(#33669944 0px, transparent 3px)',
      backgroundColor: '#33669933',
      backgroundSize: '1rem 1rem',
      overflow: 'hidden',
    }}>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '1rem',
      }}>
        {
          terms.map(term => <WorkspaceItem key={ `workspace-item-${ term.id }` } term={ term } />)
        }
      </Box>
      <Divider />
      <Box sx={{
        backgroundColor: '#eee',
        padding: '1rem',
      }}>
        <ServicesInterface />
      </Box>
    </Paper>
  )
}

