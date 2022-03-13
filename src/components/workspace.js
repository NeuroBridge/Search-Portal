import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Card, CardActionArea, CardContent, CardHeader, IconButton, Paper } from '@mui/material'
import {
  Delete as CloseIcon,
} from '@mui/icons-material'
import { useBasket } from './basket'
import { useDrawer } from './drawer'
import { useOntology } from './ontology'

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

//

const WorkspaceItem = ({ term }) => {
  const basket = useBasket()
  const drawer = useDrawer()

  return (
    <Fragment>
      <Card sx={{
        backgroundColor: '#234',
        color: '#def',
        fontSize: '75%',
        borderRadius: '4px',
        display: 'flex',
      }}>
        <CardActionArea onClick={ () => drawer.setTermId(term.id) }>
          <CardHeader title={ term.id } disableTypography />
        </CardActionArea>
        <CardContent sx={{
          backgroundColor: '#ffffff11',
          padding: '0 !important',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
          <IconButton onClick={ () => basket.toggle(term.id) }>
            <CloseIcon fontSize="small" sx={{ color: '#fff' }} />
          </IconButton>
        </CardContent> 
      </Card>
    </Fragment>
  )
}

WorkspaceItem.propTypes = {
  term: PropTypes.object.isRequired,
}