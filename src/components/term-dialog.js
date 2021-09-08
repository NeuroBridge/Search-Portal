import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Grow, Tooltip, Typography, useMediaQuery
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  ChevronLeft as PreviousTermIcon,
  ChevronRight as NextTermIcon,
  HelpOutline as HelpIcon,
} from '@material-ui/icons'
import { api } from '../api'
import ReactJson from 'react-json-view'
import ForceGraph2D from 'react-force-graph-2d'
import { useSearchContext } from '../context'
import { TermGraph } from './term-graph'
import { SizeMe } from 'react-sizeme'

const useStyles = makeStyles(theme => ({
  root: {
  },
  termDialog: {
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
}))

const DialogTransition = forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ ref } {...props} />
})

export const TermDialog = ({ open, closeHandler }) => {
  const { currentTerm, setCurrentTerm, previousTerm, nextTerm } = useSearchContext()
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [children, setChildren] = useState([])
  const [parents, setParents] = useState([])

  const handleClickNextTerm = event => setCurrentTerm(nextTerm)
  const handleClickPreviousTerm = event => setCurrentTerm(previousTerm)

  return currentTerm
    ? (
      <Dialog
        fullScreen={ fullScreen }
        maxWidth={ 'md' }
        open={ open }
        onClose={ closeHandler }
        TransitionComponent={ DialogTransition }
        classes={{ paperFullScreen: classes.root, paper: classes.termDialog }}
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
        <DialogContent className={ classes.content }>
          <TermGraph term={ currentTerm } />
        </DialogContent>
        <DialogActions>
          <IconButton color="primary" variant="outlined"><HelpIcon /></IconButton>
          <Button color="primary" variant="contained" onClick={ closeHandler }>Close</Button>
        </DialogActions>
      </Dialog>
    ) : null
}
