import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Card, CardActionArea, CardHeader, Fab, Paper, Tooltip, Zoom,
} from '@mui/material'
import { useBasket } from './context'
import { useDrawer } from '../drawer'
import { useOntology } from '../ontology'
import {
  Close as RemoveIcon,
  Delete as ClearIcon,
  Visibility as SelectedIcon,
  VisibilityOff as IgnoreIcon,
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
        borderRadius: '3px',
        display: 'flex',
        '& button': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pl: 1,
        },
        '& .MuiSvgIcon-root': {
          transform: 'scale(0.75)',
        }
      }}>
        <CardActionArea onClick={ () => drawer.setTermId(term.id) }>
          <CardHeader title={ term.id } disableTypography sx={{ p: 1 }} />
        </CardActionArea>
        <Tooltip
          title={ `${ basket.contents[term.id] === 0 ? 'Show' : 'Hide' } term` }
          placement="top"
        >
          <CardActionArea onClick={ () => basket.toggle(term.id) } sx={{ p: 1 }}>
            { basket.contents[term.id] === 0 &&
                <IgnoreIcon sx={{ color: '#aaa' }} /> }
            { basket.contents[term.id] === 1 &&
                <SelectedIcon sx={{ color: '#fff' }} /> }
          </CardActionArea>
        </Tooltip>
        <Tooltip title="Remove term from workspace" placement="top">
          <CardActionArea onClick={ () => basket.remove(term.id) } sx={{p: 1 }}>
            <RemoveIcon />
          </CardActionArea>
        </Tooltip>  
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
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundSize: '1rem 1rem',
      overflow: 'hidden',
      borderTop: '1px solid #44668899',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 9,
      borderRadius: 0,
    }}>
      <Paper sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(#33669944 0px, transparent 2px)',
        backgroundColor: '#44668833',
        backgroundSize: '0.5rem 0.5rem',
        overflow: 'hidden',
        minHeight: '80px',
        borderRadius: 0,
        position: 'relative',
        flexWrap: 'wrap',
        gap: '0.5rem',
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
        <Zoom in={ !!basket.ids.length }>
          <Tooltip placement="top" title="Clear all terms from workspace">
            <Fab
              color="primary"
              size="small"
              sx={{ position: 'absolute', right: '1rem', bottom: '1rem', zIndex: 9, }}
              onClick={ basket.empty }
            ><ClearIcon fontSize="small" /></Fab>
          </Tooltip>
        </Zoom>
      </Paper>
    </Card>
  )
}

