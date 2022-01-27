import { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Card, CardActionArea, CardContent, Typography
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import { useSearchContext } from './'
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
    '&:hover': {
      borderColor: theme.palette.secondary.main,
    },
    margin: theme.spacing(1),
  },
  selected: {
    borderColor: `${ theme.palette.secondary.main }`,
  },
  content: {
    padding: theme.spacing(2),
    flex: 1,
  },
  actions: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
    height: '100%',
    '& button': {
      flex: 1,
      padding: theme.spacing(1),
      height: '100%'
    }
  },
}))

export const TermCard = ({ term }) => {
  const classes = useStyles()
  const { roots, toggleRootSelection } = useSearchContext()

  return (
    <Fragment>
      <Card
        square
        variant="outlined"
        className={ `${ classes.termCard } ${ term.short_form in roots ? classes.selected : undefined }` }
      >
        <CardActionArea onClick={ () => toggleRootSelection(term) }>
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
        </CardActionArea>
      </Card>
    </Fragment>
  )
}

TermCard.propTypes = { ...termType }
TermCard.defaultProps = { ...termDefaults }