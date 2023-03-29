import { Container, Typography } from '@mui/material'
import { Link } from '../components/link'
import { ResponsiveIframe } from '../components/responsive-iframe'

//

export const DocumentationView = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1">Using the Search Portal</Typography>

      <br />

      <Typography paragraph>
        This interface allows users to construct a query with concepts in the NeuroBridge ontology.
        The query mechanism makes use of the ontological relationships to find publications in
        two sources: <Link to="https://www.ncbi.nlm.nih.gov/pmc/">PubMed Central</Link>, via our API,
        and <Link to="https://neuroquery.org/">NeuroQuery</Link>.
      </Typography>

      <Typography variant="h5" component="h2">
        Building a Query
      </Typography>

      <Typography variant="h6" component="h2">
        Adding Concepts
      </Typography>

      <Typography paragraph>
        The first step to building a query is to add concepts to the query builder with the &ldquo;Add Concept&rdquo; button.
        Each concept defines an induced subtree rooted at that concept.
        Adding a concept to the query builder makes its descendant concepts available to the query builder.
      </Typography>

      <ResponsiveIframe
        src="https://drive.google.com/file/d/1FbZPj1L_NbJ57KsIfkgIDlAB9N-Md1UN/preview"
      />

      <Typography variant="h6" component="h2">
        Toggling Concepts
      </Typography>

      <Typography paragraph>
        Each concept in the query builder can have one of two states&mdash;either it is in the query, or it is not.
        Clicking a concept toggles between the two states, and an icon indicates the concept&apos;s present state.
        Additionally, toggling the state of a concept also toggles the states of its descendant concepts to match the clicked concept.
      </Typography>

      <ResponsiveIframe />

      <Typography variant="h6" component="h2">
        Configuration & the Raw Query
      </Typography>

      <Typography paragraph>
        Use the &ldquo;View/Hide Query&rdquo; button to toggle visibility of the raw query being constructed.
        This lets you visually inspect the query before sending the request.
        By default, the boolean operator between each concept tree is <code>AND</code>,
        and the <code>OR</code> operator is used within each concept tree,
        but this can be changed in the Options window that opens upon clicking the &ldquo;Options&rdquo; button.
      </Typography>

      <ResponsiveIframe />

      <Typography variant="h6" component="h2">
        Starting Over
      </Typography>

      <Typography paragraph>
        Use the &ldquo;RESET&rdquo; button to clear the query builder and start over.
        Any results already fetched will remain visible.
      </Typography>

      <ResponsiveIframe
        src="https://drive.google.com/file/d/1UxC_PioqeFyWYy5-DznT1hLwpWLZ8Wte/preview"
      />

      <Typography variant="h5" component="h2">
        Results
      </Typography>

      <Typography paragraph>
        Results are grouped by their source, ordered by relevance, and contain links to the corresponding articles.
      </Typography>
  
      <ResponsiveIframe
        src="https://drive.google.com/file/d/1dLBjSspmTjzP9rqXdrNu2ZcoOXwWONvr/preview"
      />

      <Typography paragraph>
        Use the &ldquo;X&rdquo; in the top-right of the results table to clear the search results.
      </Typography>
      
    </Container>
  )
}
