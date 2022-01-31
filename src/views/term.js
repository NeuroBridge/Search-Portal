import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Typography } from '@mui/material'
import {
  CheckBox as CheckedIcon,
  CheckBoxOutlineBlank as UncheckedIcon,
} from '@mui/icons-material'
import { useOntology } from '../components/ontology'
import { useSearchContext } from '../components/search'
import { useLocation } from '@reach/router'
import { Container } from '../components/container'
import { PageHeader } from '../components/page-header'

const getParameterByName = (name, url) => {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(url)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

const TermDetails = ({ term })=> (
  <pre style={{ backgroundColor: '#33333311', overflow: 'auto', padding: '1rem' }}>
    { JSON.stringify(term, null, 2) }
  </pre>
)

TermDetails.propTypes = {
  term: PropTypes.object.isRequired,
}

//

export const TermView = () => {
  const ontology = useOntology()
  const location = useLocation()
  const short_form = getParameterByName('id', location.href)
  const [term, setTerm] = useState()
  const { roots, toggleRootSelection } = useSearchContext()

  useEffect(() => {
    const index = ontology.terms.findIndex(t => t.short_form === short_form)
    if (index === -1) {
      return
    }
    setTerm(ontology.terms[index])
  }, [location, ontology])

  if (!term) {
    return (
      <Fragment>
        <PageHeader title={ <span>Unable to find term <code>{ short_form }</code></span> } />

        <Container>
          <Typography paragraph>
            Oh no! The term with short_form <code>{ short_form }</code> could not be located in the NeuroBridge ontology.
          </Typography>
        </Container>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <PageHeader
        title={ term.label }
        actions={[
          <Button
            key="toggle-root-selection-button"
            onClick={ () => toggleRootSelection(term) }
          >
            { term.short_form in roots ? <CheckedIcon color="success" /> : <UncheckedIcon color="default" /> }
          </Button>
        ]}
      />

      <Container>
        <TermDetails term={ term } />
      </Container>
    </Fragment>
  )
}
