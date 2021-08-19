import { forwardRef } from 'react'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
  return (
    <Dialog fullScreen open={ open } onClose={ closeHandler } TransitionComponent={ DialogTransition } classes={{ root: classes.termDialog }}>
      <DialogTitle className={ classes.dialogTitle }>
        { term && term.short_form }
      </DialogTitle>
      <DialogContent style={{ flex: 1}}>
        <pre>
          { JSON.stringify(term, null, 2) }
        </pre>
      </DialogContent>
      <DialogActions>
        <Button onClick={ closeHandler }>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
