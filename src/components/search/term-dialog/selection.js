import { forwardRef, Fragment } from 'react'
import { Button, Card, CardHeader, CardContent, Divider, Fade, Grow, IconButton, List, ListItem, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Send as ActionIcon,
  Delete as ClearTermsIcon,
  Close as RemoveTermIcon,
} from '@material-ui/icons'
import { useDialogContext } from './'
import { Popup } from './popup'

const useStyles = makeStyles(theme => ({
  chip: {
    margin: 0,
    textTransform: 'none',
    '&:hover $removeTermIcon': {
      filter: 'opacity(1.0)',
      fill: 'indianred',
    },
  },
  removeTermIcon: {
    filter: 'opacity(0.25)',
    transition: 'filter 250ms',
  },
  actionButton: {
  }
}))

const GrowTransition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ ref } { ...props } />
})

export const NodeSelection = () => {
  const { selectedNodes, emptySelectedNodes, toggleNodeSelection, selectionVisibility } = useDialogContext()
  const classes = useStyles()

  const handleClickNodeSelectionAction = () => {
    console.log(`perform action with the following terms: `, JSON.stringify(selectedNodes))
  }

  return (
    <Popup
      title="Node Selection"
      align="top"
      visibility={ selectionVisibility }
      actions={
        <Fragment>
          <Tooltip title="Clear selection">
            <IconButton onClick={ emptySelectedNodes } disabled={ selectedNodes.length === 0 }>
              <ClearTermsIcon />
            </IconButton>
          </Tooltip>
          <Button
            disabled={ !selectedNodes.length }
            disableElevation
            size="small"
            color="secondary"
            variant="outlined"
            className={ classes.actionButton }
            endIcon={ <ActionIcon /> }
            onClick={ handleClickNodeSelectionAction }
            children={ 'Go' }
          />
        </Fragment>
      }
    >
      {
        !selectedNodes.length && (
          <Typography
            paragraph
            style={{ fontSize: '90%', textAlign: 'center', marginTop: '2rem' }}
            children={ `No selected nodes` }
          />
        )
      }
      <List dense>
        {
          selectedNodes.map(id => (
            <Fade key={ `selected_${ id }` } direction="left" in={ true }>
              <ListItem
                className={ classes.listItem }
                component={ Button }
                size="small"
                color="secondary"
                classes={{ root: classes.chip }}
                onClick={ () => toggleNodeSelection(id) }
                endIcon={ <RemoveTermIcon className={ classes.removeTermIcon } /> }
              >{ id }</ListItem>
            </Fade>
          ))
        }
      </List>
    </Popup>
  )
}

