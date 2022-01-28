import { Fragment, useCallback, useEffect, useState } from 'react'
import { Avatar,
  Button,
  Card, CardHeader, CardContent,
  Divider,
  Grid,
  IconButton,
  List, ListItem, ListItemAvatar, ListItemText,
  Tooltip,
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
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { useSearchContext, SelectionForest, QueryCard } from '../components/search'
import { Container } from '../components/container'

const samplePublicationsResponse = [
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/21600292', title: 'Improving the reliability of functional localizers' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/21513865', title: 'Functional bold MRI: advantages of the 3 T vs. the 1.5 T' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/19429079', title: 'Online mentalising investigated with functional MRI' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/24761177', title: 'Acupuncture Evoked Response in Contralateral Somatosensory Cortex Reflects Peripheral Nerve Pathology of Carpal Tunnel Syndrome' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/25287513', title: 'Multimodal MRI of the hippocampus in Parkinson’s disease with visual hallucinations' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/24860494', title: 'Tai Chi Chuan optimizes the functional organization of the intrinsic human brain architecture in older adults' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/17368793', title: 'A variant of logistic transfer function in Infomax and a postprocessing procedure for independent component analysis applied to fMRI data' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/28169883', title: 'Compensatory functional reorganization may precede hypertension-related brain damage and cognitive decline: a functional magnetic resonance imaging study' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/21354974', title: 'Dissociations between behavioural and functional magnetic resonance imaging-based evaluations of cognitive function after brain injury' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/16183659', title: 'Functional dysconnectivity in schizophrenia associated with attentional modulation of motor function' },
  { pubmed_url: 'https://www.ncbi.nlm.nih.gov/pubmed/25592998', title: 'Characterizing nonlinear relationships in functional imaging data using eigenspace maximal information canonical correlation analysis (emiCCA)' },
]

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

export const QueryBuilderView = () => {
  const classes = useStyles()
  const {
    roots, rootsCount, selectedTermsCount,
    clearRootSelection, clearTermSelection, startOver,
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

  const PageHeader = useCallback(() => {
    return (
      <Fragment>
        <Card variant="outlined">
          <CardContent className={ classes.controls }>
            <Grid container>
              <Grid item xs={ 12 } sm={ 3 }>
                <Typography>
                  { rootsCount } root{ rootsCount === 1 ? '' : 's' }<br />
                  { selectedTermsCount } selected term{ selectedTermsCount === 1 ? '' : 's' }<br />
                </Typography>
              </Grid>
              <Grid item xs={ 12 } sm={ 9 }>
                <Tooltip title="Start Over">
                  <span>
                    <IconButton
                      onClick={ handleStartOver }
                      disabled={ rootsCount === 0 }
                      variant="contained"
                      color="primary"
                    >
                      <StartOverIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Clear all roots">
                  <span>
                    <IconButton
                      onClick={ clearRootSelection }
                      disabled={ selectedTermsCount === 0 }
                      variant="contained"
                      color="secondary"
                    >
                      <ClearSelectionIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Deselect all terms">
                  <span>
                    <IconButton
                      onClick={ clearTermSelection }
                      disabled={ selectedTermsCount === 0 }
                      variant="contained"
                      color="secondary"
                    >
                      <ClearSelectionIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fragment>
    )
  }, [roots])

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
    <Container>
      
      <PageHeader />

      <br /><br />

      <SelectionForest />

      <br /><br /><br /><br />
      <Divider>Query</Divider>
      <br /><br /><br /><br />

      <QueryCard />

    </Container>
  )
}
