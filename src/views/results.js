import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, CardHeader, LinearProgress, Typography } from '@mui/material'
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

const LabeledLinearProgress = props => {
  console.log(props.value)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ ml: 1, position: 'relative', height: '1rem', width: '100%' }}>
        <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', left: `${ props.value }%`, transform: 'translateX(-50%)' }}>
          { props.value.toFixed(2) }% similarity
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  )
}

LabeledLinearProgress.propTypes = {
  value: PropTypes.number.isRequired,
}

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
              ? results.map(({ pubmed_url, similarity, title }) => (
                <Card key={ pubmed_url } elevation={ 0 } className={ classes.resultCard }>
                  <CardHeader title={ title } />
                  <CardContent>
                    <Link to={ pubmed_url }>{ pubmed_url }</Link>
                  </CardContent>
                  <LabeledLinearProgress variant="determinate" value={ similarity * 100 } />
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
