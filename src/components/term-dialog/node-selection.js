import { forwardRef } from 'react'
import { Button, Card, CardContent, Divider, Fade, List, ListItem, Slide, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Close as DeleteIcon,
  ArrowForward as ActionIcon,
} from '@material-ui/icons'
import { useDialogContext } from './context'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    bottom: theme.spacing(10),
    backgroundColor: '#eee',
  },
  node: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginRight: theme.spacing(2),
  },
  selection: {
    display: 'flex',
    position: 'absolute',
    left: 0,
    top: 0,
    transform: 'none',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
  },
  summary: {
    fontSize: '95%',
    backgroundColor: 'transparent',
    padding: '4px 5px',
    fontWeight: 'bold',
  },
  chips: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
  },
  chip: {
    marginBottom: theme.spacing(1) / 2,
    '&:hover $deleteIcon': {
      filter: 'opacity(1.0)',
    },
  },
  chipLabel: {
    fontSize: '85%',
    textTransform: 'none',
  },
  deleteIcon: {
    filter: 'opacity(0.25)',
    transition: 'filter 250ms',
  },
}))

const FadeTransition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ ref } { ...props } />
})

export const NodeSelection = () => {
  const { selectedNodes, toggleNodeSelection } = useDialogContext()
  const classes = useStyles()

  return (
    <FadeTransition in={ !!selectedNodes.length }>
      <Card classes={ classes } elevation={ 0 } square>
        <CardContent>
          <Typography className={ classes.summary } color="primary">
            { selectedNodes.length } node{ selectedNodes.length === 1 ? '' : 's' } selected:
          </Typography>
          <List dense>
            {
              selectedNodes.map(id => (
                <Slide key={ `selected_${ id }` } direction="right" in={ true }>
                  <ListItem>
                    <Button
                      size="small"
                      color="secondary"
                      classes={{ root: classes.chip, label: classes.chipLabel, endIcon: classes.deleteIcon }}
                      onClick={ () => toggleNodeSelection(id) }
                      endIcon={ <DeleteIcon /> }
                    >{ id }</Button>
                  </ListItem>
                </Slide>
              ))
            }
          </List>
        </CardContent>
      </Card>
    </FadeTransition>
  )
}

