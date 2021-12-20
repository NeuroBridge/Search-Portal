import PropTypes from 'prop-types'
import {
  Card, CardActionArea, IconButton, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  CheckBox as CheckedIcon,
  CheckBoxOutlineBlank as UncheckedIcon,
} from '@material-ui/icons'
import { useSearchContext } from './context'

const useStyles = makeStyles(theme => ({
  termCard: {
    fontSize: '80%',
    position: 'relative',
    borderLeft: `0.5rem solid ${ theme.palette.primary.light }`,
    filter: 'opacity(0.8)',
    width: '100%',
    transition: 'filter 250ms, border-color 250ms, border-width 250ms',
    '&:hover': {
      filter: 'opacity(1.0)',
      borderLeftWidth: `0.75rem`,
      borderColor: theme.palette.primary.main,
    },
  },
  actionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // gap: theme.spacing(1),
    padding: theme.spacing(2),
    '&:hover $checkboxIcon': {
      filter: 'opacity(1.0)',
      transform: 'scale(1.0)',
    },
  },
  checkbox: {
    filter: 'opacity(0.25)',
    transition: 'filter 250ms',
    // transform: 'scale(0.9)',
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  checkboxIcon: {
  },
}))

export const TermCard = ({ term, clickHandler, selected }) => {
  const classes = useStyles()
  const { selectedTerms, toggleTermSelection } = useSearchContext()

  const handleClickToggleTerm = term => event => {
    console.log(event)
    console.log(term)
    toggleTermSelection(term)
  }

  return (
    <Card
      variant="outlined"
      className={ classes.termCard }
    >
      <CardActionArea className={ classes.actionArea } onClick={ clickHandler }>
        <Typography color="textPrimary">
          <strong>label:</strong> { term.label }
        </Typography>
        <Typography variant="caption" color="textPrimary">
          <strong>short_form:</strong> <em>{ term.short_form }</em>
        </Typography>
        <Typography variant="caption" color="textSecondary">
          <strong>comment_annotation:</strong> { term.comment_annotation ? term.comment_annotation : 'none provided' }
        </Typography>
        <IconButton aria-label="toggle term selection" onClick={ handleClickToggleTerm(term) } className={ classes.checkbox }>
          {
            selected
            ? <CheckedIcon className={ classes.checkboxIcon } fontSize="small" />
            : <UncheckedIcon className={ classes.checkboxIcon } fontSize="small" />
          }
        </IconButton>
      </CardActionArea>
    </Card>
  )
}

TermCard.propTypes = {
  term: PropTypes.shape({
    iri: PropTypes.string.isRequired,
    short_form: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    has_children: PropTypes.bool.isRequired,
    comment_annotation: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }).isRequired,
  clickHandler: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
}

TermCard.defaultProps = {
  selected: false,
}
