import { Container, Typography } from '@mui/material'
import { Link } from '../components/link'

//

export const AboutView = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        About NeuroBridge
      </Typography>

      <br />

      <Typography variant="h5" component="h2">Purpose</Typography>

      <Typography paragraph>
        The scope of this prototype beta release is for searching for papers
        describing neuroimaging studies on schizophrenia and addiction, by
        building a query composed of concepts included in the NeuroBridge ontology. 
      </Typography>

      <Typography variant="h5" component="h2">The Data</Typography>

      <Typography paragraph>
        Currently, 356 PubMed Central publications are indexed and available to
        search with NeuroBridge. The available publications are those documenting
        studies of schizophrenia and substance abuse that contain information on
        neuroimaging data. The publications have been published between 2017 and 2021. 
      </Typography>

      <Typography variant="h5" component="h2">The NeuroBridge Ontology</Typography>

      <Typography paragraph>
        The NeuroBridge ontology extends the W3C PROV and ProvCaRe ontologies
        with terms from the SchizConnect project aligned and merged into the
        original class structure of the ProvCaRe ontology. The ProvCaRe ontology
        was developed as part of NIH BD2K Data Provenance project.
        The NeuroBridge ontology is available
        on <Link to="https://github.com/NeuroBridge/">GitHub</Link>.
      </Typography>

    </Container>
  )
}
