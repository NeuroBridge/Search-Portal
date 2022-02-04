import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, CardHeader } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSearchContext } from '../components/search'
import { PageHeader } from '../components/page-header'
import { Container } from '../components/container'
import { Link } from '../components/link'

const useStyles = makeStyles(theme => ({
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  resultCard: {
    border: `1px solid rgba(0, 0, 0, 0.12)`,
  }
}))

export const ResultsView = ({ type }) => {
  const classes = useStyles()
  const { neuroquery } = useSearchContext()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    const publications = await neuroquery()
    setResults(publications)
  }, [type])

  useEffect(() => {
    if (results) {
      console.log(results)
      setLoading(false)
    }
  }, [results])

  if (loading) {
    return (
      'Loading..'
    )
  }

  return (
    <Fragment>
      <PageHeader title={ `${ type } Results` } />
      <Container>

        <Box className={ classes.resultsContainer }>
          {
            !loading && results.length
              ? results.map(({ title, pubmed_url }) => (
                <Card key={ pubmed_url } elevation={ 0 } className={ classes.resultCard }>
                  <CardHeader title={ title } />
                  <CardContent>
                    <Link to={ pubmed_url }>{ pubmed_url }</Link>
                  </CardContent>
                </Card>
              ))
              : 'No results'
          }
        </Box>

      </Container>
    </Fragment>
  )
}

ResultsView.propTypes = {
  type: PropTypes.oneOf(['neuroquery'])
}
