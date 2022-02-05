import { Fragment, useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { Avatar,
  Button,
  Card, CardHeader, CardContent,
  Divider,
  List, ListItem, ListItemAvatar, ListItemText,
  Typography,
} from '@mui/material'
import {
  RestartAlt as StartOverIcon,
  DeleteSweep as ClearSelectionIcon,
  LooksOne as StepOneIcon,
  LooksTwo as StepTwoIcon,
  Looks3 as StepThreeIcon,
  Looks4 as StepFourIcon,
  Looks5 as StepFiveIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { useSearchContext, SelectionForest } from '../components/search'
import { Container } from '../components/container'
import { PageHeader } from '../components/page-header'

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

export const WorkspaceView = () => {
  const classes = useStyles()
  const { rootsCount, clearRootSelection, clearTermSelection } = useSearchContext()
  const [sent, setSent] = useState(false)

  /* temporary faking term send request */
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
    const resetSend = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(resetSend)
  }, [sent])


  if (!rootsCount) {
    return (
      <Container>
        <Card className={ classes.instructions } elevation={ 0 }>
          <CardHeader title="Instructions" />
          <CardContent>
            <Typography paragraph>
              Searching the NeuroBridge Ontology is simple!
            </Typography>
          </CardContent>
          <CardContent>
            <List>
              <ListItem>
                <ListItemAvatar><Avatar><StepOneIcon /></Avatar></ListItemAvatar>
                <ListItemText>Search for terms.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepTwoIcon /></Avatar></ListItemAvatar>
                <ListItemText>Select root terms from the search results.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepThreeIcon /></Avatar></ListItemAvatar>
                <ListItemText>Select descendants to build a query.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepFourIcon /></Avatar></ListItemAvatar>
                <ListItemText>Send your query.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepFiveIcon /></Avatar></ListItemAvatar>
                <ListItemText>...</ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Fragment>
      <PageHeader
        title="Query Workspace"
        menuActions={[
          {
            text: 'Start Over',
            key: 'start-over-button',
            onClick: clearRootSelection,
            icon: <StartOverIcon />,
          },
          {
            text: 'Clear Selection',
            key: 'clear-selection-button',
            onClick: clearTermSelection,
            icon: <ClearSelectionIcon />,
          },
        ]}
      />
      <Container>
        <SelectionForest />

        <br /><br /><br /><br />
        <Divider>Query</Divider>
        <br /><br /><br /><br />

        <Button
          variant="contained"
          color="secondary"
          size="large"
          endIcon={ <SendIcon /> }
          style={{ boxShadow: 'none' }}
          onClick={ () => navigate('/results/neuroquery') }
        >
          NeuroQuery
        </Button>

      </Container>
    </Fragment>
  )
}
