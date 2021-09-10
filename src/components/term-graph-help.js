import { forwardRef } from 'react'
import { Card, CardContent, Divider, Fade, List, ListItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(10),
    right: 0,
    backgroundColor: '#eee',
  },
  node: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginRight: theme.spacing(2),
  }
}))

const FadeTransition = forwardRef(function Transition(props, ref) {
  return <Fade direction="left" ref={ ref } { ...props } />
})

const Node = ({ color = '#ccc' }) => {
  const style = useStyles().node
  return (
    <div className={ style } style={{ backgroundColor: color }} />
  )
}

export const TermGrapHelp = ({ visible = false }) => {
  const classes = useStyles()

  return (
    <FadeTransition in={ visible }>
      <Card classes={ classes } elevation={ 0 } square>
        <CardContent>
          <List dense>
            <ListItem>
              <Node color="coral" />
              <Typography color="primary">Current term</Typography>
            </ListItem>
            <ListItem>
              <Node color="indianred" />
              <Typography color="primary">Current term's parent & children</Typography>
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
        </CardContent>
      </Card>
    </FadeTransition>
  )
}

