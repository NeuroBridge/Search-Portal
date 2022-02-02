import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from '../link'

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    padding: `${theme.spacing(1) } ${ theme.spacing(3) }`,
    '&:first-child': {
      padding: theme.spacing(3),
    },
    '&:last-child': {
      padding: theme.spacing(3),
    },
  },
  keyBox: {
    fontWeight: 'bold',
    flex: '0 0 200px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  valueBox: {
    flex: '1',
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}))

export const TermDetails = ({ term })=> {
  const classes = useStyles()

  return (
    <Fragment>
      <Card>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>label</Box>
          <Box className={ classes.valueBox }>{ term.label || 'null' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>short_form</Box>
          <Box className={ classes.valueBox }>{ term.short_form || 'null' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>description</Box>
          <Box className={ classes.valueBox }>{ term.description || 'null' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>iri</Box>
          <Box className={ classes.valueBox }>
            {
              term?.iri
                ? <Link to={ term.iri }>{ term.iri }</Link>
                : 'null'
            }
          </Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>synonyms</Box>
          <Box className={ classes.valueBox }>{ term.synonyms || 'null' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>is_obsolete</Box>
          <Box className={ classes.valueBox }>{ term.is_obsolete ? 'true' : 'false' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>term_replaced_by</Box>
          <Box className={ classes.valueBox }>{ term.term_replaced_by || 'null' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>is_defining_ontology</Box>
          <Box className={ classes.valueBox }>{ term.is_defining_ontology ? 'true' : 'false' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>has_children</Box>
          <Box className={ classes.valueBox }>{ term.has_children ? 'true' : 'false' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>is_root</Box>
          <Box className={ classes.valueBox }>{ term.is_root ? 'true' : 'false' }</Box>
        </CardContent>
        <CardContent className={ classes.row }>
          <Box className={ classes.keyBox }>seeAlso</Box>
          <Box className={ classes.valueBox }>
            {
              term?.seeAlso
                ? term.seeAlso.map(url => <Link to={ url } key={ `${ term }-${ url }` }>{ url }</Link>)
                : 'null'
            }
          </Box>
        </CardContent>
      </Card>

    </Fragment>
  )
}

TermDetails.propTypes = {
  term: PropTypes.object.isRequired,
}

