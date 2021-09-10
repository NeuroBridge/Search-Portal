import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, Fade, List, ListItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#378f9111',
  },
  wrapper: {
    position: 'absolute',
    bottom: theme.spacing(8),
    right: theme.spacing(6),
    clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 1rem), calc(79% + 1rem) calc(100% - 1rem), 79% 100%, calc(79% - 1rem) calc(100% - 1rem), 0% calc(100% - 1rem))',
  },
  header: {
    backgroundColor: '#378f9133',
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

export const GraphHelp = () => {
  const { helpVisibility } = useDialogContext()
  const classes = useStyles()

  return (
    <FadeTransition in={ helpVisibility }>
      <div className={ classes.wrapper }>
        <Card classes={ classes } elevation={ 0 } square>
          <CardHeader disableTypography title="Help" className={ classes.header } />
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
      </div>
    </FadeTransition>
  )
}

