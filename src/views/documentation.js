import { Container, Typography } from '@mui/material'
import { Link } from '../components/link'
import { ResponsiveIframe } from '../components/responsive-iframe'

//

export const DocumentationView = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1">Documentation</Typography>

      <br />

      <Typography variant="h5" component="h2">
        Using the Search Portal
      </Typography>

      <Typography paragraph>
        Results are retrieved from two sources: PubMed Central, via our API,{' '}
        <Link to="https://neuroquery.org/">NeuroQuery</Link>.
        Results are grouped by their source and contain links to the
        corresponding articles.
      </Typography>

      <Typography variant="h5" component="h2">
        Building a Query
      </Typography>

      <Typography paragraph>
        The goal of this tool is to build a query from concepts in the NeuroBridge ontology. 
      </Typography>

      <Typography paragraph>
        The first step to building a query is to add concepts to the query builder with
        the &ldquo;+ Add Concept&rdquo; button.
        Each concept defines an induced subtree rooted at that concept.
        Adding a concept to the query builder makes its descendant concepts available for use in the query construction.
      </Typography>

      <ResponsiveIframe
        src="https://drive.google.com/file/d/1FbZPj1L_NbJ57KsIfkgIDlAB9N-Md1UN/preview"
      />

      <Typography variant="h5" component="h2">
        Configuration Options & Viewing the Raw Query
      </Typography>

      <Typography paragraph>
        Each concept in the query builder can have one of two states&mdash;either it is in the query or not.
        Clicking a concept toggles between the two states, and an icon indicates the concept&apos;s present state.
        Additionally, changing the state of a concept also changes the states of its descendant concepts to match.
      </Typography>

      <ResponsiveIframe
        src="https://drive.google.com/file/d/1UxC_PioqeFyWYy5-DznT1hLwpWLZ8Wte/preview"
      />

      <Typography paragraph>
        Use the &ldquo;View/Hide Query&rdquo; button to toggle visibility of the raw query that will be sent to the NeuroBridge API.
        The boolean logic within the query can be chaanged in the option modal, which can be opened with the &ldquo;Options&rdquo; button.
      </Typography>
  
      <ResponsiveIframe
        src="https://drive.google.com/file/d/1dLBjSspmTjzP9rqXdrNu2ZcoOXwWONvr/preview"
      />

      <Typography variant="h5" component="h2">
        Results
      </Typography>

      <Typography paragraph>
        Results are displayed in different tabs based on their source.
      </Typography>

    </Container>
  )
}
