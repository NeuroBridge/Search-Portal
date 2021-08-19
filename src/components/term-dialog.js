import { forwardRef, useEffect, useState } from 'react'
import axios from 'axios'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Slide
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { api } from '../api'

const useStyles = makeStyles(theme => ({
  termDialog: {
    margin: '9rem 2rem 2rem 2rem',
  },
  dialogTitle: {
    width: '100%',
    textAlign: 'center',
  },
}))

const DialogTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ ref } {...props} />
})

export const TermDialog = ({ open, term, closeHandler }) => {
  const classes = useStyles()
  const [children, setChildren] = useState([])
  const [parents, setParents] = useState([])

  const handleFetchChildren = () => {
    api.hierarchicalChildren(encodeURIComponent(encodeURIComponent(term.iri)))
      .then(children => setChildren(children))
      .catch(error => console.error(error))
  }

  const handleFetchParents = () => {
    api.hierarchicalParents(encodeURIComponent(encodeURIComponent(term.iri)))
      .then(parents => setParents(parents))
      .catch(error => console.error(error))
  }

  return (
    <Dialog fullScreen open={ open } onClose={ closeHandler } TransitionComponent={ DialogTransition } classes={{ root: classes.termDialog }}>
      <DialogTitle className={ classes.dialogTitle }>
        { term && term.short_form }
      </DialogTitle>
      <DialogContent style={{ flex: 1}}>
        <pre>
          { JSON.stringify(term, null, 2) }
        </pre>
        
        <Divider light />
        <Button onClick={ handleFetchChildren }>fetch hierarchical children</Button>
        <pre>{ JSON.stringify(children, null, 2) }</pre>
        
        <Divider light />
        <Button onClick={ handleFetchParents }>fetch hierarchical parents</Button>
        <pre>{ JSON.stringify(parents, null, 2) }</pre>
      </DialogContent>
      <DialogActions>
        <Button onClick={ closeHandler }>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
