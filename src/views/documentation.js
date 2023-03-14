import { Container, Typography } from '@mui/material'

//

export const DocumentationView = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1">Documentation</Typography>

      <Typography variant="h5" component="h2">
        Using the Search Portal
      </Typography>

      <Typography paragraph>
        Results are retrieved from two sources: PubMed Central via (the NeuroBridge API) and [NeuroQuery](https://neuroquery.org/).
        Results are grouped by their source and contain links to the
        corresponding articles.
      </Typography>

      <Typography variant="h5" component="h2">
        Building a Query
      </Typography>

      <Typography paragraph>
        Because the goal is to search for publications, this purpose of this interface
        revolves around building a query from concepts in the NeuroBridge ontology. 
      </Typography>

      <br/><br/>[screenshot/video]<br/><br/><br/><br/>

      <Typography paragraph>
        The first step to building a query is to add concepts to the query builder with
        the &ldquo;+ Add Concept&rdquo; button.
        Each concept defines an induced subtree rooted at that concept.
        Adding a concept to the query builder makes its descendant concepts available for use in the query construction.
      </Typography>

      <Typography paragraph>
        Each concept in the query builder can have one of two states&mdash;either it is in the query or not. Clicking a concept toggles between the two states, and an icon indicates the concept&apos;s present state.
      </Typography>

      <Typography variant="h5" component="h2">
        Configuration Options & Viewing the Raw Query
      </Typography>

      <br/><br/>[screenshot/video]<br/><br/><br/><br/>
  
      <Typography variant="h5" component="h2">
        Results
      </Typography>

      <Typography paragraph>
        Additionally, changing the state of a concept also changes the states of its descendant concepts to match.
      </Typography>
  
      <br/><br/>[screenshot/video]<br/><br/><br/><br/>

    </Container>
  )
}
