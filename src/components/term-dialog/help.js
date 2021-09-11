import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, Grow, List, ListItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'absolute',
    bottom: theme.spacing(8),
    right: theme.spacing(1),
    backgroundColor: '#cce3e3aa',
    padding: '1px',
    clipPath: `polygon(
      0% 0%,
      100% 0%,
      100% calc(100% - 1rem),
      calc(100% - 5.75rem) calc(100% - 1rem),
      calc(100% - 6.75rem) 100%,
      calc(100% - 7.75rem) calc(100% - 1rem),
      0% calc(100% - 1rem)
    )`,
  },
  root: {
    backgroundColor: '#f2f8f8aa',
    clipPath: `polygon(
      0% 0%,
      100% 0%,
      100% calc(100% - 1rem),
      calc(100% - 5.75rem) calc(100% - 1rem),
      calc(100% - 6.75rem) calc(100% - 1px),
      calc(100% - 7.6rem) calc(100% - 1rem),
      0% calc(100% - 1rem)
    )`,
  },
  header: {
    backgroundColor: '#cce3e3aa',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  node: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    position: 'relative',
  },
  selectedNode: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: '50%',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      width: theme.spacing(3),
      height: theme.spacing(3),
      backgroundColor: 'transparent',
      border: '3px solid #378f91',
    }
  }
}))

const GrowTransition = forwardRef(function Transition(props, ref) {
  return <Grow direction="left" ref={ ref } { ...props } />
})

const Node = ({ color = '#ccc', selected = false }) => {
  const classes = useStyles()

  return (
    <div className={ `${ classes.node } ${ selected ? classes.selectedNode : undefined }` } style={{ backgroundColor: color }} />
  )
}

export const GraphHelp = () => {
  const { helpVisibility } = useDialogContext()
  const classes = useStyles()

  return (
    <GrowTransition in={ helpVisibility }>
      <div className={ classes.wrapper }>
        <Card classes={ classes } elevation={ 0 } square>
          <CardHeader disableTypography title="Help" className={ classes.header } />
          <CardContent>
            <List dense>
              <ListItem>
                <Node color="indianred" />
                <Typography color="primary">Current term, parents, & children</Typography>
              </ListItem>
              <ListItem>
                <Node color="slategrey" />
                <Typography color="primary">Term</Typography>
              </ListItem>
            </List>
            <Divider />
            <List dense>
              <ListItem>
                <Typography color="primary"><strong>Solid:</strong>&nbsp; Has children</Typography>
              </ListItem>
              <ListItem>
                <Typography color="primary"><strong>Empty:</strong>&nbsp; Childless</Typography>
              </ListItem>
            </List>
            <Divider />
            <List dense>
              <ListItem>
                <Typography color="primary"><strong>Left click:</strong>&nbsp; Reveal children</Typography>
              </ListItem>
              <ListItem>
                <Typography color="primary"><strong>Right click:</strong>&nbsp; Select node</Typography>
              </ListItem>
            </List>
            <Divider />
            <List dense>
              <ListItem>
                <Node selected />
                <Typography color="primary">Selected node</Typography>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </div>
    </GrowTransition>
  )
}

