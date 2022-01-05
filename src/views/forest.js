import { useEffect, useState } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import {
  RestartAlt as StartOverIcon,
  DeleteSweep as ClearSelectionIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { useSearchContext, SelectionForest } from '../components/search'
import { Container } from '../components/container'

const useStyles = makeStyles(theme => ({
  heading: {
    color: theme.palette.primary.dark,
    padding: `${ theme.spacing(2) } 0`,
  },
  summary: {},
  actions: {
    textAlign: 'right',
  },
  instructions: {
    marginTop: '10vh',
    fontSize: '1.5rem',
    lineHeight: 3,
    backgroundColor: '#ffffffcc',
    border: `1px solid #afb9c099`,
    padding: theme.spacing(4),
    width: '90%',
    maxWidth: '900px',
    margin: 'auto',
    textAlign: 'center',
    '& ol': {
      textAlign: 'left',
      display: 'inline-block',
      margin: 'auto',
    },
  },
}))

export const ForestView = () => {
  const classes = useStyles()
  const {
    resetSearch,
    clearRootTermSelection, selectedRootTermsCount,
    terms, selectedTerms, clearTermSelection, selectedTermsCount,
  } = useSearchContext()
  const [sent, setSent] = useState(false)

  /* temporary faking term send request */
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
    const resetSend = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(resetSend)
  }, [sent])
  
  const handleStartOver = () => {
    clearRootTermSelection()
    resetSearch()
  }

  if (!terms.length) {
    return (
      <Container>
        <div className={ classes.instructions }>
          <ol>
            <li>Search the Neurobridge ontology for terms.</li>
            <li>Select roots from the results.</li>
            <li>Select terms from the descendants of your roots.</li>
            <li>Send your term selection.</li>
          </ol>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      
      <br /><br />

      <Grid container className={ classes.heading }>
        <Grid item xs={ 12 } lg={ 6 } className={ classes.summary }>
          <Typography variant="subtitle1">
            { selectedRootTermsCount } Root Term{ selectedRootTermsCount === 1 ? '' : 's' }
          </Typography>
          <Button
            onClick={ handleStartOver }
            disabled={ selectedRootTermsCount === 0 }
            endIcon={ <StartOverIcon /> }
            variant="contained"
            color="primary"
          >
            Start Over
          </Button>
        </Grid>
        <Grid item xs={ 12 } lg={ 6 } className={ classes.actions }>
          <Typography variant="subtitle1">
            { selectedTermsCount } selected term{ selectedTermsCount === 1 ? '' : 's'}
          </Typography>
          <Button
            onClick={ clearTermSelection }
            disabled={ selectedTermsCount === 0 }
            endIcon={ <ClearSelectionIcon /> }
            variant="contained"
            color="secondary"
          >
            Clear Term Selection
          </Button>
        </Grid>
      </Grid>

      <br /><br />

      <SelectionForest />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
        <Button variant="contained" color="secondary" disabled={ sent || !selectedTermsCount } onClick={ () => setSent(true) }>
          Send { selectedTermsCount ? selectedTermsCount : '' } term{ selectedTermsCount === 1 ? '' : 's' }
        </Button>
      </div>

      {
        sent && (
          <div style={{ padding: '3rem' }}>
            <Typography variant="subtitle2">Sending the following request payload</Typography>
            <pre style={{ backgroundColor: '#ddd', fontSize: '75%', padding: '1rem' }}>
              { JSON.stringify(selectedTerms, null, 2) }
            </pre>
          </div>
        )
      }

    </Container>
  )
}
