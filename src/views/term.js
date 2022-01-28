import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { useOntology } from '../components/ontology'
import { useLocation } from '@reach/router'
import { Container } from '../components/container'

const getParameterByName = (name, url) => {
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(url)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

const TermDetails = term => {
  return (
    <pre style={{ backgroundColor: '#33333311', overflow: 'auto', padding: '1rem' }}>
      { JSON.stringify(term, null, 2) }
    </pre>
  )
}

TermDetails.propTypes = {
  term: PropTypes.object.isRequired,
}

//

export const TermView = () => {
  const ontology = useOntology()
  const location = useLocation()
  const short_form = getParameterByName('id', location.href)
  const [term, setTerm] = useState()


  useEffect(() => {
    const index = ontology.terms.findIndex(t => t.short_form === short_form)
    if (index === -1) {
      return
    }
    setTerm(ontology.terms[index])
  }, [location])

  return (
    <Container>
      
      <Typography variant="h2">Term: { short_form }</Typography>

      {
        term && <TermDetails term={ term } />
      }

    </Container>
  )
}
