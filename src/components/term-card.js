import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  AppBar, Button, Card, CardContent, IconButton, Grid, LinearProgress, Paper, InputBase, Toolbar, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ZoomOutMap as ViewTermIcon,
  Search as SearchIcon,
} from '@material-ui/icons'
import { TermDetails } from './term-details'

const useStyles = makeStyles(theme => ({
  termCard: {
    padding: theme.spacing(2),
    fontSize: '80%',
    position: 'relative',
    filter: 'opacity(0.8)',
    transition: 'filter 250ms',
    '&:hover': {
      filter: 'opacity(1.0)',
    }
  },
  viewTermButton: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
}))

export const TermCard = ({ term, clickHandler }) => {
  const classes = useStyles()
  return (
    <Card
      key={ term.label }
      variant="outlined"
      className={ classes.termCard }
    >
      <TermDetails term={ term } />
      <IconButton
        className={ classes.viewTermButton }
        size="small"
        variant="contained"
        color="secondary"
        onClick={ clickHandler }
        children={ <ViewTermIcon fontSize="small" /> }
      />
    </Card>
  )
}
