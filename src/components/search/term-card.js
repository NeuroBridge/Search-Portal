import PropTypes from 'prop-types'
import {
  Card, CardActionArea, Typography
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import {
  CheckBox as CheckedIcon,
  CheckBoxOutlineBlank as UncheckedIcon,
} from '@mui/icons-material'

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
      borderColor: theme.palette.primary.main,
    },
  },
  actionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: '1rem',
    '&:hover $checkbox': {
      filter: 'opacity(0.7)',
      transform: 'scale(1.0)',
    },
  },
  checkbox: {
    filter: 'opacity(0.25)',
    transition: 'filter 250ms',
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  },
}))

export const TermCard = ({ term, clickHandler, selected }) => {
  const classes = useStyles()

  return (
    <Card
      variant="outlined"
      square
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
        {
          selected
          ? <CheckedIcon className={ classes.checkbox } />
          : <UncheckedIcon className={ classes.checkbox } />
        }
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
