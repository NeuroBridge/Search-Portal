import PropTypes from 'prop-types'
import {
  Card, CardActionArea, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ZoomOutMap as ViewTermIcon,
} from '@material-ui/icons'

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
    '&:hover $viewTermIcon': {
      filter: 'opacity(1.0)',
      transform: 'scale(1.0)',
    },
  },
  viewTermIcon: {
    filter: 'opacity(0.1)',
    transition: 'filter 250ms',
    transform: 'scale(0.9)',
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}))

export const TermCard = ({ term, clickHandler }) => {
  const classes = useStyles()
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
        <ViewTermIcon className={ classes.viewTermIcon } fontSize="small" />
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
}