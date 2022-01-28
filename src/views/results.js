import { useState } from 'react'
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSearchContext } from '../components/search'
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

export const ResultsView = () => {
  const classes = useStyles()
  const { query } = useSearchContext()
  const [results, setResults] = useState(samplePublicationsResponse)

  return (
    <Container>
      
      <Typography variant="h2">Results View</Typography>

      <Box className={ classes.resultsContainer }>
        {
          results.map(publication => (
            <Card key={ publication.title } elevation={ 0 } className={ classes.resultCard }>
              <CardHeader title={ publication.title } />
              <CardContent>
                <Link to={ publication.pubmed_url }>{ publication.pubmed_url }</Link>
              </CardContent>
            </Card>
          ))
        }
      </Box>

    </Container>
  )
}