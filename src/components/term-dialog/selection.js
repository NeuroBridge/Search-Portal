import { forwardRef } from 'react'
import { Button, Card, CardHeader, CardContent, Divider, Fade, List, ListItem, Slide, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Close as DeleteIcon } from '@material-ui/icons'
import { useDialogContext } from './'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#378f9111',
  },
  wrapper: {
    position: 'absolute',
    bottom: theme.spacing(8),
    left: theme.spacing(2),
    clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 1rem), calc(8% + 1rem) calc(100% - 1rem), 8% 100%, calc(8% - 1rem) calc(100% - 1rem), 0% calc(100% - 1rem))',
  },
  summary: {
    textAlign: 'center',
    fontSize: '95%',
    textTransform: 'uppercase',
    backgroundColor: '#378f9133',
  },
  chip: {
    margin: 0,
    marginBottom: theme.spacing(1) / 2,
    textTransform: 'none',
    '&:hover $deleteIcon': {
      filter: 'opacity(1.0)',
    },
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
  const { selectedNodes, toggleNodeSelection, selectionVisibility } = useDialogContext()
  const classes = useStyles()

  return (
    <FadeTransition in={ selectionVisibility }>
      <div className={ classes.wrapper }>
        <Card classes={ classes } elevation={ 0 } square>
          <CardHeader disableTypography title={ `${ selectedNodes.length } node${ selectedNodes.length === 1 ? '' : 's' } selected` } className={ classes.summary } />
          <CardContent>
            <List dense>
              {
                selectedNodes.map(id => (
                  <Slide key={ `selected_${ id }` } direction="right" in={ true }>
                    <ListItem
                      className={ classes.listItem }
                      component={ Button }
                      size="small"
                      color="secondary"
                      classes={{ root: classes.chip, label: classes.chipLabel, endIcon: classes.deleteIcon }}
                      onClick={ () => toggleNodeSelection(id) }
                      endIcon={ <DeleteIcon /> }
                    >{ id }</ListItem>
                  </Slide>
                ))
              }
            </List>
          </CardContent>
        </Card>
      </div>
    </FadeTransition>
  )
}

