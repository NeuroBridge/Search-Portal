import { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grow, IconButton, Paper, Tooltip, Typography, useMediaQuery
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  HelpOutline as HelpIcon,
  Label as LabelsOnIcon,
  LabelOff as LabelsOffIcon,
  ChevronRight as NextTermIcon,
  ChevronLeft as PreviousTermIcon,
  Settings as SettingsIcon,
  ShoppingBasket as SelectionIcon,
} from '@material-ui/icons'
import { api } from '../../../api'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../context'
import { TermGraph } from './graph'
import { SizeMe } from 'react-sizeme'
import { HelpTray, NodeSelectionTray, SettingsTray } from './trays'

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

const graphModes = [
  { id: 'td',        name: 'top-down' },
  { id: 'bu',        name: 'bottom-up' },
  { id: 'lr',        name: 'left-to-right' },
  { id: 'rl',        name: 'right-to-left' },
  { id: 'radialin',  name: 'radially inward' },
  { id: 'radialout', name: 'radially outward' },
]

const defaultGraphSettings = {
  nodeLabelVisibility: false,
  mode: 'bu',
  graphRankDistance: 50,
  graphForce: 20,
}

export const TermDialog = ({ open, closeHandler }) => {
  const selectionPalette = { 0: 'teal', 1: 'goldenrod', 2: 'crimson' }
  const { currentTerm, setCurrentTerm, previousTerm, nextTerm } = useSearchContext()
  const [selectedNodes, setSelectedNodes] = useState({})
  const [openTray, setOpenTray] = useState()
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [children, setChildren] = useState([])
  const [parents, setParents] = useState([])
  const [resetFlag, setResetFlag] = useState(false)
  const [graphSettings, setGraphSettings] = useState({ ...defaultGraphSettings })

  useEffect(() => {
    resetDialogState()
  }, [currentTerm])

  const resetDialogState = () => {
    setSelectedNodes([])
    setOpenTray(null)
  }

  const emptySelectedNodes = () => setSelectedNodes([])

  const handleClickNextTerm = () => setCurrentTerm(nextTerm)

  const handleClickPreviousTerm = () => setCurrentTerm(previousTerm)

  const toggleNodeSelection = id => {
    let newSelection = { ...selectedNodes }
    if (id in newSelection) {
      newSelection[id] = (newSelection[id] + 1) % 3
    } else {
      newSelection = { ...newSelection, [id]: 0 }
    }
    setSelectedNodes(newSelection)
  }

  const handleToggleTray = trayId => () => {
    setOpenTray(openTray === trayId ? null : trayId)
  }

  const resetGraph = () => {
    setResetFlag(!resetFlag)
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
          selectedNodes, setSelectedNodes, toggleNodeSelection, emptySelectedNodes, selectionPalette,
          openTray, setOpenTray,
          resetGraph,
          graphSettings, setGraphSettings,
          graphModes,
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
          <Tooltip title={ `${ openTray === 'help' ? 'Hide' : 'Show' } help` }>
            <IconButton variant="outlined" onClick={ handleToggleTray('help') }>
              <HelpIcon color={ openTray === 'help' ? 'secondary' : 'primary' } />
            </IconButton>
          </Tooltip>
          <Tooltip title={ `${ openTray === 'settings' ? 'Hide' : 'Show' } settings` }>
            <IconButton variant="outlined" onClick={ handleToggleTray('settings') }>
              <SettingsIcon color={ openTray === 'settings' ? 'secondary' : 'primary' } />
            </IconButton>
          </Tooltip>
          <Tooltip title={ `${ openTray === 'selection' ? 'Hide' : 'Show' } node selection` }>
            <IconButton variant="outlined" onClick={ handleToggleTray('selection') } >
              <Badge badgeContent={ Object.keys(selectedNodes).length || 0 } color="secondary">
                <SelectionIcon color={ openTray === 'selection' ? 'secondary' : 'primary' } />
              </Badge>
            </IconButton>
          </Tooltip>
        </div>

        <Divider />

        <DialogContent className={ classes.content }>
          <div className={ classes.graphContainer }>
            <TermGraph term={ currentTerm } key={ resetFlag } />
          </div>
          <HelpTray />
          <NodeSelectionTray />
          <SettingsTray />
        </DialogContent>

        
        <DialogActions className={ classes.actions }>
          <Button color="primary" variant="outlined" onClick={ closeHandler }>Close</Button>
        </DialogActions>
      </DialogContext.Provider>
    </Dialog>
  )
}
