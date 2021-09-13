import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, Grow, List, ListItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'
import { Popup } from '../popup'

const useStyles = makeStyles(theme => ({
  node: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    position: 'relative',
  },
  listItemText: {
    fontSize: '90%',
  },
  selectedNode: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '50%',
      top: '50%',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      width: theme.spacing(7) / 2,
      height: theme.spacing(7) / 2,
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
    <Popup title="Help" align="bottom" visibility={ helpVisibility }>
      <List dense>
        <ListItem>
          <Node color="indianred" />
          <Typography color="primary" className={ classes.listItemText }>
            Current term,<br />its parents, & children
          </Typography>
        </ListItem>
        <ListItem>
          <Node color="slategrey" />
          <Typography color="primary" className={ classes.listItemText }>
            General Term
          </Typography>
        </ListItem>
        <ListItem>
          <Node selected />
          <Typography color="primary" className={ classes.listItemText }>
            Selected term
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem>
          <Typography color="primary" className={ classes.listItemText }>
            <strong>Solid:</strong>&nbsp; Has children
          </Typography>
        </ListItem>
        <ListItem>
          <Typography color="primary" className={ classes.listItemText }>
            <strong>Empty:</strong>&nbsp; Childless
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem>
          <Typography color="primary" className={ classes.listItemText }>
           <strong>Left click:</strong>&nbsp; Select/deselect term
         </Typography>
        </ListItem>
        <ListItem>
          <Typography color="primary" className={ classes.listItemText }>
           <strong>Right click:</strong>&nbsp; Reveal children
         </Typography>
        </ListItem>
      </List>
    </Popup>
  )
}

