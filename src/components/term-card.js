import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  AppBar, Button, Card, CardContent, Divider, IconButton, Grid, LinearProgress, Paper, InputBase, Toolbar, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ZoomOutMap as ViewTermIcon,
  Search as SearchIcon,
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  termCard: {
    padding: theme.spacing(2),
    fontSize: '80%',
    position: 'relative',
    borderLeft: `0.5rem solid ${ theme.palette.primary.light }`,
    filter: 'opacity(0.8)',
    transition: 'filter 250ms, border-color 250ms',
    '&:hover': {
      filter: 'opacity(1.0)',
      borderColor: theme.palette.secondary.light,
    },
  },
  viewTermButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
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
      <Typography variant="h6" component="h2">{ term.label }</Typography>
      <Divider />
      <Typography paragraph>{ term.comment_annotation || 'N/A' }</Typography>
      <IconButton
        className={ classes.viewTermButton }
        size="small"
        variant="contained"
        color="primary"
        onClick={ clickHandler }
        children={ <ViewTermIcon fontSize="small" /> }
      />
    </Card>
  )
}
