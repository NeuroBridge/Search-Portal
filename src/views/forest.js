import { useEffect, useState } from 'react'
import { Avatar,
  Button,
  Card, CardHeader, CardContent,
  CircularProgress,
  Grid,
  List, ListItem, ListItemAvatar, ListItemText,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import {
  RestartAlt as StartOverIcon,
  DeleteSweep as ClearSelectionIcon,
  LooksOne as StepOneIcon,
  LooksTwo as StepTwoIcon,
  Looks3 as StepThreeIcon,
  Looks4 as StepFourIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { useSearchContext, SelectionForest } from '../components/search'
import { Container } from '../components/container'
import { Query } from '../components/query'

const useStyles = makeStyles(theme => ({
  heading: {
    color: theme.palette.primary.dark,
  },
  summary: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  actions: {
    padding: theme.spacing(2),
    textAlign: 'center',
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
  },
}))

export const ForestView = () => {
  const classes = useStyles()
  const {
    resetSearch,
    clearRootTermSelection, selectedRootTermsCount,
    selectedTerms, clearTermSelection, selectedTermsCount,
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

  if (!selectedRootTermsCount) {
    return (
      <Container>
        <Card className={ classes.instructions } elevation={ 0 }>
          <CardHeader title="Instructions" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemAvatar><Avatar><StepOneIcon /></Avatar></ListItemAvatar>
                <ListItemText>Search the Neurobridge ontology for terms.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepTwoIcon /></Avatar></ListItemAvatar>
                <ListItemText>Select roots from the results.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepThreeIcon /></Avatar></ListItemAvatar>
                <ListItemText>Select terms from the descendants of your roots.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepFourIcon /></Avatar></ListItemAvatar>
                <ListItemText>Send your term selection.</ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </Card>
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

      <br /><br />

      <Query />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
        <LoadingButton
          variant="contained"
          color="secondary"
          onClick={ () => setSent(true) }
          endIcon={ <SendIcon /> }
          loading={ sent }
          loadingPosition="end"
        >
          Send Query
        </LoadingButton>
      </div>

    </Container>
  )
}
