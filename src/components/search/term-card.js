import { navigate } from '@reach/router'
import {
  Card, CardActionArea, CardContent,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Check as AddedIcon,
  ZoomIn as InspectIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles';
import { useSearchContext } from './'
import { Link } from '../link'
import { termType, termDefaults } from '../ontology'

const useStyles = makeStyles(theme => ({
  termCard: {
    position: 'relative',
    width: '100%',
    minWidth: '472px',
    maxWidth: '472px',
    border: `2px solid #afb9c099`,
    transition: 'filter 250ms, border-color 250ms',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    margin: theme.spacing(1),
    '&:hover': {
      borderColor: theme.palette.secondary.main,
    },
  },
  selected: {
    borderColor: `${ theme.palette.secondary.main }`,
    backgroundColor: `${ theme.palette.success.light }33`,
  },
  content: {
    padding: theme.spacing(2),
    flex: 1,
  },
  mainActionArea: {
    '& svg': {
      filter: 'opacity(0.25)',
      transition: 'filter 250ms'
    },
    '&:hover svg': {
      filter: 'opacity(1.0)',
    }
  },
  inspectLink: {
    minWidth: '3rem',
    maxWidth: '3rem',
    minHeight: '100%',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${ theme.palette.grey[500] }33`,
    '& svg': {
      filter: 'opacity(0.25)',
      transition: 'filter 250ms'
    },
    '&:hover svg': {
      filter: 'opacity(1.0)',
    }
  },
  addTermButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
  }
}))

export const TermCard = ({ term }) => {
  const classes = useStyles()
  const { roots, toggleRootSelection } = useSearchContext()

  const handleToggleRoot = root => event => {
    toggleRootSelection(root)
    navigate('/')
  }

  return (
    <Card
      variant="outlined"
      className={ `${ classes.termCard } ${ term.short_form in roots ? classes.selected : undefined }` }
    >
      <CardActionArea onClick={ handleToggleRoot(term) } className={ classes.mainActionArea }>
        <CardContent className={ classes.content }>
          <Typography color="textPrimary">
            <strong>label:</strong> { term.label }
          </Typography>
          <Typography variant="caption" color="textPrimary">
            <strong>short_form:</strong> <em>{ term.short_form }</em>
          </Typography><br/>
          <Typography variant="caption" color="textSecondary">
            <strong>comment_annotation:</strong> { term.comment_annotation ? term.comment_annotation : 'none provided' }
          </Typography>
        </CardContent>
        {
          term.short_form in roots
            ? <AddedIcon className={ classes.addTermButton } color="success" style={{ filter: 'opacity(1)' }} />
            : <AddIcon className={ classes.addTermButton } />
        }
      </CardActionArea>
      <Link to={ `/term?id=${ term.short_form }` } className={ classes.inspectLink }>
        <InspectIcon color="primary" />
      </Link>
    </Card>
  )
}

TermCard.propTypes = { ...termType }
TermCard.defaultProps = { ...termDefaults }