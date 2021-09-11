import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  AppBar, Button, Card, CardActionArea, CardContent, Divider, IconButton, Grid, LinearProgress, Paper, InputBase, Toolbar, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ZoomOutMap as ViewTermIcon,
  Search as SearchIcon,
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  termCard: {
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
  actionArea: {
    padding: theme.spacing(2),
    '&:hover $viewTermIcon': {
      filter: 'opacity(1.0)',
      transform: 'scale(1.0)',
    },
  },
  viewTermIcon: {
    filter: 'opacity(0.1)',
    transition: 'filter 250ms',
    transform: 'scale(0.9)',
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
      <CardActionArea className={ classes.actionArea } onClick={ clickHandler }>
        <Typography variant="h6" component="h2">{ term.label }</Typography>
        <Divider />
        {
          term.comment_annotation ? (
            <Typography paragraph color="textPrimary">{ term.comment_annotation }</Typography>
          ) : (
            <Typography paragraph color="textSecondary">no comment_annotation present</Typography>
          )
        }
        <ViewTermIcon
          className={ classes.viewTermIcon }
          fontSize="small"
        />
      </CardActionArea>
    </Card>
  )
}
