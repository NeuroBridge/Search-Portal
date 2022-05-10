import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Paper,
  Card, CardActionArea, CardContent, CardHeader, IconButton,
} from '@mui/material'
import { useBasket } from './context'
import { useDrawer } from '../drawer'
import { useOntology } from '../ontology'
import {
  Delete as CloseIcon,
  Check as SelectedIcon,
  DoNotDisturbAlt as IgnoreIcon,
} from '@mui/icons-material'


//

export const BasketItem = ({ term }) => {
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
            { basket.contents[term.id] === 0 && <IgnoreIcon fontSize="small" sx={{ color: '#f99' }} /> }
            { basket.contents[term.id] === 1 && <SelectedIcon fontSize="small" sx={{ color: '#fff' }} /> }
          </IconButton>
          <IconButton onClick={ () => basket.remove(term.id) }>
            <CloseIcon fontSize="small" sx={{ color: '#fff' }} />
          </IconButton>
        </CardContent> 
      </Card>
    </Fragment>
  )
}

BasketItem.propTypes = {
  term: PropTypes.object.isRequired,
}

//

export const Basket = () => {
  const ontology = useOntology()
  const basket = useBasket()
  const [terms, setTerms] = useState([])

  useEffect(() => {
    let newTerms = []
    basket.ids.forEach(id => {
      const index = ontology.terms.findIndex(term => term.id === id)
      if (index > -1) {
        newTerms.push(ontology.terms[index])
      }
    })
    setTerms(newTerms)
  }, [basket.ids])

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
          terms.map(term => <BasketItem key={ `workspace-item-${ term.id }` } term={ term } />)
        }
      </Box>
    </Paper>
  )
}

