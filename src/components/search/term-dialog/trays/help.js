import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, Divider, Grow, List, ListItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from '../'
import { Tray } from '../tray'

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1),
  },
  listItemText: {
    fontSize: '90%',
  },
  node: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginLeft: theme.spacing(1),
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
      width: theme.spacing(7) / 2,
      height: theme.spacing(7) / 2,
      backgroundColor: 'transparent',
      border: '3px solid #378f91',
    }
  },
  keep: {
    '&::after': {
      borderColor: 'teal',
    },
  },
  irrelevant: {
    '&::after': {
      borderColor: 'goldenrod',
    },
  },
  ignore: {
    '&::after': {
      borderColor: 'crimson',
    },
  },
}))

const GrowTransition = forwardRef(function Transition(props, ref) {
  return <Grow direction="left" ref={ ref } { ...props } />
})

const Node = ({ color = '#ccc' }) => {
  const classes = useStyles()
  return (
    <div className={ classes.node } style={{ backgroundColor: color }} />
  )
}

const SelectedNode = ({ color = '#ccc', selection = '' }) => {
  const classes = useStyles()
  let classNames = `${ classes.node } ${ classes.selectedNode }`
  switch (selection) {
    case 'keep':
      classNames += ` ${ classes.keep }`
      break;
    case 'irrelevant':
      classNames += ` ${ classes.irrelevant }`
      break;
    case 'ignore':
      classNames += ` ${ classes.ignore }`
      break;
  }
  return (
    <div className={ classNames } style={{ backgroundColor: color }} />
  )
}

export const HelpTray = () => {
  const { openTray, selectionPalette } = useDialogContext()
  const classes = useStyles()

  return (
    <Tray title="Help" align="bottom" visibility={ openTray === 'help' }>
      <List dense>
        <ListItem className={ classes.listItem }>
          <Node color="#333" />
          <Typography color="primary" className={ classes.listItemText }>
            Current term
          </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <Node color="indianred" />
          <Typography color="primary" className={ classes.listItemText }>
            Current term's parents & children
          </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <Node color="slategrey" />
          <Typography color="primary" className={ classes.listItemText }>
            Other term
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem className={ classes.listItem }>
          <SelectedNode selection="keep" />
          <Typography color="primary" className={ classes.listItemText }>
            Term is used
          </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <SelectedNode selection="irrelevant" />
          <Typography color="primary" className={ classes.listItemText }>
            Term is irrelevant
          </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <SelectedNode selection="ignore" />
          <Typography color="primary" className={ classes.listItemText }>
            Term is ignored
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem className={ classes.listItem }>
          <Typography color="primary" className={ classes.listItemText }>
            <strong>Solid:</strong>&nbsp; Has children
          </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <Typography color="primary" className={ classes.listItemText }>
            <strong>Empty:</strong>&nbsp; Childless
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <List dense>
        <ListItem className={ classes.listItem }>
          <Typography color="primary" className={ classes.listItemText }>
           <strong>Left click:</strong>&nbsp; Select/deselect term
         </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <Typography color="primary" className={ classes.listItemText }>
           <strong>Right click:</strong>&nbsp; Reveal children
         </Typography>
        </ListItem>
        <ListItem className={ classes.listItem }>
          <Typography color="primary" className={ classes.listItemText }>
           <strong>Scroll:</strong>&nbsp; Zoom
         </Typography>
        </ListItem>
      </List>
    </Tray>
  )
}

