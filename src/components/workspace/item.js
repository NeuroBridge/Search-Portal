import { Fragment } from 'react'
import { Card, CardActionArea, CardContent, CardHeader, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import {
  Delete as CloseIcon,
} from '@mui/icons-material'
import { useBasket } from '../basket'
import { useDrawer } from '../drawer'

export const WorkspaceItem = ({ term }) => {
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