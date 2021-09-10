import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, Paper, Tooltip, Typography, useMediaQuery
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  ChevronLeft as PreviousTermIcon,
  ChevronRight as NextTermIcon,
  HelpOutline as HelpIcon,
  ShoppingBasket as SelectionIcon,
} from '@material-ui/icons'
import { api } from '../../api'
import ReactJson from 'react-json-view'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../../context'
import { TermGraph } from './graph'
import { SizeMe } from 'react-sizeme'
import { GraphHelp } from './help'
import { NodeSelection } from './selection'

const DialogContext = createContext({})
export const useDialogContext = () => useContext(DialogContext)

const useStyles = makeStyles(theme => ({
  root: {
  },
  termDialog: {
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  dialogHeader: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogTitle: {
    flex: 1,
  },
  content: {
    padding: 0,
    '& div': {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `0 ${ theme.spacing(1) }px`,
  },
  actions: {
    display: 'flex',
  },
}))

const DialogTransition = forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ ref } { ...props } />
})

export const TermDialog = ({ open, closeHandler }) => {
  const { currentTerm, setCurrentTerm, previousTerm, nextTerm } = useSearchContext()
  const [selectedNodes, setSelectedNodes] = useState([])
  const [helpVisibility, setHelpVisibility] = useState(false)
  const [selectionVisibility, setSelectionVisibility] = useState(false)
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [children, setChildren] = useState([])
  const [parents, setParents] = useState([])

  const handleClickNextTerm = event => setCurrentTerm(nextTerm)
  const handleClickPreviousTerm = event => setCurrentTerm(previousTerm)

  const toggleNodeSelection = id => {
    const newSelection = new Set(selectedNodes)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedNodes(Array.from(newSelection))
  }

  if (!currentTerm) {
    return null
  }

  return (
    <Dialog
      fullScreen={ fullScreen }
      maxWidth={ 'md' }
      open={ open }
      onClose={ closeHandler }
      TransitionComponent={ DialogTransition }
      classes={{ paperFullScreen: classes.root, paper: classes.termDialog }}
    >
      <DialogContext.Provider
        value={{
          selectedNodes, setSelectedNodes, toggleNodeSelection,
          helpVisibility, setHelpVisibility,
          selectionVisibility, setSelectionVisibility,
        }}
      >
        <DialogTitle className={ classes.dialogHeader } disableTypography>
          <Tooltip title="View previous result">
            <span>
              <IconButton size="small" color="secondary" onClick={ handleClickPreviousTerm } disabled={ !previousTerm }><PreviousTermIcon /></IconButton>
            </span>
          </Tooltip>
          <Typography variant="h6" className={ classes.dialogTitle }>{ currentTerm && currentTerm.short_form }</Typography>
          <Tooltip title="View next result">
            <span>
              <IconButton size="small" color="secondary" onClick={ handleClickNextTerm } disabled={ !nextTerm }><NextTermIcon /></IconButton>
            </span>
          </Tooltip>
        </DialogTitle>

        <Divider />
        
        <div className={ classes.toolbar }>
          <IconButton variant="outlined" onClick={ () => setSelectionVisibility(!selectionVisibility) } >
            <Badge badgeContent={ selectedNodes.length || 0 } color="secondary">
              <SelectionIcon color={ selectionVisibility ? 'secondary' : 'primary' } />
            </Badge>
          </IconButton>
        </div>

        <Divider />

        <DialogContent className={ classes.content }>
          <TermGraph term={ currentTerm } />
        </DialogContent>

        <GraphHelp />
        
        <NodeSelection />
        
        <DialogActions className={ classes.actions }>
          <div style={{ flex: 1 }} />
          <IconButton color={ helpVisibility ? 'secondary' : 'primary' } variant="outlined" onClick={ () => setHelpVisibility(!helpVisibility) }><HelpIcon /></IconButton>
          <Button color="primary" variant="contained" onClick={ closeHandler }>Close</Button>
        </DialogActions>
      </DialogContext.Provider>
    </Dialog>
  )
}
