import { forwardRef, Fragment } from 'react'
import { Button, Card, CardHeader, CardContent, Chip, Divider, Fade, Grow, IconButton, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Send as ActionIcon,
  Delete as ClearTermsIcon,
  Close as RemoveTermIcon,
  DoNotDisturb as IgnoreTermIcon,
  CheckCircleOutlined as KeepTermIcon,
  DoNotDisturb as IrrelevantTermIcon,
} from '@material-ui/icons'
import { useDialogContext } from '../'
import { Tray } from '../tray'

const useStyles = makeStyles(theme => ({
  selectionList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
  },
  selectionChip: {
    display: 'flex',
    justifyContent: 'space-between',
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

export const NodeSelectionTray = () => {
  const { selectedNodes, deselectNode, emptySelectedNodes, selectionPalette, toggleNodeSelection, openTray } = useDialogContext()
  const classes = useStyles()

  const handleClickNodeSelectionAction = () => {
    console.log(`perform action with the following terms: `, JSON.stringify(selectedNodes))
  }

  return (
    <Tray
      title="Node Selection"
      align="top"
      visibility={ openTray === 'selection' }
      actions={
        <Fragment>
          <Tooltip title="Clear selection">
            <span>
              <IconButton onClick={ emptySelectedNodes } disabled={ selectedNodes.length === 0 }>
                <ClearTermsIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            disabled={ !Object.keys(selectedNodes).length }
            disableElevation
            size="small"
            color="secondary"
            variant="contained"
            className={ classes.actionButton }
            endIcon={ <ActionIcon /> }
            onClick={ handleClickNodeSelectionAction }
          >
            Go
          </Button>
        </Fragment>
      }
    >
      {
        !Object.keys(selectedNodes).length && (
          <Typography
            paragraph
            style={{ fontSize: '90%', textAlign: 'center', marginTop: '2rem' }}
          >
            No selected nodes
          </Typography>
        )
      }
      <div className={ classes.selectionList }>
        {
          Object.keys(selectedNodes).map(id => (
            <Fade key={ `selected_${ id }` } direction="left" in={ true }>
              <Chip
                label={ id }
                color="primary"
                classes={{ root: classes.selectionChip }}
                style={{ backgroundColor: selectionPalette[selectedNodes[id]] }}
                onClick={ () => toggleNodeSelection(id) }
                onDelete={ () => deselectNode(id) }
              />
            </Fade>
          ))
        }
        </div>
    </Tray>
  )
}

