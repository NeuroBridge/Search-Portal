import { useEffect, useState } from 'react'
import { Avatar,
  Button,
  Card, CardHeader, CardContent,
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
import { useSearchContext, SelectionForest, QueryCard } from '../components/search'
import { Container } from '../components/container'

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
    rootsCount, startOver, clearTermSelection, selectedTermsCount,
  } = useSearchContext()
  const [sent, setSent] = useState(false)

  /* temporary faking term send request */
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
    const resetSend = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(resetSend)
  }, [sent])

  const handleStartOver = () => {
    startOver()
  }

  if (!rootsCount) {
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
      
      <Grid container className={ classes.heading }>
        <Grid item xs={ 12 } lg={ 6 } className={ classes.summary }>
          <Typography variant="subtitle1">
            <span>{ rootsCount } Root Term{ rootsCount === 1 ? '' : 's' }</span>
          </Typography>
          <Button
            onClick={ handleStartOver }
            disabled={ rootsCount === 0 }
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
      
      <Card variant="outlined">
        <CardContent className={ classes.controls }>
          <Grid container>
            <Grid item xs={ 12 }>
              <Typography align="center">controls</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <br /><br />

      <SelectionForest />

      <br /><br />
      <br /><br />
      <hr />
      <br /><br />
      <br /><br />

      <QueryCard />

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
