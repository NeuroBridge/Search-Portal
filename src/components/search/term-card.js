import { Fragment, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button, Card, CardActions, CardActionArea, CardContent, Typography
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import {
  CheckBox as CheckedIcon,
  CheckBoxOutlineBlank as UncheckedIcon,
  Preview as InspectIcon,
} from '@mui/icons-material'
import { TermDialog, useSearchContext } from './'

const useStyles = makeStyles(theme => ({
  termCard: {
    fontSize: '80%',
    position: 'relative',
    border: `1px solid #afb9c099`,
    filter: 'opacity(0.8)',
    width: '100%',
    transition: 'filter 250ms, border-color 250ms',
    display: 'flex',
    '&:hover': {
      filter: 'opacity(1.0)',
      borderColor: theme.palette.secondary.main,
    },
  },
  selected: {
    borderColor: `${ theme.palette.primary.main }`,
  },
  content: {
    padding: theme.spacing(2),
  },
  actions: {
    padding: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
    borderLeft: `1px solid #afb9c033`,
    '& button': {
      flex: 1,
      padding: 0,
    }
  },
}))

export const TermCard = ({ term, toggleRootTermSelectionHandler }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  const { selectedRootTerms } = useSearchContext()
  const selected = useMemo(() => term.short_form in selectedRootTerms, [selectedRootTerms])

  return (
    <Fragment>
      <Card square variant="outlined" className={ `${ classes.termCard } ${ selected ? classes.selected : undefined }` }>
        <CardActionArea onClick={ toggleRootTermSelectionHandler }>
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
        <CardActions className={ classes.actions } disableSpacing={ true }>
          <Button onClick={ toggleRootTermSelectionHandler }>{ selected ? <CheckedIcon fontSize="small" color="secondary" /> : <UncheckedIcon fontSize="small" color="default" /> }</Button>
          <Button onClick={ () => setExpanded(true) }><InspectIcon fontSize="small" color="default" /></Button>
        </CardActions>
      </Card>
      <TermDialog
        term={ term }
        selected={ selected }
        toggleSelectionHandler={ toggleRootTermSelectionHandler }
        open={ expanded }
        closeHandler={ () => setExpanded(false) }
      />
    </Fragment>
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
  toggleRootTermSelectionHandler: PropTypes.func.isRequired,
}
