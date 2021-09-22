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
import { api } from '../../../api'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../context'
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
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  dialogHeader: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  dialogTitle: {
    flex: 1,
    height: '2rem',
  },
  content: {
    position: 'relative',
    padding: 0,
    overflow: 'hidden',
  },
  graphContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  toolbar: {
    height: '3rem',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: `0 ${ theme.spacing(2) }px`,
    backgroundColor: '#eee',
  },
  actions: {
    height: '4rem',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: '#eee',
  },
}))

const DialogTransition = forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ ref } { ...props } />
})

export const TermDialog = ({ open, closeHandler }) => {
  const { currentTerm, setCurrentTerm, previousTerm, nextTerm } = useSearchContext()
  const [selectedNodes, setSelectedNodes] = useState([])
  const [openTray, setOpenTray] = useState()
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [children, setChildren] = useState([])
  const [parents, setParents] = useState([])

  useEffect(() => {
    resetDialogState()
  }, [currentTerm])

  const resetDialogState = () => {
    setSelectedNodes([])
    setOpenTray(null)
  }

  const emptySelectedNodes = () => setSelectedNodes([])

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

  const handleToggleTray = trayId => event => {
    setOpenTray(openTray === trayId ? null : trayId)
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
          selectedNodes, setSelectedNodes, toggleNodeSelection, emptySelectedNodes,
          openTray, setOpenTray,
        }}
      >
        <DialogTitle className={ classes.dialogHeader } disableTypography>
          <Tooltip title="View previous result">
            <span>
              <IconButton size="small" color="secondary" onClick={ handleClickPreviousTerm } disabled={ !previousTerm }><PreviousTermIcon /></IconButton>
            </span>
          </Tooltip>
          <Typography variant="h6" className={ classes.dialogTitle }>{ currentTerm && currentTerm.label }</Typography>
          <Tooltip title="View next result">
            <span>
              <IconButton size="small" color="secondary" onClick={ handleClickNextTerm } disabled={ !nextTerm }><NextTermIcon /></IconButton>
            </span>
          </Tooltip>
        </DialogTitle>

        <Divider />
        
        <div className={ classes.toolbar }>
          <IconButton variant="outlined" onClick={ handleToggleTray('help') }>
            <HelpIcon color={ openTray === 'help' ? 'secondary' : 'primary' } />
          </IconButton>
          <IconButton variant="outlined" onClick={ handleToggleTray('selection') } >
            <Badge badgeContent={ selectedNodes.length || 0 } color="secondary">
              <SelectionIcon color={ openTray === 'selection' ? 'secondary' : 'primary' } />
            </Badge>
          </IconButton>
        </div>

        <Divider />

        <DialogContent className={ classes.content }>
          <div className={ classes.graphContainer }>
            <TermGraph term={ currentTerm } />
          </div>
          <GraphHelp />
          <NodeSelection />
        </DialogContent>

        
        <DialogActions className={ classes.actions }>
          <Button color="primary" variant="outlined" onClick={ closeHandler }>Close</Button>
        </DialogActions>
      </DialogContext.Provider>
    </Dialog>
  )
}
