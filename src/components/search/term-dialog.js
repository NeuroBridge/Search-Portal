import PropTypes from 'prop-types'
import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import {
  CheckBox as CheckedIcon,
  CheckBoxOutlineBlank as UncheckedIcon,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles';
import { useSearchContext } from './'

const useStyles = makeStyles(theme => ({
  root: {
  },
  paper: {
    [theme.breakpoints.down('md')]: {
      transform: 'translateY(-65px)',
      minHeight: '60%',
      minWidth: '90%',
    },
    [theme.breakpoints.up('md')]: {
      transform: 'translateY(-65px)',
      minHeight: '60%',
      minWidth: '75%',
    },
  },
}))

export const TermDialog = ({ term, open, closeHandler, toggleSelectionHandler }) => {
  const classes = useStyles()
  const { selectedTerms } = useSearchContext()

  return (
    <MuiDialog
      open={ open }
      onBackdropClick={ closeHandler }
      classes={ classes }
    >
      <DialogTitle>{ term.short_form }</DialogTitle>
      <DialogContent>
        lorem ipsum for now <br/>
        lorem ipsum for now <br/>
        lorem ipsum for now <br/>
        lorem ipsum for now <br/>
        lorem ipsum for now <br/>
        lorem ipsum for now <br/>
      </DialogContent>
      <DialogActions>
        <Button onClick={ toggleSelectionHandler }>
         {
            term.short_form in selectedTerms
              ? <CheckedIcon fontSize="small" color="secondary" />
              : <UncheckedIcon fontSize="small" color="default" />
          }
        </Button>
        <Button
          aria-label="Close dialog"
          onClick={ closeHandler }
        >Close</Button>
      </DialogActions>
    </MuiDialog>
  )
}

TermDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
  toggleSelectionHandler: PropTypes.func.isRequired,
  term: PropTypes.shape({
    iri: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    has_children: PropTypes.bool.isRequired,
    comment_annotation: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }).isRequired,
}
