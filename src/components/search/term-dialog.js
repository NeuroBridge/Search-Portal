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
    zIndex: '9999'
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
  const { roots } = useSearchContext()

  return (
    <MuiDialog
      open={ open }
      onBackdropClick={ closeHandler }
      classes={ classes }
    >
      <DialogTitle>
        { term.short_form }
      </DialogTitle>
      <DialogContent>
        has_children: { term.has_children ? 'yes' : 'no' } <br/>
        iri: { term.iri } <br/>
        label: { term.label } <br/>
        ontology_name: { term.ontology_name } <br/>
        ontology_prefix: { term.ontology_prefix } <br/>
        short_form: { term.short_form } <br/>
        type: { term.type } <br/>
      </DialogContent>
      <DialogActions>
        <Button onClick={ toggleSelectionHandler }>
         {
            term.short_form in roots
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
    comment_annotation: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    has_children: PropTypes.bool.isRequired,
    iri: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    ontology_name: PropTypes.string.isRequired,
    ontology_prefix: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
}
