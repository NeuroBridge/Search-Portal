import { forwardRef } from 'react'
import { Button, Card, CardHeader, CardContent, Divider, Grow, List, ListItem, Slide, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Close as DeleteIcon,
  Send as ActionIcon,
} from '@material-ui/icons'
import { useDialogContext } from './'
import { Popup } from './popup'

const useStyles = makeStyles(theme => ({
  chip: {
    margin: 0,
    textTransform: 'none',
    '&:hover $deleteIcon': {
      filter: 'opacity(1.0)',
      fill: 'indianred',
    },
  },
  deleteIcon: {
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
  const { selectedNodes, toggleNodeSelection, selectionVisibility } = useDialogContext()
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
            <Slide key={ `selected_${ id }` } direction="left" in={ true }>
              <ListItem
                className={ classes.listItem }
                component={ Button }
                size="small"
                color="secondary"
                classes={{ root: classes.chip }}
                onClick={ () => toggleNodeSelection(id) }
                startIcon={ <DeleteIcon className={ classes.deleteIcon } /> }
              >{ id }</ListItem>
            </Slide>
          ))
        }
      </List>
    </Popup>
  )
}

