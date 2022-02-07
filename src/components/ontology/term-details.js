import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Link } from '../link'
import {
  CheckBoxOutlineBlank as FalseIcon,
  CheckBox as TrueIcon,
} from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    alignItems: 'stretch',
    gap: theme.spacing(2),
    padding: `${ theme.spacing(1) } ${ theme.spacing(3) }`,
    '&:first-child': {
      paddingTop: theme.spacing(3),
    },
    '&:last-child': {
      paddingBottom: theme.spacing(3),
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

const urlPattern = new RegExp(/^https?:\/\//)
const renderString = str => {
  const urlMatch = urlPattern.exec(str)
  return urlMatch ? <Link key={ `link-to-${ str }` } to={ str }>{ str }</Link> : str
}

const Row = ({ label, value }) => {
  const classes = useStyles()

  // console.log(label, value, typeof value)
  const renderedValue = () => {
    
    // Boolean
    if (typeof value === 'boolean') {
      return value ? <TrueIcon /> : <FalseIcon />
    }

    // String
    if (typeof value === 'string') {
      return renderString(value) || 'null'
    }

    // Array
    if (Array.isArray(value)) {
      return value.map(renderString)
      // value.map(url => <Link to={ url } key={ `${ term }-${ url }` }>{ url }</Link>
    }

    return 'null'
  }

  return (
    <CardContent className={ classes.row }>
      <Box className={ classes.keyBox }>{ label }</Box>
      <Box className={ classes.valueBox }>
        { renderedValue(value) }
      </Box>
    </CardContent>
  )
}

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
}

export const TermDetails = ({ term }) => {
  const classes = useStyles()

  return (
    <Fragment>
      <Card>
        <Row label="label" value={ term.label } />
        <Row label="short_form" value={ term.short_form } />
        <Row label="seeAlso" value={ term.seeAlso } />
        <Row label="iri" value={ term.iri } />
        <Row label="synonym" value={ term.synonym } />
        <Row label="component" value={ term.component } />
        <Row label="definition" value={ term.definition } />
        <Row label="comment" value={ term.comment } />
        <Row label="category" value={ term.category } />
        <Row label="constraints" value={ term.constraints } />
        <Row label="is_obsolete" value={ term.is_obsolete } />
        <Row label="term_replaced_by" value={ term.term_replaced_by } />
        <Row label="is_defining_ontology" value={ term.is_defining_ontology } />
        <Row label="has_children" value={ term.has_children } />
        <Row label="is_root" value={ term.is_root } />
      </Card>

    </Fragment>
  )
}

TermDetails.propTypes = {
  term: PropTypes.object.isRequired,
}

